import React from 'react';
import { FlatList } from 'react-native';
import { get } from 'lodash';
import { getNodes, hasNextPage, loadMore } from 'utils/graphql';

export default class List extends React.Component {
  state = { isLoading: false };

  getConnection() {
    return get(this.props.data, this.props.connectionPath);
  }

  loadMore = () => {
    if (this.state.isLoading || !hasNextPage(this.getConnection())) {
      return;
    }

    this.setState({ isLoading: true });

    loadMore({
      data: this.props.data,
      connectionPath: this.props.connectionPath,
      cursorName: this.props.cursorName || 'cursor',
      variables: this.props.variables || {},
    });
  };

  render() {
    return (
      <FlatList
        data={getNodes(this.getConnection())}
        renderItem={this.props.renderItem}
        keyExtractor={keyExtractor}
        onEndReached={this.loadMore}
      />
    );
  }
}

function keyExtractor(item, index) {
  return item.id || index;
}
