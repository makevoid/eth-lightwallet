/*jslint node: true */
/*jslint browser: true*/
'use strict';

import React          from 'react';
import ReactDOM       from 'react-dom';
import Root           from './containers/Root';
import Styles         from 'assets/styles/lightwallet.css';
import configureStore from './store/configureStore';

const target = window.document.getElementById('app-container')
const store  = configureStore(window.__INITIAL_STATE__, __DEBUG__);

const node = (
  <Root store={store}
        debug={__DEBUG__}
        debugExternal={__DEBUG_NW__} />
);

ReactDOM.render(node, target);
