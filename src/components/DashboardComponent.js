import React, { Component } from 'react'
import {
  DashboardMetrics,
  DashboardChart,
  InplayMetrics,
  LiveTradefeed
} from 'components'
import { connect } from 'react-redux'

class _DashboardComponent extends Component {

  render() {
    const { userbets, user, currencies } = this.props
    const openBets = userbets.filter(b => b.status === 1)
    const settledBets = userbets.filter(b => b.status !== 1).sort((a, b) => a.match.startTime - b.match.startTime)
    return (
      <div className='container-fluid'>
        <DashboardMetrics
          bets={settledBets} 
          user={user}
          currencies={currencies}
        />
      </div>
    )
  }
}

export const DashboardComponent = connect(state => {
  return {
    user: state.auth.user,
    userbets: state.userbets.allIds.map(k => state.userbets.byId[k]),
    currencies: state.currencies
  }
})(_DashboardComponent)
