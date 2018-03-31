import React from 'react';
import { Text, TextInput, View } from 'react-native';
import styles from './styles';

export default class PizzaTranslator extends React.Component {
  state = {
    text: '',
  };

  onChangeText = text => {
    this.setState({ text });
  };

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Type here to translate!"
          onChangeText={this.onChangeText}
        />
        <Text style={styles.text}>
          {this.state.text
            .split(' ')
            .map(word => word && '🍕')
            .join(' ')}
        </Text>
      </View>
    );
  }
}
