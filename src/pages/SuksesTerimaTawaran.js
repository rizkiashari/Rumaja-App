import { StyleSheet, Dimensions } from 'react-native';
import React from 'react';
import { Box, VStack, View } from 'native-base';
import { Button, PesanSukses } from '../components';
import { ILTerimaBekerja } from '../assets';
import { colors } from '../utils/colors';

const SuksesTerimaTawaran = ({ navigation, route }) => {
  const { width, height } = Dimensions.get('window');

  const { title, subTitle } = route.params;

  const menujuBeranda = () => navigation.navigate('MainApp');

  return (
    <View bgColor={colors.white} minH={height}>
      <VStack justifyContent="space-between" height={height / 1.14} px={width / 28}>
        <Box height={height / 2} mt={20} justifyContent="center">
          <PesanSukses w={width / 1.6} h={width / 1.6} title={title} subTitle={subTitle} uriImage={ILTerimaBekerja} />
        </Box>
        <Button type="primary" fontSize={width} text="Kembali" onPress={menujuBeranda} />
      </VStack>
    </View>
  );
};

export default SuksesTerimaTawaran;

const styles = StyleSheet.create({});
