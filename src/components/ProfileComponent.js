import React, { Component } from 'react'
import firebase from 'firebase'
import { connect } from 'react-redux'

class _ProfileComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      displayName: props.user.displayName,
      kellyFrac: props.user.kellyFrac || 0.3,
      mainCurrency: props.user.mainCurrency,
      oddsFormat: props.user.oddsFormat || 'Decimal'
    }
  }

  onChange(e, prop) {
    this.setState({
      [prop]: e.target.value
    })
  }

  onSubmit(e) {
    e.preventDefault()
    firebase.database().ref('users').child(this.props.user.uid).update({
      displayName: this.state.displayName.trim(),
      kellyFrac: +this.state.kellyFrac,
      mainCurrency: this.state.mainCurrency,
      oddsFormat: this.state.oddsFormat
    })
  }

  render() {
    return (
      <div className='col-xs-12 col-sm-8 col-sm-offset-2'>
        <div className='panel'>
          <header className='panel-heading'>Your profile</header>
          <div className='panel-body'>
            <form className='form-horizontal' onSubmit={this.onSubmit.bind(this)}>
              <FormGroup label='Email'
                type='email'
                disabled={true}
                value={this.props.user.email}
                />
              <FormGroup label='Display name'
                type='text'
                disabled={false}
                value={this.state.displayName}
                onChange={e => this.onChange(e, 'displayName')}
              />
              <div className='form-group'>
                <label className='col-xs-3 control-label col-sm-2'>
                  Main currency
                </label>
                <div className='col-xs-9 col-sm-10'>
                  <select className='form-control'
                    value={this.state.mainCurrency}
                    onChange={e => this.onChange(e, 'mainCurrency')}>
                    {
                      this.props.currencies.map(c =>
                        <option key={c} value={c}>{ c }</option>
                      )
                    }
                  </select>
                </div>
              </div>
              <div className='form-group'>
                <label className='col-xs-3 control-label col-sm-2'>
                  Kelly bet sizing
                </label>
                <div className='col-xs-9 col-sm-10'>
                  <select className='form-control'
                    value={this.state.kellyFrac}
                    onChange={e => this.onChange(e, 'kellyFrac')}>
                    <option value={0.3}>Low risk (30%)</option>
                    <option value={0.5}>Medium risk (50%)</option>
                    <option value={1}>High risk (100%)</option>
                  </select>
                </div>
              </div>
              <div className='form-group'>
                <label className='col-xs-3 control-label col-sm-2'>
                  Odds Format
                </label>
                <div className='col-xs-9 col-sm-10'> 
                  <select className='form-control'
                    value={this.state.oddsFormat}
                    onChange={e => this.onChange(e, 'oddsFormat')}>
                    <option value={'Decimal'}> Decimal Odds </option>
                    <option value={'American'}> American Odds </option>
                  </select>
                </div>
              </div>
              <div className='form-group'>
                <div className='col-xs-offset-3 col-xs-9 col-sm-10 col-sm-offset-2'>
                  <button type='submit' className='btn btn-success'>Save changes</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

const FormGroup = (props) => {
  return (
    <div className='form-group'>
      <label className='col-xs-3 control-label col-sm-2'>{ props.label }</label>
      <div className='col-xs-9 col-sm-10'>
        <input type={props.type} value={props.value}
          disabled={props.disabled}
          onChange={props.onChange}
          placeholder={props.placeholder}
          className='form-control'
        />
      </div>
    </div>
  )
}

export const ProfileComponent = connect(state => {
  return {
    currencies: Object.keys(state.currencies)
  }
})(_ProfileComponent)
