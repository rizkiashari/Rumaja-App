import { Dimensions, TouchableOpacity } from 'react-native';
import React from 'react';
import useUserStore from '../../store/userStore';
import { Box, HStack, Image, Text, VStack } from 'native-base';
import { colors } from '../../utils/colors';
import { ILPlaceholder } from '../../assets';
import { fonts } from '../../utils/fonts';

const Tawarkan = ({ id, title, kota, provinsi, children, photo }) => {
  const { width } = Dimensions.get('window');

  const { dataPekerjaan, setDataPekerjaan } = useUserStore();

  return (
    <TouchableOpacity
      onPress={() => {
        setDataPekerjaan(id);
      }}
    >
      <Box
        borderColor={id === dataPekerjaan ? colors.blue[70] : colors.white}
        borderWidth={id === dataPekerjaan ? 2 : 0}
        bgColor={colors.white}
        rounded={8}
        px={5}
        py={4}
      >
        <VStack space={4}>
          <HStack justifyContent="space-between">
            <HStack space={3} alignItems="center">
              <Box w={12} h={12} rounded="full" alignItems="center" justifyContent="center" bgColor={colors.blue[30]}>
                <Image alt="photo profile" source={photo ? { uri: photo } : ILPlaceholder} width="8" height="8" rounded="full" />
              </Box>
              <VStack space={0.5}>
                <Text fontFamily={fonts.primary[600]} fontSize={width / 28} color="black">
                  {title}
                </Text>
                <HStack space={1.5}>
                  <Text fontFamily={fonts.primary[400]} fontSize={width / 36} color={colors.text.black70}>
                    {kota}
                  </Text>
                  <Text fontFamily={fonts.primary[400]} fontSize={width / 36} color={colors.text.black70}>
                    {provinsi}
                  </Text>
                </HStack>
              </VStack>
            </HStack>
          </HStack>
          <HStack justifyContent="space-between" alignItems="center">
            {children}
          </HStack>
        </VStack>
      </Box>
    </TouchableOpacity>
  );
};

export default Tawarkan;
