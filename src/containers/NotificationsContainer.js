import React, { Component } from 'react'
import { connect } from 'react-redux'
import firebase from 'firebase'
import {
  NotificationsComponent,
  AddPresetModal,
  EditPresetModal
} from 'components'

export class NotificationsContainer extends Component {
  constructor(props) {
    super(props)
    this.notificationRef = firebase.database().ref('users').child(props.user.uid).child('notifications')
    this.state = {
      addPresetModalOpen: false,
      editPresetModalOpen: false,
      editingPreset: {}
    }
  }

  onAddNewNotification(preset) {
    const ref = this.notificationRef.push()
    ref.set(preset)
      .then(() => {
        this.setState({
          addPresetModalOpen: false
        })
      })
  }

  onDeleteNotification(key) {
    this.notificationRef.child(key).remove()
  }

  onEditNotification(preset) {
    this.notificationRef.child(preset.key).set(preset)
    this.setState({
      editPresetModalOpen: false
    })
  }

  importTradePreset(preset) {
    this.notificationRef.child(preset.key).set(preset)
  }

  render() {
    return (
      <div>
        <NotificationsComponent
          notifications={this.props.user.notifications.sort((a, b) => a.name.localeCompare(b.name))}
          onClickAddNotification={() => this.setState({ addPresetModalOpen: true })}
          onDeleteNotification={this.onDeleteNotification.bind(this)}
          presets={this.props.user.presets}
          importTradePreset={this.importTradePreset.bind(this)}
          onEditNotification={(preset) => this.setState({
            editPresetModalOpen: true,
            editingPreset: preset
          })}
        />
        <AddPresetModal open={this.state.addPresetModalOpen}
          onClose={() => this.setState({ addPresetModalOpen: false })}
          user={this.props.user}
          onSubmit={this.onAddNewNotification.bind(this)}
          hideAfterPlacedTrade
        />
        <EditPresetModal open={this.state.editPresetModalOpen}
          onClose={() => this.setState({ editPresetModalOpen: false })}
          user={this.props.user}
          onSubmit={this.onEditNotification.bind(this)}
          hideAfterPlacedTrade
          preset={this.state.editingPreset}
          uid={this.state.editPresetModalOpen ? this.state.editingPreset.key : null}
        />
      </div>
    )
  }
}
