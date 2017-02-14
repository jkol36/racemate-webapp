import React, { Component } from 'react'
import {
  ReferralComponent
} from 'components'

import firebase from 'firebase'

export class ReferralContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      clicks: 0,
      signups: 0,
      transactions: 0
    }
    this.link = `http://tradematesports.com/?ref=${this.props.user.uid}`
  }

  componentDidMount() {
    firebase.database().ref('reflinks').child(this.props.user.uid).on('value', snap => {
      if (snap.exists()) {
        const data = snap.val()
        this.setState(data)
      }
    })
  }

  componentWillUnmount() {
    firebase.database().ref('reflinks').child(this.props.user.uid).off('value')
  }

  render() {
    return <ReferralComponent reflink={this.link} {...this.state}/>
  }
}