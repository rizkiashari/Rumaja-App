import { Text } from 'native-base';
import React from 'react';
import { fonts } from '../../utils/fonts';
import { colors } from '../../utils/colors';
import { Dimensions } from 'react-native';

const LabelInput = ({ text }) => {
  const { width } = Dimensions.get('window');

  return (
    <Text fontFamily={fonts.primary.normal} color={colors.text.black70} fontSize={width / 32}>
      {text}
    </Text>
  );
};

export default LabelInput;
