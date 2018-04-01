import MUTATION from './Mutation';
import React from 'react';
import compose from 'utils/compose';
import { Button } from 'react-native';
import { graphql } from 'react-apollo';

function BuyButton({ buy }) {
  return <Button title="Buy" onPress={buy} />;
}

export default compose(
  graphql(MUTATION, {
    props: ({ ownProps, mutate }) => ({
      buy() {
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
)(BuyButton);
