import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { BottomNavigator } from '../components';
import Beranda from '../pages/Beranda';
import Profil from '../pages/Profil';
import Progres from '../pages/Progres';
import Tersimpan from '../pages/Tersimpan';
import useAuthStore from '../store/authStore';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Notifikasi from '../pages/Notifikasi';
import Pengaturan from '../pages/Pengaturan';
import PilihPeran from '../pages/PilihPeran';
import PilihBidangPekerjaan from '../pages/PilihBidangPekerjaan';
import DetailBidangPekerjaan from '../pages/DetailBidangPekerjaan';
import DetailLayanan from '../pages/DetailLayanan';
import TambahLowongan from '../pages/TambahLowongan';
import FilterTersimpan from '../pages/FilterTersimpan';
import FilterHome from '../pages/FilterHome';
import DetailPencari from '../pages/DetailPencari';
import TawarkanPekerjaan from '../pages/TawarkanPekerjaan';
import KonfirmasiWaktu from '../pages/KonfirmasiWaktu';
import SuksesTawaranTerkirim from '../pages/SuksesTawaranTerkirim';
import OnBoarding from '../pages/OnBoarding';

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
      <Tab.Screen name="Beranda" component={Beranda} options={{ headerShown: false }} />
      <Tab.Screen name="Tersimpan" component={Tersimpan} options={{ headerShown: false }} />
      <Tab.Screen name="Progres" component={Progres} options={{ headerShown: false }} />
      <Tab.Screen name="Profil" component={Profil} options={{ headerShown: false }} />
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
      <Stack.Screen
        name="Notifikasi"
        component={Notifikasi}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Pengaturan"
        component={Pengaturan}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="DetailBidangPekerjaan"
        component={DetailBidangPekerjaan}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="DetailLayanan"
        component={DetailLayanan}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="TambahLowongan"
        component={TambahLowongan}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="FilterTersimpan"
        component={FilterTersimpan}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="FilterHome"
        component={FilterHome}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="DetailPencari"
        component={DetailPencari}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="TawarkanPekerjaan"
        component={TawarkanPekerjaan}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="KonfirmasiWaktu"
        component={KonfirmasiWaktu}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SuksesTawaranTerkirim"
        component={SuksesTawaranTerkirim}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="OnBoarding"
        component={OnBoarding}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

const UnAuthenticated = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: true,
        contentStyle: { backgroundColor: '#fafafa' },
      }}
      initialRouteName="Login"
    >
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
      <Stack.Screen name="PilihPeran" component={PilihPeran} options={{ headerShown: false }} />
      <Stack.Screen name="PilihBidangPekerjaan" component={PilihBidangPekerjaan} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

const Router = () => {
  const { isLogin } = useAuthStore();

  return isLogin ? <Authenticated /> : <UnAuthenticated />;
};

export default Router;
