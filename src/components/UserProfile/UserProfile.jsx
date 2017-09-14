import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { setEditedProfileInfo } from '../../actions/setEditedProfileInfo';
import ReactPasswordStrength from '../PasswordStrength.jsx'
import { setMulti, removeMulti } from '../../actions/twoFactorSet.js';

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
		// alert('profile ffediting is temporarily disabled')
		let name = event.target.name.value 
		let email = event.target.email.value 
		let confirm = event.target.confirm.value

		if (email === confirm && email !== '') {
			var profileObj = {}
			if (this.state.editingPassword) {
				let currentPassword = event.target.currentPassword.value
				let confirmPassword = event.target.confirmPassword.value
				if (this.state.newPassword === confirmPassword && this.state.newPassword !== '') {
					profileObj = {
						user_name: name,
						email: email,
						user_password: currentPassword,
						new_password: this.state.newPassword
					}
			  } else {
			  	alert('Passwords do not match')
			  }
			} else {
				profileObj = {
					name: name,
					email: email,
				}
			}

			this.props.setEditedProfileInfo(profileObj, this.props.userId)
			  .then((response) => {
			  	console.log('response from profile edit', response)
			  })

			event.target.name.value = ''
			event.target.email.value = ''
			event.target.confirm.value = ''
			event.target.confirmPassword.value = ''
			event.target.currentPassword.value = ''

			this.setState({
				confirmCount: 0,
				editing: false,
				password: ''
			})
		} else {
			alert("You done messed up boiieee!!!\nMake sure all fields are filled in properly")
		}
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

		if(this.state.multiText === "Add Multifactor") {
			this.props.setMulti(this.props.userId)
				.then( (response) => {
					this.setState({multiText: "Remove Multifactor"})
				})
		} else {
			//remove multifactor from user and set state
			this.props.removeMulti(this.props.userId)
			.then( (response) => {
				this.setState({multiText: "Add Multifactor"})
			})
		}
	}

	editForm() {
		return (
			<div className="container-fluid messageMargins">
        <div className="row ">
					<div className="editForm col-lg-12 col-md-12 col-sm-12 col-xs-12">
					<div className="editFormInner">
						<form onSubmit={this.handleSubmit.bind(this)}>
						  <div>
							  <label className="editFormLables">Name</label>
						  </div>
						  <input type="text" className="form-control" name="name" defaultValue={this.props.name}/>
							<br/>
						  <label className="editFormLables">Email address</label>
						  <input onKeyPress={this.toggleConfirmEmail.bind(this)} type="email" className="form-control" name="email" defaultValue={this.props.email}/>
						  <small className="form-text text-muted">We'll never share your email with anyone else.</small>
							<br/>
						  <label className="editFormLables">Confirm email</label>
						  <input id="confirmEmail" type="email" className="form-control" name="confirm" defaultValue={this.props.email}/>
							<br/>
							{this.state.editingPassword && this.editPassword()}
							<br/>
							<div>
							  <button className="btn btn-secondary"> Save Changes </button>
							</div>
						</form>
						<div className="container-fluid messageMargins">
			        <div className="row ">
				        <div className="addMulti col-lg-6 col-md-6 col-sm-6 col-xs-12">
				        	<label className="addCursorPointer" onClick={this.handleMultiClick.bind(this)}>{this.state.multiText}</label>
				        	{this.props.user.secret_url !== '' && <img src={this.props.user.secret_url}/>}
				        </div>

								<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
								  <label className="addCursorPointer" onClick={this.handleEditPassword}> Edit Password </label>
								</div>
						  </div>
						</div>
						<br/>
						</div>
					</div>
				</div>
			</div>
		)
	}

	toggleEdit() {
		this.setState({editing: !this.state.editing})
	}

	componentWillMount() {
		if(this.props.user.secret_url === null || this.props.user.secret_url === '') {
			this.setState({multiText:'Add Multifactor'})
		} else {
			this.setState({multiText:'Remove Multifactor'})
		}
	}

	render() {
		return (
		<div>
		  <div className="profileEditButton">
			  <button id="profileEditButton" onClick={this.toggleEdit.bind(this)} type="button" className="btn btn-secondary"> Edit </button>
			</div>
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
  return bindActionCreators({setEditedProfileInfo, setMulti, removeMulti}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile)