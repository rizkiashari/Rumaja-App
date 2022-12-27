import { Box, Text, VStack, View } from 'native-base';
import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { colors } from '../utils/colors';
import { Button, PesanSukses } from '../components';
import { ILTerimaDiproses } from '../assets';

const SuksesTawaranTerkirim = ({ navigation }) => {
  const { width, height } = Dimensions.get('window');

  const menujuBeranda = () => navigation.navigate('MainApp');

  return (
    <View bgColor={colors.white} style={styles.container} minH={height}>
      <VStack justifyContent="space-between" height={height / 1.14} px={width / 28}>
        <Box height={height / 2} mt={20} justifyContent="center">
          <PesanSukses
            w={width / 1.6}
            h={width / 1.6}
            title="Tawaran anda sudah terkirim!"
            subTitle="Tawaran anda sudah terkirim ke pelamar, silahkan tunggu konfirmasi dari pelamar."
            uriImage={ILTerimaDiproses}
          />
        </Box>
        <Button type="primary" fontSize={width} text="Kembali ke Beranda" onPress={menujuBeranda} />
      </VStack>
    </View>
  );
};

export default SuksesTawaranTerkirim;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
