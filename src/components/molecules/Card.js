import { Dimensions, StyleSheet } from 'react-native';
import React from 'react';
import { Box, HStack, Image, Text, VStack, View } from 'native-base';
import { colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';

const Card = ({ type, uriImage, title, subTitle, detailContent, time }) => {
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
          <Text
            fontFamily={fonts.primary[400]}
            fontSize={width / 30}
            width={width / 1.5}
            mt={1}
            color={colors.text.black50}
          >
            {detailContent}
          </Text>
          <Text
            fontFamily={fonts.primary[500]}
            fontSize={width / 36}
            width={width / 1.5}
            mt={2}
            color={colors.text.black80}
          >
            {time}
          </Text>
        </VStack>
      </HStack>
    );
  }

  return (
    <View>
      <Text>Card</Text>
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({});
