import React, { Component } from 'react'
import Modal from 'react-bootstrap/lib/Modal'
import { displayOddsType, convertCurrency, convertOdds, SPORTS } from 'utils/converters'
import { calculateStake } from 'utils/calculations'
import { bookmakerLookup, countryLookup } from 'config'
import { isEqual } from 'underscore'


export class TradeDetailModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      wager: null,
      usertrade: null,
      odds: 1,
      edge: 1,
      recommendedStake: null,
      trade: null
    }
    this.submit = this.submit.bind(this)
    this.changeOdds = this.changeOdds.bind(this)
  }

  submit() {
    if (this.state.wager) {
      this.props.registerTrade({
        trade: this.state.trade,
        wager: this.state.wager,
        currency: this.state.bookmakerCurrency,
        usertrade: this.state.usertrade,
        edge: this.state.edge,
        odds: this.state.odds
      }).then(() => this.props.onClose())
    }
  }

  onKeyDown(e) {
    if (e.keyCode === 13)
      this.submit()
  }

  calculateChanges(prevProps) {
    const { trade, usertradeMap, kellyFrac, mainCurrency, balance, currencies } = this.props
    if (!prevProps.open && this.props.open) {
      // Opened up
      document.title = `${ trade.odds } @ ${displayOddsType(trade.oddsType, trade.output, trade.oddsTypeCondition, trade.homeTeam, trade.awayTeam)}`
      if (!this.state.trade) {
        this.setState({
          trade,
          expired: false,
          wager: calculateStake(trade.kelly, kellyFrac, balance, mainCurrency, this.props.bookmakerCurrency, currencies),
          bookmakerCurrency: this.props.bookmakerCurrency,
          edge: trade.edge,
          odds: trade.odds,
          recommendedStake: null
        })
      } else if (this.state.trade._id !== trade._id) {
        this.setState({
          trade,
          expired: false,
          wager: calculateStake(trade.kelly, kellyFrac, balance, mainCurrency, this.props.bookmakerCurrency, currencies),
          edge: trade.edge,
          bookmakerCurrency: this.props.bookmakerCurrency,
          odds: trade.odds,
          recommendedStake: null
        })
      } else if (!(this.state.edge === trade.edge && this.state.kelly === trade.kelly && this.state.odds === trade.odds)) {
        this.setState({
          edge: trade.edge,
          odds: trade.odds,
          wager: calculateStake(trade.kelly, kellyFrac, balance, mainCurrency, this.props.bookmakerCurrency, currencies),
          recommendedStake: null
        })
      }
      const placedTrade = (usertradeMap[trade.matchId] || []).find(t => t.tradeId === trade._id)
      if (placedTrade && placedTrade.odds === trade.odds) {
        this.setState({
          usertrade: placedTrade,
          wager: placedTrade.wager
        })
      }
    } else if (this.props.open) {
      document.title = `${ this.state.odds } @ ${displayOddsType(this.state.trade.oddsType, this.state.trade.output, this.state.trade.oddsTypeCondition, this.state.trade.homeTeam, this.state.trade.awayTeam)}`
      if (!trade) {
        if (!this.state.expired)
          this.setState({
            expired: true
          })
      } else if (trade.kelly !== this.state.trade.kelly) {
        this.setState({
          trade,
          expired: false,
          wager: calculateStake(trade.kelly, kellyFrac, balance, mainCurrency, this.props.bookmakerCurrency, currencies),
          bookmakerCurrency: this.props.bookmakerCurrency,
          edge: trade.edge,
          odds: trade.odds,
          recommendedStake: null
        })
      } else if (this.state.expired) {
        this.setState({
          expired: false
        })
      }
    }
    if (!this.props.open && prevProps.open) {
      document.title = 'Trademate Sports'
    }
    // if (this.props.open && !this.state.trade) {
    //   console.log('dont have trade')
    //   this.setState({
    //     trade
    //   })
    // } else if (!trade && this.props.open) {
    //   this.setState({
    //     trade: {
    //       ...this.state.trade,
    //       expired: true
    //     }
    //   })
    // } else if (this.state.trade._id !== trade._id) { // New trade or open
    //   console.log('new trade')
    //   this.setState({
    //     trade,
    //     wager: calculateStake(trade.kelly, kellyFrac, balance, mainCurrency, bookmakerCurrency, currencies),
    //     edge: trade.edge,
    //     odds: trade.odds
    //   })
    // } else if (this.state.trade._id === trade._id && !(prevProps.trade.edge === trade.edge && prevProps.trade.kelly === trade.kelly && prevProps.trade.odds === trade.odds)) {
    //   // Same trade, but updated
    //   console.log('same trade updated')
    //   this.setState({
    //     trade
    //   })
    // }
    // ========
    // if (this.props.open && !prevProps.open) {
    //   document.title = `${ trade.odds } @ ${displayOddsType(trade.oddsType, trade.output, trade.oddsTypeCondition, trade.homeTeam, trade.awayTeam)}`
    // }
    // if (!this.props.open && prevProps.open) {
    //   document.title = 'Trademate Sports'
    //   this.setState({ recommendedStake: null })
    // }
    // if (trade && (!prevProps.trade || prevProps.trade._id !== trade._id) || prevProps.open !== this.props.open) {
    //   const changes = {
    //     odds: trade.odds,
    //     edge: trade.edge
    //   }
    //   const placedTrade = (usertradeMap[trade.matchId] || []).find(t => t.tradeId === trade._id)
    //   if (placedTrade && placedTrade.odds === trade.odds) {
    //     changes.usertrade = placedTrade
    //     changes.wager = placedTrade.wager
    //   } else {
    //     changes.usertrade = null
    //     changes.odds = trade.odds
    //     changes.edge = trade.edge
    //   }
    //   if (!changes.wager && ((prevProps.trade && prevProps.trade._id !== trade._id) || (!prevProps.trade))) {
    //     changes.wager = calculateStake(trade.kelly, kellyFrac, balance, mainCurrency, bookmakerCurrency, currencies)
    //   }
    //   this.setState({
    //     ...changes
    //   })
    // }
  }

  changeOdds(e) {
    const odds = +e.target.value
    const edge = Math.round(((odds / this.state.trade.yardstick) - 1) * 100 * 10) / 10
    const winRate = 1 / this.state.trade.yardstick
    const kelly = ((odds - 1) * winRate - (1 - winRate)) / (odds - 1)
    let recommendedStake = -1
    if (kelly > 0 && odds !== 0 && edge !== 0)
      recommendedStake = calculateStake(kelly, this.props.kellyFrac,
                                        this.props.balance, this.props.mainCurrency,
                                        this.state.bookmakerCurrency, this.props.currencies)
    this.setState({
      odds,
      edge,
      recommendedStake
    })
  }

  componentDidUpdate(prevProps, prevState) {
    this.calculateChanges(prevProps)
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (isEqual(this.state, nextState) && isEqual(this.props, nextProps))
      return false
    return true
  }

  render() {
    if (!this.state.trade)
      return <Modal open={false} />
    const {
      homeTeam, awayTeam, open, output, oddsType, bookmaker,
      oddsTypeCondition, competition, odds, kelly,
      startTime, edge, matchId, sportId, country
    } = this.state.trade
    let displayOdds = convertOdds('Decimal', this.props.oddsFormat, this.state.odds)
    const { balance, mainCurrency, currencies, kellyFrac, usertradeMap } = this.props
    const recommendedStake = calculateStake(kelly, kellyFrac, balance, mainCurrency, this.state.bookmakerCurrency, currencies)
    const placedBets = usertradeMap[matchId] || []
    const currentAction = placedBets.map(b => (
      <p key={b.key}>{ displayOddsType(b.oddsType, b.output, b.oddsTypeCondition, b.match.homeTeam, b.match.awayTeam) }, { b.wager } { b.currency } @ { b.odds } on { bookmakerLookup[b.bookmaker] }</p>
    ))
    return (
      <Modal show={this.props.open} onHide={this.props.onClose} className='trade-modal'>
        <Modal.Header closeButton>
          <Modal.Title>
            <div className='title'>{ homeTeam } vs { awayTeam }</div>
            <div className='text-muted'>
              <span className='pull-left'>{ competition.name } - { countryLookup[country] } ({ SPORTS[sportId].name })</span>
              <span className='pull-right'>
                <i className='ionicons ion-ios-clock-outline'></i>&nbsp;&nbsp;{ startTime.fromNow() }
              </span>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { //<p>{ this.props.trade._id.split('_')[0] }</p>
          // <p>{ this.props.trade.baselineOffer }</p>
          }
          { this.state.expired && <h3 style={{marginTop: 0 }} className='text-danger text-center'>EXPIRED</h3> }
          { currentAction.length > 0 && (
            <div className='row text-center'>
              <div className='col-xs-12'>
                <h4>Current action</h4>
                { currentAction }
              </div>
            </div>
          )}
          <div className='row'>
            <div className='col-xs-12'>
              <p className='odds-type'>{ displayOddsType(oddsType, output, oddsTypeCondition, homeTeam, awayTeam)}</p>
            </div>
            <div className='col-xs-4 text-center'>
              <p className='label'>ODDS</p>
              <p className='value'>
                <input type='number' value={this.state.odds}
                  className='form-control'
                  step={0.001}
                  onChange={this.changeOdds}
                />
              </p>
              {this.props.oddsFormat === 'American'? <p className='text-muted'> American odds: {displayOdds}</p>: null}
            </div>
            <div className='col-xs-4 text-center'>
              <p className='label'>RECOMMENDED</p>
              <p className='value'>{ this.state.recommendedStake || recommendedStake } { this.state.bookmakerCurrency }</p>
            </div>
            <div className='col-xs-4 text-center'>
              <p className='label'>EDGE</p>
              <p className='value'>{ this.state.edge }%</p>
            </div>
            <div className='col-xs-12 input-block'>
              <span className='help-text center-block text-center'>Place this trade with {bookmakerLookup[bookmaker] }</span>
              <div className='input-group wager-input'>
                <input className='form-control'
                  type='number'
                  onChange={(e) => this.setState({wager: +e.target.value})}
                  value={this.state.wager === null ? recommendedStake : this.state.wager }
                  onKeyDown={this.onKeyDown.bind(this)}
                />
                <span className='input-group-addon'>{ this.state.bookmakerCurrency }</span>
              </div>
            </div>
          </div>
          <div className='row'>
            <button className='register-trade-button btn' onClick={this.submit}>
              { this.state.usertrade && this.state.usertrade.odds === this.state.odds ? 'EDIT TRADE' : 'REGISTER TRADE' }
            </button>
          </div>
        </Modal.Body>
      </Modal>
    )
  }
}
