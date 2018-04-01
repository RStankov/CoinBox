import React from 'react';
import CenterView from 'components/CenterView';
import { ActivityIndicator } from 'react-native';

export default function Loading() {
  return (
    <CenterView>
      <ActivityIndicator size="large" />
    </CenterView>
  );
}
