import firebase from 'firebase'
import * as C from 'constants'

export const fetchCurrencies = () => dispatch => {
  return firebase.database().ref('currencies').once('value')
    .then((snap) => {
      dispatch(initialCurrencies(snap.val()))
    })
}

export const listenToCurrencies = () => dispatch => {
  firebase.database().ref('currencies').on('child_changed', snap => {
    dispatch(currencyChanged(snap.key, snap.val()))
  })
}

const initialCurrencies = (currencies) => ({
  type: C.INITIAL_CURRENCIES,
  currencies
})

const currencyChanged = (key, value) => ({
  type: C.CURRENCY_CHANGED,
  key,
  value
})
