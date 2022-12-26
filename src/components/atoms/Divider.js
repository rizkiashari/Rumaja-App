import { Dimensions } from 'react-native';
import { Divider as DividerNativeBase } from 'native-base';
import React from 'react';
import { colors } from '../../utils/colors';

const Divider = () => {
  const { width } = Dimensions.get('window');

  return <DividerNativeBase bg={colors.gray10} thickness="1" width={width / 3} />;
};

export default Divider;
