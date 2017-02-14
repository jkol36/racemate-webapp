import React, { Component } from 'react'
import { leagueLookup, bookmakerLookup, NOTIFICATIONS_SOUND_URL } from 'config'
import { displayOddsType } from 'utils/converters'

const arePropsEqual = (props, nextProps) => {
  if (props.trades == null || nextProps.trades == null)
    return false
  if (props.trades.length !== nextProps.trades.length)
    return false
  for (var i=0; i < props.trades.length; i++) {
    const a = props.trades[i]
    const b = nextProps.trades[i]
    if (!(a.edge === b.edge && a.kelly === b.kelly && a.odds === b.odds && a.id === b.id)) {
      return false
    }
  }
  return true
}

export class TradefeedComponent extends Component {
  constructor(props) {
    super(props)
    this.notificationSignal = new Audio(NOTIFICATIONS_SOUND_URL)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !arePropsEqual(this.props, nextProps)
  }

  didClick(tradeId) {
    this.props.onSelectedTrade(tradeId)
  }

  componentDidUpdate(prevProps) {
    if (this.props.)
    const oldTrades = new Set(prevProps.trades.map(t => t.id))
    const newTrades = new Set(this.props.trades.map(t => t.id))
    for (var elem of newTrades) {
      if (!oldTrades.has(elem)) {
        this.audio.play()
        return
      }
    }
  }

  render() {
    return (
      <div className='panel tradefeed-panel'>
        <header className='panel-heading'>Tradefeed</header>
        <div className='panel-body'>
          <div className='list-group'>
            { this.props.trades.map(t => (
              <div className='list-group-item clearfix' onClick={this.didClick.bind(this, t.id)} key={t.id}>
                <span className='time'>
                  <i className='ionicons ion-ios-clock-outline'></i>{ t.startTime.fromNow() }
                </span>
                <span className='bookmaker'>
                  { bookmakerLookup[t.bookmaker] }
                </span>
                <div className='col-sm-12 hidden-xs teams'>
                  { t.homeTeam }<span className='vs'>vs</span>{ t.awayTeam }
                </div>
                <div className='col-xs-12 visible-xs home'>
                  { t.homeTeam }
                </div>
                <div className='col-xs-12 visible-xs'>
                  <hr className='vs-divider divider center-block' />
                </div>
                <div className='col-xs-12 visible-xs away'>
                  { t.awayTeam }
                </div>
                <div className='col-xs-12 league text-center hidden-xs'>
                  { leagueLookup[t.competition] }
                </div>
                <div className='col-xs-12 center-block'>
                  <hr className='divider' />
                </div>
                <div className='col-xs-12 text-center odds-type'>
                  { displayOddsType(t.oddsType, t.output, t.oddsTypeCondition, t.homeTeam, t.awayTeam) }
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
}
