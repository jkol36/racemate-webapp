import React, { Component } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Link } from 'react-router'


export class ReferralComponent extends Component {

  constructor(props) {
    super(props)
    this.state = {
      copied: false
    }
  }

  handleCopy() {
    this.setState({
      copied: true
    })
    this.timeout = setTimeout(() => {
      this.setState({ copied: false })
    }, 3000)
  }

  componentWillUnmount() {
    clearTimeout(this.timeout)
  }

  render() {
    return (
      <div className='col-xs-12 col-lg-8 col-lg-offset-2'>
        <div className='panel'>
          <header className='panel-heading'>Your referral stats</header>
          <div className='panel-body'>
            <p>Refer a friend and both of you get 30 EUR credit. Credit stacks, so you can freeroll your own subscription.</p>
            <CopyToClipboard text={this.props.reflink} onCopy={this.handleCopy.bind(this)}>
              <pre style={{cursor: 'pointer' }}>{ this.props.reflink } <span className='pull-right text-success'>({ this.state.copied ? 'Copied' : 'Click to copy' })</span></pre>
            </CopyToClipboard>
            <p><strong>{ this.props.clicks }</strong> have clicked your referral link thus far.</p>
            <p><strong>{ this.props.signups }</strong> have signed up using your link.</p>
            <p><strong>{ this.props.transactions }</strong> have purchase a plan.</p>
            <p>You've gotten <strong>{ this.props.transactions * 30 } EUR</strong> in credits due to referrals.</p>
            <p>Go to <Link to='/billing'>Billing</Link> to check your next invoice from Trademate.</p>
          </div>
        </div>
      </div>
    );
  }
}
