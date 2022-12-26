import React from 'react';
import { ILAddPekerjaan } from '../../assets';
import { Dimensions } from 'react-native';
import { fonts } from '../../utils/fonts';
import { Box, Button, Image, Text, VStack } from 'native-base';
import { colors } from '../../utils/colors';

const BoxAddPekerjaan = ({ onPress }) => {
  const { width, height } = Dimensions.get('window');

  return (
    <Box width="full" px={width / 24} py={4} rounded={10} mb={6} bgColor={colors.blue[90]} position="relative" height={height / 5.3}>
      <VStack w="1/2" maxW="full" space={3} justifyContent="space-between" height="full">
        <Text color="white" fontFamily={fonts.primary[500]}>
          Publikasikan lowongan pekerjaan Anda!
        </Text>
        <Button bgColor={colors.blue[50]} px={1} py={1.5} rounded={8} w={width / 2.4} onPress={onPress}>
          <Text fontFamily={fonts.primary[500]} color="white">
            Tambah Sekarang
          </Text>
        </Button>
      </VStack>
      <Image
        source={ILAddPekerjaan}
        width={width / 3.2}
        height={height / 4.8}
        alt="add pekerjaan"
        position="absolute"
        right={6}
        bottom={0}
        resizeMode="contain"
      />
    </Box>
  );
};

export default BoxAddPekerjaan;
