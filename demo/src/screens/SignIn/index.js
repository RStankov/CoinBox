import MUTATION from './Mutation';
import React from 'react';
import withActions from 'utils/withActions';
import { graphql } from 'react-apollo';
import compose from 'utils/compose';
import { signIn } from 'utils/authentication';
import { navigateBack } from 'modules/navigation';
import {
  Container,
  Button,
  Content,
  Form,
  Item,
  Input,
  Text,
} from 'native-base';

class Screen extends React.Component {
  state = {
    email: '',
    password: '',
    errors: [],
  };

  handleInputChange = (field, value) => {
    this.setState({ ...this.state, [field]: value });
  };

  handleSubmit = async () => {
    const { email, password } = this.state;

    this.setState({ errors: [] });

    const { data: { response } } = await this.props.signIn(email, password);

    if (response.node) {
      signIn(response.node.accessToken);
      this.props.navigateBack();
    } else {
      this.setState({
        errors: response.errors.map(({ field }) => field),
      });
    }
  };

  render() {
    const { errors } = this.state;

    return (
      <Container>
        <Content>
          <Form>
            <Item error={errors.indexOf('email') !== -1}>
              <Input
                placeholder="Email"
                onChangeText={value => this.handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </Item>
            <Item error={errors.indexOf('password') !== -1}>
              <Input
                placeholder="Password"
                onChangeText={value =>
                  this.handleInputChange('password', value)
                }
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
              />
            </Item>
          </Form>
          <Button full onPress={this.handleSubmit}>
            <Text>Sign In</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

export default compose(
  graphql(MUTATION, {
    props: ({ mutate }) => ({
      signIn: (email, password) => mutate({ variables: { email, password } }),
    }),
  }),
  withActions({ navigateBack }),
)(Screen);
