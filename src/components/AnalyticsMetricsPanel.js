import React, { Component } from 'react'
import { calculateBetReturn } from 'utils/calculations'
import { convertCurrency } from 'utils/converters'
import numeral from 'numeral'
import moment from 'moment'

export class AnalyticsMetricsPanel extends Component {
  render() {
    const { trades, currencies, user, user: { mainCurrency } } = this.props
    if (trades.length === 0)
      return <EmptyStats />
    let totalTurnover = 0
    let totalProfit = 0
    let ROI = 0
    let flatProfit = 0
    let hitrate = 0
    let avgOdds = 0
    let avgOddsClosing = 0
    let avgClosing = 0
    for (var t of trades) {
      totalProfit += convertCurrency(calculateBetReturn(t.wager, t.odds, t.status) - t.wager, t.currency, mainCurrency, currencies)
      totalTurnover += convertCurrency(t.wager, t.currency, mainCurrency, currencies)
      const flatp = calculateBetReturn(1, t.odds, t.status) - 1
      flatProfit += flatp
      hitrate += flatp > 0
      avgOdds += t.odds
      avgOddsClosing += t.odds / (((t.closing || t.edge) / 100) + 1)
      avgClosing += t.closing || t.edge
    }
    const flatROI = flatProfit / trades.length
    const std = standardDeviation(trades.map(t => t.closing || t.edge))
    hitrate = hitrate / trades.length
    avgOdds /= trades.length
    avgOddsClosing /= trades.length
    avgClosing /= trades.length
    return (
      <div className='panel'>
        <header className='panel-heading'>Stats breakdown</header>
        <div className='panel-body'>
          <table className='analytics-metrics-table table'>
            <tbody>
              <tr>
                <td>
                  Total turnover
                </td>
                <td>{ numeral(totalTurnover).format('0.0a') } { mainCurrency }</td>
              </tr>
              <tr>
                <td>
                  Total profit
                </td>
                <td>{ numeral(totalProfit).format('0') } { mainCurrency }</td>
              </tr>
              <tr>
                <td>
                  Average ROI
                  <i className='ionicons ion-ios-help-outline'
                    data-tip='Your average ROI per bet. For every bet, your net return is this percentage of your stake.'
                    data-for='analytics-explainer'>
                  </i>
                </td>
                <td>{ numeral(totalProfit / (totalTurnover || 1)).format('0.0%') }</td>
              </tr>
              <tr>
                <td>
                  Flat ROI
                  <i className='ionicons ion-ios-help-outline'
                    data-tip="This would your average ROI if you would've placed 1 unit per trade."
                    data-for='analytics-explainer'>
                  </i>
                </td>
                <td>{ numeral(flatROI).format('0.0%') }</td>
              </tr>
              <tr>
                <td>
                  Closing edge Standard Deviation
                  <i className='ionicons ion-ios-help-outline'
                    data-tip={`Metric of spread of your closing edge which is an indication of variance.<br/>68% of your closing edges lies between ${numeral(avgClosing - std).format('0.0')}% and ${numeral(avgClosing+std).format('0.0')}%.<br />95% of your closing edges lies between ${numeral(avgClosing - 2 * std).format('0.0')}% and ${numeral(avgClosing + 2 * std).format('0.0')}%.<br />Lower the hours before kick off, odds or recommended leagues and you'll probably see that this number gets lower.`}
                    data-for='analytics-explainer'>
                  </i>
                </td>
                <td>{ numeral(std).format('0.0') }</td>
              </tr>
              <tr>
                <td>
                  Average odds placed
                  <i className='ionicons ion-ios-help-outline'
                    data-tip="Average odds you've placed on, with the average probability of success in paranthesis"
                    data-for='analytics-explainer'>
                  </i>
                </td>
                <td>{ numeral(avgOdds).format('0.00')} ( { numeral(1 / avgOdds).format('0.0%') } )</td>
              </tr>
              <tr>
                <td>
                  Average true closing odds
                  <i className='ionicons ion-ios-help-outline'
                    data-tip="Average true odds on the closing line, with the average probability of success in paranthesis"
                    data-for='analytics-explainer'>
                  </i>
                </td>
                <td>{ numeral(avgOddsClosing).format('0.00') } ( { numeral(1 / avgOddsClosing).format('0.0%') } )</td>
              </tr>
              <tr>
                <td>
                  Hit rate
                  <i className='ionicons ion-ios-help-outline'
                    data-tip="Percentage of trades that's been profitable for you.<br/>This should even out with the average true closing odds over time.<br/>A higher hit rate than average closing true odds means you're running good,<br/>where as a lower hit rate than average closing true odds means you're running bad."
                    data-for='analytics-explainer'>
                  </i>
                </td>
                <td>{ numeral(hitrate).format('0.0%') }</td>
              </tr>
              <tr>
                <td>
                  Average time before kick off
                </td>
                <td>{ moment.duration(trades.reduce((p, c) => p + (c.match.startTime - c.createdAt), 0) / trades.length).humanize() }</td>
              </tr>
               <tr>
                <td>Number of trades</td>
                <td>{ trades.length }</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

const EmptyStats = () => {
  return (
    <div className='panel'>
      <header className='panel-heading'>Stats breakdown</header>
    </div>
  )
}

function standardDeviation(values){
  var avg = values.reduce((p, c) => p + c, 0) / values.length;
  
  var squareDiffs = values.map(function(value){
    var diff = value - avg;
    var sqrDiff = diff * diff;
    return sqrDiff;
  });
  
  var avgSquareDiff = squareDiffs.reduce((p, c) => p + c, 0) / squareDiffs.length;

  return Math.sqrt(avgSquareDiff);
}
