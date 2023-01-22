import { Dimensions, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Box, CheckIcon, HStack, ScrollView, Select, Text, VStack, View } from 'native-base';
import { getData } from '../utils/getData';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { API } from '../config/api';
import { showError, showSuccess } from '../utils/showMessages';
import { colors } from '../utils/colors';
import { Button, ErrorInput, Header, Input, LabelInput, LoadingButton, SelectItem, TextArea } from '../components';
import { ChevronBack, Info } from '../assets';
import { fonts } from '../utils/fonts';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import useLoading from '../store/loadingStore';

const EditLowongan = ({ navigation, route }) => {
  const { uuid } = route.params;
  const { width, height } = Dimensions.get('window');

  const [dataProvinsi, setDataProvinsi] = useState([]);
  const [dataKota, setDataKota] = useState([]);
  const [bidangKerja, setBidangKerja] = useState([]);

  const { setLoading } = useLoading();

  const [isLoading, setIsLoading] = useState(false);

  const [provinsi, setProvinsi] = useState('');

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

  const onEditLowongan = useFormik({
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
    validateOnChange: true,
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
      try {
        setIsLoading(true);

        const payload = {
          gaji: Number(values.gaji),
          skala_gaji: values.skala_gaji,
          kualifikasi: values.kualifikasi,
          fasilitas: values.fasilitas,
          id_bidang_kerja: Number(values.bidang_kerja),
          deskripsi_lowongan: values.deskripsi_lowongan,
          provinsi_lowongan: values.provinsi_lowongan,
          kota_lowongan: values.kota_lowongan,
          alamat_lengkap: values.alamat_lengkap,
        };
        const res = await API.patch(`/lowongan/update/${uuid}`, payload);
        if (res.data.message === 'SUCCESS_EDIT_LOWONGAN') {
          showSuccess('Berhasil mengubah lowongan');
          navigation.navigate('MainApp');
          setLoading(true);
          setIsLoading(false);
        } else {
          showError(res.data.message);
          setIsLoading(false);
        }
      } catch ({ response }) {
        setIsLoading(false);
        setLoading(false);
        switch (response.data.message) {
          case 'LOWONGAN_NOT_FOUND':
            showError('Lowongan tidak ditemukan');
            break;
          default:
            showError(response.data.message);
            break;
        }
      }
    },
  });

  useEffect(() => {
    const loadLowongan = async () => {
      let flag = true;
      if (flag) {
        const { data, code } = await getData(`/lowongan/id/${uuid}`);
        if (code === 200) {
          onEditLowongan.setFieldValue('bidang_kerja', data?.bidang_kerja?.id);
          onEditLowongan.setFieldValue('gaji', data?.gaji.toString());
          onEditLowongan.setFieldValue('skala_gaji', data?.skala_gaji);
          onEditLowongan.setFieldValue('kualifikasi', data?.kualifikasi);
          onEditLowongan.setFieldValue('fasilitas', data?.fasilitas);
          onEditLowongan.setFieldValue('deskripsi_lowongan', data?.deskripsi_lowongan);
          onEditLowongan.setFieldValue('kota_lowongan', data?.kota_lowongan);
          onEditLowongan.setFieldValue('provinsi_lowongan', data?.provinsi_lowongan);
          onEditLowongan.setFieldValue('alamat_lengkap', data?.alamat_lengkap);
        } else {
          showError('Gagal mengambil data lowongan');
        }
      }
      flag = false;
    };

    loadLowongan();
  }, [uuid]);

  useEffect(() => {
    getDataProvinsi();
    getDataKota(provinsi);
    getDataBidangKerja();
  }, [provinsi]);

  return (
    <View backgroundColor={colors.white} minH={height} pb={9}>
      <Header>
        <HStack space={4}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronBack width={28} />
          </TouchableOpacity>
          <Text fontFamily={fonts.primary[600]} fontSize={width / 24} color="black">
            Edit lowongan
          </Text>
        </HStack>
      </Header>
      <View flex={1}>
        <KeyboardAwareScrollView extraHeight={250} enableAutomaticScroll={true} extraScrollHeight={250} showsVerticalScrollIndicator={false}>
          <ScrollView flex={0.9} showsVerticalScrollIndicator={false} _contentContainerStyle={{ paddingBottom: height / 4 }} px={width / 28}>
            <VStack mt={5} justifyContent="space-between">
              <VStack space={5}>
                <VStack space={2}>
                  <LabelInput text="Bidang Pekerjaan" />
                  <Select
                    selectedValue={onEditLowongan.values.bidang_kerja}
                    accessibilityLabel="Pilih bidang pekerjaan"
                    placeholder="Pilih bidang pekerjaan"
                    rounded={8}
                    px={4}
                    py={2}
                    fontFamily={fonts.primary[500]}
                    borderColor={colors.text.black30}
                    backgroundColor={colors.white}
                    fontSize={width / 32}
                    _selectedItem={{
                      bg: colors.white,
                      endIcon: <CheckIcon size={1} />,
                    }}
                    onValueChange={(itemValue) => onEditLowongan.setFieldValue('bidang_kerja', itemValue)}
                  >
                    {bidangKerja.map((item, index) => (
                      <SelectItem key={index} label={item.detail_bidang} value={item.id} />
                    ))}
                  </Select>
                  {onEditLowongan.errors.bidang_kerja && onEditLowongan.touched.bidang_kerja && (
                    <ErrorInput error={onEditLowongan.errors.bidang_kerja} />
                  )}
                </VStack>
                <VStack space={2}>
                  <LabelInput text="Gaji" />
                  <HStack space={2}>
                    <VStack width={width / 2.2}>
                      <Input
                        placeholder="Masukan gaji"
                        type="number"
                        value={onEditLowongan.values.gaji}
                        onChangeText={onEditLowongan.handleChange('gaji')}
                      />
                      {onEditLowongan.errors.gaji && onEditLowongan.touched.gaji && <ErrorInput error={onEditLowongan.errors.gaji} />}
                    </VStack>
                    <VStack width={width / 2.2}>
                      <Select
                        selectedValue={onEditLowongan.values.skala_gaji}
                        accessibilityLabel="Per hari"
                        placeholder="Per hari"
                        rounded={8}
                        px={4}
                        py={2}
                        fontFamily={fonts.primary[500]}
                        borderColor={colors.text.black30}
                        backgroundColor={colors.white}
                        fontSize={width / 32}
                        _selectedItem={{
                          bg: colors.white,
                          endIcon: <CheckIcon size={1} />,
                        }}
                        onValueChange={(itemValue) => onEditLowongan.setFieldValue('skala_gaji', itemValue)}
                      >
                        <Select.Item label="Hari" value="hari" />
                        <Select.Item label="Minggu" value="minggu" />
                        <Select.Item label="Bulan" value="bulan" />
                      </Select>
                      {onEditLowongan.errors.skala_gaji && onEditLowongan.touched.skala_gaji && (
                        <ErrorInput error={onEditLowongan.errors.skala_gaji} />
                      )}
                    </VStack>
                  </HStack>
                </VStack>
                <VStack space={2}>
                  <LabelInput text="Kualifikasi" />
                  <TextArea
                    placeholder="Masukan kualifikasi (cth: Usia maksimal 35 tahun)"
                    value={onEditLowongan.values.kualifikasi}
                    onChangeText={onEditLowongan.handleChange('kualifikasi')}
                  />
                  {onEditLowongan.errors.kualifikasi && onEditLowongan.touched.kualifikasi && (
                    <ErrorInput error={onEditLowongan.errors.kualifikasi} />
                  )}
                </VStack>
                <VStack space={2}>
                  <LabelInput text="Deskripsi Pekerjaan" />
                  <TextArea
                    placeholder="Masukan deskripsi pekerjaan (cth: tanggung jawab membersihkan rumah 2 lantai)"
                    value={onEditLowongan.values.deskripsi_lowongan}
                    onChangeText={onEditLowongan.handleChange('deskripsi_lowongan')}
                  />
                  {onEditLowongan.errors.deskripsi_lowongan && onEditLowongan.touched.deskripsi_lowongan && (
                    <ErrorInput error={onEditLowongan.errors.deskripsi_lowongan} />
                  )}
                </VStack>
                <VStack space={2}>
                  <LabelInput text="Fasilitas" />
                  <TextArea
                    placeholder="MasukkMasukan fasilitas (cth: Kamar tidur dan kamar mandi pribadi)"
                    value={onEditLowongan.values.fasilitas}
                    onChangeText={onEditLowongan.handleChange('fasilitas')}
                  />
                </VStack>
                <VStack space={2}>
                  <LabelInput text="Lokasi" />
                  <HStack space={2}>
                    <VStack width={width / 2.2}>
                      <Select
                        selectedValue={onEditLowongan.values.provinsi_lowongan}
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
                          endIcon: <CheckIcon size={1} />,
                        }}
                        onValueChange={(itemValue) => {
                          setProvinsi(itemValue);
                          onEditLowongan.setFieldValue('provinsi_lowongan', itemValue);
                        }}
                      >
                        {dataProvinsi?.map((item, index) => (
                          <SelectItem label={item.nama} value={`${item.id},${item.nama}`} key={index} />
                        ))}
                      </Select>
                      {onEditLowongan.errors.provinsi_lowongan && onEditLowongan.touched.provinsi_lowongan && (
                        <ErrorInput error={onEditLowongan.errors.provinsi_lowongan} />
                      )}
                    </VStack>
                    <VStack width={width / 2.2}>
                      <Select
                        selectedValue={onEditLowongan.values.kota_lowongan}
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
                          endIcon: <CheckIcon size={1} />,
                        }}
                        onValueChange={(itemValue) => onEditLowongan.setFieldValue('kota_lowongan', itemValue)}
                      >
                        {dataKota?.map((item, idx) => (
                          <SelectItem label={item.nama} value={item.nama} key={idx} />
                        ))}
                      </Select>
                    </VStack>
                  </HStack>
                  <Box mt={2}>
                    <TextArea
                      placeholder="Masukan alamat lengkap (cth: Jalan Kalibata Raya no.1)"
                      value={onEditLowongan.values.alamat_lengkap}
                      onChangeText={onEditLowongan.handleChange('alamat_lengkap')}
                    />
                    {onEditLowongan.errors.alamat_lengkap && onEditLowongan.touched.alamat_lengkap && (
                      <ErrorInput error={onEditLowongan.errors.alamat_lengkap} />
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
            </VStack>
          </ScrollView>
        </KeyboardAwareScrollView>
        <Box backgroundColor={colors.white} pt={4} px={width / 28} justifyContent="center" alignItems="center" width={width}>
          {!isLoading ? <Button onPress={onEditLowongan.handleSubmit} text="Simpan" fontSize={width} width={width / 1.1} /> : <LoadingButton />}
        </Box>
      </View>
    </View>
  );
};

export default EditLowongan;
