import { combineReducers }    from 'redux';
import { routerStateReducer } from 'redux-router';

import lightwallet     from './lightwallet';

export default combineReducers({
  router: routerStateReducer,
  lightwallet
});
