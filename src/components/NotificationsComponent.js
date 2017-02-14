import React, { Component } from 'react'
import 'less/notificationtab.less'
import Select from 'react-select'
import ReactTooltip from 'react-tooltip'

export class NotificationsComponent extends Component {

  onDelete(key, e) {
    e.preventDefault()
    e.stopPropagation()
    this.props.onDeleteNotification(key)
  }
  render() {
    let emptyContent = null
    if (this.props.notifications.length === 0) {
      emptyContent = <p>You have no notifications set up, add your first one by clicking at the plus in the top right corner.</p>
    }
    const notificationKeys = this.props.notifications.map(n => n.key)
    const presetOptions = this.props.presets.filter(p => notificationKeys.indexOf(p.key) === -1)
      .map(p => ({
        label: p.name,
        value: p
      }))
    return (
      <div className='col-xs-12 col-lg-8 col-lg-offset-2 notifications-container'>
        <div className='panel'>
          <header className='panel-heading'>
            Your slack notifications
            <span className='tools'>
              <a href='javascript:;' data-tip="Add email notification">
                <i className='fa fa-fw fa-plus' onClick={this.props.onClickAddNotification}></i>
              </a>
            </span>
          </header>
          <div className='panel-body'>
          <p>You'll get notifications by <a href='javascript:;'>@tradematebot</a> on Slack on these presets. By using the Slack app as well, you can get the notifications straight on mobile. By setting yourself in <a href='https://get.slack.help/hc/en-us/articles/214908388-Do-Not-Disturb-and-snooze-settings' target='_blank'>snooze mode</a> you'll pause the notifications.</p>
            { emptyContent && emptyContent }
            <table className='table table-striped table-hover'>
              { !emptyContent && (
                <thead>
                  <tr>
                    <th>Name</th>
                    <th></th>
                  </tr>
                </thead>
              )}
              <tbody>
                {
                  this.props.notifications.map(n =>
                    <tr key={n.key} onClick={() => this.props.onEditNotification(n) }>
                      <td>{ n.name }</td>
                      <td>
                        <button className='btn btn-danger pull-right'
                          onClick={this.onDelete.bind(this, n.key)}>Delete</button>
                      </td>
                    </tr>
                  )
                }
              </tbody>
            </table>
            { presetOptions.length > 0 && (
              <div>
                <p>Import one of your tradefeed presets:</p>
                <Select name='presets'
                  options={presetOptions}
                  onChange={(e) => this.props.importTradePreset(e.value) }
                />
              </div>
            )}
          </div>
        </div>
        <ReactTooltip effect="solid" place="left"/>
      </div>
    )
  }
}
