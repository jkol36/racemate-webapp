import { Route, IndexRedirect, IndexRoute, Redirect } from 'react-router'
import React from 'react'

import {
  AuthContainer,
  AppContainer,
} from 'containers'

import {
  LoginComponent,
  LoadingComponent,
  DashboardComponent,
  SignupComponent,
  ProfileComponent,
} from 'components'

export default () => [(
  <Route path='/' component={AuthContainer} key='app'>
    <IndexRoute component={LoadingComponent} />
    <Route path='/login' component={LoginComponent} />
    <Route path='/signup' component={SignupComponent} />
    <Route path='/a' component={AppContainer}>
      <IndexRedirect to='/dashboard'/>
      <Route path='/dashboard' component={DashboardComponent} />
    </Route>
  </Route>
)]
