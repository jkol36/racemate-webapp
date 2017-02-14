import React, { Component } from 'react'
import { displayOddsType, convertOdds } from 'utils/converters'
import { bookmakerLookup, NOTIFICATION_SOUND_URL } from 'config'
import { calculateStake } from 'utils/calculations'
import classnames from 'classnames'
import Push from 'push.js'

const arePropsEqual = (props, nextProps) => {
  return false
  if (props.trades == null || nextProps.trades == null)
    return false
  if (props.trades.length !== nextProps.trades.length)
    return false
  for (var i=0; i < props.trades.length; i++) {
    const a = props.trades[i]
    const b = nextProps.trades[i]
    if (!(a.edge === b.edge && a.kelly === b.kelly && a.odds === b.odds && a._id === b._id)) {
      return false
    }
  }
  return true
}

export class ComposableTradefeed extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sortKey: 'kelly',
      query: ''
    }
    this.notificationSignal = new Audio(NOTIFICATION_SOUND_URL)
  }

  componentDidUpdate(prevProps) {
    const oldTrades = new Set(prevProps.trades.map(t => t._id))
    const newTrades = new Set(this.props.trades.map(t => t._id))
    for (var elem of newTrades) {
        if (!oldTrades.has(elem)) {
          let tradeObj = this.props.trades.filter(trade => trade._id === elem).map(t => t)[0]
          if (this.props.sound) {
            this.notificationSignal.play()
          }
          if(this.props.desktopNotifications) {
            Push.create(`New Trade on ${bookmakerLookup[tradeObj.bookmaker]} ${tradeObj.startTime.fromNow()}`,{
              body:`${tradeObj.homeTeam} vs ${tradeObj.awayTeam} \n edge: ${tradeObj.edge} \n odds: ${tradeObj.odds} \n stake: ${calculateStake(tradeObj.kelly, this.props.kellyFrac, this.props.balance, this.props.mainCurrency, this.props.bookmakerCurrencies[tradeObj.bookmaker], this.props.currencies)}`,
              icon:'https://app.tradematesports.com/static/img/logo.png',
              onClick: () => {
                this.didClick(tradeObj._id)
              }
            })
          }
          
          return
        }
      }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !arePropsEqual(nextProps, nextState) || this.state.sortKey !== nextState.sortKey
  }

  didClick(id) {
    this.props.onSelectedTrade(id)
  }

  onEditPreset() {
    this.props.onEditPreset(this.props.presetId)
  }

  onDeletePreset() {
    this.props.onDeletePreset(this.props.presetId)
  }

  onClickHeader(sortKey) {
    this.setState({
      sortKey
    })
  }

  toggleSound() {
    this.props.toggleSound(this.props.presetId)
  }

  toggleDesktopNotifications() {
    this.props.toggleDesktopNotifications(this.props.presetId)
  }

  render() {
    return (
      <div className='col-xs-12 col-lg-6'>
        <div className='panel composable-tradefeed'>
          <header className='panel-heading'>
            { this.props.name }
            <span className='tools'>
              <a className={'ionicons ion-alert-circled' + (this.props.desktopNotifications ? '  active': '')}
                onClick={this.toggleDesktopNotifications.bind(this)}
                data-tip='Send desktop notifications on new trade'
              ></a>
              <a className={'ionicons ion-ios-bell' + (this.props.sound ? ' active' : '') }
                onClick={this.toggleSound.bind(this)}
                data-tip='Play sound on new trade'></a>
              <a className='ionicons ion-edit text-info' onClick={this.onEditPreset.bind(this)}
                data-tip="Edit preset"></a>
              <a className='ionicons ion-close text-danger' onClick={this.onDeletePreset.bind(this) }
                data-tip="Delete preset"></a>
            </span>
          </header>
          <div className='panel-body'>
            { this.props.trades.length > 0 ? this.renderTrades() : this.renderEmpty()}
          </div>
        </div>
      </div>
    )
  }

  onHide(tid, e) {
    e.preventDefault()
    e.stopPropagation()
    this.props.onHideTrade(tid)
  }

  filterTrades() {
    if (this.state.query.length < 3)
      return this.props.trades
    const regex = new RegExp(this.state.query, 'gi')
    return this.props.trades.filter(t => {
      return (t.competition.name.match(regex) ||
              t.homeTeam.match(regex) ||
              t.awayTeam.match(regex) ||
              bookmakerLookup[t.bookmaker].match(regex))
    })
  }

  renderTrades() {
    const trades = this.filterTrades().map(t => ({
      ...t,
      stake: calculateStake(t.kelly, this.props.kellyFrac, this.props.balance, this.props.mainCurrency, this.props.bookmakerCurrencies[t.bookmaker], this.props.currencies)
    })).sort((a, b) => {
      let t = b[this.state.sortKey] - a[this.state.sortKey]
      if (t === 0)
        return a._id - b._id
      return t
    })
    return (
      <div>
        <table className='table table-hover'>
          <thead>
            <tr>
              <th className='search'>
                <div className='floating-input-group'>
                  <input type='text' required value={this.state.query}
                    onChange={(e) => this.setState({ query: e.target.value })} />
                  <label><i className='ionicons ion-ios-search'></i>Search</label>
                </div>
              </th>
              <th>BOOKMAKER</th>
              <th className={classnames({ 'text-success': this.state.sortKey === 'kelly'} )}
                onClick={() => this.onClickHeader('kelly')}>STAKE</th>
              <th className={classnames({ 'text-success': this.state.sortKey === 'edge'} )}
                onClick={() => this.onClickHeader('edge')}>EDGE</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {
              trades.map(t => {
                const placedTrades = this.props.usertradeMap[t.matchId] || []
                let odds = t.odds
                if(!!this.props.oddsFormat) {
                  odds = convertOdds('Decimal', this.props.oddsFormat, t.odds)
                }
                return (
                  <tr key={t._id} id={t._id} onClick={this.didClick.bind(this, t._id)}
                    className={classnames({
                      placed: placedTrades.length > 0
                    })}>
                    <td className='match-cell'>
                      <p className='teams'>{ t.homeTeam } <span className='vs'>vs</span> { t.awayTeam }</p>
                      <p className='line'>{ displayOddsType(t.oddsType, t.output,
                        t.oddsTypeCondition, t.homeTeam, t.awayTeam) } @ { odds }</p>
                      <p className='time'><i className='ionicons ion-clock'></i>{ t.startTime.fromNow() }</p>
                    </td>
                    <td className='bookmaker-cell'>{ bookmakerLookup[t.bookmaker] }</td>
                    <td className='stake-cell'>{ t.stake }
                      <span className='currency'>{ this.props.bookmakerCurrencies[t.bookmaker] }</span>
                    </td>
                    <td className='edge-cell'>{ t.edge }%</td>
                    <td className='hider text-danger' onClick={this.onHide.bind(this, t._id)} ><i className='ionicons ion-close'></i></td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    )
  }

  renderEmpty() {
    return (
      <p>{ this.props.name } has no trades right now.</p>
    )
  }
}
