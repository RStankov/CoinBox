import Card from 'components/Card';
import Wallet from 'components/Wallet';
import Image from 'components/Image';
import List from 'components/List';
import QUERY from './Query';
import React from 'react';
import compose from 'utils/compose';
import withLoading from 'utils/withLoading';
import { Button } from 'react-native';
import { graphql } from 'react-apollo';
import { View } from 'react-native';

class Screen extends React.Component {
  render() {
    return (
      <View>
        <Wallet player={this.props.data.viewer} />
        <List
          data={this.props.data}
          connectionPath="game.store"
          renderItem={this.renderItem}
        />
      </View>
    );
  }

  renderItem({ item }) {
    return (
      <Card card={item}>
        <Button title="Buy" onPress={() => null} />
      </Card>
    );
  }
}

const Container = compose(graphql(QUERY), withLoading)(Screen);

Container.navigationOptions = {
  title: 'Store',
};

export default Container;
