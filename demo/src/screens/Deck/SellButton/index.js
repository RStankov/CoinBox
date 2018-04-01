import MUTATION from './Mutation';
import React from 'react';
import compose from 'utils/compose';
import { Button } from 'react-native';
import { graphql } from 'react-apollo';

function SellButton({ sell }) {
  return <Button title="Sell" onPress={sell} />;
}

export default compose(
  graphql(MUTATION, {
    props: ({ ownProps, mutate }) => ({
      sell() {
        return mutate({
          variables: {
            input: {
              transferable_id: ownProps.card.id,
              consumable_id: 'coin',
            },
          },
        });
      },
    }),
  }),
)(SellButton);
