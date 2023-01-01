import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { View, Text, HStack, VStack, Select, CheckIcon, Box } from 'native-base';
import React from 'react';
import { colors } from '../utils/colors';
import { Button, Header, Input, LabelInput } from '../components';
import { ChevronBack } from '../assets';
import { fonts } from '../utils/fonts';
import { useState } from 'react';
import { getData } from '../utils/getData';
import { useEffect } from 'react';
import useUserStore from '../store/userStore';
import { useFilterTersimpan } from '../store/filterHome';
import { showError } from '../utils/showMessages';

const FilterTersimpan = ({ navigation }) => {
  // Belum default value

  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;

  const { userData } = useUserStore();
  const { setFilterTersimpan } = useFilterTersimpan();

  const [dataProvinsi, setDataProvinsi] = useState([]);
  const [dataKota, setDataKota] = useState([]);

  const [currentProvinsi, setCurrentProvinsi] = useState('');
  const [currentKota, setCurrentKota] = useState('');
  const [jenisGaji, setJenisGaji] = useState('');
  const [pekerjaan, setPekerjaan] = useState('');
  const [urutan, setUrutan] = useState('');
  const [gender, setGender] = useState('');
  const [minUsia, setMinUsia] = useState(0);
  const [maxUsia, setMaxUsia] = useState(0);

  const getDataProvinsi = async () => {
    const resp = await getData('/wilayah-indo/provinsi');
    setDataProvinsi(resp.data);
  };

  const getDataKota = async (id) => {
    if (id === '') return;

    const resp = await getData(`/wilayah-indo/kota?id_provinsi=${id?.split(',')[0]}`);
    setDataKota(resp.data);
  };

  const dataFilterLowongan = {
    bidang_kerja: pekerjaan !== 0 ? pekerjaan : '',
    skala_gaji: jenisGaji ? jenisGaji : '',
    urutan: urutan ? urutan : '',
  };

  const dataFilterPencari = {
    bidang_kerja: pekerjaan !== 0 ? pekerjaan : '',
    jenis_kelamin: gender ? gender : '',
    min_usia: minUsia ? minUsia : '',
    max_usia: maxUsia ? maxUsia : '',
    urutan: urutan ? urutan : '',
  };

  return (
    <View bgColor={colors.white} minH={height}>
      <Header>
        <HStack space={4}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronBack width={28} />
          </TouchableOpacity>
          <Text fontFamily={fonts.primary[600]} fontSize={width / 24} color="black">
            Filter
          </Text>
        </HStack>
      </Header>
      <VStack mt={5} height={height / 1.2} justifyContent="space-between">
        <View px={width / 28}>
          <VStack space={5}>
            {/* Bidang Pekerjaan */}
            <VStack space={2}>
              <LabelInput text="Bidang Pekerjaan" />
              <VStack space={2}>
                <HStack justifyContent="space-between" space={2}>
                  <TouchableOpacity onPress={() => setPekerjaan(1)}>
                    <Box
                      borderColor={+pekerjaan === 1 ? colors.blue[70] : colors.white}
                      borderWidth={+pekerjaan === 1 ? 2 : 0}
                      style={styles.btnFilterPekerjaan(width)}
                    >
                      <Text
                        textAlign="center"
                        fontFamily={fonts.primary[400]}
                        fontSize={width / 32}
                        color={+pekerjaan === 1 ? colors.blue[70] : colors.text.black50}
                      >
                        ART
                      </Text>
                    </Box>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setPekerjaan(2)}>
                    <Box
                      borderColor={+pekerjaan === 2 ? colors.blue[70] : colors.white}
                      borderWidth={+pekerjaan === 2 ? 2 : 0}
                      style={styles.btnFilterPekerjaan(width)}
                    >
                      <Text
                        textAlign="center"
                        fontFamily={fonts.primary[400]}
                        fontSize={width / 32}
                        color={+pekerjaan === 2 ? colors.blue[70] : colors.text.black50}
                      >
                        Pengasuh Anak
                      </Text>
                    </Box>
                  </TouchableOpacity>
                </HStack>
                <HStack justifyContent="space-between" space={2}>
                  <TouchableOpacity onPress={() => setPekerjaan(3)}>
                    <Box
                      borderColor={+pekerjaan === 3 ? colors.blue[70] : colors.white}
                      borderWidth={+pekerjaan === 3 ? 2 : 0}
                      style={styles.btnFilterPekerjaan(width)}
                    >
                      <Text
                        textAlign="center"
                        fontFamily={fonts.primary[400]}
                        fontSize={width / 32}
                        color={+pekerjaan === 3 ? colors.blue[70] : colors.text.black50}
                      >
                        Supir Pribadi
                      </Text>
                    </Box>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setPekerjaan(4)}>
                    <Box
                      borderColor={+pekerjaan === 4 ? colors.blue[70] : colors.white}
                      borderWidth={+pekerjaan === 4 ? 2 : 0}
                      style={styles.btnFilterPekerjaan(width)}
                    >
                      <Text
                        textAlign="center"
                        fontFamily={fonts.primary[400]}
                        fontSize={width / 32}
                        color={+pekerjaan === 4 ? colors.blue[70] : colors.text.black50}
                      >
                        Tukang Kebun
                      </Text>
                    </Box>
                  </TouchableOpacity>
                </HStack>
              </VStack>
            </VStack>

            {userData?.id_role === 3 && (
              <HStack w="full" space={2}>
                {/* Jenis Kelamin */}
                <VStack w="1/2" space={2}>
                  <LabelInput text="Jenis Kelamin" />
                  <Select
                    accessibilityLabel="Pilih jenis kelamin"
                    placeholder="Pilih jenis kelamin"
                    rounded={8}
                    px="3"
                    fontFamily={fonts.primary[500]}
                    type="text"
                    borderColor={colors.text.black30}
                    backgroundColor={colors.white}
                    py="2"
                    fontSize={width / 30}
                    w="100%"
                    _selectedItem={{
                      bg: colors.white,
                      endIcon: <CheckIcon size={0.5} />,
                    }}
                    onValueChange={(itemValue) => {
                      setGender(itemValue);
                    }}
                  >
                    <Select.Item label="Pria" value="pria" />
                    <Select.Item label="Wanita" value="wanita" />
                  </Select>
                </VStack>

                {/* Usia */}
                <VStack w="1/2" space={2}>
                  <LabelInput text="Rentang Usia" />
                  <HStack space={1} alignItems="center">
                    <Input
                      placeholder="Min"
                      onChangeText={(text) => {
                        setMinUsia(text);
                      }}
                      value={minUsia}
                    />
                    <Text fontFamily={fonts.primary[400]} fontSize={width / 30} color="grey">
                      -
                    </Text>
                    <Input
                      placeholder="Max"
                      onChangeText={(text) => {
                        setMaxUsia(text);
                      }}
                      value={maxUsia}
                    />
                    <Text fontFamily={fonts.primary[400]} fontSize={width / 30} color="grey">
                      Tahun
                    </Text>
                  </HStack>
                </VStack>
              </HStack>
            )}
            {/* END: JENIS KELAMIN */}

            {/* Jenis Gaji */}
            {userData?.id_role === 2 && (
              <VStack space={2}>
                <Text fontFamily={fonts.primary[400]} fontSize={width / 30} color="grey">
                  Jenis Gaji
                </Text>
                <HStack w="full" justifyContent="space-between" space={2}>
                  <TouchableOpacity onPress={() => setJenisGaji('hari')}>
                    <Box
                      borderColor={jenisGaji === 'hari' ? colors.blue[70] : colors.white}
                      borderWidth={jenisGaji === 'hari' ? 2 : 0}
                      style={styles.btnFilter(width, height)}
                    >
                      <Text
                        textAlign="center"
                        fontFamily={fonts.primary[400]}
                        fontSize={width / 32}
                        color={jenisGaji === 'hari' ? colors.blue[70] : colors.text.black50}
                      >
                        Per Hari
                      </Text>
                    </Box>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setJenisGaji('minggu')}>
                    <Box
                      borderColor={jenisGaji === 'minggu' ? colors.blue[70] : colors.white}
                      borderWidth={jenisGaji === 'minggu' ? 2 : 0}
                      style={styles.btnFilter(width, height)}
                    >
                      <Text
                        textAlign="center"
                        fontFamily={fonts.primary[400]}
                        fontSize={width / 32}
                        color={jenisGaji === 'minggu' ? colors.blue[70] : colors.text.black50}
                      >
                        Per Minggu
                      </Text>
                    </Box>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setJenisGaji('bulan')}>
                    <Box
                      borderColor={jenisGaji === 'bulan' ? colors.blue[70] : colors.white}
                      borderWidth={jenisGaji === 'bulan' ? 2 : 0}
                      style={styles.btnFilter(width, height)}
                    >
                      <Text
                        textAlign="center"
                        fontFamily={fonts.primary[400]}
                        fontSize={width / 32}
                        color={jenisGaji === 'bulan' ? colors.blue[70] : colors.text.black50}
                      >
                        Per Bulan
                      </Text>
                    </Box>
                  </TouchableOpacity>
                </HStack>
              </VStack>
            )}

            {/* Urutkan Berdasarkan */}
            <VStack space={2}>
              <Text fontFamily={fonts.primary[400]} fontSize={width / 30} color="grey">
                Urutan Berdasarkan
              </Text>
              {userData?.id_role === 2 && (
                <HStack w="full" justifyContent="space-between" space={2}>
                  <TouchableOpacity onPress={() => setUrutan('Terbaru')}>
                    <Box
                      style={styles.btnFilterPekerjaan(width)}
                      borderWidth={urutan === 'Terbaru' ? 2 : 0}
                      borderColor={urutan === 'Terbaru' ? colors.blue[70] : colors.white}
                    >
                      <Text
                        textAlign="center"
                        fontFamily={fonts.primary[400]}
                        fontSize={width / 32}
                        color={urutan === 'Terbaru' ? colors.blue[70] : colors.text.black50}
                      >
                        Terbaru
                      </Text>
                    </Box>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setUrutan('GajiTertinggi')}>
                    <Box
                      borderWidth={urutan === 'GajiTertinggi' ? 2 : 0}
                      style={styles.btnFilterPekerjaan(width)}
                      borderColor={urutan === 'GajiTertinggi' ? colors.blue[70] : colors.white}
                    >
                      <Text
                        textAlign="center"
                        fontFamily={fonts.primary[400]}
                        fontSize={width / 32}
                        color={urutan === 'GajiTertinggi' ? colors.blue[70] : colors.text.black50}
                      >
                        Gaji Tertinggi
                      </Text>
                    </Box>
                  </TouchableOpacity>
                </HStack>
              )}

              {userData?.id_role === 3 && (
                <HStack w="full" justifyContent="space-between" space={2}>
                  <TouchableOpacity onPress={() => setUrutan('pengalaman')}>
                    <Box
                      style={styles.btnFilterPekerjaan(width)}
                      borderWidth={urutan === 'pengalaman' ? 2 : 0}
                      borderColor={urutan === 'pengalaman' ? colors.blue[70] : colors.white}
                    >
                      <Text
                        textAlign="center"
                        fontFamily={fonts.primary[400]}
                        fontSize={width / 32}
                        color={urutan === 'pengalaman' ? colors.blue[70] : colors.text.black50}
                      >
                        Pengalaman
                      </Text>
                    </Box>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setUrutan('penilaian')}>
                    <Box
                      borderWidth={urutan === 'penilaian' ? 2 : 0}
                      style={styles.btnFilterPekerjaan(width)}
                      borderColor={urutan === 'penilaian' ? colors.blue[70] : colors.white}
                    >
                      <Text
                        textAlign="center"
                        fontFamily={fonts.primary[400]}
                        fontSize={width / 32}
                        color={urutan === 'penilaian' ? colors.blue[70] : colors.text.black50}
                      >
                        Penilaian
                      </Text>
                    </Box>
                  </TouchableOpacity>
                </HStack>
              )}
            </VStack>
          </VStack>
        </View>
        {userData?.id_role === 2 && (
          <HStack alignItems="center" justifyContent="space-between" px={width / 32} space={2}>
            <Button
              fontSize={width}
              onPress={() => {
                setPekerjaan('');
                setCurrentProvinsi('');
                setCurrentKota('');
                setJenisGaji('');
                setUrutan('');
              }}
              text="Reset"
              type="red-border"
              width={width / 3.5}
            />
            <Button
              type="primary"
              onPress={() => {
                navigation.goBack();
                setFilterTersimpan(dataFilterLowongan);
              }}
              text="Simpan"
              width={width / 1.6}
              fontSize={width}
            />
          </HStack>
        )}

        {userData?.id_role === 3 && (
          <HStack alignItems="center" justifyContent="space-between" px={width / 32} space={2}>
            <Button
              fontSize={width}
              onPress={() => {
                setCurrentKota('');
                setCurrentProvinsi('');
                setGender('');
                setUrutan('');
                setMaxUsia('');
                setMinUsia('');
                setPekerjaan('');
              }}
              text="Reset"
              type="red-border"
              width={width / 3.5}
            />
            <Button
              type="primary"
              onPress={() => {
                if (maxUsia < minUsia) {
                  return showError('Usia maksimal tidak boleh kurang dari usia minimal');
                } else {
                  navigation.goBack();
                  setFilterTersimpan(dataFilterPencari);
                }
              }}
              text="Simpan"
              width={width / 1.6}
              fontSize={width}
            />
          </HStack>
        )}
      </VStack>
    </View>
  );
};

export default FilterTersimpan;

const styles = StyleSheet.create({
  btnFilter: (width) => ({
    backgroundColor: colors.blue[10],
    width: width / 3.6,
    paddingVertical: 6,
    borderRadius: 8,
  }),
  btnFilterPekerjaan: (width) => ({
    backgroundColor: colors.blue[10],
    width: width / 2.28,
    paddingVertical: 6,
    borderRadius: 8,
  }),
  btnReset: (width) => ({
    backgroundColor: colors.white,
    width: width / 3.5,
    borderColor: '#C86161',
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 6,
  }),
  btnSimpan: (width) => ({
    backgroundColor: colors.blue[80],
    width: width / 1.6,
    borderColor: colors.blue[80],
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 6,
  }),
});
