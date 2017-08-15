import React, { Component } from 'react'
import { calculateBetReturn } from 'utils/calculations'
import { convertCurrency } from 'utils/converters'

export class PresetBreakdown extends Component {
  render() {
    const { bets, currencies, user } = this.props
    const { mainCurrency } = user
    let byPreset = {}
    bets.forEach(b => {
      const key = b.preset
      let data = byPreset[b.preset]
      if (!data) {
        data = {
          turnover: 0,
          nTrades: 0,
          preset: presetLookup[b.preset],
          profits: 0,
          currency: (user.bookmakers.find(b => b.key === b.preset) || {}).currency || b.currency
        }
      }
      data.turnover += b.wager
      data.flatROI += calculateBetReturn(1, b.odds, b.status) - 1
      data.nTrades += 1
      data.profits += calculateBetReturn(b.wager, b.odds, b.status) - b.wager
      byPreset[b.preset] = data
    })
    return (
      <div className='item'>
        <div className='panel'>
          <header className='panel-heading'>Preset breakdown</header>
          <div className='panel-body'>
            <table className='table table-striped table-hover preset-breakdown-table'>
              <thead>
                <tr>
                  <th>Preset</th>
                  <th>Profits</th>
                  <th>Turnover</th>
                  <th>ROI</th>
                  <th>bets</th>
                </tr>
              </thead>
              <tbody>
                { Object.keys(byPreset).map(k => byPreset[k]).sort((a, b) => b.nTrades - a.nTrades).map(sub => (
                    <tr key={sub.preset}>
                      <td>{ sub.preset }</td>
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
