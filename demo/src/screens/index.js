import { StackNavigator } from 'react-navigation';

import Home from './Home';
import SignIn from './SignIn';
import Store from './Store';

export default StackNavigator({
  Home: { screen: Home },
  SignIn: { screen: SignIn },
  Store: { screen: Store },
});
