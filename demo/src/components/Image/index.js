import React from 'react';
import { View, StyleSheet, Image as ReactImage } from 'react-native';

export default function Image({ url, size }) {
  const sizeStyle = { width: size, height: size };
  if (!url) {
    return <View style={[styles.placeholder, sizeStyle]} />;
  }
  return <ReactImage style={[styles.image, sizeStyle]} source={{ uri: url }} />;
}

const styles = StyleSheet.create({
  image: {
    borderRadius: 10,
  },
  placeholder: {
    borderRadius: 10,
    backgroundColor: '#ddd',
  },
});
