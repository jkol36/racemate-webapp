import firebase from 'firebase'
import * as C from 'constants'

export const listenToTrades = () => (dispatch, getState) => {
  const ref = firebase.database().ref('trades')
  const bookmakers = getState().auth.user.bookmakers.map(b => b.key)
  ref.on('child_added', s => {
    if (bookmakers.indexOf(s.val().bookmaker) > -1)
      dispatch(addTrade(s.val()))
  })
  ref.on('child_changed', s => {
    if (bookmakers.indexOf(s.val().bookmaker) > -1)
      dispatch(changeTrade(s.val()))
  })
  ref.on('child_removed', s => {
    if (getState().trades.byId[s.key])
      dispatch(deleteTrade(s.key))
  })
}

export const resetTradeListener = () => dispatch => {
  dispatch(resetTrades())
  dispatch(listenToTrades())
}

const resetTrades = () => ({
  type: C.RESET_TRADES
})

const addTrade = (trade) => ({
  type: C.ADD_TRADE,
  key: trade._id,
  trade
})

const changeTrade = (trade) => ({
  type: C.CHANGE_TRADE,
  key: trade._id,
  trade
})

const deleteTrade = (key) => ({
  type: C.DELETE_TRADE,
  key
})
