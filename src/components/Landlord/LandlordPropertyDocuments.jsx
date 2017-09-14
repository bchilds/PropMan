import React from 'react'
import Dropzone from 'react-dropzone'
import aws from 'aws-sdk'
import axios from 'axios'

const ROOT_URL = process.env.NODE_ENV === 'production' ? 'http://myrentopia.com': 'http://localhost:8000'

class Documents extends React.Component {
  constructor(props) {
    super()
    this.state = {
      propertyDocuments: [],
      fileForUploadToS3: null
    }
  }

  componentWillMount() {
    this.getPropertyDocuments(this.props.property_id)
  }

  getPropertyDocuments(property_id) {
    axios.get(`${ROOT_URL}/api/docs/property/${property_id}`)
     .then((response) => {
        // console.log(response)
        this.setState({
          propertyDocuments: response.data
        })
     })
     .catch((err) => {
        console.log(err)
     })
  }

  addPropertyDocument(landlord_id = null, property_id = null) {
    const propertyDocsRequest = axios.post(`${ROOT_URL}/api/docs/add/rawtext`,
    {
      "doc_type": "rawtext", 
      "landlord_id": landlord_id, 
      "tenant_id": null, 
      "property_id": property_id,
      "doc_body": this.state.fileForUploadToS3.name,
      "doc_url": `https://s3.us-east-2.amazonaws.com/rentopia/${this.state.fileForUploadToS3.name}`
    })
     .then((response) => {
        // console.log(response)
        this.getPropertyDocuments(this.props.property_id)
        // this.setState({
        //   propertyDocuments: [...this.state.propertyDocuments, response.data]
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
            this.addPropertyDocument(this.props.landlord_id, this.props.property_id)
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
    const propertyDocsRequest = axios.post(`${ROOT_URL}/api/landlords/emailTenant`,
    {
      "document_title": e.target.getElementsByClassName("document_title")[0].text,
      "document_url": e.target.getElementsByClassName("document_title")[0].href,
      "tenant_email": e.target.tenant_email.value
    })
     .then((response) => {
        alert(`"${response.data.document_title}" has been sent to ${response.data.tenant_email}`)
     })
     .catch((err) => {
        console.log(err)
     })
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
        <h2>Documents</h2>
        {this.state.propertyDocuments.length === 0 ? null :
          <div>
            <ul>
              {
                this.state.propertyDocuments.map(doc => 
                  <div key={doc.document_id}>
                    <form className="sendDocumentToTenantEmail" onSubmit={this.sendDocumentToTenant.bind(this)}>
                      <a className="document_title" target="_blank" href={doc.doc_url}>{doc.doc_body} </a>
                      <select name="tenant_email">
                        {this.renderTenants()}
                      </select>
                      <button type="submit"> Send File </button>
                    </form>
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
