import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { countNodes } from 'utils/graphql';

export default function Wallet({ player, children }) {
  const wallet = getWallet(player);

  return (
    <View style={styles.container}>
      <Text style={styles.wallet}>Wallet</Text>
      <Text>Experience: {wallet.exp}</Text>
      <Text>Coins: {wallet.coin}</Text>
      <Text>Cards: {countNodes(player.wallet.transferables)}</Text>
    </View>
  );
}

function getWallet(player) {
  return player.wallet.consumables.reduce(
    (acc, item) => {
      acc[item.consumable.id] = item.amount || 0;
      return acc;
    },
    { exp: 0, coin: 0 },
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  wallet: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
