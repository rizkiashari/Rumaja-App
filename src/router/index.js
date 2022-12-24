import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { BottomNavigator } from '../components';
import Beranda from '../pages/Beranda';
import Profil from '../pages/Profil';
import Progres from '../pages/Progres';
import Tersimpan from '../pages/Tersimpan';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainApp = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomNavigator {...props} />}
      screenOptions={{
        unmountOnBlur: true,
      }}
    >
      <Tab.Screen
        name="Beranda"
        component={Beranda}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Tersimpan"
        component={Tersimpan}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Progres"
        component={Progres}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Profil"
        component={Profil}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

const Authenticated = () => {
  return (
    <Stack.Navigator
      initialRouteName="MainApp"
      screenOptions={{
        gestureEnabled: true,
        contentStyle: { backgroundColor: '#fafafa' },
      }}
    >
      <Stack.Screen
        name="MainApp"
        component={MainApp}
        options={{
          headerShown: false,
          gestureEnabled: true,
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
};

const UnAuthenticated = () => {};

const Router = () => {
  return <Authenticated />;
};

export default Router;
