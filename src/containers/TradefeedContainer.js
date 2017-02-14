import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  TradeDetailModal,
  ComposableTradefeed,
  AddPresetModal,
  EditPresetModal,
  BottomLeftStaticButton,
} from 'components'
import { uniq } from 'underscore'
import { calculateCurrentBalance } from 'utils/calculations'
import { canUseLocalStorage, getFromStorage, appendToStorage } from 'utils'
import { registerBet, editUserbet } from 'actions/userbets'
import ReactTooltip from 'react-tooltip'
import firebase from 'firebase'
import classnames from 'classnames'
import { recommendedLeagues } from 'config'
import 'less/tradefeed.less'

const STORAGE_KEY = 'trademate__hidden_trades'

class _TradefeedContainer extends Component {

  constructor(props) {
    super(props)
    this.canUseLocalStorage = canUseLocalStorage()
    this.state = {
      detailModalOpen: false,
      selectedTrade: null,
      addPresetModalOpen: false,
      editPresetModalOpen: false,
      editPresetId: null,
      hiddenTrades: this.canUseLocalStorage ? (getFromStorage(STORAGE_KEY) || []) : []
    }
    this.onSelectedTrade = this.onSelectedTrade.bind(this)
    this.onRegisterBet = this.onRegisterBet.bind(this)
    this.onEditPreset = this.onEditPreset.bind(this)
    this.onDeletePreset = this.onDeletePreset.bind(this)
    this.submitEditedPreset = this.submitEditedPreset.bind(this)
    this.onHideTrade = this.onHideTrade.bind(this)
    this.toggleSound = this.toggleSound.bind(this)
    this.toggleDesktopNotifications = this.toggleDesktopNotifications.bind(this)
  }

  onSelectedTrade(tradeId) {
    this.setState({
      selectedTrade: tradeId,
      detailModalOpen: true
    })
  }

  onRegisterBet({bet, wager, currency, userbet, edge, odds}) {
    if (userbet && userbet.odds === odds) {
      return this.props.dispatch(editUserbet(userbet.key, wager, edge))
    } else {
      return this.props.dispatch(registerBet(bet, wager, currency, edge, odds))
    }
  }

  onHideTrade(tid) {
    const hiddenTrades = [...this.state.hiddenTrades, tid]
    this.setState({ hiddenTrades })
    if (this.canUseLocalStorage) {
      appendToStorage(STORAGE_KEY, tid)
    }
  }

  onEditPreset(uid) {
    this.setState({
      editPresetModalOpen: true,
      editPresetId: uid
    })
    analytics.track('Edited tradefeed preset')
  }

  toggleSound(presetId) {
    const toggled = !this.props.user.presets.find(p => p.key === presetId).sound
    firebase.database().ref('users').child(this.props.user.uid).child('presets').child(presetId).child('sound').set(toggled)
  }

  toggleDesktopNotifications(presetId) {
    const desktopNotificationsToggled = !this.props.user.presets.find(p => p.key === presetId).desktopNotifications
    firebase.database().ref('users')
      .child(this.props.user.uid)
      .child('presets')
      .child(presetId)
      .child('desktopNotifications')
      .set(desktopNotificationsToggled)
  }

  submitEditedPreset(preset) {
    firebase.database().ref('users').child(this.props.user.uid).child('presets').child(this.state.editPresetId).set({
      ...preset
    }).then(() => this.setState({
      editPresetModalOpen: false,
      editPresetId: null
    }))
    analytics.track('Added tradefeed preset')
  }

  onDeletePreset(uid) {
    firebase.database().ref('users').child(this.props.user.uid).child('presets').child(uid).remove()
    analytics.track('Deleted tradefeed preset')
  }

  onAddNewPreset(preset) {
    const ref = firebase.database().ref('users').child(this.props.user.uid).child('presets').push()
    ref.set(preset)
    this.setState({
      addPresetModalOpen: false
    })
  }

