import React, { Component } from 'react'
import 'less/subscribe.less'
import 'less/react-toggle.less'
import Toggle from 'react-toggle'
import { RESTAPI_URL, STRIPE_KEY } from 'config'
import request from 'superagent'
import { tokenize } from 'utils'
import { Link } from 'react-router'

export class SubscribeComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      monthly: true,
      success: false,
      loading: false,
      plan: 'prom',
      error: null
    }
    this.tokenCallback = this.tokenCallback.bind(this)
  }

  tokenCallback(token) {
    this.setState({
      loading: true
    })
    tokenize(request.post(RESTAPI_URL + '/stripe/create-payment-method').send({token: token.id}))
      .then(res => tokenize(request.post(RESTAPI_URL + '/stripe/subscribe').send({ plan: this.state.plan })))
      .then(res => this.setState({
        loading: false,
        success: true
      })).catch(err => {
        Raven.captureException(err, {
          user: this.props.user.uid,
          plan: this.state.plan
        })
        this.setState({error: err.stripeMessage, loading: false})
      })
  }

  openHandler(plan) {
    plan = plan + (this.state.monthly ? 'm' : 'q')
    this.setState({plan})
    if (this.props.user.subscription.uid) {
      this.setState({ loading: true })
      tokenize(request.post(RESTAPI_URL + '/stripe/subscribe').send({ plan }))
        .then(res => this.setState({
          loading: false,
          success: true
        }))
    } else {
      const planName = PLAN_NAMES[plan]
      const handler = StripeCheckout.configure({
        key: STRIPE_KEY,
        image: '/static/img/logo.png',
        locale: 'auto',
        name: 'Trademate Sports',
        description: `${planName} for €${PLAN_PRICES[plan]}/${this.state.monthly ? 'm' : 'q' }`,
        panelLabel: 'Subscribe',
        email: this.props.user.email,
        allowRememberMe: false,
        zipCode: true,
        token: this.tokenCallback
      })
      handler.open()
    }
  }

  render() {
    if (this.state.loading)
      return <div><i className='fa fa-spin fa-spinner'></i></div>
    if (this.state.success) {
      return <SuccessComponent plan={this.state.plan}/>
    }
    let alert = null
    if (this.state.error) {
      alert = (
        <div className='alert alert-dismissible alert-danger'>
          <button type='button' className='close' data-dismiss='alert'>×</button>
          <strong>Oh snap!</strong> { this.state.error }
        </div>
      )
    }
    return (
      <div className='subscribe-container container'>
        { alert }
        { (this.props.user.referrer && !this.props.user.referralUsed) && (
          <div className='alert alert-success text-center'>
            You got referred by a friend, so you get a €30 discount on your first invoice :-)
          </div>
        )}
        <div className='pricing-switcher'>
          <label>MONTHLY</label>
          <Toggle checked={!this.state.monthly} onChange={() => this.setState({monthly: !this.state.monthly }) }/>
          <label>QUARTERLY</label>
        </div>
        <ul className='pricing-list clearfix'>
          <li>
            <header className='pricing-header'>
              <h2>TRADEMATE CORE</h2>
              <div className='price'>
                <span className='currency'>€</span>
                <span className='value'>{ this.state.monthly ? 120 : 300 }</span>
                <span className='duration'>/{ this.state.monthly ? 'monthly' : 'quarterly' }</span>
              </div>
            </header>
            <div className='pricing-body'>
              <ul className='pricing-features'>
                { !this.state.monthly && <li><span>You are saving 20%</span></li> }
                <li><span>35</span> Bookmakers</li>
                <li><span>Unlimited</span> customizable tradefeed</li>
                <li><span>Performance</span> analytics</li>
              </ul>
            </div>
            <footer>
              <a href="javascript:;" className='select' onClick={() => this.openHandler('core') }>
                Start trading
              </a>
            </footer>
          </li>
          <li>
            <header className='pricing-header'>
              <h2>TRADEMATE PRO</h2>
              <div className='price'>
                <span className='currency'>€</span>
                <span className='value'>{ this.state.monthly ? 400 : 1000 }</span>
                <span className='duration'>/{ this.state.monthly ? 'monthly' : 'quarterly' }</span>
              </div>
            </header>
            <div className='pricing-body'>
              <p className='caption'>Trademate Pro offers everything you need to be a professional trader in the asian markets.</p>
              <ul className='pricing-features'>
                { !this.state.monthly && <li><span>You are saving 20%</span></li> }
                <li><span>Includes</span> asian sharp bookmakers</li>
                <li><span>Constructive</span> analysis on your past trades</li>
                <li><span>Unlimited</span> customizable tradefeeds</li>
                <li><span>One on one</span> sessions with the trademate team</li>
              </ul>
            </div>
            <footer>
              <a href="javascript:;" className='select' onClick={() => this.openHandler('pro') }>Start Trading</a>
            </footer>
          </li>
        </ul>
      </div>
    )
  }
}

const SuccessComponent = (props) => {
  return (
    <div className='container'>
      <div className='panel subscribe-success'>
        <header className='panel-heading'><span className='text-success'>Success</span></header>
        <div className='panel-body'>
          <p className='lead'>Congratulations on your {PLAN_NAMES[props.plan] } plan!</p>
          <p>Don't hesitate to reach out to us to get started! Your next steps should be</p>
          <ul>
            <li><Link to='/bookmakers'>Add your bookmakers</Link></li>
            <li><Link to='/tradefeed'>Set up your tradefeed</Link></li>
            <li><Link to='/tradefeed'>Start trading!</Link></li>
          </ul>
        </div>
      </div>
    </div>
  )
}

const PLAN_NAMES = {
  corem: 'Core Monthly',
  prom: 'Pro Monthly',
  coreq: 'Core Quarterly',
  proq: 'Pro Quarterly'
}

const PLAN_PRICES = {
  corem: 120,
  prom: 400,
  coreq: 300,
  proq: 1000
}
