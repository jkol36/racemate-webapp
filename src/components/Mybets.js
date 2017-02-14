import React, { Component } from 'react'
import { connect } from 'react-redux'
import { displayOddsType } from 'utils/converters'
import { calculateBetReturn } from 'utils/calculations'
import { bookmakerLookup } from 'config'
import ReactPaginate from 'react-paginate';
import 'less/mybets.less'

const PAGE_LENGTH = 25

export class Mybets extends Component {

  constructor(props) {
    super(props)
    this.state = {
      openPage: 0,
      settledPage: 0,
      showOpen: true,
      showClosed: true,
      query: ''
    }
  }

  changePage(page) {
    this.setState({
      page
    })
  }

  filterTrades() {
    if (this.state.query.length < 3)
      return this.props.userbets
    const regex = new RegExp(this.state.query, 'gi')
    return this.props.userbets.filter(t =>
      (t.match.competition && t.match.competition.name && t.match.competition.name.match(regex)) ||
      t.match.homeTeam.match(regex) ||
      t.match.awayTeam.match(regex) ||
      bookmakerLookup[t.bookmaker].match(regex)
    )
  }

  renderOpenTrades(trades) {
    trades = trades.filter(t => t.status === 1)
    if (trades.length === 0) {
      if (this.state.query > 3)
        return <p className='lead'>There are no open trades with your search query</p>
      return <p className='lead'>You have no open trades</p>
    }
    const pages = Math.ceil(trades.length / PAGE_LENGTH)
    if (!this.state.showOpen)
      return (
        <div className='row hidden-xs header-row'>
          <div className='col-sm-7'>
            <span className='title-label-container'
              onClick={() => this.setState({ showOpen: !this.state.showOpen }) }>
              <span>Open trades</span>
            </span>
          </div>
        </div>
      )
    return (
      <div>
        <div className='row hidden-xs header-row'>
          <div className='col-sm-12'>
            <span className='title-label-container'
              onClick={() => this.setState({ showOpen: !this.state.showOpen }) }>
              <span>Open trades</span>
            </span>
          </div>
          <div className='col-sm-7'>
            { pages > 1 &&
              <ReactPaginate pageNum={pages}
                marginPagesDisplayed={2}
                initialSelected={this.state.openPage}
                pageRangeDisplayed={5}
                containerClassName='pagination clearfix'
                forceSelected={this.state.settledPage}
                clickCallback={(page) => this.setState({ openPage: page.selected })} />
            }
          </div>
          <div className='col-sm-3 text-center'><span>STAKE</span></div>
          <div className='col-sm-2 text-center'><span>ODDS</span></div>
        </div>
        <div className='list-group'>
          {
            trades.slice(this.state.openPage * PAGE_LENGTH, this.state.openPage * PAGE_LENGTH + PAGE_LENGTH).map(t =>
              <Trade trade={t} onSelectTrade={this.props.onSelectTrade}
                key={t.key} open={true} />)
          }
        </div>
        { pages > 1 &&
          <ReactPaginate pageNum={pages}
            marginPagesDisplayed={2}
            initialSelected={this.state.openPage}
            pageRangeDisplayed={5}
            containerClassName='pagination clearfix'
            forceSelected={this.state.settledPage}
            clickCallback={(page) => this.setState({ openPage: page.selected })} />
        }

      </div>
    )
  }


