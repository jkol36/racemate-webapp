import React, { Component } from 'react';
import { calculateBetReturn } from 'utils/calculations'
import { convertCurrency } from 'utils/converters'
import numeral from 'numeral'
import 'less/widget.less'

export class AnalyticsMetrics extends Component {
  render() {
    const { trades, currencies, user, user: {mainCurrency} } = this.props
    let flatROI = 0
    let ev = 0
    let closingEv = 0
    let averageEdge = 0
    let averageClosingEdge = 0
    for (var t of trades) {
      ev += convertCurrency(t.wager * t.edge / 100, t.currency, mainCurrency, currencies)
      closingEv += convertCurrency(t.wager * (t.closing || t.edge) / 100, t.currency, mainCurrency, currencies)
      averageEdge += t.edge
      averageClosingEdge += t.closing || t.edge
    }
    return (
      <div className='row widgets'>
        <Widget icon='rocket'
          color='blue'
          number={numeral(ev).format('0')}
          description={`Total EV (${mainCurrency })`}
        />
        <Widget icon='line-chart'
          color='white'
          number={numeral(closingEv).format('0')}
          description={`Closing EV (${mainCurrency})`}
        />
        <Widget icon='circle-o-notch'
          color='orange'
          number={numeral(averageEdge / ((trades.length || 1) * 100)).format('0.0%')}
          description={`Average edge placed`}
        />
        <Widget icon='slack'
          color='red'
          number={ numeral(averageClosingEdge / ((trades.length || 1) * 100)).format('0.0%') }
          description='Average closing edge'
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
