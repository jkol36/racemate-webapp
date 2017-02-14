import firebase from 'firebase'
import * as C from 'constants'

export const listenToUserbets = () => (dispatch, getState) => {
  const {auth: { uid }} = getState()
  return firebase.database().ref('userbet-keys').child(uid).once('value')
    .then(snap => {
      const keys = []
      snap.forEach(s => {
        keys.push(s.key)
      })
      return Promise.map(keys, (key) => firebase.database().ref('userbets').child(key).once('value'))
    }).then(results => {
      const bets = []
      results.forEach(t => {
        bets.push({ ...t.val(), key: t.key})
      })
      dispatch(initialBets(bets))
      bets.forEach(t => {
        keepBetInSync(t.key, dispatch)
      })
      firebase.database().ref('userbet-keys').child(uid).on('child_removed', snap => {
        dispatch(deleteBet(snap.key))
        firebase.database().ref('userbets').child(snap.key).off()
      })
      let ref = firebase.database().ref('userbet-keys').child(uid)
      if (bets.length > 0) {
        ref = firebase.database().ref('userbet-keys').child(uid).orderByKey().startAt(bets[bets.length - 1].key)
      }
      ref.on('child_added', snap => {
        if (bets.length === 0 || snap.key !== bets[bets.length - 1].key) {
          firebase.database().ref('userbets').child(snap.key).once('value')
            .then(s => {
              dispatch(addBet({ ...s.val(), key: s.key}))
            })
            keepBetInSync(snap.key, dispatch)
        }
      })
    })
}

export const initialBets = (bets) => ({
  type: C.INITIAL_BETS,
  bets
})

const changeBet = (id, key, value) => ({
  type: C.CHANGE_USERBET,
  id,
  key,
  value
})

const deleteBet = (id) => ({
  type: C.DELETE_USERTRADE,
  id
})

const addBet = (bet) => ({
  type: C.ADD_USERTRADE,
  bet,
  key: bet.key
})

const keepBetInSync = (key, dispatch) => {
  const ref = firebase.database().ref('userbets').child(key)
  ref.on('child_changed', snap => {
    dispatch(changeBet(key, snap.key, snap.val()))
  })
}

export const editUsertrade = (key, wager, edge) => (_, getState) => {
  return firebase.database().ref('userbets').child(key).update({
    wager,
    edge,
    closing: edge
  })
}

export const registerBet = (bet, wager, currency, edge, odds) => (_, getState) => {
  const userbet = {
    match: {
      _id: bet.matchId,
      homeTeam: bet.homeTeam,
      awayTeam: bet.awayTeam,
      competition: bet.competition,
      startTime: +bet.startTime
    },
    bookmaker: bet.bookmaker,
    createdAt: firebase.database.ServerValue.TIMESTAMP,
    wager,
    currency,
    edge,
    closing: edge,
    odds: odds,
    oddsType: bet.oddsType,
    oddsTypeCondition: bet.oddsTypeCondition || 0,
    output: bet.output,
    sport: bet.sportId,
    status: 1,
    user: getState().auth.uid,
    betId: bet._id
  }
  const ref = firebase.database().ref('userbets').push()
  return firebase.database().ref().update({
    [`userbet-keys/${getState().auth.uid}/${ref.key}`]: true,
    [`userbets/${ref.key}`]: userbet
  })
}
