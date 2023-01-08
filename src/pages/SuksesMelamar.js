import { Dimensions } from 'react-native';
import React from 'react';
import { Box, VStack, View } from 'native-base';
import { colors } from '../utils/colors';
import { Button, PesanSukses } from '../components';
import { ILTerimaDiproses2 } from '../assets';

const SuksesMelamar = ({ navigation }) => {
  const { width, height } = Dimensions.get('window');

  const menujuBeranda = () => navigation.navigate('MainApp');

  return (
    <View bgColor={colors.white} minH={height}>
      <VStack justifyContent="space-between" height={height / 1.14} px={width / 28}>
        <Box height={height / 2} mt={20} justifyContent="center">
          <PesanSukses
            w={width / 1.6}
            h={width / 1.6}
            title="Selamat! Lamaran Berhasil Terkirim"
            subTitle="Menunggu konfirmasi penyedia. Pantau terus progres dan notifikasi untuk informasi lebih lanjut!"
            uriImage={ILTerimaDiproses2}
          />
        </Box>
        <Button type="primary" fontSize={width} text="Kembali" onPress={menujuBeranda} />
      </VStack>
    </View>
  );
};

export default SuksesMelamar;
