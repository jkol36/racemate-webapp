import React, { Component } from 'react'
import Modal from 'react-bootstrap/lib/Modal'
import Select from 'react-select'
import { bookmakerLookup } from 'config'
import ReactTooltip from 'react-tooltip'
import 'less/react-select.less'
import firebase from 'firebase'
import Toggle from 'react-toggle'

import { SPORTS } from 'utils/converters'

const sportOptions = Object.keys(SPORTS).map(s => ({
  label: SPORTS[s].name,
  value: +s
}))
const oddsTypeOptions = [{
  label: '1x2',
  value: 0
}, {
  label: 'Moneyline',
  value: 1
}, {
  label: 'Spread',
  value: 3
}, {
  label: 'Totals',
  value: 4
}, {
  label: 'Asian handicap',
  value: 5
}, {
  label: 'Draw no bet',
  value: 6291457
}, {
  label: 'European Handicap',
  value: 8388608
}]
export class EditPresetModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: 'My new preset',
      bookmakers: [],
      odds: {
        lte: 8,
        gte: 1.2
      },
      edge: {
        gte: 3,
        lte: 12
      },
      hoursBefore:{
        lte: 48,
        gte: 0
      },
      oddsTypes: [],
      sports: [],
      recommendedLeagues: true,
      afterTradePlaced: 1
    }
  }

  onChangeBookmakers(bookmakers) {
    this.setState({
      bookmakers: bookmakers ? bookmakers.map(b => b.value) : []
    })
  }

  onChangeSports(sports) {
    this.setState({
      sports: sports ? sports.map(b => b.value) : []
    })
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.open && nextProps.open && this.props.uid !== nextProps.uid) {
      const { preset } = nextProps
      this.setState({
        ...preset
      })
    }
  }

  onSubmit(e) {
    e.preventDefault()
    this.props.onSubmit(this.state)
  }

  render() {
    const bookmakerOptions = this.props.user.bookmakers.map(b => ({
      value: b.key, label: bookmakerLookup[b.key]
    }))
    return (
      <Modal show={this.props.open} onHide={this.props.onClose} className='edit-preset-modal'>
        <Modal.Header closeButton>
          <Modal.Title>
            { this.props.title || this.state.name }
          </Modal.Title>
        </Modal.Header>
        <form onSubmit={this.onSubmit.bind(this)}>
        <Modal.Body>
          { !this.props.title &&
            <div className='form-group'>
              <label>Name</label>
              <input className='form-control' type='text' placeholder='name' value={this.state.name}
                onChange={(e) => this.setState({ name: e.target.value })}
              />
            </div>
          }
          <div className='form-group'>
            <label>Bookmakers</label>
            <Select name='bookmakers'
              options={bookmakerOptions}
              onChange={this.onChangeBookmakers.bind(this) }
              multi
              value={this.state.bookmakers}
              placeholder={this.props.user.bookmakers.length === 0 ? 'You have not added any bookmakers yet, this is done in My Bookmakers' : 'Includes all bookmakers if none are selected'}
            />
          </div>
          <div className='form-group'>
            <label>Sports</label>
            <Select name='sports'
              options={sportOptions}
              onChange={this.onChangeSports.bind(this) }
              multi
              placeholder='Includes all sports if none are selected'
              value={this.state.sports}
            />
          </div>
          <div className='form-group'>
            <label>Odds types</label>
            <Select name='oddstypes'
              options={oddsTypeOptions}
              onChange={ ots => this.setState({ oddsTypes: ots ? ots.map(ot => ot.value) : [] }) }
              multi
              placeholder='Includes all odds types if none are selected'
              value={this.state.oddsTypes}
            />
          </div>
          <div className='form-group'>
            <label>Odds</label>
            <div className='row'>
              <div className='col-xs-12 col-md-6'>
                <div className='input-group'>
                  <span className='input-group-addon' data-tip='Greater than or equal to'>FROM</span>
                  <input type='number'
                    className='form-control'
                    value={this.state.odds.gte}
                    onChange={(e) => this.setState({ odds: {
                        gte: +e.target.value,
                        lte: this.state.odds.lte
                      }
                    })}
                  />
                </div>
              </div>
              <div className='col-xs-12 col-md-6'>
                <div className='input-group'>
                  <span className='input-group-addon' data-tip='Lesser than or equal to'>TO</span>
                  <input type='number'
                    className='form-control'
                    value={this.state.odds.lte}
                    onChange={(e) => this.setState({
                      odds: {
                        lte: +e.target.value,
                        gte: this.state.odds.gte
                      }
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className='form-group'>
            <label>Edge</label>
            <div className='row'>
              <div className='col-xs-12 col-md-6'>
                <div className='input-group'>
                  <span className='input-group-addon' data-tip='Greater than or equal to'>FROM</span>
                  <input type='number'
                    className='form-control'
                    value={this.state.edge.gte}
                    onChange={(e) => this.setState({
                      edge: {
                        gte: +e.target.value,
                        lte: this.state.edge.lte
                      }
                    })}
                  />
                  <span className='input-group-addon'>%</span>
                </div>
              </div>
              <div className='col-xs-12 col-md-6'>
                <div className='input-group'>
                  <span className='input-group-addon' data-tip='Lesser than or equal to'>TO</span>
                  <input type='number'
                    className='form-control'
                    value={this.state.edge.lte}
                    onChange={(e) => this.setState({
                      edge: {
                        lte: +e.target.value,
                        gte: this.state.edge.gte
                      }
                    })}
                  />
                  <span className='input-group-addon'>%</span>
                </div>
              </div>
            </div>
          </div>
          <div className='form-group'>
            <label>Hours before game time</label>
            <div className='row'>
              <div className='col-xs-12 col-md-6'>
                <div className='input-group'>
                  <span className='input-group-addon' data-tip='Greater than or equal to'>FROM</span>
                  <input type='number'
                    className='form-control'
                    value={this.state.hoursBefore.gte}
                    onChange={(e) => this.setState({
                      hoursBefore: {
                        gte: +e.target.value,
                        lte: this.state.hoursBefore.lte
                      }
                    })}
                  />
                </div>
              </div>
              <div className='col-xs-12 col-md-6'>
                <div className='input-group'>
                  <span className='input-group-addon' data-tip='Lesser than or equal to'>TO</span>
                  <input type='number'
                    className='form-control'
                    value={this.state.hoursBefore.lte}
                    onChange={(e) => this.setState({
                      hoursBefore: {
                        lte: +e.target.value,
                        gte: this.state.hoursBefore.gte
                      }
                    })}
                  />
                </div>
              </div>
            </div>
          </div>


          <div className='form-group'>
            <div className='row'>
              <div className='col-xs-6'>
                <label>{ this.state.recommendedLeagues ? 'Only recommended leagues' : 'All leagues' }</label>
                <div className='input-group'>
                  <Toggle checked={this.state.recommendedLeagues}
                    onChange={() => this.setState({recommendedLeagues: !this.state.recommendedLeagues})} />
                </div>
              </div>
            </div>
          </div>
          { (!this.props.title && !this.props.hideAfterPlacedTrade) &&
            <div className='form-group'>
              <label>After placed trade</label>
              <select className='form-control' value={this.state.afterTradePlaced}
                onChange={e => this.setState({ afterTradePlaced: +e.target.value }) }>
                <option value={1}>Remove all trades on that match</option>
                <option value={2}>Remove that particular trade</option>
                <option value={3}>Keep it in the tradefeed</option>
              </select>
            </div>
          }
          <ReactTooltip place='left' />
        </Modal.Body>
        <Modal.Footer>
          <button type='submit' className='btn btn-success'>Save preset</button>
        </Modal.Footer>
        </form>
      </Modal>
    )
  }
}
