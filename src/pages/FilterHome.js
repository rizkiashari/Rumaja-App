import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { View, Text, HStack, VStack, Select, CheckIcon, Box, Input } from 'native-base';
import React from 'react';
import { colors } from '../utils/colors';
import { Button, Header, LabelInput, SelectItem } from '../components';
import { ChevronBack } from '../assets';
import { fonts } from '../utils/fonts';
import { useState } from 'react';
import { getData } from '../utils/getData';
import { useEffect } from 'react';
import { useFilterHome } from '../store/filterHome';
import useUserStore from '../store/userStore';
import { showError } from '../utils/showMessages';

const FilterHome = ({ navigation, route }) => {
  const { bidang, id } = route.params;
  const { width, height } = Dimensions.get('window');

  const isFocused = navigation.isFocused();

  const [dataProvinsi, setDataProvinsi] = useState([]);
  const [dataKota, setDataKota] = useState([]);

  const [currentKota, setCurrentKota] = useState('');
  const [provinsi, setProvinsi] = useState('');
  const [jenisGaji, setJenisGaji] = useState('');
  const [urutan, setUrutan] = useState('');
  const [gender, setGender] = useState('');
  const [minRentang, setMinRentang] = useState('');
  const [maxRentang, setMaxRentang] = useState('');

  const { setFilterHome, filterHome } = useFilterHome();
  const { userData } = useUserStore();

  const getDataProvinsi = async () => {
    const resp = await getData('/wilayah-indo/provinsi');
    setDataProvinsi(resp.data);
  };

  const getDataKota = async (idProvinsi) => {
    if (idProvinsi === '') return;

    const resp = await getData(`/wilayah-indo/kota?id_provinsi=${idProvinsi?.split(',')[0]}`);
    setDataKota(resp.data);
  };

  useEffect(() => {
    getDataProvinsi();
    getDataKota(provinsi);
  }, [provinsi, isFocused]);

  const dataFilterLowongan = {
    provinsi: provinsi ? provinsi : '',
    jenis_gaji: jenisGaji,
    urutan: urutan,
    kota: currentKota,
  };

  const dataFilterPekerja = {
    provinsi: provinsi ? provinsi : '',
    kota: currentKota ? currentKota : '',
    urutan: urutan ? urutan : '',
    gender: gender !== 0 ? gender : '',
    min_rentang: minRentang !== 0 ? minRentang : '',
    max_rentang: maxRentang !== 0 ? maxRentang : '',
  };

  console.log('dataFilterPekerja', dataFilterPekerja);
  console.log('filterHome', filterHome);

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

      {userData?.id_role === 2 && (
        <VStack height={height / 1.2} mt={3} justifyContent="space-between">
          <View px={width / 28}>
            <VStack space={3}>
              <LabelInput text="Lokasi Kerja" />
              <HStack space={2}>
                <VStack w="1/2">
                  <Select
                    defaultValue={filterHome?.provinsi}
                    accessibilityLabel="Pilih provinsi"
                    placeholder="Pilih provinsi"
                    rounded={8}
                    px={4}
                    py={2}
                    fontFamily={fonts.primary[500]}
                    borderColor={colors.text.black30}
                    backgroundColor={colors.white}
                    fontSize={width / 32}
                    _selectedItem={{
                      bg: colors.white,
                      endIcon: <CheckIcon size={4} />,
                    }}
                    onValueChange={(itemValue) => {
                      setProvinsi(itemValue);
                    }}
                  >
                    {dataProvinsi?.map((item, index) => (
                      <SelectItem key={index} label={item.nama} value={`${item.id},${item.nama}`} />
                    ))}
                  </Select>
                </VStack>
                <VStack w="1/2">
                  <Select
                    defaultValue={filterHome?.kota}
                    accessibilityLabel="Pilih kota"
                    placeholder="Pilih kota"
                    rounded={8}
                    px={4}
                    py={2}
                    fontFamily={fonts.primary[500]}
                    borderColor={colors.text.black30}
                    backgroundColor={colors.white}
                    fontSize={width / 32}
                    _selectedItem={{
                      bg: colors.white,
                      endIcon: <CheckIcon size={4} />,
                    }}
                    onValueChange={(itemValue) => {
                      setCurrentKota(itemValue);
                    }}
                  >
                    {dataKota?.map((item, index) => (
                      <SelectItem key={index} label={item.nama} value={item.nama} />
                    ))}
                  </Select>
                </VStack>
              </HStack>
            </VStack>
            <VStack space={3} my={5}>
              <LabelInput text="Jenis Gaji" />
              <HStack w="full" justifyContent="space-between" space={2} mb={2}>
                <TouchableOpacity onPress={() => setJenisGaji('Hari')}>
                  <Box
                    borderColor={jenisGaji === 'Hari' ? colors.blue[70] : colors.white}
                    borderWidth={jenisGaji === 'Hari' ? 2 : 0}
                    style={styles.btnFilter(width)}
                  >
                    <Text
                      textAlign="center"
                      fontFamily={fonts.primary[400]}
                      fontSize={width / 32}
                      color={jenisGaji === 'Hari' ? colors.blue[70] : colors.text.black50}
                    >
                      Per Hari
                    </Text>
                  </Box>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setJenisGaji('Bulan')}>
                  <Box
                    borderColor={jenisGaji === 'Bulan' ? colors.blue[70] : colors.white}
                    borderWidth={jenisGaji === 'Bulan' ? 2 : 0}
                    style={styles.btnFilter(width)}
                  >
                    <Text
                      textAlign="center"
                      fontFamily={fonts.primary[400]}
                      fontSize={width / 32}
                      color={jenisGaji === 'Bulan' ? colors.blue[70] : colors.text.black50}
                    >
                      Per Bulan
                    </Text>
                  </Box>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setJenisGaji('Tahun')}>
                  <Box
                    borderColor={jenisGaji === 'Tahun' ? colors.blue[70] : colors.white}
                    borderWidth={jenisGaji === 'Tahun' ? 2 : 0}
                    style={styles.btnFilter(width)}
                  >
                    <Text
                      textAlign="center"
                      fontFamily={fonts.primary[400]}
                      fontSize={width / 32}
                      color={jenisGaji === 'Tahun' ? colors.blue[70] : colors.text.black50}
                    >
                      Per Tahun
                    </Text>
                  </Box>
                </TouchableOpacity>
              </HStack>
            </VStack>
            <VStack space={3}>
              <LabelInput text="Urutan Berdasarkan" />
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
            </VStack>
          </View>
          <HStack alignItems="center" justifyContent="space-between" px={width / 32} space={2}>
            <Button
              fontSize={width}
              onPress={() => {
                setCurrentKota('');
                setProvinsi('');
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
                navigation.navigate('DetailBidangPekerjaan', {
                  id: id,
                  bidang: bidang,
                });
                setFilterHome(dataFilterLowongan);
              }}
              text="Simpan"
              width={width / 1.6}
              fontSize={width}
            />
          </HStack>
        </VStack>
      )}

      {userData?.id_role === 3 && (
        <VStack height={height / 1.2} mt={3} justifyContent="space-between">
          <View px={width / 28}>
            <VStack space={3}>
              <LabelInput text="Domisili" />
              <HStack space={2}>
                <VStack w="1/2">
                  <Select
                    defaultValue={filterHome?.provinsi}
                    accessibilityLabel="Pilih provinsi"
                    placeholder="Pilih provinsi"
                    rounded={8}
                    px={4}
                    py={2}
                    fontFamily={fonts.primary[500]}
                    borderColor={colors.text.black30}
                    backgroundColor={colors.white}
                    fontSize={width / 32}
                    _selectedItem={{
                      bg: colors.white,
                      endIcon: <CheckIcon size={4} />,
                    }}
                    onValueChange={(itemValue) => {
                      setProvinsi(itemValue);
                    }}
                  >
                    {dataProvinsi?.map((item, index) => (
                      <SelectItem key={index} label={item.nama} value={`${item.id},${item.nama}`} />
                    ))}
                  </Select>
                </VStack>
                <VStack w="1/2">
                  <Select
                    defaultValue={filterHome?.kota}
                    accessibilityLabel="Pilih kota"
                    placeholder="Pilih kota"
                    rounded={8}
                    px={4}
                    py={2}
                    fontFamily={fonts.primary[500]}
                    borderColor={colors.text.black30}
                    backgroundColor={colors.white}
                    fontSize={width / 32}
                    _selectedItem={{
                      bg: colors.white,
                      endIcon: <CheckIcon size={4} />,
                    }}
                    onValueChange={(itemValue) => {
                      setCurrentKota(itemValue);
                    }}
                  >
                    {dataKota?.map((item, index) => (
                      <SelectItem key={index} label={item.nama} value={item.nama} />
                    ))}
                  </Select>
                </VStack>
              </HStack>
            </VStack>
            <HStack w="full" space={2} mt={4}>
              <VStack w="1/2" space={2}>
                <LabelInput text="Jenis Kelamin" />
                <Select
                  defaultValue={filterHome?.gender}
                  accessibilityLabel="Pilih gender"
                  placeholder="Pilih jenis kelamin"
                  rounded={8}
                  px={4}
                  py={2}
                  fontFamily={fonts.primary[500]}
                  borderColor={colors.text.black30}
                  backgroundColor={colors.white}
                  fontSize={width / 32}
                  _selectedItem={{
                    bg: colors.white,
                    endIcon: <CheckIcon size={4} />,
                  }}
                  onValueChange={(itemValue) => {
                    setGender(itemValue);
                  }}
                >
                  <Select.Item label="Pria" value="pria" />
                  <Select.Item label="Wanita" value="wanita" />
                </Select>
              </VStack>
              <VStack w="1/2" space={2}>
                <Text fontFamily={fonts.primary[400]} fontSize={width / 30} color="grey">
                  Rentang Usia
                </Text>
                <HStack space={1} alignItems="center">
                  <Input
                    rounded={8}
                    px="3"
                    fontFamily={fonts.primary[500]}
                    type="text"
                    borderColor={colors.text.black30}
                    backgroundColor={colors.white}
                    py="2"
                    fontSize={width / 30}
                    w="30%"
                    keyboardType="numeric"
                    onChangeText={(text) => {
                      setMinRentang(text);
                    }}
                    value={minRentang}
                  />
                  <Text fontFamily={fonts.primary[400]} fontSize={width / 30} color="grey">
                    -
                  </Text>
                  <Input
                    rounded={8}
                    px="3"
                    fontFamily={fonts.primary[500]}
                    type="text"
                    borderColor={colors.text.black30}
                    backgroundColor={colors.white}
                    py="2"
                    fontSize={width / 30}
                    w="30%"
                    keyboardType="numeric"
                    onChangeText={(text) => {
                      setMaxRentang(text);
                    }}
                    value={maxRentang}
                  />
                  <Text fontFamily={fonts.primary[400]} fontSize={width / 30} color="grey">
                    Tahun
                  </Text>
                </HStack>
              </VStack>
            </HStack>
            <VStack space={3} mt={4}>
              <LabelInput text="Urutan Berdasarkan" />
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
            </VStack>
          </View>
          <HStack alignItems="center" justifyContent="space-between" px={width / 32} space={2}>
            <Button
              fontSize={width}
              onPress={() => {
                setCurrentKota('');
                setGender('');
                setMaxRentang(0);
                setMinRentang(0);
                setUrutan('');
              }}
              text="Reset"
              type="red-border"
              width={width / 3.5}
            />
            <Button
              type="primary"
              onPress={() => {
                if (minRentang > maxRentang) {
                  return showError('Usia maksimal tidak boleh kurang dari usia minimal');
                } else {
                  navigation.navigate('DetailLayanan', {
                    id: id,
                    bidang: bidang,
                  });
                  setFilterHome(dataFilterPekerja);
                }
              }}
              text="Simpan"
              width={width / 1.6}
              fontSize={width}
            />
          </HStack>
        </VStack>
      )}
    </View>
  );
};

export default FilterHome;

const styles = StyleSheet.create({
  btnFilterPekerjaan: (width) => ({
    backgroundColor: colors.blue[10],
    width: width / 2.28,
    paddingVertical: 6,
    borderRadius: 8,
  }),
  btnFilter: (width) => ({
    backgroundColor: colors.blue[10],
    width: width / 3.6,
    paddingVertical: 6,
    borderRadius: 8,
  }),
});
