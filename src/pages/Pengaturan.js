import { StyleSheet, SafeAreaView, Dimensions, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { HStack, Text, VStack, View } from 'native-base';
import { colors } from '../utils/colors';
import { Button, Header } from '../components';
import { ChevronBack } from '../assets';
import { fonts } from '../utils/fonts';
import useUserStore from '../store/userStore';
import { showError, showSuccess } from '../utils/showMessages';
import { useFilterHome, useFilterTersimpan } from '../store/filterHome';
import useAuthStore from '../store/authStore';
import { getDataLocal, removeLocalStorage } from '../utils/localStorage';
import { postWithJson } from '../utils/postData';

const Pengaturan = ({ navigation }) => {
  const { width, height } = Dimensions.get('window');

  const [refreshToken, setRefreshToken] = useState('');

  const isFocused = navigation.isFocused();

  const { setUserData, userData, setIsBoarding } = useUserStore();
  const { setFilterHome } = useFilterHome();
  const { setFilterTersimpan } = useFilterTersimpan();
  const { setIsLogin } = useAuthStore();

  const logout = async () => {
    const respon = await postWithJson('/auth/logout', {
      refreshToken,
    });
    if (respon.message === 'LOGOUT_SUCCESS') {
      removeLocalStorage('token');
      removeLocalStorage('role');
      setIsLogin(false);
      setUserData(null);
      setFilterHome(null);
      setFilterTersimpan(null);
      setIsBoarding(false);
      showSuccess('Berhasil Logout');
    } else {
      showError('Gagal Logout');
    }
  };

  useEffect(() => {
    getDataLocal('token').then((res) => {
      if (res) {
        setRefreshToken(res.refreshToken);
      }
    });
  }, [isFocused]);

  return (
    <SafeAreaView>
      <View bgColor={colors.text.black10} minH={height}>
        <Header>
          <HStack space={4}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ChevronBack width={28} />
            </TouchableOpacity>
            <Text fontFamily={fonts.primary[600]} fontSize={width / 24} color="black">
              Pengaturan
            </Text>
          </HStack>
        </Header>
        <View px={width / 28} pt={height / 40}>
          <VStack space={4}>
            <TouchableOpacity onPress={() => navigation.navigate('EditProfil')}>
              <Button type="bg-white" text="Edit Profil" fontSize={width} />
            </TouchableOpacity>
            {userData?.id_role === 3 && (
              <TouchableOpacity onPress={() => navigation.navigate('LowonganTerhapus')}>
                <Button type="bg-white" text="Lowongan Terhapus" fontSize={width} />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => navigation.navigate('UbahKataSandi')}>
              <Button type="bg-white" text="Ubah Kata Sandi" fontSize={width} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('TentangKami')}>
              <Button type="bg-white" text="Tentang Kami" fontSize={width} />
            </TouchableOpacity>
          </VStack>
        </View>
        <VStack mt={height / 15} space={4} alignItems="center">
          <Button text="Keluar" type="logout" width={width / 1.1} onPress={logout} />
          <Text fontFamily={fonts.primary[400]} color={colors.text.black50} fontSize={width / 32}>
            Versi 1.0
          </Text>
        </VStack>
      </View>
    </SafeAreaView>
  );
};

export default Pengaturan;

const styles = StyleSheet.create({});
