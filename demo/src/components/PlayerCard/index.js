import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PlayerCard({ player, children }) {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{player.username}</Text>
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
  name: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
  },
});
