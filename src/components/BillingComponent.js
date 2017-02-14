import React, { Component } from 'react'
import { STRIPE_KEY, RESTAPI_URL } from 'config'
import { tokenize } from 'utils'
import { browserHistory, Link } from 'react-router'
import request from 'superagent'
import Modal from 'react-bootstrap/lib/Modal'
import moment from 'moment'
import 'less/billing.less'

export class BillingComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      amountDue: 0,
      date: moment(),
      interval: '...',
      modalOpen: false
    }
  }

  getNextInvoice() {
    tokenize(request.post(RESTAPI_URL + '/stripe/next-invoice'))
      .then(({ invoice }) => this.setState({
        amountDue: invoice.total,
        date: moment(invoice.date * 1000)
      }))
  }

  onCancel(e) {
    e.preventDefault()
    tokenize(request.post(RESTAPI_URL + '/stripe/cancel-subscription'))
      .then(() => {
        this.setState({ modalOpen: false })
        this.getNextInvoice()
      })
  }

  componentDidMount() {
    if (this.props.user.subscription.status !== 'active' && this.props.user.subscription.status !== 'past_due' && this.props.user.subscription.permissionLevel !== 5) {
      return browserHistory.push('/subscribe')
    }
    this.handler = StripeCheckout.configure({
      key: STRIPE_KEY,
      image: '/static/img/logo.png',
      locale: 'auto',
      name: 'Trademate Sports',
      panelLabel: 'Add payment card',
      email: this.props.user.email,
      allowRememberMe: false,
      token: (token) => {
        tokenize(request.post(RESTAPI_URL + '/stripe/create-payment-method').send({token: token.id}))
      }
    })
    this.getNextInvoice()
  }

  render() {
    const { subscription } = this.props.user
    return (
      <div className='col-xs-12 col-sm-8 col-sm-offset-2 col-lg-6 col-lg-offset-3'>
        <div className='panel billing-panel'>
          <header className='panel-heading'><i className='ionicons ion-card'></i> Billing</header>
          <div className='panel-body'>
            <SubscriptionBreakdown
              subscription={subscription}
              date={this.state.date}
            />
            <h4>Account status</h4>
            <ul>
              <li><CardBreakdown openHandler={() => this.handler.open() } card={subscription.card} /></li>
              <li>You will be charged <strong>{ this.state.amountDue / 100 } EUR</strong> on the next invoice.</li>
            </ul>
            <br />
            <p>
              <Link to='/subscribe'>
                <button className='btn btn-info'>{ subscription.cancelAtPeriodEnd ? 'Reactivate plan' : 'Change plan' }</button>
              </Link>
            </p>
            { !subscription.cancelAtPeriodEnd && (subscription.status === 'active' || subscription.status === 'past_due') && <button className='btn btn-danger' onClick={() => this.setState({ modalOpen: true }) }>
              Cancel plan
            </button>
          }
          </div>
        </div>
        <CancelModal open={this.state.modalOpen} onHide={() => this.setState({ modalOpen: false }) }
          subscription={this.props.user.subscription} onCancel={this.onCancel.bind(this) }/>
      </div>
    )
  }
}

const CardBreakdown = (props) => {
  if (props.card) {
    return (
      <span>
        Your current payment card is a <strong>{ props.card.brand }</strong> ending in { props.card.last4 }.
        <a href='javascript:;' onClick={props.openHandler}> Change payment</a>
      </span>
    )
  }
  return (
    <p className='lead card'>
      You don't have a payment card yet.
      <a href='javascript:;' onClick={props.openHandler}> Add your payment details here</a>
    </p>
  )
}

const SubscriptionBreakdown = ({ subscription, date, interval }) => {
  if (subscription.uid) {
      if (subscription.cancelAtPeriodEnd) {
        return <p>You are currently on the <strong>{ PLAN_NAMES[subscription.plan] }</strong>. Your plan will cancel on <strong>{ date.format('MMMM Do YYYY') }</strong></p>
      }
    return <p>You are currently on the <strong>{ PLAN_NAMES[subscription.plan] } plan</strong>. Your plan will renew on <strong>{ date.format('MMMM Do YYYY') }</strong>.</p>
  } else {
    return <p>You don't have a plan. <a href="javascript:;">Get one now!</a></p>
  }
}

const PLAN_NAMES = {
  corem: 'Core Monthly',
  prom: 'Pro Monthly',
  coreq: 'Core Quarterly',
  proq: 'Pro Quarterly'
}


const CancelModal = (props) => {
  return (
    <Modal show={props.open} onHide={props.onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Cancel subscription</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to cancel your subscription? You will lose access to your account on { moment(props.subscription.currentPeriodEnd).format('MMMM Do YYYY')}
      </Modal.Body>
      <Modal.Footer>
        <button className='btn btn-success' onClick={props.onCancel}>Yes</button>
        <button className='btn btn-danger' onClick={props.onHide}>No</button>
      </Modal.Footer>
    </Modal>
  )
}
