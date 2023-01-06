import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { fonts } from '../../utils/fonts';
import { colors } from '../../utils/colors';
import {
  BerandaActive,
  BerandaInactive,
  ProfilActive,
  ProfilInactive,
  ProgresActive,
  ProgresInactive,
  TersimpanActive,
  TersimpanInactive,
} from '../../assets';

const TabItem = ({ title, active, onPress, onLongPress }) => {
  const IconCustom = () => {
    if (title === 'Beranda') {
      return active ? (
        <BerandaActive width={24} height={24} />
      ) : (
        <BerandaInactive width={24} height={24} />
      );
    }
    if (title === 'Profil') {
      return active ? (
        <ProfilActive width={24} height={24} />
      ) : (
        <ProfilInactive width={24} height={24} />
      );
    }
    if (title === 'Status') {
      return active ? (
        <ProgresActive width={24} height={24} />
      ) : (
        <ProgresInactive width={24} height={24} />
      );
    }
    if (title === 'Tersimpan') {
      return active ? (
        <TersimpanActive width={24} height={24} />
      ) : (
        <TersimpanInactive width={24} height={24} />
      );
    }
    return <BerandaActive width={24} height={24} />;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <IconCustom />
      <Text style={styles.text(active)}>{title}</Text>
    </TouchableOpacity>
  );
};

export default TabItem;

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  text: (active) => ({
    fontSize: 11,
    color: active ? colors.blue[80] : colors.text.black70,
    marginTop: 4,
    fontFamily: fonts.primary[400],
  }),
});
