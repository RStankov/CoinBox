import Image from 'components/Image';
import List from 'components/List';
import QUERY from './Query';
import React from 'react';
import compose from 'utils/compose';
import withLoading from 'utils/withLoading';
import { View, Text, Button, StyleSheet } from 'react-native';
import { graphql } from 'react-apollo';

class Screen extends React.Component {
  render() {
    return (
      <List
        data={this.props.data}
        connectionPath="game.store"
        renderItem={renderItem}
      />
    );
  }
}

function renderItem({ item }) {
  return (
    <View style={styles.container} key={item.id}>
      <Image size={60} url={item.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>
          {item.price.amount}{' '}
          {item.price.consumable && item.price.consumable.name}
        </Text>
      </View>
      <Button title="Buy" onPress={() => null} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  info: {
    marginLeft: 10,
    flex: 1,
  },
  name: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
  },
});

const Container = compose(graphql(QUERY), withLoading)(Screen);

Container.navigationOptions = {
  title: 'Store',
};

export default Container;
