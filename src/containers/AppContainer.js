import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Topbar, Sidebar } from 'components'
import { logout } from 'actions/auth'
import { browserHistory } from 'react-router'
import firebase from 'firebase'

class _AppContainer extends Component {

  constructor(props) {
    console.log('app container got props', props)
    super(props)
    this.state = {
      online: 0,
      news: null,
      showNews: false
    }
  }

  onLogout() {
    this.props.dispatch(logout())
  }

  


  componentDidMount() {
    const connectionRef = firebase.database().ref('online-status')
    firebase.database().ref('.info/connected').on('value', snap => {
      if (snap.val() === true) {
        var con = firebase.database().ref('online-status').child(this.props.user.uid)
        con.set(true)
        con.onDisconnect().remove()
      }
    })
    connectionRef.on('child_added', snap => this.setState({ online: this.state.online + 1 }))
    connectionRef.on('child_removed', snap => this.setState({ online: this.state.online - 1 }))
    firebase.database().ref('news-info').on('value', snap => {
      if (snap.exists()) {
        this.setState({
          news: snap.val(),
          showNews: true
        })
      } else {
        this.setState({
          news: null,
          showNews: false
        })
      }
    })
  }

  componentWillUnmount() {
    firebase.database().ref('news-info').off()
  }

  render() {
    return (
      <div id='page-wrapper'>
        <Sidebar online={this.state.online} />
        <div id='content-wrapper'>
          <Topbar user={this.props.user} pathname={this.props.location.pathname} onLogout={this.onLogout.bind(this)}/>
          <div className='page-content'>
            { (this.state.news && this.state.showNews) && (
                <div className='alert alert-success alert-news' style={{marginLeft: 'auto', marginRight: 'auto', width: '80%'}}>
                  <button type='button' className='close' onClick={() => this.setState({ showNews: false }) }>×</button>
                  { this.state.news }
                </div>
            )}
            { React.cloneElement(this.props.children,
              { user: this.props.user,
                dispatch: this.props.dispatch
              })
            }
            {
              this.props.user.hijacked && <HijackBar email={this.props.user.email} onClick={() => document.location = '/' }/>
            }
          </div>
        </div>
      </div>
    )
  }
}

const HijackBar = ({ email, onClick }) => {
  return (
    <div onClick={onClick}
      className='alert alert-warning alert-hijack'>
        { 'You are hijacking ' + email + ', click here to release or refresh the page.' }
    </div>
  )
}

export const AppContainer = connect(state => state.auth)(_AppContainer)
