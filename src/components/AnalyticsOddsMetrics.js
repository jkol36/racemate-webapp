import React, { Component } from 'react';

export class AnalyticsOddsMetrics extends Component {
  render() {
    return (
      <div className='panel'>
        <header className='panel-heading'>
          Analytics odds breakdown
        </header>
      </div>
    )
  }
}

AnalyticsOddsMetrics.propTypes = {
  trades: React.PropTypes.array
}
