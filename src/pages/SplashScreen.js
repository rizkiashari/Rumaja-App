import { Dimensions, SafeAreaView, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { Image, Text, View } from 'native-base';
import { ILLogoRumaja } from '../assets';
import { colors } from '../utils/colors';
import { fonts } from '../utils/fonts';
import useAuthStore from '../store/authStore';

const SplashScreen = () => {
  const { width, height } = Dimensions.get('window');
  const { setSplashScreen } = useAuthStore();

  useEffect(() => {
    setTimeout(() => {
      setSplashScreen(false);
    }, 500);
  }, [setSplashScreen]);

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.content(width, height)}>
        <Image source={ILLogoRumaja} alt="Logo Rumaja" width={24} height={24} />
      </View>
      <Text mt={3} color={colors.white} fontSize={24} fontFamily={fonts.primary[700]}>
        Rumaja
      </Text>
    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#3A5088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: (width, height) => ({
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    width: width / 2.8,
    height: width / 2.8,
  }),
});
