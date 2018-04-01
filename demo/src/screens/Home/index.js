import CenterView from 'components/CenterView';
import QUERY from './Query';
import React from 'react';
import compose from 'utils/compose';
import withActions from 'utils/withActions';
import withLoading from 'utils/withLoading';
import { View, Text, Button } from 'react-native';
import { graphql } from 'react-apollo';
import { navigateTo } from 'modules/navigation';
import { signOut } from 'utils/authentication';

class Screen extends React.Component {
  handleSignIn = () => {
    this.props.navigateTo('SignIn');
  };

  handleSignOut = () => {
    signOut();
    this.props.data.refetch();
  };

  handleStore = () => {
    this.props.navigateTo('Store');
  };

  render() {
    const { data: { viewer, game } } = this.props;

    return (
      <CenterView>
        <Text>Game: {game.name}</Text>
        {viewer ? (
          <View>
            <Text>Player: {viewer.username}</Text>
            <Button title="Store" onPress={this.handleStore} />
            <Button title="Sign Out" onPress={this.handleSignOut} />
          </View>
        ) : (
          <Button title="Sign In" onPress={this.handleSignIn} />
        )}
      </CenterView>
    );
  }
}

const Container = compose(
  graphql(QUERY),
  withActions({ navigateTo }),
  withLoading,
)(Screen);

Container.navigationOptions = {
  title: 'Demo',
};

export default Container;
