import React from 'react'
import Dropzone from 'react-dropzone'
import aws from 'aws-sdk'
import axios from 'axios'

const ROOT_URL = 'http://localhost:8000'

class Documents extends React.Component {
  constructor(props) {
    super()
    this.state = {
      tenantDocuments: [],
      fileForUploadToS3: null
    }
  }

  componentWillMount() {
    this.getTenantDocuments(this.props.tenant_id)
  }

  getTenantDocuments(tenant_id) {
    axios.get(`${ROOT_URL}/api/docs/tenant/${tenant_id}`)
     .then((response) => {
        // console.log(response)
        this.setState({
          tenantDocuments: response.data
        })
     })
     .catch((err) => {
        console.log(err)
     })
  }

  addTenantDocument(tenant_id = null) {
    axios.post(`${ROOT_URL}/api/docs/add/rawtext`,
    {
      "doc_type": "rawtext", 
      "landlord_id": null, 
      "tenant_id": tenant_id, 
      "property_id": null,
      "doc_body": this.state.fileForUploadToS3.name,
      "doc_url": `https://s3.us-east-2.amazonaws.com/rentopia/${this.state.fileForUploadToS3.name}`
    })
     .then((response) => {
        // console.log(response)
        this.getTenantDocuments(this.props.tenant_id)
        // this.setState({
        //   tenantDocuments: [...this.state.tenantDocuments, response.data]
        // })
     })
     .catch((err) => {
        console.log(err)
     })
  }

  onDrop(files) {
    this.setState({
      fileForUploadToS3: files[0]
    });
  }

  sendFileToS3(e) {
    e.preventDefault()
    e.stopPropagation()

    aws.config.update({
        signatureVersion: 'v4',
        region: 'us-east-2',
        accessKeyId: process.env.AWS_ACCESSKEYID,
        secretAccessKey: process.env.AWS_SECRETACCESSKEY
    });
    var s3 = new aws.S3();
    var params = {
      Bucket: 'rentopia',
      Key: this.state.fileForUploadToS3.name,
      Expires: 60,
      ContentType: this.state.fileForUploadToS3.type
    }
// console.log('params', params)
    s3.getSignedUrl('putObject', params, (err, signedUrl) => {
      if (err) {
        console.log(err)
        return err
      } else {
// console.log('signedUrl', signedUrl)
// console.log(this.state.fileForUploadToS3)
        var instance = axios.create()
        instance.put(signedUrl, this.state.fileForUploadToS3, {headers: {'Content-Type': this.state.fileForUploadToS3.type}})
         .then((result) => {
            // console.log('result', result)
            this.addTenantDocument(this.props.tenant_id)
            this.setState({
              fileForUploadToS3: null
            })
         })
         .catch(function (err) {
            console.log(err)
      });
        return signedUrl;
      }
    });
  }

  sendDocumentToTenant(e) {
    e.preventDefault()
    console.log('Send document to Tenant!')
  }

  renderTenants() {
    return this.props.tenants.map((tenant) => {
      return (
        <option key={tenant.tenant_id}> {tenant.tenant_email} </option>
      )
    })
  }

  render() {
    return (
        <div>
        <h3 className="sidebarTitle">Documents</h3>
        {this.state.tenantDocuments.length === 0 ? null :
          <div>
            <ul>
              {
                this.state.tenantDocuments.map(doc => 
                  <div key={doc.document_id}>
                    <a target="_blank" href={doc.doc_url}>{doc.doc_body} </a>
                    {!this.props.tenants ? null :
                      <span>
                        <select name="tenant_id">
                          {this.renderTenants()}
                        </select>
                        <button onClick={this.sendDocumentToTenant.bind(this)}> Send File </button>
                      </span>
                    }
                  </div>
                )
              }
            </ul>
          </div>
        }
          <Dropzone className="Dropzone" onDrop={this.onDrop.bind(this)}>
            {
            this.state.fileForUploadToS3 === null ? 
              <div>
                <p>Drop a file from your desktop, or or click here, to upload a file.</p>
              </div>
            :
              <div>
                <h3>File to be Uploaded:</h3>
                <h4>{this.state.fileForUploadToS3.name}</h4>
                <h5>{this.state.fileForUploadToS3.size} bytes</h5>
                <button onClick={this.sendFileToS3.bind(this)}> Upload File </button>
              </div>
            }
          </Dropzone>
        </div>
    )
  }
}

export default Documents
