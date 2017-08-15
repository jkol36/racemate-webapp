import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  TradeDetailModal,
  ComposableTradefeed,
  AddPresetModal,
  EditPresetModal,
  BottomLeftStaticButton,
} from 'components'
import { uniq } from 'underscore'
import { calculateCurrentBalance } from 'utils/calculations'
import { canUseLocalStorage, getFromStorage, appendToStorage } from 'utils'
import { registerBet, editUserbet } from 'actions/userbets'
import ReactTooltip from 'react-tooltip'
import firebase from 'firebase'
import classnames from 'classnames'
import { recommendedLeagues } from 'config'
import 'less/tradefeed.less'

const STORAGE_KEY = 'trademate__hidden_trades'

class _RacefeedContainer extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div> Hi i'm the racefeed container </div>
    )
  }
}

export const RaceFeedContainer = connect(state => {
  return (
    races: state.races
  )(_RacefeedContainer)
})
