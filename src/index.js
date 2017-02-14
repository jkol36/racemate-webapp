import 'babel-polyfill'
import React from 'react';
import './config'
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { createHistory } from 'history'
import createStore from './store'
import { Provider } from 'react-redux'
import createRoutes from './routes'
import 'less/main.less'

const routes = createRoutes()
const store = createStore()
const history = syncHistoryWithStore(browserHistory, store)

history.listen(location => {
  window.analytics.page()
})

render((
  <Provider store={store}>
    <Router history={history}>
      { routes }
    </Router>
  </Provider>
), document.getElementById('root'));
