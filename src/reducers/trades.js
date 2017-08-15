import * as C from 'constants'
import moment from 'moment'
import { combineReducers } from 'redux'

const allIds = (state=[], action) => {
  switch(action.type) {
    case C.ADD_TRADE:
      return [...state, action.key]
    case C.DELETE_TRADE:
      return state.filter(k => k !== action.key)
    default:
      return state
  }
}

const byId = (state={}, action) => {
  switch(action.type) {
    case C.ADD_TRADE:
    case C.CHANGE_TRADE:
      return {
        ...state,
        [action.key]: trade(state[action.key], action)
      }
    case C.DELETE_TRADE:
      var newState = { ... state }
      delete newState[action.key]
      return newState
    default:
      return state
  }
}

const races = (state={}, action) => {
  switch(action.type) {
    case C.ADD_TRADE:
    case C.CHANGE_TRADE:
      return {
        ...action.trade,
        startTime: moment(action.trade.startTime)
      }
    default:
      return state
  }
}

export const trades = combineReducers({
  allIds,
  byId
})
