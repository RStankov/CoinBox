import Card from 'components/Card';
import Image from 'components/Image';
import List from 'components/List';
import QUERY from './Query';
import React from 'react';
import compose from 'utils/compose';
import withLoading from 'utils/withLoading';
import { Button } from 'react-native';
import { graphql } from 'react-apollo';

class Screen extends React.Component {
  render() {
    return (
      <List
        data={this.props.data}
        connectionPath="viewer.wallet.transferables"
        renderItem={this.renderItem}
      />
    );
  }

  renderItem({ item }) {
    return (
      <Card card={item}>
        <Button title="Sell" onPress={() => null} />
      </Card>
    );
  }
}

const Container = compose(graphql(QUERY), withLoading)(Screen);

Container.navigationOptions = {
  title: 'Deck',
};

export default Container;
