import React, { Component } from 'react'
import { convertCurrency, displayOddsType } from 'utils/converters'
import { calculateBetReturn } from 'utils/calculations'
import ReactHighcharts from 'react-highcharts'
import { fromJS } from 'immutable'
import moment from 'moment'

export class AnalyticsChart extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    if (JSON.stringify(nextProps.trades.map(t => t.key)) === JSON.stringify(this.props.trades.map(t => t.key)) &&
        nextProps.mainCurrency === this.props.mainCurrency)
      return false
    return true
  }

  render() {
    const { trades, currencies, mainCurrency } = this.props
    const profitData = []
    const evData = []
    const netProfitData = []
    const closingEvData = []
    for (var i = 0; i < trades.length; i++) {
      const t = trades[i]
      const currentProfit = convertCurrency(calculateBetReturn(t.wager, t.odds, t.status) - t.wager,
                                      t.currency, mainCurrency, currencies)
      const currentEV = convertCurrency(t.wager * (t.edge / 100), t.currency, mainCurrency, currencies)
      const currentClosingEV = convertCurrency(t.wager * ((t.closing || t.edge) / 100), t.currency, mainCurrency, currencies)
      netProfitData.push(Math.round(currentProfit))
      if (i === 0) {
        evData.push(currentEV)
        profitData.push(currentProfit)
        closingEvData.push(currentClosingEV)
      } else {
        evData.push(evData[i-1] + currentEV)
        profitData.push(profitData[i-1] + currentProfit)
        closingEvData.push(closingEvData[i-1] + currentClosingEV)
      }
    }
    return (
      <div className='panel'>
        <header className='panel-heading'>Your net results vs number of trades</header>
        <div className='panel-body'>
          <ReactHighcharts config={{
            chart: {
              type: 'line',
              zoomType: 'x'
            },
            title: {
              text: ''
            },
            xAxis: {
              categories: profitData.map((_, i) => i + 1),
              title: {
                text: 'Number of trades'
              }
            },
            yAxis: {
              title: {
                text: `Profits in ${mainCurrency}`
              }
            },
            tooltip: {
              formatter: function() {
                if (this.series.name === 'Profits') {
                  const trade = trades[this.key - 1]
                  return `<b>Profits: ${ Math.round(this.y) } ${ mainCurrency }</b><br /><b>${trade.match.homeTeam}</b> vs <b>${trade.match.awayTeam}</b><br />${ displayOddsType(trade.oddsType, trade.output, trade.oddsTypeCondition, trade.match.homeTeam, trade.match.awayTeam) } <b>${ STATUSES[trade.status] }</b><br />Placed <b>${moment.duration(trade.match.startTime - trade.createdAt).humanize()}</b> before<br /><b>${ trade.edge }%</b> edge closed at <b>${ trade.closing }</b>%<br /><b>${ trade.wager } ${ trade.currency } </b>@ <b>${trade.odds}</b><br /><b>Net: ${ netProfitData[this.key - 1] } ${ mainCurrency }<br />`
                }
                return `<b>${this.series.name}: ${Math.round(this.y)} ${mainCurrency}</b> after <b>${this.x}</b> bets`
              }
            },
            series: [{
              data: profitData,
              name: 'Profits'
            }, {
              name: 'EV',
              data: evData
            }, {
              name: 'Closing EV',
              data: closingEvData
            }]
          }}/>
        </div>
      </div>
    )
  }
}

const STATUSES = {
  2: 'Won',
  3: 'Lost',
  4: 'Void',
  5: 'Half won',
  6: 'Half lost'
}
