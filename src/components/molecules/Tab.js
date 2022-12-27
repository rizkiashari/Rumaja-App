import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { Box, Text } from 'native-base';
import { colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';

const Tab = ({ title, onPress, jenisTabs, widthTab }) => {
  const { width } = Dimensions.get('window');

  return (
    <TouchableOpacity onPress={onPress}>
      <Box backgroundColor={jenisTabs === title ? colors.blue[80] : colors.white} style={styles.btnTab(widthTab)}>
        <Text
          textAlign="center"
          fontFamily={fonts.primary[400]}
          fontSize={width / 32}
          color={jenisTabs === title ? colors.white : colors.text.black50}
        >
          {title}
        </Text>
      </Box>
    </TouchableOpacity>
  );
};

export default Tab;

const styles = StyleSheet.create({
  btnTab: (widthTab) => ({
    width: widthTab,
    paddingVertical: 6,
    borderRadius: 8,
  }),
});
