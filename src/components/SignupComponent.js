import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { 
  loginWithFacebook, 
  loginWithGoogle,
  createUserWithEmail

} from 'actions/auth'
import { TappableButton } from 'components'
import 'less/login.less'

class _SignupComponent extends Component {

  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      loading: false,
      error: ''
    }
  }

  componentDidMount() {
    analytics.page('Signup')
  }

  handleEmail(e) {
    e.preventDefault()
    const email = this.state.email.trim()
    const password = this.state.password.trim()
    this.setState({loading: true })
    this.props.dispatch(createUserWithEmail(email, password))
      .then(() => {
        this.setState({loading: false})
      }).catch(error => {
        this.setState({
          error: error.message,
          loading: false
        })
      })
  }

  handleFacebook(e) {
    e.preventDefault()
    this.props.dispatch(loginWithFacebook())
  }

  handleGoogle(e) {
    e.preventDefault()
    this.props.dispatch(loginWithGoogle())
  }

  handleTwitter() {
    e.preventDefault()
    this.props.dispatch(loginWithTwitter())
  }

  render() {
    let button = <button type='submit' className='btn btn-success'>Sign up</button>
    if (this.state.loading) {
      button = <button type='submit' disabled className='btn btn-success'><i className='fa fa-fw fa-spin fa-spinner'></i></button>
    }
    let alert = null
    if (this.state.error) {
      alert = (
        <div className='alert alert-dismissible alert-warning'>
          <button type='button' className='close' data-dismiss='alert'>×</button>
          <strong>Oh snap!</strong> { this.state.error }
        </div>
      )
    }
    return (
      <div className='login-container'>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-xs-12 col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4'>
              <div className='panel'>
                <div className='panel-body'>
                  { alert }
                  <TappableButton onClick={this.handleFacebook.bind(this)} className='facebook-btn btn'>Sign up with facebook</TappableButton>
                  <TappableButton onClick={this.handleGoogle.bind(this)} className='google-btn btn'>Sign up with google</TappableButton>
                  <div className='or-wrapper'>
                    <span className='or-text'>or</span>
                  </div>
                  <form className='form' onSubmit={this.handleEmail.bind(this)}>
                    <div className='form-group'>
                      <div className='input-group'>
                        <span className='input-group-addon'><i className='fa fa-envelope fa-fw'></i></span>
                        <input className='form-control' type='email' placeholder='your@email.com' value={this.state.email} onChange={(e) => this.setState({email: e.target.value}) } />
                      </div>
                    </div>
                    <div className='form-group'>
                      <div className='input-group'>
                        <span className='input-group-addon'><i className='fa fa-lock fa-fw'></i></span>
                        <input className='form-control' type='password' placeholder='****' value={this.state.password} onChange={(e) => this.setState({password: e.target.value}) }/>
                      </div>
                    </div>
                    { button }
                  </form>
                </div>
                <div className='panel-footer'>
                  { !this.state.loading && <Link disabled to='/login'>Already have an account? Click here to log in.</Link> }
                  <br />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export const SignupComponent = connect()(_SignupComponent)
