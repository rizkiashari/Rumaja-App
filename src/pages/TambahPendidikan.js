import { Dimensions, TouchableOpacity } from 'react-native';
import React from 'react';
import useLoading from '../store/loadingStore';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { showError, showSuccess } from '../utils/showMessages';
import { HStack, ScrollView, Text, VStack, View } from 'native-base';
import { Button, ErrorInput, Header, Input, LabelInput, LoadingButton } from '../components';
import { ChevronBack } from '../assets';
import { fonts } from '../utils/fonts';
import { colors } from '../utils/colors';
import { postWithJson } from '../utils/postData';

const TambahPendidikan = ({ navigation }) => {
  const { width, height } = Dimensions.get('window');

  const { setLoading, loading } = useLoading();

  const onTambahPendidikan = useFormik({
    initialValues: {
      nama: '',
      tahun_masuk: '',
      tahun_akhir: '',
    },
    validateOnChange: true,
    validationSchema: Yup.object({
      nama: Yup.string().required('Nama sekolah tidak boleh kosong'),
      tahun_masuk: Yup.string().required('Tahun masuk wajib diisi'),
      tahun_akhir: Yup.string()
        .required('Tahun akhir wajib diisi')
        .test('tahun_akhir', 'Tahun akhir tidak boleh kurang dari tahun masuk', function (value) {
          return this.parent.tahun_masuk <= value;
        }),
    }),
    onSubmit: async (values) => {
      setLoading(true);

      const payload = {
        nama: values.nama,
        tahun_awal: values.tahun_masuk,
        tahun_akhir: values.tahun_akhir,
      };

      const res = await postWithJson('/pendidikan/add', payload);
      setLoading(false);

      if (res.message === 'ADD_PENDIDIKAN_SUCCESS') {
        showSuccess('Pendidikan berhasil ditambahkan');
        navigation.navigate('MainApp');
        setLoading(true);
        onTambahPendidikan.resetForm();
      } else {
        setLoading(false);
        showError('Gagal menambahkan pendidikan, coba lagi nanti');
      }
    },
  });

  return (
    <View backgroundColor={colors.white} minH={height}>
      <Header>
        <HStack space={4}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronBack width={28} />
          </TouchableOpacity>
          <Text fontFamily={fonts.primary[600]} fontSize={width / 24} color="black">
            Tambah Pendidikan
          </Text>
        </HStack>
      </Header>
      <VStack mt={5} height={height / 1.2} justifyContent="space-between" px={width / 28}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <VStack space={5}>
            <VStack space={2}>
              <LabelInput text="Nama Sekolah" />
              <Input
                placeholder="Masukkan nama sekolah (cth: SMK Negeri 1)"
                value={onTambahPendidikan.values.nama}
                onChangeText={onTambahPendidikan.handleChange('nama')}
              />
              {onTambahPendidikan.errors.nama && onTambahPendidikan.touched.nama && <ErrorInput error={onTambahPendidikan.errors.nama} />}
            </VStack>
            <HStack space={2}>
              <VStack width={width / 2.2} space={2}>
                <LabelInput text="Tahun Mulai" />
                <Input
                  placeholder="Masukkan tahun"
                  type="number"
                  value={onTambahPendidikan.values.tahun_masuk}
                  onChangeText={onTambahPendidikan.handleChange('tahun_masuk')}
                  // icon={<Calender />}
                />
                {onTambahPendidikan.errors.tahun_masuk && onTambahPendidikan.touched.tahun_masuk && (
                  <ErrorInput error={onTambahPendidikan.errors.tahun_masuk} />
                )}
              </VStack>
              <VStack width={width / 2.2} space={2}>
                <LabelInput text="Tahun Selesai" />
                <Input
                  placeholder="Masukkan tahun"
                  value={onTambahPendidikan.values.tahun_akhir}
                  onChangeText={onTambahPendidikan.handleChange('tahun_akhir')}
                  // icon={<Calender />}
                  type="number"
                />
                {onTambahPendidikan.errors.tahun_akhir && onTambahPendidikan.touched.tahun_akhir && (
                  <ErrorInput error={onTambahPendidikan.errors.tahun_akhir} />
                )}
              </VStack>
            </HStack>
          </VStack>
        </ScrollView>
        {loading ? <LoadingButton /> : <Button onPress={onTambahPendidikan.handleSubmit} text="Simpan" fontSize={width} width={width / 1.1} />}
      </VStack>
    </View>
  );
};

export default TambahPendidikan;
