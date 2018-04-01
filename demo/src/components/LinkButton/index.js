import React from 'react';
import withActions from 'utils/withActions';
import { Button } from 'react-native';
import { navigateTo } from 'modules/navigation';

class LinkButton extends React.Component {
  handlePress = () => {
    this.props.navigateTo(this.props.screen);
  };

  render() {
    return <Button title={this.props.title} onPress={this.handlePress} />;
  }
}

export default withActions({ navigateTo })(LinkButton);
