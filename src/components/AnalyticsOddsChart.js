import React, { Component } from 'react'
import ReactHighcharts from 'react-highcharts'
require('highcharts-more')(ReactHighcharts.Highcharts)
import { chain, groupBy } from 'underscore'
import { calculateBetReturn } from 'utils/calculations'
import { convertCurrency } from 'utils/converters'
import numeral from 'numeral'

const TICK_INTERVAL = 0.25
const INV_TICK_INTERVAL = 1 / TICK_INTERVAL

export class AnalyticsOddsChart extends Component {
  getChartData() {
    const { trades, currencies, mainCurrency } = this.props
    const groups = chain(trades.map(t => {
      const profits = convertCurrency(calculateBetReturn(t.wager, t.odds, t.status) - t.wager, t.currency, mainCurrency, currencies)
      const flatResult = calculateBetReturn(1, t.odds, t.status) - 1
      return {
        posReturn: profits > 0,
        profits,
        flatResult,
        closing: t.closing || t.edge,
        edge: t.edge,
        closingOdds: Math.round(t.odds / (((t.closing || t.edge) / 100) + 1) * INV_TICK_INTERVAL) / INV_TICK_INTERVAL
      }
    })).groupBy(t => t.closingOdds).mapObject((v, k) => ({
      hitrate: Math.round(v.reduce((p, c) => p + c.posReturn, 0) * 100 / v.length * 10) / 10,
      n: v.length,
      avgEdge: Math.round(v.reduce((p, c) => p + c.edge, 0) / v.length * 10) / 10,
      avgClosing: Math.round(v.reduce((p, c) => p + c.closing, 0) / v.length * 10) / 10,
      profits: Math.round(v.reduce((p, c) => p + c.profits, 0) * 10) / 10,
      flatResult: Math.round(v.reduce((p, c) => p + c.flatResult, 0) * 10) / 10
    })).value()
    const categories = Object.keys(groups).map(o => +o).sort((a, b) => a - b)
    return {
      chart: {
        type: 'bubble',
        zoomType: 'x'
      },
      title: {
        text: ''
      },
      xAxis: {
        title: 'Odds range',
        tickInterval: TICK_INTERVAL
      },
      yAxis: {
        title: 'Chance of success',
        labels: {
          format: '{value}%'
        }
      },
      plotOptions: {
        bubble: {
          minSize: 15
        }
      },
      series: [{
        type: 'line',
        dataLabels: {
          enabled: false
        },
        enableMouseTracking: false,
        name: 'Theoretical hitrate',
        data: categories.map(c => ({
          x: c,
          y: 100 / c
        }))
      }, {
        name: 'Hit rate',
        data: categories.map(c => ({
          x: +c,
          y: groups[c].hitrate,
          z: groups[c].n,
          n: groups[c].n,
          profits: groups[c].profits
        })),
        dataLabels: {
          enabled: true,
          format: '{point.z:.0f}'
        }
      }],
      tooltip: {
        formatter: function() {
          const group = groups[this.x]
          return `Odds range: <b>${this.x}</b><br />Hit rate: <b>${group.hitrate}%</b><br />Theoretical hitrate: <b>${Math.round(100 / this.x * 10) / 10}%</b><br />Net result: <b>${ group.profits } ${mainCurrency}</b><br />Flat net result: <b>${ group.flatResult } units</b><br />Average edge: <b>${group.avgEdge}%</b><br />Average closing: <b>${ group.avgClosing }%</b><br />Number of trades: <b>${group.n}</b>`
        }
      }
    }
  }

  render() {
    return (
      <div className='panel'>
        <header className='panel-heading'>
          True closing odds vs hit rate breakdown
          <i className='ionicons ion-ios-help-outline'
            data-tip='The blue line shows the theoretical hit rate.<br />If the true closing line ends in 2.0, that should be won 50% of the time.<br />The balls indicate your actual hit rate, so you can see how you run in different odds ranges.<br /> The number and size of the ball indicates how many trades.<br />When the sample gets bigger, the balls and the dots will be aligned.'
            data-for='analytics-explainer'
          />
        </header>
        <div className='panel-body'>
          <ReactHighcharts config={this.getChartData()} />
        </div>
      </div>
    )
  }
}

AnalyticsOddsChart.propTypes = {
  trades: React.PropTypes.array.isRequired,
  currencies: React.PropTypes.object.isRequired,
  mainCurrency: React.PropTypes.string.isRequired
}