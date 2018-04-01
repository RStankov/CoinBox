import PlayerCard from 'components/PlayerCard';
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
        connectionPath="game.players"
        renderItem={this.renderItem}
      />
    );
  }

  renderItem({ item }) {
    return (
      <PlayerCard player={item}>
        <Button title="Battle" onPress={() => null} />
      </PlayerCard>
    );
  }
}

const Container = compose(graphql(QUERY), withLoading)(Screen);

Container.navigationOptions = {
  title: 'Arena',
};

export default Container;