  renderSettledTrades(trades) {
    trades = trades.filter(t => t.status !== 1)
    if (trades.length === 0) {
      if (this.state.query.length > 3)
        return <p className='lead'>There are no trades with your search query</p>
      return <p className='lead'>You have no settled trades</p>
    }
    if (!this.state.showClosed) {
      return (
        <div className='row hidden-xs header-row'>
          <div className='col-sm-8'>
            <span className='title-label-container'
              onClick={() => this.setState({ showClosed: !this.state.showClosed }) }>
              <span>Settled trades</span>
            </span>
          </div>
        </div>
      )
    }
    const pages = Math.ceil(trades.length / PAGE_LENGTH)
    return (
      <div>
        <div className='row hidden-xs header-row'>
          <div className='col-sm-12'>
            <span className='title-label-container'
              onClick={() => this.setState({ showClosed: !this.state.showClosed }) }>
              <span>Settled trades</span>
            </span>
          </div>
          <div className='col-sm-8'>
            { pages > 1 &&
              <ReactPaginate pageNum={pages}
                marginPagesDisplayed={2}
                initialSelected={this.state.settledPage}
                pageRangeDisplayed={5}
                containerClassName='pagination clearfix'
                forceSelected={this.state.settledPage}
                clickCallback={(page) => this.setState({ settledPage: page.selected })} />
            }
          </div>
          <div className='col-sm-1 text-center'><span>ODDS</span></div>
          <div className='col-sm-1 text-center edge'><span>EDGE</span> / <span>CLOSING</span></div>
          <div className='col-sm-2 text-center'><span>NET RETURN</span></div>

        </div>
        <div className='list-group'>
          { trades.slice(this.state.settledPage * PAGE_LENGTH, this.state.settledPage * PAGE_LENGTH + PAGE_LENGTH).map(t =>
              <Trade trade={t} key={t.key} onSelectTrade={this.props.onSelectTrade}/>)
          }
        </div>
        { pages > 1 &&
          <ReactPaginate pageNum={pages}
            marginPagesDisplayed={2}
            initialSelected={this.state.settledPage}
            pageRangeDisplayed={5}
            containerClassName='pagination clearfix'
            forceSelected={this.state.settledPage}
            clickCallback={(page) => this.setState({ settledPage: page.selected })} />
        }
      </div>
    )
  }

  render() {
    const trades = this.filterTrades()
    return (
      <div className='panel mybets-panel'>
        <header className='panel-heading hidden-xs'>
          My trades
          <button className='pull-right btn btn-danger' onClick={this.props.onDeleteTrades}>Clear my trade history</button>
          <div className='floating-input-group pull-right'>
            <input type='text' required value={this.state.query}
              onChange={(e) => this.setState({ query: e.target.value })}
              style={{
                display: 'inline-block',
                borderBottom: '1px solid #d0d0d0' }}/>
            <label><i className='ionicons ion-ios-search'></i>Search</label>
          </div>
        </header>
        <div className='panel-body'>
          { this.renderOpenTrades(trades) }
          { this.renderSettledTrades(trades) }
        </div>
      </div>
    )
  }
}

class Trade extends Component {
  constructor(props) {
    super(props)
    this.onSelectRow = this.onSelectRow.bind(this)
  }

  onSelectRow() {
    this.props.onSelectTrade(this.props.trade.key)
  }

  renderSettledMobile(t) {
    const result = t.result ? t.result.split('-') : null
    let netReturn = Math.round((calculateBetReturn(t.wager, t.odds, t.status) - t.wager) * 100) / 100
    let netReturnClassname = ''
    if (netReturn > 0) {
      netReturn = '+ ' + netReturn
    }
    return (
      <div className='row mobile hidden-sm hidden-md hidden-lg' onClick={this.onSelectRow}>
        <div className='col-xs-7 left'>
          <div className='hometeam center-block'>
            { t.match.homeTeam }
            <span className='result'>
              {result && result[0]}
            </span>
          </div>
          <hr className='divider' />
          <div className='awayteam center-block'>
            { t.match.awayTeam }
            <span className='result'>{result && result[1]}</span>
          </div>
          <div className='odds-type center-block'>{ displayOddsType(t.oddsType, t.output, t.oddsTypeCondition, t.match.homeTeam, t.match.awayTeam) } @ { t.odds }
          </div>
          <p className='start-time'>{ t.match.startTime.format('MMM Do h:mm a') }, { bookmakerLookup[t.bookmaker] }</p>
        </div>
        <div className='col-xs-5 right'>
          <div className='status'>
            <img src={`/static/img/status/${t.status}.png`} className='img img-responsive' />
          </div>
          <div className={ `return status-${t.status}` }>{ netReturn } {t.currency}</div>
        </div>
      </div>
    )
  }

