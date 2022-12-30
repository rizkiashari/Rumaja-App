import React, { useEffect, useState } from 'react';
import FlashMessage from 'react-native-flash-message';
import 'moment/locale/id';
import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider } from 'native-base';
import Router from './router';
import useAuthStore from './store/authStore';
import useUserStore from './store/userStore';
import { getDataLocal, storeData } from './utils/localStorage';
import { getData } from './utils/getData';
import { setAuthToken } from './config/api';
import { postWithJson } from './utils/postData';
import { showError } from './utils/showMessages';

const App = () => {
  const { setIsLogin } = useAuthStore();
  const { setUserData } = useUserStore();
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const dataToken = await getDataLocal('token');

      if (dataToken === undefined) {
        return;
      }
      setAuthToken(dataToken?.accessToken);
      const resp = await getData('/auth/check-auth');
      switch (resp.message) {
        case 'UNAUTHORIZED':
          setIsLogin(false);
          console.log('Logout 1');
          showError('Sesi anda telah berakhir, silahkan login kembali');
          break;
        case 'TOKEN_EXPIRED':
          setExpired(true);
          const respRefresh = await postWithJson('/auth/refresh-token', {
            refreshToken: dataToken?.refreshToken,
          });
          if (respRefresh?.message === 'TOKEN_EXPIRED') {
            setExpired(true);
            setIsLogin(false);
            showError('Sesi anda telah berakhir, silahkan login kembali');
            removeLocalStorage('token');
            console.log('Logout 2');
          } else if (respRefresh?.message === 'REFRESH_TOKEN_SUCCESS') {
            setExpired(false);
            storeData('token', {
              accessToken: respRefresh?.data?.access_token,
              refreshToken: dataToken?.refreshToken,
            });
            setAuthToken(respRefresh?.data?.access_token);
            setIsLogin(true);
          }
          break;
        case 'USER_FOUND':
          setUserData(resp.data);
          setIsLogin(true);
          storeData('role', {
            role: resp?.data?.id_role,
          });
          break;
        default:
          setIsLogin(false);
          break;
      }
    };

    checkAuth();
  }, [setIsLogin, setUserData, expired]);

  return (
    <>
      <NavigationContainer>
        <NativeBaseProvider>
          <Router />
        </NativeBaseProvider>
      </NavigationContainer>
      <FlashMessage position="top" />
    </>
  );
};

export default App;
