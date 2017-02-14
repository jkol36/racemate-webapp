import React, { Component } from 'react'
import { convertCurrency } from 'utils/converters'
import { calculateBetReturn } from 'utils/calculations'
import ReactHighcharts from 'react-highcharts'
import { fromJS } from 'immutable'

export class DashboardChart extends Component {

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
    for (var i = 0; i < trades.length; i++) {
      const t = trades[i]
      const currentProfit = convertCurrency(calculateBetReturn(t.wager, t.odds, t.status) - t.wager,
                                      t.currency, mainCurrency, currencies)
      const currentEV = convertCurrency(t.wager * (t.edge / 100), t.currency, mainCurrency, currencies)

      if (i === 0) {
        evData.push(currentEV)
        profitData.push(currentProfit)
      } else {
        evData.push(evData[i-1] + currentEV)
        profitData.push(profitData[i-1] + currentProfit)
      }
    }
    return (
      <div className='item'>
        <div className='panel'>
          <header className='panel-heading'>Your net results vs number of trades</header>
          <div className='panel-body'>
            <ReactHighcharts config={{
              chart: {
                type: 'line'
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
                  return `<b>${this.series.name}: ${Math.round(this.y)} ${mainCurrency}</b> after <b>${this.x}</b> bets`
                }
              },
              series: [{
                data: profitData,
                name: 'Profits'
              }, {
                name: 'EV',
                data: evData
              }]
            }}/>
          </div>
        </div>
      </div>
    )
  }
}
