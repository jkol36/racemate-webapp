import React, { Component } from 'react'
import { calculateBetReturn } from 'utils/calculations'
import { convertCurrency } from 'utils/converters'
import { bookmakerLookup } from 'config'

export class BookmakerBreakdown extends Component {
  render() {
    const { trades, currencies, user } = this.props
    const { mainCurrency } = user
    let byBook = {}
    trades.forEach(t => {
      const key = t.bookmaker
      let data = byBook[t.bookmaker]
      if (!data) {
        data = {
          turnover: 0,
          nTrades: 0,
          bookmaker: bookmakerLookup[t.bookmaker],
          profits: 0,
          currency: (user.bookmakers.find(b => b.key === t.bookmaker) || {}).currency || t.currency
        }
      }
      data.turnover += t.wager
      data.flatROI += calculateBetReturn(1, t.odds, t.status) - 1
      data.nTrades += 1
      data.profits += calculateBetReturn(t.wager, t.odds, t.status) - t.wager
      byBook[t.bookmaker] = data
    })
    return (
      <div className='item'>
        <div className='panel'>
          <header className='panel-heading'>Bookmaker breakdown</header>
          <div className='panel-body'>
            <table className='table table-striped table-hover bookmaker-breakdown-table'>
              <thead>
                <tr>
                  <th>Bookmaker</th>
                  <th>Profits</th>
                  <th>Turnover</th>
                  <th>ROI</th>
                  <th>Trades</th>
                </tr>
              </thead>
              <tbody>
                { Object.keys(byBook).map(k => byBook[k]).sort((a, b) => b.nTrades - a.nTrades).map(sub => (
                    <tr key={sub.bookmaker}>
                      <td>{ sub.bookmaker }</td>
                      <td>{`${Math.round(sub.profits)} ${sub.currency}` }</td>
                      <td>{ `${Math.round(sub.turnover)} ${sub.currency}` }</td>
                      <td>{ Math.round(sub.profits / sub.turnover * 100 * 10) / 10 }%</td>
                      <td>{ sub.nTrades }</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}
