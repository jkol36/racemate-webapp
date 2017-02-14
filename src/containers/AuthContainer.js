import React, { Component } from 'react';
import { connect } from 'react-redux'
import firebase from 'firebase'
import { LoadingComponent } from 'components'
import { browserHistory } from 'react-router'
import { loginSuccess, fetchUser } from 'actions/auth'
import { listenToUserbets } from 'actions/userbets'
import { fetchCurrencies, listenToCurrencies } from 'actions/currencies'
import { listenToTrades } from 'actions/trades'

class _AuthContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true
    }
  }

  componentDidMount() {
    let loggedIn = false
    const authHandler = firebase.auth().onAuthStateChanged((data) => {
      const { dispatch, location: { pathname }} = this.props
      if (data) {
        console.log('got data', data)
        if (loggedIn)
          return
        dispatch(loginSuccess(data.uid))
        dispatch(fetchUser(data))
          .then(() => {
            Raven.setUserContext({
              uid: data.uid,
              email: data.email
            })
            const { user } = this.props
            console.log('got user', user)
            analytics.identify(data.uid, {
              name: user.displayName,
              email: user.email,
              permissionLevel: user.subscription.permissionLevel,
            })
            if (pathname.match('/login') || pathname.match('/signup') || pathname === '/') {
              browserHistory.push('/dashboard')
            }
            this.setState({loading: false})
            loggedIn = true
          })
      } else {
        if (!pathname.match('/login') && !pathname.match('/signup')) {
          browserHistory.push('/login')
        }
        this.setState({loading: false})
      }
    })
  }

  render() {
    if (this.state.loading)
      return <LoadingComponent />
    return React.cloneElement(this.props.children, {
      loading: this.state.loading
    })
  }
}

export const AuthContainer = connect(state => state.auth)(_AuthContainer)
