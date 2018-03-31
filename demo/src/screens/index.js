import { StackNavigator } from 'react-navigation';

import Home from './Home';
import PizzaPicker from './PizzaPicker';

export default StackNavigator({
  Home: { screen: Home },
  PizzaPicker: { screen: PizzaPicker },
});
