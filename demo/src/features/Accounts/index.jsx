
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

const AsyncBalanceLoader = React.createClass({
  getInitialState() {
    return {
      isLoading: true,
      balanceValue: 0
    }
  },

  componentDidMount() {
    lightwalletLib.getBalanceForAddress(this.props.balance).then((bal)=>{
      this.setState({isLoading: false, balanceValue: bal});
    })
  },

  render() {
    if(this.state.isLoading) {
      return <span>...</span>;
    }

    return <span>{this.state.balanceValue}</span>;
  }
});

export default React.createClass({
  mixins: [History],

  onRowClick(account) {
    this.history.pushState(null, `/send/from/${account}`)
  },

  render() {
    const accounts = lightwalletLib.getAvailableAddresses();

    const tableRows = accounts.map((account)=>{
      return (
        <tr key={account} onClick={this.onRowClick.bind(null, account)}>
          <td className='AccountValue'>
            {account}
          </td>
          <td>
            <AsyncBalanceLoader balance={account} />
          </td>
        </tr>
      );
    });

    return (
      <div className='flex-container full-height' key={'name'}>
        <AppHeader />
        <div className='MainContent'>
          <section className='AccountBalances'>
            <div className='row'>
              <table>
                <thead>
                  <tr>
                    <td>Address</td>
                    <td>Balance (ETH)</td>
                  </tr>
                </thead>
                <tbody>
                  {tableRows}
                </tbody>
              </table>
            </div>
          </section>
        </div>
        <footer>
        </footer>
    </div>
    );
  }
});
