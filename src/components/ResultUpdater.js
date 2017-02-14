import React, { Component } from 'react'
import { getStatusesForTrades } from 'utils'
import firebase from 'firebase'
import { groupBy } from 'underscore'


export class ResultUpdater extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedMatch: null,
      bets: []
    }
  }

  componentDidMount() {
    firebase.database().ref('userbets').orderByChild('status').equalTo(1).once('value')
      .then(snap => {
        const bets = []
        snap.forEach(s => {
          bets.push({ ...s.val(), key: s.key })
        })
        this.setState({
          bets
        })
      })
  }

  onVoid() {
    const updates = {}
    const bets = this.state.bets.filter(t => t.match._id === this.state.selectedMatch._id)
    bets.forEach(bet => {
      updates[`${bet.key}/status`] = 4
    })
    firebase.database().ref('userbets').update(updates)
      .then(() => {
        this.setState({
          bets: this.state.bets.filter(t => {
            return !bets.find(tt => t.key == tt.key)
          })
        })
      })
  }

  onSubmit(e) {
    e.preventDefault()
    const { selectedMatch } = this.state
    const score = this.fulltimeResult.value.split('-').map(k => +k)
    const bets = this.state.bets.filter(t => t.match._id === selectedMatch._id)
    const result = {
      CURRENT: score,
      FT: score,
      R: score
    }
    const statuses = getStatusesForTrades(bets, result)
    statuses.forEach(status => {
      firebase.database().ref('userbets').child(status.id).update({
        result: status.result.join('-'),
        status: status.status
      })
    })
  }

  render() {
    const groupedTrades = groupBy(this.state.bets.filter(t => t.status === 1 && t.match.startTime < Date.now() - 1000 * 60 * 60 * 3), t => t.match._id)
    const matches = Object.keys(groupedTrades)
    return (
      <div className='row'>
        <div className='col-xs-8 text-center'>
          <h3>bets not settled > 2 hours</h3>
          <table className='table table-striped table-hover'>
            <tbody>
              { matches.map(m => groupedTrades[m][0]).sort((a, b) => a.match.startTime - b.match.startTime).map((bet, i) => {
                return (
                  <tr key={i} onClick={() => this.setState({selectedMatch: bet.match})}>
                    <td>{ bet.match._id }</td>
                    <td>{ bet.match.homeTeam } vs { bet.match.awayTeam }</td>
                    <td>{ new Date(bet.match.startTime).toString() }</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className='col-xs-4 text-center'>
          <h3>Update bets</h3>
          <div>{ this.state.selectedMatch ? (this.state.selectedMatch.homeTeam + ' vs ' + this.state.selectedMatch.awayTeam) : 'No match selected' }</div>
          <form className='form' onSubmit={(e) => this.onSubmit(e) }>
            <div className='form-group'>
              <input className='form-control' type='text' placeholder='Full time result' ref={ref => this.fulltimeResult = ref }/>
            </div>
            <div className='button-group'>
              <button className='btn btn-success' type='submit'>Update bets</button>
              <button className='btn btn-info' type='button' onClick={this.onVoid.bind(this) }>Void bets</button>
            </div>
          </form>
        </div>
      </div>
    )
  }
}
