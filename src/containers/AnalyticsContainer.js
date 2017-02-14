import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  AnalyticsMetrics,
  BottomLeftStaticButton,
  AnalyticsChart,
  AnalyticsPresetModal,
  AnalyticsMetricsPanel,
  AnalyticsOddsChart,
  AnalyticsOddsMetrics
} from 'components'
import moment from 'moment'
import { recommendedLeagues } from 'config'
import { isEqual } from 'underscore'
import ReactTooltip from 'react-tooltip'
import 'less/analytics.less'

var dateLte
var timeLte
var dateGte
var timeGte


class _AnalyticsContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      preset: allPreset,
      editModalOpen: false
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.editModalOpen !== nextState.editModalOpen)
      return true
    if (!isEqual(this.state.preset, nextState.preset))
      return true
    if (this.props.trades.length !== nextProps.trades.length)
      return true
    return false
  }


  filterTrades() {
    const { preset } = this.state
    if(preset.date.lte == ""){
      timeLte = Infinity
    }else{
      dateLte = new Date(preset.date.lte);
      timeLte = dateLte.getTime();
    }

    if(preset.date.gte == ""){
      timeGte = 0
    }else{
      dateGte = new Date(preset.date.gte);
      timeGte = dateGte.getTime();
    }
    return this.props.trades.filter(t => {
      return (
        t.edge >= (preset.edge.gte || -Infinity) &&
        t.edge <= (preset.edge.lte || Infinity) &&
        t.odds >= (preset.odds.gte || 0 ) &&
        t.odds <= (preset.odds.lte || Infinity) &&
        t.closing >= (preset.closing.gte) &&
        t.closing <= (preset.closing.lte) &&
        t.createdAt >= (timeGte) &&
        t.createdAt <= (timeLte) &&
        (preset.bookmakers.length === 0 || preset.bookmakers.indexOf(t.bookmaker) !== -1) &&
        (t.match.startTime - t.createdAt) / (1000 * 60 * 60) <= preset.hoursBefore.lte &&
        (preset.hoursBefore.gte === 0 || ((t.match.startTime - t.createdAt) / (1000 * 60 * 60) >= preset.hoursBefore.gte)) &&
        (preset.sports.length === 0 || preset.sports.indexOf(t.sport) !== -1) &&
        (preset.oddsTypes.length === 0 || preset.oddsTypes.indexOf(t.oddsType) !== -1) &&
        (!preset.recommendedLeagues || recommendedLeagues.indexOf(t.match.competition.uid) !== -1)
      )
    }).sort((a, b) => a.match.startTime - b.match.startTime)
  }

  render() {
    if (this.props.user.subscription.permissionLevel < 2 && !this.props.user.hijacked) {
      return (
        <div className='container'>
          <p className='lead'>This is for Trademate Pro customers only. Upgrade to get access.</p>
        </div>
      )
    }
    const trades = this.filterTrades()
    return (
      <div className='container-fluid analytics-container'>
        <AnalyticsMetrics
          trades={trades}
          user={this.props.user}
          currencies={this.props.currencies}
        />
        <div className='row'>
          <div className='col-xs-12 col-lg-8'>
            <AnalyticsChart trades={trades} currencies={this.props.currencies}
              mainCurrency={this.props.user.mainCurrency} />
          </div>
          <div className='col-xs-12 col-lg-4'>
            <AnalyticsMetricsPanel trades={trades}
              user={this.props.user}
              currencies={this.props.currencies}
            />
          </div>
        </div>
        <div className='row'>
          <div className='col-xs-12'>
            <AnalyticsOddsChart trades={trades}
            currencies={this.props.currencies}
            mainCurrency={this.props.user.mainCurrency} />
          </div>
        </div>
        <BottomLeftStaticButton
          onClick={() => this.setState({ editModalOpen: true })}
          data-tip='Change preset'>
          <i className='ionicons ion-ios-gear'></i>
        </BottomLeftStaticButton>
        <AnalyticsPresetModal open={this.state.editModalOpen}
          onClose={() => this.setState({ editModalOpen: false})}
          user={this.props.user}
          preset={this.state.preset}
          title='Analytics preset'
          onSubmit={(preset) => {
            analytics.track('Edited analytics preset')
            this.setState({ preset, editModalOpen: false })
          }}
        />
        <ReactTooltip id='analytics-explainer' effect='solid' place='top' multiline={true} class='react-tooltip-analytics'/>
      </div>
    )
  }
}

export const AnalyticsContainer = connect(state => ({
  trades: state.usertrades.allIds.map(k => state.usertrades.byId[k]).filter(t => t.status !== 1),
  currencies: state.currencies
}))(_AnalyticsContainer)


const allPreset = {
  odds: {
    lte: 100,
    gte: 0
  },
  edge: {
    lte: 100,
    gte: 0
  },
  closing: {
    lte: 100,
    gte: -100
  },
  sports: [],
  bookmakers: [],
  recommendedLeagues: false,
  hoursBefore:{
    lte: 48,
    gte: 0
  },
  oddsTypes: [],
  date:{
    lte: "",
    gte: ""
  }
}
