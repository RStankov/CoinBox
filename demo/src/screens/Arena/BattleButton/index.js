import MUTATION from './Mutation';
import React from 'react';
import compose from 'utils/compose';
import { Button, Text } from 'react-native';
import { graphql } from 'react-apollo';

class BuyButton extends React.Component {
  state = {
    status: 'idle',
  };

  battle = () => {
    if (this.state.status !== 'idle') {
      return;
    }

    const win = parseInt(Math.random() * 10) % 2 === 0;

    this.setState({ status: win ? 'won' : 'lost' });

    if (win) {
      this.props.receive({
        consumables: [
          { id: 'exp', amount: parseInt(Math.random() * 100) },
          { id: 'coin', amount: parseInt(Math.random() * 10) },
        ],
      });
    } else {
      this.props.receive({
        consumables: [{ id: 'exp', amount: parseInt(Math.random() * 10) }],
      });
    }
  };

  render() {
    if (this.state.status === 'won') {
      return <Text>👍</Text>;
    }

    if (this.state.status === 'lost') {
      return <Text>👎</Text>;
    }

    return <Button title="Battle" onPress={this.battle} />;
  }
}

export default compose(
  graphql(MUTATION, {
    props: ({ ownProps, mutate }) => ({
      receive(input) {
        return mutate({
          variables: {
            input,
          },
        });
      },
    }),
  }),
)(BuyButton);
