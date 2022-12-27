import React from 'react';
import { HStack, Text } from 'native-base';
import { Dimensions } from 'react-native';
import { colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';

const Badge = ({ title, type, icon }) => {
  const { width } = Dimensions.get('window');

  return (
    <HStack alignItems="center" space={2} bgColor={colors.blue[10]} rounded={12} px={2} py={0.5}>
      <Text fontSize={width / 36} fontFamily={fonts.primary[500]} textTransform="capitalize">
        {title}
      </Text>
      {type === 'rating' && icon}
    </HStack>
  );
};

export default Badge;
