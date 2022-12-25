import { StyleSheet } from 'react-native';
import React from 'react';
import { Text, Button as ButtonNativeBase, HStack } from 'native-base';
import { colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';
import { ChevronRight } from '../../assets';

const Button = ({ onPress, width, text, type, fontSize }) => {
  if (type === 'secondary') {
    return (
      <ButtonNativeBase onPress={onPress} style={styles.btnSecondary(width)}>
        <Text fontFamily={fonts.primary[500]} color={colors.blue[80]} fontSize={fontSize / 30} textAlign="center">
          {text}
        </Text>
      </ButtonNativeBase>
    );
  }

  if (type === 'bg-white') {
    return (
      <HStack justifyContent="space-between" px="4" rounded={8} py="3" alignItems="center" bgColor={colors.white}>
        <Text fontFamily={fonts.primary[500]} color="black" fontSize={fontSize / 28}>
          {text}
        </Text>
        <ChevronRight width={28} />
      </HStack>
    );
  }

  if (type === 'logout') {
    return (
      <ButtonNativeBase onPress={onPress} style={styles.btnKeluar(width)}>
        <Text fontFamily={fonts.primary[500]} fontSize={width / 28} color={colors.red} textAlign="center">
          {text}
        </Text>
      </ButtonNativeBase>
    );
  }

  return (
    <ButtonNativeBase style={styles.btnPrimary(width)} onPress={onPress}>
      <Text fontFamily={fonts.primary[500]} color={colors.white} fontSize={fontSize / 30} textAlign="center">
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
  btnKeluar: (width) => ({
    backgroundColor: 'transparent',
    borderRadius: 8,
    paddingVertical: width / 44,
    width: width,
    borderWidth: 1,
    borderColor: colors.red,
  }),
});
