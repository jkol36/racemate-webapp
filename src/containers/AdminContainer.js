import React, { Component } from 'react'
import {
  HijackComponent
} from 'components'
import { browserHistory } from 'react-router'

export class AdminContainer extends Component {
  componentDidMount() {
    if (!this.props.user.hijacked && this.props.user.subscription.permissionLevel < 5)
      return browserHistory.push('/dashboard')
  }

  render() {
    return (
      <div className='container'>
        <HijackComponent dispatch={this.props.dispatch}/>
      </div>
    )
  }
}
