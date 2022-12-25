import { Dimensions } from 'react-native';
import { Text } from 'native-base';
import React from 'react';
import { fonts } from '../../utils/fonts';

const ErrorInput = ({ error }) => {
  const { width } = Dimensions.get('window');

  return (
    <Text
      fontFamily={fonts.primary.normal}
      color="red.600"
      fontSize={width / 36}
    >
      {error}
    </Text>
  );
};

export default ErrorInput;
