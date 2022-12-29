import { Dimensions } from 'react-native';
import React from 'react';
import { View, Box, VStack } from 'native-base';
import { ILSuksesGantiPass } from '../assets';
import { Button, PesanSukses } from '../components';
import { colors } from '../utils/colors';

const SuksesGantiPassword = ({ navigation }) => {
  const { width, height } = Dimensions.get('window');

  const menujuPengaturan = () => navigation.navigate('Pengaturan');

  return (
    <View bgColor={colors.white} minH={height}>
      <VStack justifyContent="space-between" height={height / 1.14} px={width / 28}>
        <Box height={height / 2} mt={20} justifyContent="center">
          <PesanSukses
            w={width / 1.6}
            h={width / 1.6}
            title="Selamat kata sandi anda berhasil diubah"
            subTitle="Kata sandi anda berhasil di ubah, saat ini anda dapat menggunakan kata sandi baru anda"
            uriImage={ILSuksesGantiPass}
          />
        </Box>
        <Button type="primary" fontSize={width} text="Kembali ke Pengaturan" onPress={menujuPengaturan} />
      </VStack>
    </View>
  );
};

export default SuksesGantiPassword;
