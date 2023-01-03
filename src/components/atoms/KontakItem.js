import { Box, HStack, Image, Text, VStack } from 'native-base';
import React from 'react';
import { Dimensions } from 'react-native';
import { colors } from '../../utils/colors';
import { ILEmail, ILWA } from '../../assets';
import { fonts } from '../../utils/fonts';

const KontakItem = ({ nomor, email }) => {
  const { width } = Dimensions.get('window');

  return (
    <VStack space={2}>
      <HStack space={3} alignItems="center">
        <Box w={12} h={12} rounded="full" px={2} py={2} alignItems="center" justifyContent="center" bgColor={colors.blue[30]}>
          <Image source={ILWA} w={6} h={6} alt="Icon Whatsapp" />
        </Box>
        <VStack space={0.5}>
          <Text fontFamily={fonts.primary[500]} fontSize={width / 32} color="black">
            Nomor Telepon
          </Text>
          <HStack space={1.5}>
            <Text fontFamily={fonts.primary[400]} fontSize={width / 36} color={colors.text.black70}>
              {nomor}
            </Text>
          </HStack>
        </VStack>
      </HStack>
      <HStack space={3} alignItems="center">
        <Box w={12} h={12} rounded="full" px={2} py={2} alignItems="center" justifyContent="center" bgColor={colors.blue[30]}>
          <Image source={ILEmail} w={6} h={5} alt="Icon Email" />
        </Box>
        <VStack space={0.5}>
          <Text fontFamily={fonts.primary[500]} fontSize={width / 32} color="black">
            Email
          </Text>
          <HStack space={1.5}>
            <Text fontFamily={fonts.primary[400]} fontSize={width / 36} color={colors.text.black70}>
              {email}
            </Text>
          </HStack>
        </VStack>
      </HStack>
    </VStack>
  );
};

export default KontakItem;
