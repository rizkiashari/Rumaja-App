import { Dimensions, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import { Box, Input as InputNativeBase } from 'native-base';
import React, { useState } from 'react';
import { fonts } from '../../utils/fonts';
import { colors } from '../../utils/colors';
import { ShowPassword, HidePassword } from '../../assets';

const Input = ({ value, onChangeText, type, placeholder, icon, onPress }) => {
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
          _focus={{ borderColor: colors.blue[80] }}
        />
        {showPassword ? (
          <TouchableOpacity style={styles.actionPassword(width)} onPress={() => setShowPassword(!showPassword)}>
            <ShowPassword />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.actionPassword(width)} onPress={() => setShowPassword(!showPassword)}>
            <HidePassword />
          </TouchableOpacity>
        )}
      </Box>
    );
  }

  if (type === 'waktu') {
    return (
      <Pressable onPress={onPress} position="relative">
        <InputNativeBase
          rounded={8}
          px={4}
          py={2}
          keyboardType="numeric"
          borderColor={colors.text.black30}
          backgroundColor={colors.white}
          fontFamily={fonts.primary[500]}
          fontSize={width / 32}
          width="full"
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          _focus={{ borderColor: colors.blue[80] }}
          editable={false}
        />
        <Box position="absolute" justifyContent="center" right={width / 24} top={0} bottom={0}>
          {icon}
        </Box>
      </Pressable>
    );
  }

  return (
    <InputNativeBase
      rounded={8}
      px={4}
      py={2}
      type={type}
      keyboardType={type === 'email' ? 'email-address' : type === 'number' ? 'numeric' : 'default'}
      borderColor={colors.text.black30}
      backgroundColor={colors.white}
      fontFamily={fonts.primary[500]}
      _focus={{ borderColor: colors.blue[80] }}
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
