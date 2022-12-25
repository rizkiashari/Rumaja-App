import { Dimensions } from 'react-native';
import React from 'react';
import { HStack, Heading, Spinner } from 'native-base';
import { fonts } from '../../utils/fonts';
import { colors } from '../../utils/colors';

const LoadingButton = () => {
  const { width } = Dimensions.get('window');

  return (
    <HStack space={2} alignItems="center" justifyContent="center">
      <Spinner size={width / 20} />
      <Heading
        color={colors.blue[70]}
        fontFamily={fonts.primary[400]}
        fontSize={width / 28}
      >
        Loading
      </Heading>
    </HStack>
  );
};

export default LoadingButton;
