import CenterView from 'components/CenterView';
import QUERY from './Query';
import React from 'react';
import compose from 'utils/compose';
import withLoading from 'utils/withLoading';
import { View, Text, Button, FlatList } from 'react-native';
import { graphql } from 'react-apollo';
import { navigateTo } from 'modules/navigation';
import { signOut } from 'utils/authentication';
import { getNodes, hasNextPage, loadMore } from 'utils/graphql';

class Screen extends React.Component {
  state = { isLoading: false };

  loadMore = () => {
    if (this.state.isLoading || !hasNextPage(this.props.data.game.store)) {
      return;
    }

    this.setState({ isLoading: true });

    loadMore({ data: this.props.data, connectionPath: 'game.store' });
  };

  render() {
    const { data: { game } } = this.props;

    return (
      <FlatList
        data={getNodes(game.store)}
        renderItem={renderRow}
        onEndReached={this.loadMore}
      />
    );
  }
}

function renderRow({ item }) {
  return <Text>{item.id}</Text>;
}

const Container = compose(graphql(QUERY), withLoading)(Screen);

Container.navigationOptions = {
  title: 'Store',
};

export default Container;
