import { Dimensions, StyleSheet } from 'react-native';
import React from 'react';
import { Box, VStack, View } from 'native-base';
import { colors } from '../utils/colors';
import { ILBekerjaSelesai } from '../assets';
import { Button, PesanSukses } from '../components';

const SuksesMengakhiriPekerjaan = ({ navigation }) => {
  const { width, height } = Dimensions.get('window');

  const menujuBeranda = () => navigation.navigate('MainApp');

  return (
    <View bgColor={colors.white} minH={height}>
      <VStack justifyContent="space-between" height={height / 1.14} px={width / 28}>
        <Box height={height / 2} mt={20} justifyContent="center">
          <PesanSukses
            w={width / 1.6}
            h={width / 1.6}
            title="Berhasil mengakhiri pekerjaan"
            subTitle="Anda telah berhasil mengakhiri pekerjaan. Penilaian dan ulasan anda telah diterima."
            uriImage={ILBekerjaSelesai}
          />
        </Box>
        <Button type="primary" fontSize={width} text="Kembali" onPress={menujuBeranda} />
      </VStack>
    </View>
  );
};

export default SuksesMengakhiriPekerjaan;

const styles = StyleSheet.create({});
