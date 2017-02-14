import React, { Component } from 'react'
import { displayOddsType } from 'utils/converters'
import Modal from 'react-bootstrap/lib/Modal'
import { bookmakerLookup } from 'config'

export class UsertradeModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      wager: 1,
      status: 1
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.open && nextProps.open) {
      this.setState({
        wager: nextProps.trade.wager,
        status: nextProps.trade.status
      })
    }
  }

  onDelete(e) {
    e.preventDefault()
    this.props.onDelete(this.props.trade.key)
  }

  onSubmit(e) {
    e.preventDefault()
    if (this.state.wager !== this.props.trade.wager || this.state.status !== this.props.trade.status) {
      this.props.onSubmit(this.props.trade.key, this.state.wager, this.state.status)
    } else {
      this.props.onClose()
    }
  }

  render() {
    const { trade, open, onClose, onDelete } = this.props
    if (!trade)
      return <Modal show={open} onHide={onClose} />
    return (
      <Modal show={open} onHide={onClose} className='usertrade-modal'>
        <Modal.Header closeButton>
          <Modal.Title>
            { trade.match.homeTeam } vs { trade.match.awayTeam }
            { trade.status > 1 && <img src={`/static/img/status/${trade.status}.png`} /> }
            <p className='competition'>{ trade.match.competition && trade.match.competition.name }</p>
          </Modal.Title>
        </Modal.Header>
        <form onSubmit={this.onSubmit.bind(this)} className='form-horizontal'>
        <Modal.Body>
          <FormGroup label={'Start time'}>
            <input className='form-control'
              type='text' value={trade.match.startTime.format('MMM Do h:mm a')} disabled />
          </FormGroup>
          <FormGroup label={'Placed at'}>
            <input className='form-control'
              type='text' value={trade.createdAt.format('MMM Do h:mm a')} disabled />
          </FormGroup>
          <FormGroup label={'Odds type'}>
            <input className='form-control'
              type='text' value={displayOddsType(trade.oddsType, trade.output,
              trade.oddsTypeCondition, trade.match.homeTeam, trade.match.awayTeam)} disabled />
          </FormGroup>
          <FormGroup label={'Bookmaker'}>
            <input className='form-control'
              type='text' value={bookmakerLookup[trade.bookmaker]} disabled />
          </FormGroup>
          <FormGroup label={'Odds'}>
            <input className='form-control'
              type='text' value={trade.odds} disabled />
          </FormGroup>
          <FormGroup label={'Edge / Closed at'}>
            <input className='form-control'
              type='text' value={trade.edge + '%' + ' / ' + trade.closing + ' %'} disabled />
          </FormGroup>
          <FormGroup label={'Stake'}>
            <div className='input-group'>
              <input className='form-control'
                type='number' value={this.state.wager}
                onChange={(e) => this.setState({ wager: +e.target.value }) }

              />
              <span className='input-group-addon'>{ trade.currency }</span>
            </div>
          </FormGroup>
          <FormGroup label={'Status'}>
            <select className='form-control' value={this.state.status} onChange={(e) => this.setState({ status: +e.target.value }) }>
              <option value={1}>Open</option>
              <option value={2}>Won</option>
              <option value={3}>Lost</option>
              <option value={4}>Void</option>
              <option value={5}>Half won</option>
              <option value={6}>Half lost</option>
            </select>
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <button type='button' className='btn btn-danger' onClick={this.onDelete.bind(this)}>Delete trade</button>
          <button className='btn btn-info' onClick={onClose}>Close</button>
          <button type='submit' className='btn btn-success'>Save</button>
        </Modal.Footer>
        </form>
      </Modal>
    )
  }
}

const FormGroup = (props) => {
  return (
    <div className='form-group'>
      <label className='col-xs-3 control-label'>{ props.label }</label>
      <div className='col-xs-9'>
        { props.children }
      </div>
    </div>
  )
}
