import { Dimensions } from 'react-native';
import React from 'react';
import { colors } from '../../utils/colors';
import { HStack } from 'native-base';

const Header = ({ children }) => {
  const { width, height } = Dimensions.get('window');

  return (
    <HStack
      px={width / 28}
      pt={height / 40}
      pb={height / 48}
      bgColor={colors.white}
      alignItems="center"
      justifyContent="space-between"
    >
      {children}
    </HStack>
  );
};

export default Header;