  render() {
    var hiddenTradeMap = {}
    this.state.hiddenTrades.forEach(t => {
      hiddenTradeMap[t] = true
    })
    const trades = this.props.trades.sort((a, b) => b.kelly - a.kelly).filter(t => !hiddenTradeMap[t._id])
    const selectedTrade = this.props.tradeMap[this.state.selectedTrade]
    const bookmakerCurrencies = {}
    this.props.user.bookmakers.forEach(b => bookmakerCurrencies[b.key] = b.currency)
    let bookmakerCurrency = null
    if (!!selectedTrade) {
      bookmakerCurrency = this.props.bookmakers.find(b => b.key === selectedTrade.bookmaker).currency
    }
    const { usertradeMap } = this.props
    return (
      <div className='container-fluid'>
        <div className='tradefeeds-container'>
          {
            this.props.user.presets.map(preset => {
              const timeNow = Date.now()
              var subTrades = trades.filter(t => {
                return (
                  t.edge >= (preset.edge.gte || 0) &&
                  t.edge <= (preset.edge.lte || Infinity) &&
                  t.odds >= (preset.odds.gte || 0 ) &&
                  t.odds <= (preset.odds.lte || Infinity) &&
                  (preset.bookmakers.length === 0 || preset.bookmakers.indexOf(t.bookmaker) !== -1) &&
                  (t.startTime - timeNow) / (1000 * 60 * 60) <= preset.hoursBefore.lte &&
                  (preset.hoursBefore.gte === 0 || ((t.startTime - timeNow) / (1000 * 60 * 60) >= preset.hoursBefore.gte)) &&
                  (preset.sports.length === 0 || preset.sports.indexOf(t.sportId) !== -1) &&
                  (!preset.recommendedLeagues || recommendedLeagues.indexOf(t.competition.uid)) !== -1 &&
                  (preset.oddsTypes.length === 0 || preset.oddsTypes.indexOf(t.oddsType) !== -1) &&
                  ((preset.afterTradePlaced === 1 && !usertradeMap[t.matchId]) ||
                   (preset.afterTradePlaced === 2 && !(usertradeMap[t.matchId] || []).find(k => k.tradeId === t.id) )||
                    (preset.afterTradePlaced === 3))
                )
              })
              return <ComposableTradefeed key={preset.key}
                presetId={preset.key}
                oddsFormat={this.props.user.oddsFormat ? this.props.user.oddsFormat: 'Decimal'}
                sound={preset.sound}
                toggleSound={this.toggleSound}
                desktopNotifications={preset.desktopNotifications}
                toggleDesktopNotifications={this.toggleDesktopNotifications}
                trades={subTrades}
                onSelectedTrade={ this.onSelectedTrade }
                name={preset.name}
                bookmakerCurrencies={bookmakerCurrencies}
                balance={this.props.currentBalance}
                mainCurrency={this.props.user.mainCurrency}
                currencies={this.props.currencies}
                onEditPreset={this.onEditPreset}
                onDeletePreset={this.onDeletePreset}
                usertradeMap={this.props.usertradeMap}
                kellyFrac={this.props.user.kellyFrac}
                onHideTrade={this.onHideTrade}
              />
            })
          }
        </div>
        <BottomLeftStaticButton tooltipText='Add a new preset'
          hidden={this.state.detailModalOpen || this.state.editPresetModalOpen || this.state.addPresetModalOpen}
          onClick={() => this.setState({ addPresetModalOpen: true })}
        >
          <i className='ionicons ion-ios-plus-empty'></i>
        </BottomLeftStaticButton>
        <AddPresetModal
          open={this.state.addPresetModalOpen}
          onClose={() => this.setState({ addPresetModalOpen: false })}
          user={this.props.user}
          onSubmit={this.onAddNewPreset.bind(this)}
        />
        <EditPresetModal open={this.state.editPresetModalOpen}
          onClose={() => this.setState({ editPresetModalOpen: false, editPresetId: null})}
          user={this.props.user}
          preset={this.props.user.presets.find(p => p.key === this.state.editPresetId)}
          uid={this.state.editPresetId}
          onSubmit={ this.submitEditedPreset }
        />
        <TradeDetailModal
          bet={selectedTrade}
          kellyFrac={this.props.user.kellyFrac}
          oddsFormat={this.props.user.oddsFormat ? this.props.user.oddsFormat: 'Decimal'}
          open={this.state.detailModalOpen}
          onClose={() => this.setState({detailModalOpen: false})}
          balance={this.props.currentBalance}
          bookmakerCurrency={bookmakerCurrency}
          mainCurrency={this.props.user.mainCurrency}
          currencies={this.props.currencies}
          registerTrade={this.onRegisterBet}
          usertradeMap={this.props.usertradeMap}
        />
        <ReactTooltip place='left' effect='solid'/>
      </div>
    )
  }
}

export const TradefeedContainer = connect(state => {
  const bookmakers = state.auth.user.bookmakers
  const bookmakerKeys = bookmakers.map(k => k.key)
  const trades = state.trades.allIds.map(id => state.trades.byId[id]).filter(t => bookmakerKeys.indexOf(t.bookmaker) > -1)
  const usertrades = state.usertrades.allIds.map(id => state.usertrades.byId[id])
  const currentBalance = calculateCurrentBalance(usertrades, state.auth.user, state.currencies)
  const usertradeMap = {}
  usertrades.filter(t => t.status === 1).forEach(t => {
    if (usertradeMap[t.match._id])
      usertradeMap[t.match._id].push(t)
    else usertradeMap[t.match._id] = [t]
  })
  return {
    currentBalance,
    usertrades: new Set(usertrades.filter(t => t.status === 1).map(u => u.match._id)),
    trades,
    tradeMap: state.trades.byId,
    bookmakers,
    currencies: state.currencies,
    usertradeMap
  }
})(_TradefeedContainer)
