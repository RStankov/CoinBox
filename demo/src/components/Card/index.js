import React from 'react';
import Image from 'components/Image';
import { View, Text, StyleSheet } from 'react-native';

export default function Card({ card, children }) {
  return (
    <View style={styles.container}>
      <Image size={60} url={card.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{card.name}</Text>
        <Text style={styles.price}>
          {card.price.amount}{' '}
          {card.price.consumable && card.price.consumable.name}
        </Text>
      </View>
      {children}
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
