import { Dimensions, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { CheckIcon, HStack, ScrollView, Select, Text, View, VStack, Box } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { colors } from '../utils/colors';
import { Button, ErrorInput, Header, Input, LabelInput, LoadingButton, SelectItem, TextArea } from '../components';
import { ChevronBack, Info } from '../assets';
import { fonts } from '../utils/fonts';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getData } from '../utils/getData';
import { showError, showSuccess } from '../utils/showMessages';
import { postWithJson } from '../utils/postData';
import useLoading from '../store/loadingStore';

const TambahLowongan = ({ navigation }) => {
  const { width, height } = Dimensions.get('window');

  const [isLoading, setIsLoading] = useState(false);

  const [dataProvinsi, setDataProvinsi] = useState([]);
  const [dataKota, setDataKota] = useState([]);
  const [bidangKerja, setBidangKerja] = useState([]);

  const [currentProvinsi, setCurrentProvinsi] = useState('');

  const { setLoading } = useLoading();

  const getDataProvinsi = async () => {
    const resp = await getData('/wilayah-indo/provinsi');
    setDataProvinsi(resp.data);
  };

  const getDataKota = async (idProvinsi) => {
    if (idProvinsi === '') return;

    const resp = await getData(`/wilayah-indo/kota?id_provinsi=${idProvinsi?.split(',')[0]}`);
    setDataKota(resp.data);
  };

  const getDataBidangKerja = async () => {
    const resp = await getData('/lowongan/layanan');
    setBidangKerja(resp.data);
  };

  useEffect(() => {
    getDataProvinsi();
    getDataKota(currentProvinsi);
    getDataBidangKerja();
  }, [currentProvinsi]);

  const onTambahLowongan = useFormik({
    initialValues: {
      gaji: '',
      skala_gaji: '',
      kualifikasi: '',
      fasilitas: '',
      bidang_kerja: '',
      deskripsi_lowongan: '',
      provinsi_lowongan: '',
      kota_lowongan: '',
      alamat_lengkap: '',
    },
    validationSchema: Yup.object({
      gaji: Yup.string().required('Gaji tidak boleh kosong'),
      skala_gaji: Yup.string().required('Skala gaji tidak boleh kosong'),
      kualifikasi: Yup.string().required('Kualifikasi tidak boleh kosong'),
      fasilitas: Yup.string().required('Fasilitas tidak boleh kosong'),
      bidang_kerja: Yup.string().required('Bidang kerja tidak boleh kosong'),
      deskripsi_lowongan: Yup.string().required('Deskripsi lowongan tidak boleh kosong'),
      provinsi_lowongan: Yup.string().required('Provinsi lowongan tidak boleh kosong'),
      kota_lowongan: Yup.string().required('Kota lowongan tidak boleh kosong'),
      alamat_lengkap: Yup.string().required('Alamat lengkap tidak boleh kosong'),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);

      const payload = {
        gaji: +values.gaji,
        skala_gaji: values.skala_gaji,
        kualifikasi: values.kualifikasi,
        fasilitas: values.fasilitas,
        id_bidang_kerja: +values.bidang_kerja,
        deskripsi_lowongan: values.deskripsi_lowongan,
        provinsi_lowongan: values.provinsi_lowongan,
        kota_lowongan: values.kota_lowongan,
        alamat_lengkap: values.alamat_lengkap,
      };

      const res = await postWithJson('/lowongan/add', payload);
      setIsLoading(false);
      if (res.message === 'SUCCESS_ADD_LOWONGAN') {
        showSuccess('Berhasil menambahkan lowongan');
        onTambahLowongan.resetForm();
        setLoading(true);
        navigation.goBack();
      } else {
        setIsLoading(false);
        setLoading(false);
        showError(res.message);
      }
    },
  });

  return (
    <View backgroundColor={colors.white} minH={height} pb={height / 20}>
      <Header>
        <HStack space={4}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronBack width={28} />
          </TouchableOpacity>
          <Text fontFamily={fonts.primary[600]} fontSize={width / 24} color="black">
            Tambah lowongan
          </Text>
        </HStack>
      </Header>
      <View flex={1}>
        <KeyboardAwareScrollView extraHeight={height} enableAutomaticScroll={true} showsVerticalScrollIndicator={false} extraScrollHeight={height}>
          <ScrollView flex={0.9} showsVerticalScrollIndicator={false} _contentContainerStyle={{ paddingBottom: height / 4 }} px={width / 28}>
            <VStack space={4}>
              <VStack space={2}>
                <LabelInput text="Bidang Pekerjaan" />
                <Select
                  selectedValue={onTambahLowongan.values.bidang_kerja}
                  accessibilityLabel="Pilih bidang pekerjaan"
                  placeholder="Pilih bidang pekerjaan"
                  rounded={8}
                  px={4}
                  fontFamily={fonts.primary[500]}
                  borderColor={colors.text.black30}
                  backgroundColor={colors.white}
                  py={2}
                  fontSize={width / 32}
                  _selectedItem={{
                    bg: colors.white,
                    endIcon: <CheckIcon size={1} />,
                  }}
                  onValueChange={(itemValue) => onTambahLowongan.setFieldValue('bidang_kerja', itemValue)}
                >
                  {bidangKerja?.map((item, idx) => (
                    <SelectItem label={item.detail_bidang} value={item.id} key={idx} />
                  ))}
                </Select>
                {onTambahLowongan.touched.bidang_kerja && onTambahLowongan.errors.bidang_kerja && (
                  <ErrorInput error={onTambahLowongan.errors.bidang_kerja} />
                )}
              </VStack>
              <VStack space={2}>
                <LabelInput text="Gaji" />
                <HStack space={2}>
                  <VStack width={width / 2.2}>
                    <Input
                      placeholder="Masukan gaji"
                      value={onTambahLowongan.values.gaji}
                      onChangeText={onTambahLowongan.handleChange('gaji')}
                      type="number"
                    />
                    {onTambahLowongan.touched.gaji && onTambahLowongan.errors.gaji ? <ErrorInput error={onTambahLowongan.errors.gaji} /> : null}
                  </VStack>
                  <VStack width={width / 2.2}>
                    <Select
                      selectedValue={onTambahLowongan.values.skala_gaji}
                      accessibilityLabel="Per hari"
                      placeholder="Per hari"
                      rounded={8}
                      px={4}
                      fontFamily={fonts.primary[500]}
                      borderColor={colors.text.black30}
                      backgroundColor={colors.white}
                      py={2}
                      fontSize={width / 32}
                      _selectedItem={{
                        bg: colors.white,
                        endIcon: <CheckIcon size={1} />,
                      }}
                      onValueChange={(itemValue) => onTambahLowongan.setFieldValue('skala_gaji', itemValue)}
                    >
                      <Select.Item label="Hari" value="hari" />
                      <Select.Item label="Minggu" value="minggu" />
                      <Select.Item label="Bulan" value="bulan" />
                    </Select>
                    {onTambahLowongan.errors.skala_gaji && onTambahLowongan.touched.skala_gaji && (
                      <ErrorInput error={onTambahLowongan.errors.skala_gaji} />
                    )}
                  </VStack>
                </HStack>
              </VStack>
              <VStack space={2}>
                <LabelInput text="Kualifikasi" />
                <TextArea
                  value={onTambahLowongan.values.kualifikasi}
                  onChangeText={onTambahLowongan.handleChange('kualifikasi')}
                  placeholder="Masukan kualifikasi (cth: Usia maksimal 35 tahun)"
                />
                {onTambahLowongan.errors.kualifikasi && onTambahLowongan.touched.kualifikasi && (
                  <ErrorInput error={onTambahLowongan.errors.kualifikasi} />
                )}
              </VStack>
              <VStack space={2}>
                <LabelInput text="Deskripsi Pekerjaan" />
                <TextArea
                  value={onTambahLowongan.values.deskripsi_lowongan}
                  onChangeText={onTambahLowongan.handleChange('deskripsi_lowongan')}
                  placeholder="Masukan Deskripsi Pekerjaan (cth: tanggung jawab membersihkan rumah 2 lantai)"
                />
                {onTambahLowongan.errors.deskripsi_lowongan && onTambahLowongan.touched.deskripsi_lowongan && (
                  <ErrorInput error={onTambahLowongan.errors.deskripsi_lowongan} />
                )}
              </VStack>
              <VStack space={2}>
                <LabelInput text="Fasilitas" />
                <TextArea
                  value={onTambahLowongan.values.fasilitas}
                  onChangeText={onTambahLowongan.handleChange('fasilitas')}
                  placeholder="Masukan fasilitas (cth: Kamar tidur dan kamar mandi pribadi)"
                />
                {onTambahLowongan.errors.fasilitas && onTambahLowongan.touched.fasilitas && <ErrorInput error={onTambahLowongan.errors.fasilitas} />}
              </VStack>
              <VStack space={2}>
                <LabelInput text="Lokasi" />
                <HStack space={2}>
                  <VStack width={width / 2.2}>
                    <Select
                      selectedValue={onTambahLowongan.values.provinsi_lowongan}
                      accessibilityLabel="Pilih provinsi"
                      placeholder="Pilih provinsi"
                      rounded={8}
                      px={4}
                      fontFamily={fonts.primary[500]}
                      borderColor={colors.text.black30}
                      backgroundColor={colors.white}
                      py={2}
                      fontSize={width / 32}
                      _selectedItem={{
                        bg: colors.white,
                        endIcon: <CheckIcon size={1} />,
                      }}
                      onValueChange={(itemValue) => {
                        setCurrentProvinsi(itemValue);
                        onTambahLowongan.setFieldValue('provinsi_lowongan', itemValue);
                        onTambahLowongan.setFieldValue('domisili_kota', '');
                      }}
                    >
                      {dataProvinsi?.map((item, idx) => (
                        <SelectItem label={item.nama} value={`${item.id},${item.nama}`} key={idx} />
                      ))}
                    </Select>
                    {onTambahLowongan.errors.provinsi_lowongan && onTambahLowongan.touched.provinsi_lowongan && (
                      <ErrorInput error={onTambahLowongan.errors.provinsi_lowongan} />
                    )}
                  </VStack>
                  <VStack width={width / 2.2}>
                    <Select
                      selectedValue={onTambahLowongan.values.kota_lowongan}
                      accessibilityLabel="Pilih kota"
                      placeholder="Pilih kota"
                      rounded={8}
                      px={4}
                      fontFamily={fonts.primary[500]}
                      borderColor={colors.text.black30}
                      backgroundColor={colors.white}
                      py={2}
                      fontSize={width / 32}
                      _selectedItem={{
                        bg: colors.white,
                        endIcon: <CheckIcon size={1} />,
                      }}
                      onValueChange={(itemValue) => onTambahLowongan.setFieldValue('kota_lowongan', itemValue)}
                    >
                      {dataKota?.map((item, idx) => (
                        <SelectItem label={item.nama} value={item.nama} key={idx} />
                      ))}
                    </Select>
                    {onTambahLowongan.errors.kota_lowongan && onTambahLowongan.touched.kota_lowongan && (
                      <ErrorInput error={onTambahLowongan.errors.kota_lowongan} />
                    )}
                  </VStack>
                </HStack>
                <Box mt={2}>
                  <TextArea
                    value={onTambahLowongan.values.alamat_lengkap}
                    onChangeText={onTambahLowongan.handleChange('alamat_lengkap')}
                    placeholder="Masukan alamat lengkap (cth: Jalan Kalibata Raya no.1)"
                  />
                  {onTambahLowongan.errors.alamat_lengkap && onTambahLowongan.touched.alamat_lengkap && (
                    <ErrorInput error={onTambahLowongan.errors.alamat_lengkap} />
                  )}
                </Box>
                <HStack mt={2} mb={28} px={width / 28} bgColor={colors.gray20} rounded={8} py={width / 40} space={width / 40} alignItems="center">
                  <Info />
                  <Text color={colors.text.black100} fontFamily={fonts.primary[400]} fontSize={width / 32}>
                    Alamat lengkap hanya dapat dilihat oleh pencari kerja yang telah diterima
                  </Text>
                </HStack>
              </VStack>
            </VStack>
          </ScrollView>
        </KeyboardAwareScrollView>
        <Box backgroundColor={colors.white} pt={4} px={width / 28} justifyContent="center" alignItems="center" width={width}>
          {!isLoading ? <Button onPress={onTambahLowongan.handleSubmit} text="Simpan" fontSize={width} width={width / 1.1} /> : <LoadingButton />}
        </Box>
      </View>
    </View>
  );
};

export default TambahLowongan;
