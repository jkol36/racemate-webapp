import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Mybets, UsertradeModal, DeleteUserbetsModal } from 'components'
import firebase from 'firebase'



class _MybetsContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTrade: null,
      modalOpen: false,
      deleteTradesModal: false
    }
    this.onSelectBet = this.onSelectBet.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onDeleteBet = this.onDeleteBet.bind(this)
    this.onDeleteAllBets = this.onDeleteAllBets.bind(this)
  }


  onSubmit(key, wager, status) {
    firebase.database().ref('userbets').child(key).update({
      wager,
      status
    })
    this.setState({
      modalOpen: false
    })
  }

  onSelectBet(key) {
    this.setState({
      selectedTrade: key,
      modalOpen: true
    })
  }

  onDeleteBet(key) {
    firebase.database().ref('userbets').child(key).remove()
    firebase.database().ref('userbet-keys').child(this.props.user.uid).child(key).remove()
    this.setState({
      modalOpen: false,
    })
  }

  onDeleteAllBets() {
    return Promise.join(
      Promise.map(this.props.userbets, b => firebase.database().ref('userbets').child(b.key).remove()),
      firebase.database().ref('userbet-keys').child(this.props.user.uid).set(null)
    )
  }

  render() {
    return (
      <div className='container-fluid'>
        <Mybets userbets={this.props.userbets}
          currencies={this.props.currencies}
          user={this.props.user}
          onSelectBet={this.onSelectBet}
          onDeleteBets={() => this.setState({ deleteBetsModal: true })}
        />
        <UsertradeModal trade={this.props.usertradeMap[this.state.selectedTrade]}
          open={this.state.modalOpen}
          onClose={() => this.setState({ modalOpen: false })}
          onSubmit={this.onSubmit}
          onDelete={this.onDeleteBet}
        />
        <DeleteUserbetsModal show={this.state.deleteTradesModal}
          onHide={() => this.setState({ deleteTradesModal: false}) }
          onDelete={ this.onDeleteAllBets } />
      </div>
    )
  }
}

export const MybetsContainer = connect(state => ({
  userbets: state.userbets.allIds.map(id => state.userbets.byId[id]).sort((a, b) => b.match.startTime - a.match.startTime),
  usertradeMap: state.userbets.byId,
  currencies: state.currencies
}))(_MybetsContainer)
