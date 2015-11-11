import Web3 from 'web3';
import lightwallet from 'lightwallet';
import HookedWeb3Provider from 'hooked-web3-provider';
import Promise from 'bluebird';

export default class LightwalletLib {

  constructor() {
    this.keyStore           = undefined;
    this.availableAddresses = [];
    this.web3Provider       = undefined;
    this.web3               = new Web3();

    if(localStorage.getItem('wallet')) {
      var serialized          = localStorage.getItem('wallet');
      this.keyStore           = lightwallet.keystore.deserialize(serialized);
      this.availableAddresses = this.keyStore.getAddresses();
      this.setWeb3Provider();
    }
  }

  keystoreReady() {
    return this.keyStore === undefined ? false : true;
  }

  getAvailableAddresses() {
    return this.availableAddresses;
  }

  generateRandomSeed(entropy) {
    return lightwallet.keystore.generateRandomSeed(entropy);
  }

  generateAddresses(password) {
    this.keyStore.generateNewAddress(password, 3);
    this.availableAddresses = this.keyStore.getAddresses();
  }

  setWeb3Provider() {
    this.web3Provider = new HookedWeb3Provider({
      host: "http://ethsandbox.cloudapp.net:8545",
      transaction_signer: this.keyStore
    });
    this.web3.setProvider(this.web3Provider);
  }

  createNewWallet( randomSeed, password ){
    this.keyStore = new lightwallet.keystore(
      randomSeed,
      password
    );

    this.generateAddresses(password);
    this.setWeb3Provider();
    this.saveKeystoreToLocalStorage();
  }

  saveKeystoreToLocalStorage() {
    localStorage.setItem('wallet', this.keyStore.serialize());
  }

  getBalanceForAddress(address) {
    return new Promise((resolve,reject)=>{
      this.web3.eth.getBalance(address, (err, balance) => {
        resolve(this.formatBalance(balance));
      });
    })
  }

  formatBalance(balance) {
    return (balance / Math.pow(10, 18)).toFixed(3) + ' Ether';
  }

}
