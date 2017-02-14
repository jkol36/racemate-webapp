import React, { Component } from 'react'
import firebase from 'firebase'
import { displayOddsType, SPORTS } from 'utils/converters'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import moment from 'moment'
import { bookmakerLookup } from 'config'
import 'less/livefeed.less'


export class LiveTradefeed extends Component {
  constructor(props) {
    super(props)
    this.fireRef = firebase.database().ref('userbets').orderByChild('createdAt').limitToLast(5)
    this.interval = setInterval(this.updateFeed.bind(this), 10000)
    this.state = {
      trades: []
    }
  }

  updateFeed() {
    this.forceUpdate()
  }

  handleNewTrade(trade) {
    this.setState({
      trades: [trade, ...this.state.trades].slice(0, 5)
    })
  }

  componentDidMount() {
    this.fireRef.on('child_added', snap => {
      this.handleNewTrade(snap.val())
    })
  }

  componentWillUnmount() {
    clearInterval(this.interval)
    this.fireRef.off()
  }

  render() {
    return (
      <div className='item'>
        <div className='panel livefeed-panel'>
          <header className='panel-heading'>Live feed from the community</header>
          <div className='panel-body'>
            <Livefeed items={this.state.trades} />
          </div>
        </div>
      </div>
    )
  }
}

const LivefeedItem = (props) => {
  const {
    oddsType,
    wager,
    createdAt,
    currency,
    odds,
    oddsTypeCondition,
    output,
    sport,
    bookmaker,
    match: { homeTeam, awayTeam },
  } = props
  return (
    <div className='livefeed-item clearfix'>
      <span className='icon'>
        <i className={SPORTS[sport].icon}></i>
      </span>
      <div className='info'>
        <div>
          <span className='highlighted'>{ homeTeam }</span>
          <span> vs </span>
          <span className='highlighted'>{ awayTeam }</span>
          <span className='pull-right'>{ moment(createdAt).fromNow() }</span>
        </div>
        <span className='highlighted'>{ `${wager} ${currency}` }</span>
        <span> on </span>
        <span className='highlighted'>{ displayOddsType(oddsType, output, oddsTypeCondition, homeTeam, awayTeam)}</span>
        <span> @ </span>
        <span className='highlighted'>{ odds }</span>
        <br />
        <span>at </span><span className='highlighted'>{ bookmakerLookup[bookmaker] }</span>
      </div>
    </div>
  )
}

const Livefeed = (props) => {
  return (
    <ReactCSSTransitionGroup className='livefeed-list' component='div'
      transitionName='livefeed'
      transitionEnterTimeout={500} transitionLeaveTimeout={300}
      transitionAppear={true} transitionAppearTimeout={500}>
      { props.items.map((item, i) => <LivefeedItem key={i} {...item} />)}
    </ReactCSSTransitionGroup>
  )
}
