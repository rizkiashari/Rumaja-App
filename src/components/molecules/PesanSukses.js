import { Dimensions } from 'react-native';
import React from 'react';
import { Image, Text, VStack } from 'native-base';
import { fonts } from '../../utils/fonts';
import { colors } from '../../utils/colors';

const PesanSukses = ({ title, subTitle, uriImage, h, w }) => {
  const { width, height } = Dimensions.get('window');

  return (
    <VStack alignItems="center" space={width / 20} height={height / 2}>
      <Image source={uriImage} alt="Image URL" width={w} height={h} />

      <VStack alignItems="center" space={width / 40}>
        <Text fontFamily={fonts.primary[600]} fontSize={width / 24} color="black">
          {title}
        </Text>
        <Text fontFamily={fonts.primary[400]} fontSize={width / 32} color={colors.text.black70} textAlign="center">
          {subTitle}
        </Text>
      </VStack>
    </VStack>
  );
};

export default PesanSukses;
