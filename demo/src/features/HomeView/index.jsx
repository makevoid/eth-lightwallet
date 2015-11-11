'use strict';

import React from 'react';
import { Link } from 'react-router';

import AppHeader from 'components/ui-AppHeader';

import 'assets/styles/card.css';
import 'assets/styles/utils/spacing.css';
import './index.css';

export default React.createClass({
  render() {
    return (
      <div className='flex-container full-height' key={'name'}>
        <AppHeader />
        <div className='MainContent'>
          <section className='card'>
            <h1>Welcome</h1>
            <p className='p-b-lg'>To proceed, you need to either create a new Lightwallet or load a previously created wallet file.</p>
            <Link className='btn btn-primary p-a m-r-md' to='new_wallet'>Create New Wallet</Link>
            <button className='btn btn-secondary p-a'>I have a Wallet file</button>
          </section>
        </div>
        <footer>
          <a href='#'>I need to restore my Wallet from its seed passphrase.</a>
        </footer>
    </div>
    );
  }
});
