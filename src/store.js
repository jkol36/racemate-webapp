import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension';
import { routerReducer } from 'react-router-redux'
import thunk from 'redux-thunk'
import * as reducers from 'reducers'

const rootReducer = combineReducers({
  routing: routerReducer,
  ...reducers
})


export default () => {
  const middleware = applyMiddleware(thunk)
  const composable = process.env.NODE_ENV === 'production' ? compose(middleware) : composeWithDevTools(middleware)
  return createStore(rootReducer, composable)
}
