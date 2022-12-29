import { Box, Image, Text, VStack } from 'native-base';
import React from 'react';
import { Dimensions } from 'react-native';
import { ILPlaceholder } from '../../assets';
import { fonts } from '../../utils/fonts';
import { colors } from '../../utils/colors';

const TopProfile = ({ title, subtitle, type, bubble, photo, photoWidth, photoHeight }) => {
  const { width } = Dimensions.get('window');

  return (
    <VStack mb={2} p={width / 20} bgColor="white" space={2} alignItems="center">
      <Box w={20} h={20} alignItems="center" justifyContent="center" backgroundColor={colors.blue[30]} rounded="full">
        <Image alt="photo profile" source={photo ? { uri: photo } : ILPlaceholder} width={photoWidth} height={photoHeight} rounded="full" />
      </Box>
      <VStack space={1} alignItems="center">
        <Text fontFamily={fonts.primary[600]} maxW={width / 1.1} isTruncated fontSize={width / 28} color="black" textTransform="capitalize">
          {title}
        </Text>
        <Text fontFamily={fonts.primary[400]} fontSize={width / 32} color={colors.text.black70} numberOfLines={1}>
          {subtitle}
        </Text>
      </VStack>
      {type === 'pekerja' ? bubble : null}
    </VStack>
  );
};

export default TopProfile;
