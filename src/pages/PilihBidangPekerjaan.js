import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Box, Center, HStack, ScrollView, Skeleton, Text, VStack } from 'native-base';
import { colors } from '../utils/colors';
import { fonts } from '../utils/fonts';
import { getData } from '../utils/getData';
import { getDataLocal, storeData } from '../utils/localStorage';
import { Button } from '../components';
import {
  ArtActive,
  ArtInactive,
  BabysitterActive,
  BabysitterInactive,
  DriverActive,
  DriverInactive,
  GardenerActive,
  GardenerInactive,
} from '../assets';

const PilihBidangPekerjaan = ({ navigation }) => {
  const { width, height } = Dimensions.get('window');

  const [dataBidang, setDataBidang] = useState([]);
  const [currentBidang, setCurrentBidang] = useState('');

  const getAllBidang = async () => {
    const resp = await getData('/user/list-bidang');
    setDataBidang(resp.data);
  };

  const goBackPilihPeran = () => {
    navigation.navigate('PilihPeran');
  };

  const addBidangPekerjaan = (id_bidang) => {
    storeData('id_bidang', id_bidang);
    setCurrentBidang(id_bidang);
  };

  const getBidangPekerjaan = () => {
    getDataLocal('id_bidang').then((res) => {
      setCurrentBidang(res);
    });
  };

  useEffect(() => {
    getAllBidang();
    getBidangPekerjaan();
  }, []);

  return (
    <ScrollView showsVerticalScrollIndicator={false} bgColor={colors.white}>
      <Box pt="10" pb="5" width="full">
        <VStack h={height / 1.13} alignItems="center">
          <Text color="black" textAlign="center" fontSize={width / 22} fontFamily={fonts.primary[600]} mb={20}>
            Pilih Bidang Pekerjaan
          </Text>
          <Center>
            <HStack mx={3} flexWrap="wrap" alignContent="center">
              {dataBidang.length > 0
                ? dataBidang.map((item, index) => {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          addBidangPekerjaan(item.id);
                        }}
                        key={index}
                        style={styles.wrap(index)}
                      >
                        <Box
                          background={colors.blue[10]}
                          borderColor={+currentBidang === +item.id ? colors.blue[70] : colors.blue[10]}
                          borderWidth={+currentBidang === +item.id ? 2 : 0}
                          rounded={8}
                          py={5}
                          w={width / 2.22}
                          h={height / 4}
                        >
                          <VStack alignItems="center" space="1.5">
                            <Box alignContent="center" rounded="lg">
                              {item.id === +currentBidang && item.id === 1 ? (
                                <ArtActive />
                              ) : item.id === +currentBidang && item.id === 2 ? (
                                <BabysitterActive />
                              ) : item.id === 2 ? (
                                <BabysitterInactive />
                              ) : item.id === +currentBidang && item.id === 3 ? (
                                <DriverActive />
                              ) : item.id === 3 ? (
                                <DriverInactive />
                              ) : item.id === +currentBidang && item.id === 4 ? (
                                <GardenerActive />
                              ) : item.id === 4 ? (
                                <GardenerInactive />
                              ) : (
                                <ArtInactive />
                              )}
                            </Box>
                            {/* <Text
                              fontFamily={fonts.primary[500]}
                              fontSize={width / 32}
                              textAlign="center"
                              color={+currentBidang === +item.id ? colors.blue[80] : colors.text.black70}
                            >
                              {item.nama_bidang}
                            </Text> */}
                            <Text
                              fontFamily={fonts.primary[400]}
                              fontSize={width / 32}
                              color={+currentBidang === +item.id ? colors.blue[60] : colors.text.black50}
                              textAlign="center"
                              w="full"
                              maxW={width / 4}
                            >
                              {item.detail_bidang}
                            </Text>
                          </VStack>
                        </Box>
                      </TouchableOpacity>
                    );
                  })
                : Array(4)
                    .fill(0)
                    .map((_, index) => {
                      return (
                        <VStack
                          borderWidth="1"
                          space={8}
                          w={width / 2.22}
                          h={height / 3}
                          style={styles.wrap(index)}
                          overflow="hidden"
                          rounded="md"
                          _dark={{
                            borderColor: 'coolGray.500',
                          }}
                          _light={{
                            borderColor: 'coolGray.200',
                          }}
                          key={index}
                          p={3}
                        >
                          <Skeleton h={height / 8} />
                          <Skeleton.Text px="4" lines={2} />
                        </VStack>
                      );
                    })}
            </HStack>
          </Center>
          <Center mt={20}>
            <HStack alignItems="center" space={3} w="full" px={width / 14} justifyContent="space-between">
              <Button text="Kembali" onPress={goBackPilihPeran} type="secondary" width={width / 2.3} fontSize={width} />
              {currentBidang !== '' && currentBidang !== undefined ? (
                <Button onPress={() => navigation.navigate('Register')} text="Selanjutnya" width={width / 2.3} fontSize={width} />
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

export default PilihBidangPekerjaan;

const styles = StyleSheet.create({
  btnSelanjutnyaDisabled: (width) => ({
    backgroundColor: colors.text.black30,
    width: width / 2.3,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.text.black30,
  }),
  wrap: (index) => ({
    marginRight: index % 2 === 0 ? 14 : 0,
    marginBottom: index === 0 ? 14 : 0,
  }),
});
