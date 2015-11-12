/**
 * Library imports
 */
import React                    from 'react';
import { bindActionCreators  }  from 'redux';
import { connect  }             from 'react-redux';
import { Link, History }                 from 'react-router';

/**
 * Application component imports
 */
import AppHeader                from 'components/ui-AppHeader';
import lightwalletActions       from 'actions/lightwallet';

/**
 * Style imports
 */
import 'assets/styles/card.css';
import 'assets/styles/utils/spacing.css';
import './index.css';

/**
 * Map the current state to props for the component
 */
const mapStateToProps = (state) => ({
  lightwallet : state.lightwallet,
  routerState : state.router
});

/**
 * Binding the Action creators to the local props
 */
const mapDispatchToProps = (dispatch) => ({
  actions : bindActionCreators(lightwalletActions, dispatch)
});

/**
 * Export the HomeView component so that it can be
 * tested without any Redux connections
 */
export const HomeView = React.createClass({
  mixins: [ History ],

  getInitialState() {
    return {
      collectingEntropy: true,
      hasEnoughEntropy: false,
      entropyString: '',
      encryptingPassword: '',
      confirmPassphraseCopied: false
    }
  },

  checkEntropyLevels(el) {
    const entropyLength = el.target.value.length;
    if(entropyLength > 20) {
      this.setState({hasEnoughEntropy: true, entropyString: el.target.value});
    } else {
      this.setState({hasEnoughEntropy: false});
    }
  },

  confirmPassphraseCopied() {
    this.setState({confirmPassphraseCopied: true})
  },

  onPasswordChange(el) {
    console.log(el.target.value);
    this.setState({encryptingPassword: el.target.value});
  },

  onCreateLightwallet() {
   console.log('creating lightwallet');
   this.props.actions.createLightwallet(
     this.props.lightwallet.lightwalletRandomSeed,
     this.state.encryptingPassword
   );
   this.history.pushState(null, `accounts`);
  },

  render() {

    let currentScreen;

    if(this.state.collectingEntropy) {
      currentScreen = (
        <div className='col-lg-12'>
          <h1>Create a new Wallet</h1>
          <p className='p-b-lg'>Please enter some random text in the box below to generate entropy for your passphrase:</p>
          <input type='text' onKeyDown={this.checkEntropyLevels} className='form-control col-lg-12 m-b-md' />
          {this.state.hasEnoughEntropy ?
            <a className='btn btn-primary p-a pull-right'
              to='new_wallet'
              onClick={()=>{
                this.props.actions.createLightwalletPassphrase(this.state.entropyString)
              }}
              >
              Create New Wallet
            </a>
          : null }
        </div>
      );
    }

    if(this.props.lightwallet.lightwalletRandomSeed.length > 0) {
      currentScreen = (
        <div className='col-lg-12'>
          <h1>Here's your Passphrase</h1>
          <pre className='text-center p-a-lg'>
            {this.props.lightwallet.lightwalletRandomSeed}
          </pre>
          <div className='alert alert-danger'>
            Write down your seed words. If you lose them, you will permanently lose access to your wallet. Store these words in multiple, safe locations. If another person has access to your seed words, they can take your ether.
          </div>
          <div className='pull-right'>
            { !this.state.confirmPassphraseCopied ? <span>
            <input id="Option" type="checkbox" onClick={this.confirmPassphraseCopied}/>
            <label className="checkbox" htmlFor="Option">I have securely written down my passphrase</label>
            </span>
            :
            <div>
              <p>Enter a password to encrypt your Passphrase in the Browser</p>
              <input type='password' onKeyUp={this.onPasswordChange} />
              <button onClick={()=>{
                this.onCreateLightwallet()
              }}>Encrypt my Passphrase</button>
            </div> }
          </div>
        </div>
      );
    }

    return(
      <div className='flex-container full-height' key={'name'}>
        <AppHeader />
        <div className='MainContent'>
          <section className='card'>
            <div className='row'>
              {currentScreen}
            </div>
          </section>
        </div>
        <footer>
        </footer>
    </div>
    );
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeView);
