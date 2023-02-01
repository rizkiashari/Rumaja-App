import { Dimensions, StyleSheet } from 'react-native';
import React from 'react';
import { Box, VStack, View } from 'native-base';
import { ILTerimaDiproses } from '../assets';
import { colors } from '../utils/colors';
import { Button, PesanSukses } from '../components';

const SuksesTerimaPelamar = ({ navigation }) => {
  const { width, height } = Dimensions.get('window');

  const menujuBeranda = () => navigation.navigate('MainApp');

  return (
    <View bgColor={colors.white} minH={height}>
      <VStack justifyContent="space-between" height={height / 1.14} px={width / 28}>
        <Box height={height / 2} mt={20} justifyContent="center">
          <PesanSukses
            w={width / 1.6}
            h={width / 1.6}
            title="Pelamar berhasil diterima!"
            subTitle="Menunggu konfirmasi pelamar. Waktu Wawancara dan catatan yang anda minta telah dikirim ke pelamar."
            uriImage={ILTerimaDiproses}
          />
        </Box>
        <Button type="primary" fontSize={width} text="Kembali" onPress={menujuBeranda} />
      </VStack>
    </View>
  );
};

export default SuksesTerimaPelamar;

const styles = StyleSheet.create({});
