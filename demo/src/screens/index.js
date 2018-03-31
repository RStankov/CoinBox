import { StackNavigator } from 'react-navigation';

import Home from './Home';
import PizzaPicker from './PizzaPicker';
import SignIn from './SignIn';

export default StackNavigator({
  Home: { screen: Home },
  PizzaPicker: { screen: PizzaPicker },
  SignIn: { screen: SignIn },
});
