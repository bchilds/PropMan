import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { setEditedProfileInfo } from '../../actions/setEditedProfileInfo';
import ReactPasswordStrength from '../PasswordStrength.jsx'
import { setMulti } from '../../actions/twoFactorSet.js';

class UserProfile extends Component {
	constructor() {
		super()
		
		this.state = {
			editing: false,
			confirmCount: 0,
			passLength: 0,
			newPassword: '',
			editingPassword: false,
			multiText: ''
		}
		this.handleEditPassword = this.handleEditPassword.bind(this)
	}

	handlePassword(password) {
		this.setState({newPassword: password})
	}

	handleEditPassword() {
		this.setState({editingPassword: !this.state.editingPassword})
	}

	handleSubmit(event) {
		event.preventDefault()
		alert('profile editing is temporarily disabled')
		// let name = event.target.name.value 
		// let email = event.target.email.value 
		// let confirm = event.target.confirm.value

		// if (email === confirm && email !== '') {
		// 	var profileObj = {}
		// 	if (this.state.editingPassword) {
		// 		let currentPassword = event.target.currentPassword.value
		// 		let confirmPassword = event.target.confirmPassword.value
		// 		if (this.state.newPassword === confirmPassword && this.state.newPassword !== '') {
		// 			profileObj = {
		// 				user_name: name,
		// 				email: email,
		// 				user_password: currentPassword,
		// 				new_password: this.state.newPassword
		// 			}
		// 	  } else {
		// 	  	alert('Passwords do not match')
		// 	  }
		// 	} else {
		// 		profileObj = {
		// 			name: name,
		// 			email: email,
		// 		}
		// 	}

		// 	this.props.setEditedProfileInfo(profileObj, this.props.userId)
		// 	  .then((response) => {
		// 	  	console.log('response from profile edit', response)
		// 	  })

		// 	event.target.name.value = ''
		// 	event.target.email.value = ''
		// 	event.target.confirm.value = ''
		// 	event.target.confirmPassword.value = ''
		// 	event.target.currentPassword.value = ''

		// 	this.setState({
		// 		confirmCount: 0,
		// 		editing: false,
		// 		password: ''
		// 	})
		// } else {
		// 	alert("You done messed up boiieee!!!\nMake sure all fields are filled in properly")
		// }
	}

	toggleConfirmEmail(e) {
		if (this.state.confirmCount === 0) {
	    document.getElementById('confirmEmail').value = ''
	    this.setState({
	    	confirmCount: 1
	    })
  	}
	}


	changeCallback(state) {
	  this.setState({ passLength: state.password.length });
	}

	clear() {
	  this.refs.passComponent.clear();
	}

	editPassword() {
		const inputProps = {
		  placeholder: "Try a password...",
		  id: "inputPassword",
		  autoFocus: true,
		  className: 'another-input-prop-class-name',
		};

		return (
			<div>
				<label>Current Password</label>
				<input type="password" className="form-control" name="currentPassword"/>
				<br/>
				<label>New Password</label>
				<ReactPasswordStrength
				   ref="passComponent"
				   minLength={6}
				   inputProps={inputProps}
				   changeCallback={this.changeCallback.bind(this)}
				   handlePassword={this.handlePassword.bind(this)}
				 />
				 <br/>
				 <label>Confirm Password</label>
				 <input type="password" className="form-control" name="confirmPassword"/>
			 </div>
		)
	}

	handleMultiClick() {
		this.props.setMulti(this.props.userId)
		// .then( (response) => {
		// 	console.log(response)
		// 	//if successful
			
		// })
	}

	editForm() {
		return (
			<div className="editForm">
				<form onSubmit={this.handleSubmit.bind(this)}>
				  <div>
					  <label>Name</label>
					  <a style={{float: "right"}} onClick={this.handleEditPassword}> Edit Password </a>
				  </div>
				  <input type="text" className="form-control" name="name" defaultValue={this.props.name}/>
					<br/>
				  <label>Email address</label>
				  <input onKeyPress={this.toggleConfirmEmail.bind(this)} type="email" className="form-control" name="email" defaultValue={this.props.email}/>
				  <small className="form-text text-muted">We'll never share your email with anyone else.</small>
					<br/>
				  <label>Confirm email</label>
				  <input id="confirmEmail" type="email" className="form-control" name="confirm" defaultValue={this.props.email}/>
					<br/>
					{this.state.editingPassword && this.editPassword()}
					<br/>
					<button className="paymentForm"> Save Changes </button>
				</form>
				<div className="addMulti">
					<button onClick={this.handleMultiClick.bind(this)}>{this.state.multiText}</button>
					{this.props.user && <img src={"https://i.pinimg.com/736x/7b/93/80/7b9380bb001475a19ec7bb9d798093c8--random-stuff-shetland-sheepdog.jpg"}/>}
				</div>
			</div>
		)
	}



	toggleEdit() {
		this.setState({editing: !this.state.editing})
	}

	componentWillMount() {
		if(this.props.user.secret_url !== null && this.props.user.secret_url !== '') {
			this.setState({multiText:'Add Multifactor'})
		} else {
			this.setState({multiText:'Something Else'})
		}
	}

	render() {
		return (
		<div>
			<button id="profileEditButton" onClick={this.toggleEdit.bind(this)} type="button" className="btn btn-secondary"> Edit </button>
				<div className="editForm">
					{!this.state.editing ?
						<div className="editForm">
								<p>Name: {this.props.name}</p>
								<p>Email: {this.props.email}</p>
						</div>
					: 
						this.editForm.bind(this)()}
				</div>
		</div>
		)
	}
}


function mapStateToProps(state) {
	return {

		name: state.user && state.user.user_name,
		email: state.user && state.user.email,
		userId: state.user && state.user.user_id,
		user: state.user,
	}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({setEditedProfileInfo, setMulti}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile)