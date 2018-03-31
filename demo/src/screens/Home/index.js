import React from 'react';
import { Text, Button } from 'react-native';
import withActions from 'utils/withActions';
import { navigateTo } from 'modules/navigation';
import CenterView from 'components/CenterView';
import { Query } from 'react-apollo';
import QUERY from './Query';

function Screen({ navigateTo }) {
  return (
    <CenterView>
      <Button
        title="Get Pizza"
        onPress={() => navigateTo('PizzaPicker', { name: 'Test' })}
      />
      <Query query={QUERY}>
        {({ loading, error, data }) => {
          if (loading) return <Text>Loading...</Text>;
          if (error) return <Text>Error :(</Text>;

          return <Text>{data.game.name}</Text>;
        }}
      </Query>
    </CenterView>
  );
}

Screen.navigationOptions = {
  title: 'Home',
};

export default withActions({ navigateTo })(Screen);
