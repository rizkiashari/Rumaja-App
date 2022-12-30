import { Dimensions, StyleSheet } from 'react-native';
import React from 'react';
import { Box, VStack, View } from 'native-base';
import { colors } from '../utils/colors';
import { Button, PesanSukses } from '../components';
import { ILTolakDiproses } from '../assets';

const SuksesTolakPelamar = ({ navigation, route }) => {
  const { width, height } = Dimensions.get('window');

  const { title, subTitle } = route.params;

  const menujuProgres = () => navigation.navigate('MainApp');

  return (
    <View bgColor={colors.white} minH={height}>
      <VStack justifyContent="space-between" height={height / 1.14} px={width / 28}>
        <Box height={height / 2} mt={20} justifyContent="center">
          <PesanSukses w={width / 1.6} h={width / 1.6} title={title} subTitle={subTitle} uriImage={ILTolakDiproses} />
        </Box>
        <Button type="primary" fontSize={width} text="Kembali" onPress={menujuProgres} />
      </VStack>
    </View>
  );
};

export default SuksesTolakPelamar;

const styles = StyleSheet.create({});
