import QUERY from './Query';
import React from 'react';
import compose from 'utils/compose';
import withLoading from 'utils/withLoading';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { graphql } from 'react-apollo';
import List from 'components/List';

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
      {item.image ? (
        <Image style={styles.image} source={{ uri: item.image }} />
      ) : (
        <View style={styles.placeholder} />
      )}
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
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  info: {
    marginLeft: 10,
    flex: 1,
  },
  placeholder: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#888',
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
