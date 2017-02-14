import * as C from 'constants'

const ANALYTICS_MAPPING = {
  displayName: 'name'
}

const initialState = {
  uid: null,
  user: null,
  loading: false,
  error: null
}

export const auth = (state=initialState, action) => {
  console.log(action)
  switch(action.type) {
    case C.LOGIN_REQUEST:
      return {
        ...state,
        loading: true
      }
    case C.LOGIN_SUCCESS:
      return {
        ...initialState,
        uid: action.uid
      }
    case C.LOGIN_ERROR:
      return {
        ...initialState,
        error: action.error
      }
    case C.INITIAL_USER:
      return {
        ...state,
        loading: false,
        uid: action.user.uid,
        error: null,
        user: user(state.user, action)
      }
    case C.USER_CHANGED:
      return {
        ...state,
        user: user(state.user, action)
      }
    default:
      return state
  }
}

const user = (state=null, action) => {
  switch(action.type) {
    case C.INITIAL_USER:
      return {
        ...action.user
      }
    case C.USER_CHANGED:
      const newState = {...state}
      return newState
    default:
      return state
  }
}

const parseBookmakers = (bookmakers) =>
  Object.keys(bookmakers).filter(k => k !== 'dummy').map(k => ({
    ...bookmakers[k],
    key: +k
  }))

const parsePresets = (presets) =>
  Object.keys(presets).filter(k => k !== 'dummy').map(k => ({
    ...presets[k],
    key: k,
    sports: presets[k].sports || [],
    bookmakers: presets[k].bookmakers || [],
    oddsTypes: presets[k].oddsTypes || []
  })).sort((a, b) => a.name.localeCompare(b.name))

const parseNotifications = (notifications) =>
  Object.keys(notifications).filter(k => k !== 'dummy').map(k => ({
    ...notifications[k],
    key: k,
    sports: notifications[k].sports || [],
    bookmakers: notifications[k].bookmakers || []
  }))
