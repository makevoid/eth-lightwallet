'use strict';


import React from 'react';
import TransitionGroup from 'react-addons-css-transition-group';

import GradientBackground from 'components/ui-GradientBackground';

import 'assets/styles/AppLayout.css';

export default React.createClass({
  render() {
    return (
      <GradientBackground>
        <TransitionGroup transitionName="page-transition" transitionEnterTimeout={500} transitionLeaveTimeout={300} transitionAppear={true} transitionAppearTimeout={3800}>
          {this.props.children}
        </TransitionGroup>
      </GradientBackground>
    );
  }
});
