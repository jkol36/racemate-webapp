import React, { Component } from 'react';
import { calculateBetReturn, getFundGrowth } from 'utils/calculations'
import { convertCurrency } from 'utils/converters'
import numeral from 'numeral'
import 'less/widget.less'

export class DashboardMetrics extends Component {

  componentDidMount() {
    const { trades, currencies, user, user: { mainCurrency } } = this.props
    let totalTurnover = 0
    let totalProfit = 0
    for (var t of trades) {
      totalProfit += convertCurrency(calculateBetReturn(t.wager, t.odds, t.status) - t.wager, t.currency, mainCurrency, currencies)
      totalTurnover += convertCurrency(t.wager, t.currency, mainCurrency, currencies)
    }
    analytics.identify(this.props.user.uid, {
      totalProfit,
      totalTurnover,
      averageROI: totalProfit / (totalTurnover || 1),
      trades: trades.length
    })
  }
  render() {
    const { trades, currencies, user, user: {mainCurrency} } = this.props
    let totalTurnover = 0
    let totalProfit = 0
    for (var t of trades) {
      totalProfit += convertCurrency(calculateBetReturn(t.wager, t.odds, t.status) - t.wager, t.currency, mainCurrency, currencies)
      totalTurnover += convertCurrency(t.wager, t.currency, mainCurrency, currencies)
    }
    return (
      <div className='row widgets'>
        <Widget icon='rocket'
          color='blue'
          number={numeral(getFundGrowth(trades, user, currencies)).format('0.0') + '%'}
          description='Fund growth'
        />
        <Widget icon='line-chart'
          color='white'
          number={numeral(totalProfit).format('0')}
          description={`Total profit (${mainCurrency})`}
        />
        <Widget icon='circle-o-notch'
          color='orange'
          number={numeral(totalProfit / (totalTurnover || 1)).format('0.0%')}
          description={`Average ROI`}
        />
        <Widget icon='slack'
          color='red'
          number={ trades.length }
          description='Number of trades'
        />
      </div>
    )
  }
}

const Widget = (props) => (
  <div className='col-lg-3 col-sm-6 col-xs-12'>
    <div className={ 'panel ' + props.color }>
      <div className='symbol'>
        <i className={'fa fa-fw fa-' + props.icon }></i>
      </div>
      <div className='value'>
        <h1>{ props.number }</h1>
        <p>{ props.description }</p>
      </div>
    </div>
  </div>
)
