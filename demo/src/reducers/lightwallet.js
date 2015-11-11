import { createReducer }      from '../utils';
import LightwalletLib         from '../lib/LightwalletLib';
import {
  CREATE_LIGHTWALLET_PASSPHRASE,
  CREATE_LIGHTWALLET
} from 'constants/lightwallet';

const lightwalletLib = new LightwalletLib();

const initialState = {
  hasKeystore: lightwalletLib.keystoreReady(),
  availableAddresses: lightwalletLib.getAvailableAddresses(),
  lightwalletRandomSeed: ''
};

export default createReducer(initialState, {
  [CREATE_LIGHTWALLET_PASSPHRASE]: (state, action) => {
    const randomSeed = lightwalletLib.generateRandomSeed(action.entropy);
    return {...state, lightwalletRandomSeed: randomSeed};
  },
  [CREATE_LIGHTWALLET]: (state, action) => {
    lightwalletLib.createNewWallet( action.passphrase, action.password );
    return {
      ...state,
      availableAddresses: lightwalletLib.getAvailableAddresses(),
      meta: {
        transition: (state, action) => ({
          path: `/logged-in/${3}`
        })
      }
    };
  }
});
