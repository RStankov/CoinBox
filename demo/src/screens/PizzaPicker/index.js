import React from 'react';
import PizzaTranslator from './PizzaTranslator';
import { View } from 'react-native';
import CenterView from 'components/CenterView';

export default function Screen() {
  return (
    <CenterView>
      <PizzaTranslator />
    </CenterView>
  );
}

Screen.navigationOptions = {
  title: 'Pizza Translator',
};
