import firebase from 'firebase'
import * as C from 'constants'
import { tokenize } from 'utils'
import { RESTAPI_URL } from 'config'
import request from 'superagent'
import { resetTradeListener } from 'actions/trades'
import { initialBets } from 'actions/userbets'
import cookie from 'react-cookie';


const userRef = firebase.database().ref('users')
const fbProvider = new firebase.auth.FacebookAuthProvider();
const twitterProvider = new firebase.auth.TwitterAuthProvider();
const googleProvider = new firebase.auth.GoogleAuthProvider();
fbProvider.addScope('email')
googleProvider.addScope('email')

export const loginWithFacebook = () => dispatch => {
  return firebase.auth().signInWithRedirect(fbProvider)
}

export const loginWithGoogle = () => dispatch => {
  return firebase.auth().signInWithRedirect(googleProvider)
}

export const loginWithTwitter = () => dispatch => {
  return firebase.auth().signInWithRedirect(twitterProvider)
}

export const loginWithEmailAndPassword = ({ email, password }) => dispatch =>
  firebase.auth().signInWithEmailAndPassword(email, password)

export const loginSuccess = (uid) => ({
  type: C.LOGIN_SUCCESS,
  uid: uid
})

export const fetchUser = (data) => dispatch => {
  console.log('fetching user')
  const { uid } = data
  return userRef.child(uid).once('value')
    .then(snap => {
      console.log('firebase returned', snap.val())
      var user = {}
      if (!snap.exists()) {
        analytics.alias(uid)
        user = {
          displayName: data.displayName || 'Beginner Racer',
          email: data.email,
          uid,
          mainCurrency: 'USD',
          notificationOptions: {
            desktop: false,
            text: false,
            email: false
          },
          presets: {
            dummy: 1,
            1: {
              name: 'My first preset',
              horses: [],
              recommendedLeagues: false,
              edge: {
                gte: 1,
                lte: 100
              },
              odds: {
                gte: 1,
                lte: 5
              },
              hoursBefore: {
                lte: 48,
                gte: 0
              },
              sports: []
            }
          },
          subscription: {
            permissionLevel: 0
          }
        }
        const referrer = cookie.load('__trademate__referrer')
        if (referrer)
          user.referrer = referrer
        userRef.child(uid).set(user)
      } else {
        user = snap.val()
      }
      dispatch(initialUser(user))
      userRef.child(uid).on('child_changed', s => {
        dispatch(userChanged(s.key, s.val()))
      })
    }).catch(err => {
      console.log('error logging in', err)
      Raven.captureException(err, {
        extra: data
      })
      dispatch(loginError(err))
    })
}

export const createUserWithEmail = (email, password) => dispatch =>
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(user => {
      const firebaseUser = {
        displayName: 'Beginner Racer',
        email: user.email,
        uid: user.uid,
        mainCurrency:'USD',
        notificationOptions: {
          desktop: false,
          text: false,
          email: false
        },
        subscription: {
          permissionLevel: 0
        }
      }
      const referrer = cookie.load('__trademate__referrer')
      if (referrer)
        firebaseUser.referrer = referrer
      firebase.database().ref('users').child(user.uid).set(firebaseUser)
      analytics.alias(user.uid)
    })

const loginError = (error) => ({
  type: C.LOGIN_ERROR,
  error
})

const initialUser = (user) => ({
  type: C.INITIAL_USER,
  user
})

const userChanged = (key, value) => ({
  type: C.USER_CHANGED,
  key,
  value
})

export const logout = () => dispatch => {
  return firebase.auth().signOut()
    .then(() => document.location = '/')
}

export const hijackUser = (uid) => ({
  type: C.HIJACK_USER,
  uid
})

export const hijack = (uid) => (dispatch, getState) => {
  const prevUid = getState().auth.uid
  dispatch(hijackUser(uid))
  firebase.database().ref('users').child(prevUid).off()
  firebase.database().ref('usertrade-keys').child(prevUid).off()
  getState().userbets.allIds.forEach(id => {
    firebase.database().ref('userbets').child(id).off()
  })
  return firebase.database().ref('users').child(uid).once('value')
    .then(snap => {
      const user = snap.val()
      dispatch(initialUser({ ...user, hijacked: true }))
      return firebase.database().ref('usertrade-keys').child(uid).once('value')
    }).then(snap => {
      const keys = []
      snap.forEach(s => {
        keys.push(s.key)
      })
      return Promise.map(keys, (key) => firebase.database().ref('userbets').child(key).once('value'))
    }).then(snap => {
      const trades = []
      snap.forEach(t => {
        trades.push({ ...t.val(), key: t.key })
      })
      dispatch(initialTrades(trades))
    })
}
