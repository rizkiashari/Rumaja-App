import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Box, Center, HStack, ScrollView, Text, VStack } from 'native-base';
import { fonts } from '../utils/fonts';
import { colors } from '../utils/colors';
import { getDataLocal, storeData } from '../utils/localStorage';
import { PencariActive, PencariInactive, PenyediaActive, PenyediaInactive } from '../assets';
import { Button } from '../components';

const PilihPeran = ({ navigation }) => {
  const { width, height } = Dimensions.get('window');

  const [peran, setPeran] = useState('');

  const goBackLogin = () => {
    navigation.navigate('Login');
  };

  const addPeran = (dataPeran) => {
    storeData('peran', dataPeran);
    setPeran(dataPeran);
  };

  const getPeran = () => {
    getDataLocal('peran').then((res) => {
      setPeran(res);
    });
  };

  useEffect(() => {
    getPeran();
  }, []);

  return (
    <ScrollView showsVerticalScrollIndicator={false} bgColor={colors.white}>
      <Box pt="10" pb="5" w={width / 1.3} alignSelf="center">
        <VStack h={height / 1.14} alignItems="center" justifyContent="space-between">
          <Center>
            <VStack space={height / 12} w="full">
              <Text color="black" textAlign="center" fontSize={width / 22} fontFamily={fonts.primary[600]}>
                Apa yang anda cari ?
              </Text>
              <VStack space={height / 32}>
                <TouchableOpacity
                  onPress={() => {
                    addPeran('pencari');
                  }}
                >
                  <Box
                    background={colors.blue[10]}
                    borderColor={peran === 'pencari' ? colors.blue[70] : colors.blue[10]}
                    borderWidth={peran === 'pencari' ? 2 : 0}
                    rounded={8}
                    p={3}
                  >
                    <HStack alignItems="center" space={3}>
                      <Box w={12} h={12} rounded="lg">
                        {peran === 'pencari' ? <PencariActive /> : <PencariInactive />}
                      </Box>
                      <Text
                        color={peran === 'pencari' ? colors.blue[80] : colors.text.black50}
                        fontFamily={fonts.primary[500]}
                        fontSize={width / 32}
                        width="full"
                      >
                        Saya mencari pekerjaan
                      </Text>
                    </HStack>
                  </Box>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    addPeran('penyedia');
                  }}
                >
                  <Box
                    background={colors.blue[10]}
                    borderColor={peran === 'penyedia' ? colors.blue[70] : colors.blue[10]}
                    borderWidth={peran === 'penyedia' ? 2 : 0}
                    rounded={8}
                    p={3}
                  >
                    <HStack alignItems="center" space={3}>
                      <Box w={12} h={12} rounded="lg">
                        {peran === 'penyedia' ? <PenyediaActive /> : <PenyediaInactive />}
                      </Box>
                      <Text
                        color={peran === 'penyedia' ? colors.blue[80] : colors.text.black50}
                        fontFamily={fonts.primary[500]}
                        fontSize={width / 32}
                        width="full"
                      >
                        Saya mencari tenaga kerja
                      </Text>
                    </HStack>
                  </Box>
                </TouchableOpacity>
              </VStack>
            </VStack>
          </Center>
          <Center>
            <HStack space={4} alignItems="center" justifyContent="space-between">
              <Button text="Kembali" onPress={goBackLogin} type="secondary" width={width / 2.3} fontSize={width} />

              {peran !== '' && peran !== undefined ? (
                <Button
                  text="Selanjutnya"
                  width={width / 2.3}
                  fontSize={width}
                  onPress={() => {
                    if (peran === 'pencari') {
                      navigation.navigate('PilihBidangPekerjaan');
                    } else {
                      navigation.navigate('Register');
                    }
                  }}
                />
              ) : (
                <Box style={styles.btnSelanjutnyaDisabled(width)}>
                  <Text color={colors.text.black50} fontFamily={fonts.primary[500]} textAlign="center" paddingY={2}>
                    Selanjutnya
                  </Text>
                </Box>
              )}
            </HStack>
          </Center>
        </VStack>
      </Box>
    </ScrollView>
  );
};

export default PilihPeran;

const styles = StyleSheet.create({
  btnSelanjutnyaDisabled: (width) => ({
    backgroundColor: colors.text.black30,
    width: width / 2.3,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.text.black30,
  }),
});
