import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { colors } from '../../utils/colors';
import { Box, HStack, Image, Text, VStack, View } from 'native-base';
import { ChevronRight, ILPlaceholder } from '../../assets';
import { fonts } from '../../utils/fonts';

const DaftarWithJumlah = ({ navDetail, subTitle, title, photo, daftar, total, daftarNavigate, children }) => {
  const { width } = Dimensions.get('window');

  return (
    <Box bgColor={colors.white} rounded={8}>
      <TouchableOpacity onPress={navDetail}>
        <VStack space={4} py={4} pl={5}>
          <HStack justifyContent="space-between">
            <HStack space={3} alignItems="center">
              <Box w={12} h={12} rounded="full" alignItems="center" justifyContent="center" bgColor={colors.blue[30]}>
                <Image alt="photo profile" source={photo ? { uri: photo } : ILPlaceholder} width="8" height="8" />
              </Box>
              <VStack space={0.5}>
                <Text fontFamily={fonts.primary[600]} fontSize={width / 28} color="black">
                  {title}
                </Text>
                <HStack space={1.5}>
                  <Text fontFamily={fonts.primary[400]} fontSize={width / 36} color={colors.text.black70} isTruncated maxW={width / 1.8} w="full">
                    {subTitle}
                  </Text>
                </HStack>
              </VStack>
            </HStack>
          </HStack>
          <HStack justifyContent="space-between" alignItems="center">
            {children}
          </HStack>
        </VStack>
      </TouchableOpacity>
      <View style={styles.lineStyle} />
      <TouchableOpacity onPress={daftarNavigate}>
        <HStack px={5} py={3} alignItems="center" justifyContent="space-between">
          <Text fontFamily={fonts.primary[500]} fontSize={width / 28} color="black">
            {daftar} ({total})
          </Text>
          <ChevronRight />
        </HStack>
      </TouchableOpacity>
    </Box>
  );
};

export default DaftarWithJumlah;

const styles = StyleSheet.create({
  lineStyle: {
    borderWidth: 0.5,
    borderColor: colors.text.black40,
  },
});
