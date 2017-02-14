import * as C from 'constants'
import moment from 'moment'
import { combineReducers } from 'redux'

const allIds = (state=[], action) => {
  switch(action.type) {
    case C.INITIAL_USERBETS:
      return action.bets.map(bet => bet.key)
    case C.ADD_USERBET:
      return [...state, action.key]
    case C.DELETE_USERBET:
      return state.filter(id => id !== action.id)
    default:
      return state
  }
}

const byId = (state={}, action) => {
  switch(action.type) {
    case C.INITIAL_USERBETS:
      var newState = {}
      const bets = action.bets
      bets.forEach(bet => {
        newState[bet.key] = bet(null, { type: C.ADD_USERBET, bet: bet, key: bet.key })
      })
      return newState
    case C.ADD_USERBET:
      return {
        ...state,
        [action.key]: bet(state[action.key], action)
      }
    case C.CHANGE_USERTRADE:
      return {
        ...state,
        [action.id]: bet(state[action.id], action)
      }
    case C.DELETE_USERBET:
      var newState = { ...state }
      delete newState[action.id]
      return newState
    default:
      return state
  }
}

const bet = (state={}, action) => {
  switch(action.type) {
    case C.ADD_USERBET:
      const bet = {...action.bet}
      bet.createdAt = moment(bet.createdAt)
      bet.match.startTime = moment(bet.match.startTime)
      return bet
    case C.CHANGE_USERTRADE:
      let value = action.value
      if (action.key === 'createdAt')
        value = moment(value)
      else if (action.key === 'match')
        value = {...value, startTime: moment(value.startTime)}
      return {
        ...state,
        [action.key]: value
      }
    case C.DELETE_USERBET:
      return null
    default:
      return state
  }
}

export const userbets = combineReducers({
  allIds,
  byId
})
