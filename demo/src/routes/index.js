'use strict';

import React from 'react';
import { Route, IndexRoute  } from 'react-router';

import AppLayout from 'layouts/AppLayout';
import HomeView  from 'features/HomeView';
import NewWallet from 'features/NewWallet';
import Accounts  from 'features/Accounts';
import SendEther from 'features/SendEtherView';

export default (
  <Route path='/' component={AppLayout}>
    <IndexRoute component={HomeView} />
    <Route path='new_wallet' component={NewWallet} />
    <Route path='accounts'   component={Accounts} />
    <Route path='send/from/:account'   component={SendEther} />
  </Route>
);
