import { Dimensions, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Box, Center, Image, Text, ScrollView, VStack, HStack } from 'native-base';
import { colors } from '../utils/colors';
import { fonts } from '../utils/fonts';
import { ILLogin } from '../assets';
import { Button, Divider, ErrorInput, Input, LoadingButton } from '../components';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import useAuthStore from '../store/authStore';
import useUserStore from '../store/userStore';
import { postWithJson } from '../utils/postData';
import { storeData } from '../utils/localStorage';
import { showError, showSuccess } from '../utils/showMessages';
import { setAuthToken } from '../config/api';
import { getData } from '../utils/getData';

const Login = ({ navigation }) => {
  const { height, width } = Dimensions.get('window');

  const { setIsLogin } = useAuthStore();
  const { setUserData } = useUserStore();

  const [isLoading, setIsLoading] = useState(false);

  const menujuLupaKataSandi = () => {
    navigation.navigate('LupaKataSandi');
  };

  const menujuPilihPeran = () => navigation.navigate('PilihPeran');

  const login = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validateOnChange: true,
    validationSchema: Yup.object({
      email: Yup.string().email('Email tidak valid').required('Email tidak boleh kosong'),
      password: Yup.string().required('Password tidak boleh kosong'),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      const res = await postWithJson('/auth/login', values);
      setIsLoading(false);
      switch (res.message) {
        case 'PASSWORD_NOT_MATCH':
          showError('Email atau password yang anda masukkan salah');
          break;
        case 'USER_NOT_FOUND':
          showError('Email atau password yang anda masukkan salah');
          break;
        case 'LOGIN_SUCCESS':
          storeData('token', { accessToken: res.data.access_token, refreshToken: res.data.refresh_token });
          setAuthToken(res.data.access_token);
          const resCheckAuth = await getData('/auth/check-auth');
          setUserData(resCheckAuth.data);
          showSuccess('Login berhasil');
          login.resetForm();
          setTimeout(() => {
            setIsLogin(true);
          }, 1000);
          break;
        default:
          showError(res.message);
          break;
      }
    },
  });

  return (
    <ScrollView showsVerticalScrollIndicator={false} bgColor={colors.white} height={height}>
      <Box pt={height / 20} pb={4} px={width / 28}>
        <VStack space={6}>
          <VStack space={5} justifyContent="center" alignItems="center">
            <Center>
              <Image source={ILLogin} alt="Login" width={width / 2} height={height / 3.5} />
            </Center>
            <Text fontFamily={fonts.primary[700]} color={colors.text.black100} fontSize={width / 20}>
              Masuk Rumaja
            </Text>
          </VStack>
          <VStack space={2}>
            <Text fontFamily={fonts.primary.normal} color={colors.text.black70} fontSize={width / 32}>
              Alamat Email
            </Text>
            <Input type="email" placeholder="Masukkan alamat email" value={login.values.email} onChangeText={login.handleChange('email')} />
            {login.touched.email && login.errors.email ? <ErrorInput error={login.errors.email} /> : null}
          </VStack>
          <VStack space={2}>
            <Text fontFamily={fonts.primary.normal} color={colors.text.black70} fontSize={width / 32}>
              Kata Sandi
            </Text>
            <Input type="password" placeholder="Masukkan kata sandi" value={login.values.password} onChangeText={login.handleChange('password')} />
            {login.touched.password && login.errors.password ? <ErrorInput error={login.errors.password} /> : null}
          </VStack>
          <VStack space={5} alignItems="center" justifyContent="center">
            {!isLoading ? (
              <Button type="primary" onPress={login.handleSubmit} text="Masuk" width={width / 1.1} fontSize={width} />
            ) : (
              <LoadingButton />
            )}
            <HStack space={1} alignItems="center" justifyContent="center">
              <Text fontFamily={fonts.primary[500]} fontSize={width / 35}>
                Lupa kata sandi?
              </Text>
              <TouchableOpacity onPress={menujuLupaKataSandi}>
                <Text color={colors.blue[60]} fontFamily={fonts.primary[500]} fontSize={width / 35}>
                  Klik disini
                </Text>
              </TouchableOpacity>
            </HStack>
            <HStack space={6} alignItems="center" justifyContent="center">
              <Divider />
              <Text fontFamily={fonts.primary[400]} color={colors.text.black70} fontSize="xs" textAlign="center" fontWeight="thin" width={width / 7}>
                atau
              </Text>
              <Divider />
            </HStack>
            <Button type="secondary" onPress={menujuPilihPeran} text="Buat Akun" width={width / 1.1} fontSize={width} />
          </VStack>
        </VStack>
      </Box>
    </ScrollView>
  );
};

export default Login;
