import React, { Component } from 'react'
//import { calculateCurrentBalance, getFundGrowth } from 'utils/calculations'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'


const TITLEMAP = {
  '/mybets': 'My bets',
  '/racefeed': 'Racefeed',
  '/dashboard': 'Home',
  '/login': 'Log in'
}

class _Topbar extends Component {

  onLogout(e) {
    e.preventDefault()
    this.props.onLogout()
  }

  render() {
    const { user } = this.props
    //const currentBalance = Math.round(calculateCurrentBalance(trades, user, currencies))
    //const fundGrowth = Math.round(getFundGrowth(trades.filter(t => t.status !== 1), user, currencies) * 10) / 10
    return (
      <div className='row header'>
        <div className='content'>
          <div className='col-xs-8 hidden-xs col-xs-offset-8 col-sm-4 value dropdown'>
            <div className='clickable-profile clearfix' id="profiledropdown" data-toggle="dropdown" aria-expanded='true' aria-haspopup='true'>
              <span className='pull-right'>{ user.displayName }</span>
              <div className='photo'><img src='https://i.imgflip.com/d0tb7.jpg' className='img-circle' /></div>
            </div>
            <ul className='pull-right dropdown-menu'>
              <li>
                <Link to='/me'>Profile</Link>
                <Link to='/billing'>Billing</Link>
                <Link to='/bookmakers'>My Bookmakers</Link>
                <Link to='/notifications'>Notifications</Link>
                { (user.subscription.permissionLevel > 2 || user.hijacked) && <Link to='/admin'>Admin</Link> }
                <Link to='/product-changes'>Product changes</Link>
                { (user.subscription.permissionLevel >= 3 || user.hijacked) && <Link to='/syndicate'>Syndicate</Link> }
                <a onClick={this.onLogout.bind(this)} href="javascript:;">Log out</a>
              </li>
            </ul>
          </div>
          <div className='col-xs-2 mobile-logo hidden-sm hidden-md hidden-lg'>
            <img src='/static/img/logo-outline.png' />
          </div>
          <div className='col-xs-8 hidden-sm hidden-md hidden-lg title-container'>
            <span className='text-center center-block title'>{ TITLEMAP[this.props.pathname] }</span>
          </div>
          <div className='col-xs-2 collapsable-menu dropdown'>
            <i className='pull-right ionicons ion-navicon dropdown-toggle' id="navdropdown" data-toggle="dropdown" aria-expanded="true" aria-haspopup="true"></i>
            <ul className='dropdown-menu pull-right' aria-labelledby='navdropdown'>
              <li>
                <Link to='/dashboard'>
                  <i className='ionicons ion-ios-home-outline'></i>Home
                </Link>
              </li>
              <li><Link to='/tradefeed'><i className='ionicons ion-ios-heart-outline'></i>Tradefeed</Link></li>
              <li><Link to='/mybets'><i className='ionicons ion-ios-list-outline'></i>My bets</Link></li>
              <li><Link to='/me'><i className='ionicons ion-ios-contact-outline'></i>My profile</Link></li>
              <li><Link to='/notifications'><i className='ionicons ion-ios-bell-outline'></i>Notifications</Link></li>
              <li><Link to='/billing'><i className='ionicons ion-card'></i>Billing</Link></li>
              <li><a onClick={this.onLogout.bind(this)} href="javascript;:"><i className='ionicons ion-log-out'/>Log out</a></li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

export const Topbar = connect(state => {
  return {
    currencies: state.currencies,
    trades: state.userbets.allIds.map(id => state.userbets.byId[id])
  }
})(_Topbar)
