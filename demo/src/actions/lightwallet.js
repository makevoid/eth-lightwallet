import {
  CREATE_LIGHTWALLET_PASSPHRASE,
  CREATE_LIGHTWALLET
} from 'constants/lightwallet';

export default {
  createLightwalletPassphrase: (entropy) => ({
    type: CREATE_LIGHTWALLET_PASSPHRASE,
    payload: { entropy }
  }),

  createLightwallet: (passphrase, password, router) => ({
    type: CREATE_LIGHTWALLET,
    payload: { passphrase, password, router }
  })
};
