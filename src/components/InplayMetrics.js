import React, { Component } from 'react'
import { convertCurrency } from 'utils/converters'
import numeral from 'numeral'

export class InplayMetrics extends Component {
  render() {
    const { openBets, currencies, mainCurrency } = this.props
    const openTurnover = openBets.reduce((prev, t) => prev + convertCurrency(t.wager, t.currency, mainCurrency, currencies), 0)
    const turnover = openBets.reduce((prev, t) => prev + convertCurrency(t.wager, t.currency, mainCurrency, currencies), 0)
    return (
      <div className='item'>
        <div className='panel'>
          <header className='panel-heading'>Turnover stats</header>
          <div className='panel-body'>
            <div className='col-xs-4 text-center'>
              <h3>{ `${numeral(openTurnover).format('0')} ${mainCurrency}` }</h3>
              <span className='text-muted'>Open turnover</span>
            </div>
            <div className='col-xs-4 text-center'>
              <h3>{ openBets.length }</h3>
              <span className='text-muted'>Open bets</span>
            </div>
            <div className='col-xs-4 text-center'>
              <h3>{ `${numeral(turnover).format('0.[0]a')} ${mainCurrency}` }</h3>
              <span className='text-muted'>Settled turnover</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
