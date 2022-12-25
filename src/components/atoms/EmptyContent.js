import React from 'react';
import { Box, Image, Text } from 'native-base';
import { fonts } from '../../utils/fonts';
import { colors } from '../../utils/colors';
import { Dimensions } from 'react-native';

const EmptyContent = ({ image, title, subTitle }) => {
  const { width, height } = Dimensions.get('window');

  return (
    <Box minH={height / 2} justifyContent="center" alignItems="center">
      <Image source={image} width={width / 2} height={width / 2} resizeMode="contain" alt="img" />
      <Text fontFamily={fonts.primary[600]} mb="2" fontSize={14}>
        {title}
      </Text>
      <Text
        fontFamily={fonts.primary[400]}
        color={colors.text.black60}
        fontSize={14}
        textAlign="center"
        maxWidth={width / 1.3}
      >
        {subTitle}
      </Text>
    </Box>
  );
};

export default EmptyContent;
