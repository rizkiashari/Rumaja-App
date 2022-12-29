import { StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { Text, Button as ButtonNativeBase, HStack } from 'native-base';
import { colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';
import { ChevronRight } from '../../assets';

const Button = ({ onPress, width, text, type, fontSize, bgColor }) => {
  if (type === 'secondary') {
    return (
      <ButtonNativeBase onPress={onPress} style={styles.btnSecondary(width)}>
        <Text fontFamily={fonts.primary[500]} color={colors.blue[80]} fontSize={fontSize / 28} textAlign="center">
          {text}
        </Text>
      </ButtonNativeBase>
    );
  }

  if (type === 'bg-white') {
    return (
      <TouchableOpacity onPress={onPress}>
        <HStack justifyContent="space-between" px="4" rounded={8} py="3" alignItems="center" bgColor={colors.white}>
          <Text fontFamily={fonts.primary[500]} color="black" fontSize={fontSize / 28}>
            {text}
          </Text>
          <ChevronRight width={28} />
        </HStack>
      </TouchableOpacity>
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

  if (type === 'red-border') {
    return (
      <ButtonNativeBase style={styles.btnReset(width)} onPress={onPress}>
        <Text color="#C86161" fontSize={fontSize / 28} textAlign="center" fontFamily={fonts.primary[500]}>
          {text}
        </Text>
      </ButtonNativeBase>
    );
  }

  if (type === 'progres') {
    return (
      <ButtonNativeBase
        borderWidth={2}
        borderColor={bgColor}
        borderRadius={8}
        paddingVertical={8}
        backgroundColor={bgColor}
        width={width}
        onPress={onPress}
      >
        <Text color={colors.white} fontSize={fontSize / 28} textAlign="center" fontFamily={fonts.primary[500]}>
          {text}
        </Text>
      </ButtonNativeBase>
    );
  }

  return (
    <ButtonNativeBase style={styles.btnPrimary(width)} onPress={onPress}>
      <Text fontFamily={fonts.primary[500]} color={colors.white} fontSize={fontSize / 28} textAlign="center">
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
    borderWidth: 2,
    borderColor: colors.blue[80],
    borderRadius: 8,
    paddingVertical: 8,
  }),
  btnSecondary: (width) => ({
    width: width,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.blue[80],
    borderRadius: 8,
    paddingVertical: 8,
  }),
  btnKeluar: (width) => ({
    backgroundColor: 'transparent',
    borderRadius: 8,
    paddingVertical: width / 44,
    width: width,
    borderWidth: 2,
    borderColor: colors.red,
  }),
  btnReset: (width) => ({
    backgroundColor: colors.white,
    width: width,
    borderColor: '#C86161',
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 8,
  }),
});
