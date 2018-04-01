import Card from 'components/Card';
import Wallet from 'components/Wallet';
import Image from 'components/Image';
import List from 'components/List';
import QUERY from './Query';
import React from 'react';
import compose from 'utils/compose';
import withLoading from 'utils/withLoading';
import { graphql } from 'react-apollo';
import { View } from 'react-native';
import SellButton from './SellButton';

class Screen extends React.Component {
  render() {
    return (
      <View>
        <Wallet player={this.props.data.viewer} />
        <List
          data={this.props.data}
          connectionPath="viewer.wallet.transferables"
          renderItem={this.renderItem}
        />
      </View>
    );
  }

  renderItem({ item }) {
    return (
      <Card card={item}>
        <SellButton card={item} />
      </Card>
    );
  }
}

const Container = compose(graphql(QUERY), withLoading)(Screen);

Container.navigationOptions = {
  title: 'Deck',
};

export default Container;
