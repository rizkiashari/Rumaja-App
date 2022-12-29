import { Dimensions, StyleSheet } from 'react-native';
import React from 'react';
import { Box, VStack, View } from 'native-base';
import { colors } from '../utils/colors';
import { Button, PesanSukses } from '../components';
import { ILTolakDiproses } from '../assets';

const SuksesTolakTawaran = ({ navigation }) => {
  const { width, height } = Dimensions.get('window');

  const menujuProgres = () => navigation.navigate('MainApp');

  return (
    <View bgColor={colors.white} minH={height}>
      <VStack justifyContent="space-between" height={height / 1.14} px={width / 28}>
        <Box height={height / 2} mt={20} justifyContent="center">
          <PesanSukses
            w={width / 1.6}
            h={width / 1.6}
            title="Tawaran berhasil ditolak"
            subTitle="Tawaran kerja yang anda dapat berhasil ditolak. Alasan penolakan telah dikirim ke penyedia kerja."
            uriImage={ILTolakDiproses}
          />
        </Box>
        <Button type="primary" fontSize={width} text="Kembali" onPress={menujuProgres} />
      </VStack>
    </View>
  );
};

export default SuksesTolakTawaran;

const styles = StyleSheet.create({});
