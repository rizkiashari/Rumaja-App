import React from 'react';
import { TextArea as TextAreaNativeBase } from 'native-base';
import { Dimensions } from 'react-native';
import { fonts } from '../../utils/fonts';
import { colors } from '../../utils/colors';

const TextArea = ({ placeholder, value, onChangeText }) => {
  const { width, height } = Dimensions.get('window');

  return (
    <TextAreaNativeBase
      placeholder={placeholder}
      rounded={8}
      px="3"
      fontFamily={fonts.primary[500]}
      borderColor={colors.text.black30}
      backgroundColor={colors.white}
      py="2"
      _focus={{ borderColor: colors.blue[80] }}
      fontSize={width / 30}
      w="100%"
      h={height / 6}
      value={value}
      onChangeText={onChangeText}
    />
  );
};

export default TextArea;
