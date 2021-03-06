import { StackNavigator } from 'react-navigation';

import Home from './Home';
import SignIn from './SignIn';
import Store from './Store';
import Deck from './Deck';
import Arena from './Arena';

export default StackNavigator({
  Home: { screen: Home },
  SignIn: { screen: SignIn },
  Store: { screen: Store },
  Deck: { screen: Deck },
  Arena: { screen: Arena },
});