  renderMobile(t) {
    if (!this.props.open)
      return this.renderSettledMobile(t)
    return (
      <div className='row mobile hidden-sm hidden-md hidden-lg' onClick={this.onSelectRow}>
        <div className='col-xs-7 left'>
          <div className='hometeam center-block'>{ t.match.homeTeam }</div>
          <hr className='divider' />
          <div className='awayteam center-block'>{ t.match.awayTeam }</div>
          <div className='odds-type center-block'>{ displayOddsType(t.oddsType, t.output, t.oddsTypeCondition, t.match.homeTeam, t.match.awayTeam) }</div>
          <p className='start-time'>{ t.match.startTime.format('MMM Do h:mm a') }</p>
        </div>
        <div className='col-xs-5 right'>
          <div className='stake center-block text-center'>
            <span>You've placed</span>
            <p className='stake-value'>{ t.wager } {t.currency }</p>
          </div>
          <div className='odds center-block text-center'>
            <span>ODDS</span>
            <span className='odds-value'>{ t.odds }</span>
          </div>
        </div>
      </div>
    )
  }

  renderSettledDesktop(t) {
    const result = t.result ? t.result.split('-') : null
    let netReturn = Math.round((calculateBetReturn(t.wager, t.odds, t.status) - t.wager) * 100) / 100
    if (netReturn > 0) {
      netReturn = '+ ' + netReturn
    }
    return (
      <div className='row hidden-xs' onClick={this.onSelectRow}>
        <div className='col-sm-8 team-col'>
          <p className='teams'>
            { t.match.homeTeam }<span className='result'>{ result && result[0] } - {result && result[1]}</span>{ t.match.awayTeam }
          </p>
          <p className='odds-type'>
            { displayOddsType(t.oddsType, t.output, t.oddsTypeCondition, t.match.homeTeam, t.match.awayTeam) }
          </p>
          <p className='start-time'>
            { t.match.startTime.format('MMM Do h:mm a') } @ { bookmakerLookup[t.bookmaker] }
          </p>
          <span className='return-status'>
            <img src={`/static/img/status/${t.status}.png`}  />
          </span>
        </div>
        <div className='col-sm-1 closing-odds-col'>
          <p>{ t.odds }</p>
        </div>
        <div className='col-sm-1 edge-col'>
          <div>{ t.edge }%</div>
          <div>{ t.closing }%</div>
        </div>
        <div className='col-sm-2 return-col'>
          <p className={`return status-${t.status}`}>{ netReturn } { t.currency }</p>
        </div>
      </div>
    )
  }

  renderDesktop(t) {
    if (!this.props.open) {
      return this.renderSettledDesktop(t)
    }
    return (
      <div className='row row-eq-height hidden-xs' onClick={this.onSelectRow}>
        <div className='col-sm-7 team-col'>
          <p className='teams'>{ t.match.homeTeam } vs { t.match.awayTeam }</p>
          <p className='odds-type'>{ displayOddsType(t.oddsType, t.output, t.oddsTypeCondition, t.match.homeTeam, t.match.awayTeam) }</p>
          <p className='start-time'>
            { t.match.startTime.format('MMM Do h:mm a') } @ { bookmakerLookup[t.bookmaker] }
          </p>
        </div>
        <div className='col-sm-3 stake-col'>
          <p>{ t.wager } { t.currency}</p>
        </div>
        <div className='col-sm-2 odds-col'>
          <p>{ t.odds }</p>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className='list-group-item'>
        { this.renderMobile(this.props.trade) }
        { this.renderDesktop(this.props.trade) }
      </div>
    )
  }
}
