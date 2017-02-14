import * as C from 'constants'

export const currencies = (state=null, action) => {
  switch(action.type) {
    case C.INITIAL_CURRENCIES:
      return action.currencies
    case C.CURRENCY_CHANGED:
      return {
        ...state,
        [action.key]: action.value
      }
    default:
      return state
  }
}
