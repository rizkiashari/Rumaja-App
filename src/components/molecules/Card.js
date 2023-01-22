import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { Box, HStack, Image, Text, VStack } from 'native-base';
import { colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';
import {
  BekerjaIcon,
  DiprosesIcon,
  DitolakIcon,
  ILArt,
  ILPengasuh,
  ILSopirPribadi,
  ILTukangKebun,
  SelesaiIcon,
  TersimpanActive,
  UnSaved,
} from '../../assets';

const Card = ({
  type,
  uriImage,
  title,
  subTitle,
  detailContent,
  time,
  id,
  onSaved,
  onNavigation,
  dataSave,
  children,
  lokasi,
  icon,
  statusProgress,
  uriType,
}) => {
  const { width } = Dimensions.get('window');

  const IconCustom = () => {
    if (statusProgress === 'Diproses') return <DiprosesIcon />;
    if (statusProgress === 'Bekerja') return <BekerjaIcon />;
    if (statusProgress === 'Berakhir') return <SelesaiIcon />;
    if (statusProgress === 'Ditolak') return <DitolakIcon />;

    return <DiprosesIcon />;
  };

  if (type === 'notif') {
    return (
      <HStack alignItems="flex-start" w="full" space={4}>
        {uriType === 'pekerja' ? (
          <Box alignItems="center" justifyContent="center">
            <Image alt="photo profile" source={uriImage} w={12} h={12} rounded="full" />
          </Box>
        ) : (
          <Box w={12} h={12} rounded="full" alignItems="center" justifyContent="center" bgColor={colors.blue[30]}>
            <Image alt="photo profile" source={uriImage} width="8" height="8" />
          </Box>
        )}
        <VStack>
          <Text fontFamily={fonts.primary[600]} fontSize={width / 28} color="black" width={width / 1.5} mb={1}>
            {title}
          </Text>
          <Text fontFamily={fonts.primary[400]} fontSize={width / 30} width={width / 1.5} color={colors.text.black60}>
            {subTitle}
          </Text>
          <Text fontFamily={fonts.primary[400]} fontSize={width / 30} width={width / 1.5} mt={1} color={colors.text.black50}>
            {detailContent}
          </Text>
          <Text fontFamily={fonts.primary[500]} fontSize={width / 36} width={width / 1.5} mt={2} color={colors.text.black80}>
            {time}
          </Text>
        </VStack>
      </HStack>
    );
  }

  if (type === 'bidang') {
    return (
      <VStack alignItems="center" bgColor={colors.white} space={width / 40} w={width / 4.8} p={3.5} rounded={10} h={width / 3.8}>
        <Box bgColor={colors.blue[30]} w={width / 7} h={width / 10} rounded={4} px={2} py={1} alignItems="center" justifyContent="center">
          {id === 1 ? (
            <Image source={ILArt} width={8} height={8} alt="ART Icon" />
          ) : id === 2 ? (
            <Image source={ILPengasuh} width={8} height={8} alt="Pengasuh Icon" />
          ) : id === 3 ? (
            <Image source={ILSopirPribadi} width={8} height={8} alt="Supier Pribadi Icon" />
          ) : (
            <Image source={ILTukangKebun} width={8} height={8} alt="Tukang Kebun Icon" />
          )}
        </Box>
        <Text fontFamily={fonts.primary[400]} fontSize={width / 40} color="black" textAlign="center">
          {id === 1 ? title : subTitle}
        </Text>
      </VStack>
    );
  }

  if (type === 'pengalaman') {
    return (
      <HStack justifyContent="space-between" bgColor={colors.white} rounded={8} px={5} py={4}>
        <HStack space={3} alignItems="center">
          <VStack space={0.5}>
            <Text fontFamily={fonts.primary[600]} fontSize={width / 28} color="black">
              {title}
            </Text>
            <Text fontFamily={fonts.primary[400]} fontSize={width / 36} color={colors.text.black70}>
              {subTitle}
            </Text>
            {lokasi && (
              <Text fontFamily={fonts.primary[400]} fontSize={width / 36} color={colors.text.black70}>
                {lokasi}
              </Text>
            )}
          </VStack>
        </HStack>
        {icon}
      </HStack>
    );
  }

  if (type === 'detail') {
    return (
      <VStack space={2} bgColor={colors.white} rounded={8} px={5} py={4}>
        <Text fontFamily={fonts.primary[600]} fontSize={width / 28} color="black">
          {title}
        </Text>
        {children}
      </VStack>
    );
  }

  if (type === 'ulasan') {
    return (
      <VStack space={4} bgColor={colors.white} rounded={8} px={5} py={4}>
        <HStack space={3}>
          {uriType === 'pekerja' ? (
            <Box alignItems="center" justifyContent="center">
              <Image alt="photo profile" source={uriImage} w={12} h={12} rounded="full" />
            </Box>
          ) : (
            <Box w={12} h={12} rounded="full" alignItems="center" justifyContent="center" bgColor={colors.blue[30]}>
              <Image alt="photo profile" source={uriImage} width="8" height="8" />
            </Box>
          )}
          <VStack space={0.5}>
            <Text fontFamily={fonts.primary[600]} fontSize={width / 28} color="black">
              {title}
            </Text>
            <Text fontFamily={fonts.primary[400]} fontSize={width / 36} color={colors.text.black70} maxW={width / 1.54} w="full">
              {subTitle}
            </Text>
          </VStack>
        </HStack>
        {children}
      </VStack>
    );
  }

  if (type === 'progres') {
    return (
      <TouchableOpacity onPress={onNavigation}>
        <Box bgColor={colors.white} rounded={8}>
          <VStack space={2} py={4} pl={5}>
            <HStack justifyContent="space-between">
              <HStack space={2} alignItems="center">
                <Box bgColor={colors.blue[30]} w={12} h={12} rounded="full" px={2} py={1} alignItems="center" justifyContent="center">
                  {id === 1 ? (
                    <Image source={ILArt} width={8} height={8} alt="ART Icon" />
                  ) : id === 2 ? (
                    <Image source={ILPengasuh} width={8} height={8} alt="Pengasuh Icon" />
                  ) : id === 3 ? (
                    <Image source={ILSopirPribadi} width={8} height={8} alt="Supier Pribadi Icon" />
                  ) : id === 4 ? (
                    <Image source={ILTukangKebun} width={8} height={8} alt="Tukang Kebun Icon" />
                  ) : (
                    <Image source={uriImage} width={8} height={8} alt="Photo" />
                  )}
                </Box>
                <VStack space={0.5}>
                  <VStack space={0.5}>
                    <Text fontFamily={fonts.primary[600]} fontSize={width / 28} color="black">
                      {title}
                    </Text>
                    <Text fontFamily={fonts.primary[400]} isTruncated maxW={width / 2} fontSize={width / 36} color={colors.text.black70}>
                      {subTitle}
                    </Text>
                  </VStack>
                </VStack>
              </HStack>
              <HStack
                space={1.5}
                px={2}
                style={styles.boxStatus(width)}
                backgroundColor={
                  statusProgress === 'Diproses'
                    ? colors.proses
                    : statusProgress === 'Bekerja'
                    ? colors.blue[60]
                    : statusProgress === 'Berakhir'
                    ? colors.text.green
                    : statusProgress === 'Ditolak'
                    ? 'red.600'
                    : colors.proses
                }
              >
                <IconCustom />
                <Text fontFamily={fonts.primary[600]} fontSize={width / 34} color={colors.text.white}>
                  {statusProgress}
                </Text>
              </HStack>
            </HStack>
            <HStack justifyContent="space-between" alignItems="center">
              {children}
            </HStack>
          </VStack>
        </Box>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onNavigation}>
      <Box bgColor={colors.white} rounded={8} px={5} py={4}>
        <VStack space={4}>
          <HStack justifyContent="space-between">
            <HStack space={3} alignItems="center">
              {uriType === 'pekerja' ? (
                <Box alignItems="center" justifyContent="center">
                  <Image alt="photo profile" source={uriImage} w={12} h={12} rounded="full" />
                </Box>
              ) : (
                <Box w={12} h={12} rounded="full" alignItems="center" justifyContent="center" bgColor={colors.blue[30]}>
                  <Image alt="photo profile" source={uriImage} width="8" height="8" />
                </Box>
              )}
              <VStack space={0.5}>
                <Text fontFamily={fonts.primary[600]} fontSize={width / 28} color="black" isTruncated numberOfLines={1}>
                  {title}
                </Text>
                <Text
                  fontFamily={fonts.primary[400]}
                  fontSize={width / 36}
                  color={colors.text.black70}
                  isTruncated
                  maxW={width / 1.6}
                  numberOfLines={1}
                >
                  {subTitle}
                </Text>
              </VStack>
            </HStack>
            {type === 'lowongan' ? null : (
              <TouchableOpacity onPress={onSaved}>{dataSave?.isSave && dataSave ? <TersimpanActive /> : <UnSaved />}</TouchableOpacity>
            )}
          </HStack>
          <HStack justifyContent="space-between" alignItems="center">
            {children}
          </HStack>
        </VStack>
      </Box>
    </TouchableOpacity>
  );
};

export default Card;

const styles = StyleSheet.create({
  boxStatus: (width) => ({
    width: width / 4.5,
    height: width / 18,
    alignItems: 'center',
  }),
});
