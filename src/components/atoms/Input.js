import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { Box, Input as InputNativeBase } from 'native-base';
import React, { useState } from 'react';
import { fonts } from '../../utils/fonts';
import { colors } from '../../utils/colors';
import { ShowPassword, HidePassword } from '../../assets';

const Input = ({ value, onChangeText, type, placeholder }) => {
  const { width } = Dimensions.get('window');

  const [showPassword, setShowPassword] = useState(false);

  if (type === 'password') {
    return (
      <Box position="relative">
        <InputNativeBase
          rounded={8}
          px={4}
          py={2}
          type={type === 'password' && showPassword ? 'text' : 'password'}
          borderColor={colors.text.black30}
          backgroundColor={colors.white}
          fontFamily={fonts.primary[500]}
          fontSize={width / 32}
          width="full"
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
        />
        {showPassword ? (
          <TouchableOpacity
            style={styles.actionPassword(width)}
            onPress={() => setShowPassword(!showPassword)}
          >
            <ShowPassword />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.actionPassword(width)}
            onPress={() => setShowPassword(!showPassword)}
          >
            <HidePassword />
          </TouchableOpacity>
        )}
      </Box>
    );
  }

  return (
    <InputNativeBase
      rounded={8}
      px={4}
      py={2}
      type={type}
      keyboardType={type === 'email' ? 'email-address' : 'default'}
      borderColor={colors.text.black30}
      backgroundColor={colors.white}
      fontFamily={fonts.primary[500]}
      fontSize={width / 32}
      width="full"
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
    />
  );
};

export default Input;

const styles = StyleSheet.create({
  actionPassword: (dimensiWidth) => ({
    position: 'absolute',
    right: dimensiWidth / 38,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  }),
});