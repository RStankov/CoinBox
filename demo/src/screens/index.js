import { StackNavigator } from 'react-navigation';

import Home from './Home';
import SignIn from './SignIn';

export default StackNavigator({
  Home: { screen: Home },
  SignIn: { screen: SignIn },
});
