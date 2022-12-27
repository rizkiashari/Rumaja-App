import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { Box, HStack, Image, Text, VStack, View } from 'native-base';
import { colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';
import { ILArt, ILPengasuh, ILSopirPribadi, ILTukangKebun, TersimpanActive, Timer, UnSaved } from '../../assets';

const Card = ({ type, uriImage, title, subTitle, detailContent, time, id, onSaved, onNavigation, dataSave, children, lokasi, icon }) => {
  const { width } = Dimensions.get('window');

  if (type === 'notif') {
    return (
      <HStack w="full" space={4}>
        <Box w={12} h={12} rounded="full" alignItems="center" justifyContent="center" bgColor={colors.blue[30]}>
          <Image alt="photo profile" source={uriImage} width="10" height="10" />
        </Box>
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

  return (
    <TouchableOpacity onPress={onNavigation}>
      <Box bgColor={colors.white} rounded={8} px={5} py={4}>
        <VStack space={4}>
          <HStack justifyContent="space-between">
            <HStack space={3} alignItems="center">
              <Box w={12} h={12} rounded="full" alignItems="center" justifyContent="center" bgColor={colors.blue[30]}>
                <Image alt="photo profile" source={uriImage} width="10" height="10" rounded="full" />
              </Box>
              <VStack space={0.5}>
                <Text fontFamily={fonts.primary[600]} fontSize={width / 28} color="black" isTruncated numberOfLines={1}>
                  {title}
                </Text>
                <Text fontFamily={fonts.primary[400]} fontSize={width / 36} color={colors.text.black70} isTruncated numberOfLines={1}>
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

const styles = StyleSheet.create({});
