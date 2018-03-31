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
        title="Sign In"
        onPress={() => navigateTo('SignIn', { name: 'Test' })}
      />
      <Query query={QUERY}>
        {({ loading, error, data }) => {
          if (loading) return <Text>Loading...</Text>;
          if (error) return <Text>Error :(</Text>;

          if (data.viewer) {
            return (
              <Text>
                {data.viewer.username} is playing {data.game.name}
              </Text>
            );
          } else {
            return <Text>{data.game.name}</Text>;
          }
        }}
      </Query>
    </CenterView>
  );
}

Screen.navigationOptions = {
  title: 'Home',
};

export default withActions({ navigateTo })(Screen);
