import { Box, Button, Image, Modal, Text, VStack } from 'native-base';
import React, { useState } from 'react';
import { Dimensions, TouchableOpacity } from 'react-native';
import { ILPlaceholder } from '../../assets';
import { fonts } from '../../utils/fonts';
import { colors } from '../../utils/colors';

const TopProfile = ({ title, subtitle, type, bubble, photo, photoWidth, photoHeight }) => {
  const { width } = Dimensions.get('window');
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <VStack mb={2} p={width / 20} bgColor="white" space={2} alignItems="center">
        <Box w={20} h={20} alignItems="center" justifyContent="center" backgroundColor={colors.blue[30]} rounded="full">
          {photo ? (
            <TouchableOpacity onPress={() => setShowModal(true)} style={{ width: '100%' }}>
              <Image alt="photo profile" margin="auto" source={{ uri: photo }} width={photoWidth} height={photoHeight} rounded="full" />
            </TouchableOpacity>
          ) : (
            <Image alt="photo profile" source={ILPlaceholder} width={photoWidth} height={photoHeight} rounded="full" />
          )}
        </Box>
        <VStack space={1} alignItems="center">
          <Text fontFamily={fonts.primary[600]} maxW={width / 1.1} isTruncated fontSize={width / 28} color="black" textTransform="capitalize">
            {title}
          </Text>
          <Text fontFamily={fonts.primary[400]} fontSize={width / 32} color={colors.text.black70} numberOfLines={1}>
            {subtitle}
          </Text>
        </VStack>
        {type === 'pekerja' ? bubble : null}
      </VStack>
      {photo && (
        <Modal _backdrop={{ bg: 'black' }} isOpen={showModal} onClose={() => setShowModal(false)}>
          <Modal.Content bg="transparent" shadow="none" maxWidth="400px">
            <Image margin="auto" alt="photo profile" source={{ uri: photo }} rounded="full" width={250} height={250} />
          </Modal.Content>
        </Modal>
      )}
    </>
  );
};

export default TopProfile;
