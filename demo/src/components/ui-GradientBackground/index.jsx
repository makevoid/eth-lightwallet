'use strict';

import React from 'react';

import './index.css';
import 'assets/styles/flex-container.css';

export default React.createClass({
  render() {
    return (
      <div className='GradientBackground'>
        {this.props.children}
      </div>
    );
  }
});
