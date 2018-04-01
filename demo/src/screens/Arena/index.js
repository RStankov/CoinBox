import PlayerCard from 'components/PlayerCard';
import Image from 'components/Image';
import List from 'components/List';
import QUERY from './Query';
import React from 'react';
import compose from 'utils/compose';
import withLoading from 'utils/withLoading';
import { Button, View } from 'react-native';
import { graphql } from 'react-apollo';
import BattleButton from './BattleButton';
import Wallet from 'components/Wallet';

class Screen extends React.Component {
  render() {
    return (
      <View>
        <Wallet player={this.props.data.viewer} />
        <List
          data={this.props.data}
          connectionPath="game.players"
          renderItem={this.renderItem}
        />
      </View>
    );
  }

  renderItem({ item }) {
    return (
      <PlayerCard player={item}>
        <BattleButton player={item} />
      </PlayerCard>
    );
  }
}

const Container = compose(graphql(QUERY), withLoading)(Screen);

Container.navigationOptions = {
  title: 'Arena',
};

export default Container;
