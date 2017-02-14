import firebase from 'firebase'
import Promise from 'bluebird'
window.Promise = Promise

var config = {
  apiKey: "AIzaSyB6UipkgRuEREIn5WCCliQaqiUkVnL04eA",
  authDomain: "racemate-75b05.firebaseapp.com",
  databaseURL: "https://racemate-75b05.firebaseio.com",
  storageBucket: "racemate-75b05.appspot.com",
  messagingSenderId: "576830222480"
};
firebase.initializeApp(config);
//export const RESTAPI_URL = 'https://api.tradematesports.com'
//export { bookmakerLookup, getBookmakers } from './bookmakerLookup'
//export { leagueLookup } from './leagueLookup'
//export const STRIPE_KEY = 'pk_live_ZbEYCi2zl9RgE7gF3xRJKBW1'
//export { recommendedLeagues } from './leagueLookup'
//export { countryLookup } from './countries'

if (process.env.NODE_ENV === 'production')
  Raven.config('https://2dea819ffbb24c5298c773f394554522@sentry.io/138981').install()
//export const NOTIFICATION_SOUND_URL = '/static/notification_sound.mp3'
