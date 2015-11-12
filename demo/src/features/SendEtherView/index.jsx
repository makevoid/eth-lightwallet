/**
 * Library imports
 */
import React                    from 'react';
import { bindActionCreators  }  from 'redux';
import { connect  }             from 'react-redux';
import { Link, History }        from 'react-router';

/**
 * Application component imports
 */
import AppHeader                from 'components/ui-AppHeader';
import LightwalletLib           from 'lib/LightwalletLib';

/**
 * Style imports
 */
import 'assets/styles/utils/spacing.css';
import './index.css';

const lightwalletLib = new LightwalletLib();

export default React.createClass({
  getInitialState() {
    const { account } = this.props.params;

    return {
      fromAccount: account,
      toAddress: '',
      etherAmount: 0
    }
  },

  onEtherAmountChange(el){
    this.setState({etherAmount: el.target.value})
  },

  onToAddressChange(el){
    console.log(el);
    this.setState({toAddress: el.target.value})
  },

  onSendEther() {
    lightwalletLib.sendEther(
      this.state.fromAccount,
      this.state.toAddress,
      this.state.etherAmount
    );
  },

  render() {
    return (
      <div className='flex-container full-height' key={'name'}>
        <AppHeader />
        <div className='MainContent'>
          <section className='AccountBalances'>
            <div className='row'>
              <h1>How much Ether do you want to send?</h1>
              <p>{this.state.fromAccount} has 0.231ETH</p>
            </div>
            <div className='row'>
              <input className='GiantInput' type='text' onChange={this.onEtherAmountChange} />
            </div>
            <div className='row'>
              <h5>What address do you want to send the Ether to?</h5>
              <input type='text' onChange={this.onToAddressChange} />
            </div>
            <div className='row'>
              <button className='btn btn-primary' onClick={this.onSendEther}>Send Ether</button>
            </div>
          </section>
        </div>
        <footer>
        </footer>
    </div>
    )
  }
});
