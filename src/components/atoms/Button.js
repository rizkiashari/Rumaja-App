import { StyleSheet } from 'react-native';
import React from 'react';
import { Text, Button as ButtonNativeBase } from 'native-base';
import { colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';

const Button = ({ onPress, width, text, type }) => {
  if (type === 'secondary') {
    return (
      <ButtonNativeBase style={styles.btnSecondary(width)}>
        <Text
          fontFamily={fonts.primary[500]}
          color={colors.blue[80]}
          fontSize={width / 30}
          textAlign="center"
        >
          {text}
        </Text>
      </ButtonNativeBase>
    );
  }

  return (
    <ButtonNativeBase style={styles.btnPrimary(width)} onPress={onPress}>
      <Text
        fontFamily={fonts.primary[500]}
        color={colors.white}
        fontSize={width / 30}
        textAlign="center"
      >
        {text}
      </Text>
    </ButtonNativeBase>
  );
};

export default Button;

const styles = StyleSheet.create({
  btnPrimary: (width) => ({
    width: width,
    backgroundColor: colors.blue[80],
    borderWidth: 1,
    borderColor: colors.blue[80],
    borderRadius: 8,
    paddingVertical: 8,
  }),
  btnSecondary: (width) => ({
    width: width,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.blue[80],
    borderRadius: 8,
    paddingVertical: 8,
  }),
});
