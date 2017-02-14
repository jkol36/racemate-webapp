import React, { Component } from 'react'
import { Link } from 'react-router'
import ReactTooltip from 'react-tooltip'

export class Sidebar extends Component {
  render() {
    return (
      <div id='sidebar-wrapper'>
        <ul className='sidebar'>
          <li className='sidebar-main'>
            <img src='/static/img/logo-outline.png' className='img brand-logo' />
          </li>
          <li className='clearfix'>
            <Link to='/dashboard' data-tip="Dashboard" data-for='sidebar-tooltips' activeClassName='active'>
              <i className='ionicons ion-ios-home-outline'></i>
            </Link>
          </li>
          <li>
            <Link to='/tradefeed' data-tip="Racefeed" data-for='sidebar-tooltips' activeClassName='active'>
              <i className='ionicons ion-ios-heart-outline'></i>
            </Link>
          </li>
          <li>
            <Link to='/mybets' data-tip="My trades" data-for='sidebar-tooltips' activeClassName='active'>
              <i className='ionicons ion-ios-list-outline'></i>
            </Link>
          </li>
          <li>
            <Link to='/analytics' data-tip="Analytics" data-for='sidebar-tooltips' activeClassName='active'>
              <i className='ionicons ion-ios-pie-outline'></i>
            </Link>
          </li>
          <li>
            <Link to='/referral' data-tip="Referral system" data-for='sidebar-tooltips' activeClassName='active'>
              <i className='ionicons ion-ios-people-outline new' />
            </Link>
          </li>
          <li className='sidebar-online' data-tip={`${this.props.online} online right now`} data-for='sidebar-tooltips'>
            <i className='ionicons ion-ios-bolt text-success'></i>{ this.props.online }
          </li>
        </ul>
        <ReactTooltip id='sidebar-tooltips' place='right' effect='solid' />
      </div>
    )
  }
}
