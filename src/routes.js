import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import Main from './pages/Main';
import User from './pages/User';
import MyWeb from './pages/MyWeb';

const Routes = createAppContainer(
  createStackNavigator(
    {
      Main,
      User,
      MyWeb,
    },
    {
      headerLayoutPreset: 'center',
      headerBackTitleVisible: false,
      defaultNavigationOptions: {
        // opcoes para todos os headers
        headerStyle: {
          backgroundColor: '#7159c1',
        },
        headerTintColor: '#fff',
      },
    },
  ),
);

export default Routes;
