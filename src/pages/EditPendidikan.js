import { Dimensions, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import { HStack, ScrollView, Text, VStack, View } from 'native-base';
import useLoading from '../store/loadingStore';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { API } from '../config/api';
import { showError, showSuccess } from '../utils/showMessages';
import { getData } from '../utils/getData';
import { colors } from '../utils/colors';
import { Button, ErrorInput, Header, Input, LabelInput, LoadingButton } from '../components';
import { ChevronBack, Calender } from '../assets';
import { fonts } from '../utils/fonts';

const EditPendidikan = ({ navigation, route }) => {
  const { width, height } = Dimensions.get('window');

  const { uuid } = route.params;
  const isFocused = navigation.isFocused();

  const { setLoading, loading } = useLoading();

  const onEditPendidikan = useFormik({
    initialValues: {
      nama: '',
      tahun_awal: '',
      tahun_akhir: '',
    },
    enableReinitialize: true,
    validateOnChange: true,
    validationSchema: Yup.object({
      nama: Yup.string().required('Nama sekolah tidak boleh kosong'),
      tahun_awal: Yup.string().required('Tahun masuk wajib diisi'),
      tahun_akhir: Yup.string()
        .required('Tahun akhir wajib diisi')
        .test('tahun_akhir', 'Tahun akhir tidak boleh kurang dari tahun masuk', function (value) {
          return this.parent.tahun_awal <= value;
        }),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      const payload = {
        nama: values.nama,
        tahun_awal: Number(values.tahun_awal),
        tahun_akhir: Number(values.tahun_akhir),
      };

      try {
        const res = await API.patch(`/pendidikan/edit/${uuid}`, payload);
        if (res.data.message === 'EDIT_PENDIDIKAN_SUCCESS') {
          showSuccess('Pendidikan berhasil diubah');
          navigation.navigate('MainApp');
          setLoading(true);
        } else {
          showError('Gagal mengubah pendidikan, coba lagi nanti');
        }
      } catch ({ response }) {
        setLoading(false);
        switch (response.data.message) {
          case 'PENDIDIKAN_NOT_FOUND':
            showError('Pendidikan tidak ditemukan');
            break;
          default:
            showError(response.data.message);
            break;
        }
      }
    },
  });

  useEffect(() => {
    const getDetailPendidikan = async () => {
      const res = await getData(`/pendidikan/id/${uuid}`);
      // setDetailPendidikan(res.data);
      onEditPendidikan.setFieldValue('nama', res?.data?.nama_pendidikan);
      onEditPendidikan.setFieldValue('tahun_awal', res?.data?.tahun_awal.toString());
      onEditPendidikan.setFieldValue('tahun_akhir', res?.data?.tahun_akhir.toString());
    };

    getDetailPendidikan();
  }, [isFocused, uuid]);

  const handleDelete = async () => {
    setLoading(true);
    try {
      setLoading(false);
      const resp = await API.delete(`/pendidikan/delete/${uuid}`);
      if (resp.data.message === 'DELETE_PENDIDIKAN_SUCCESS') {
        showSuccess('Pendidikan berhasil dihapus');
        navigation.navigate('MainApp');
        setLoading(true);
      } else {
        showError('pendidikan gagal dihapus');
      }
    } catch ({ response }) {
      setLoading(false);
      switch (response.data.message) {
        case 'PENDIDIKAN_NOT_FOUND':
          showError('Pendidikan tidak ditemukan');
          break;
        default:
          showError(response.data.message);
          break;
      }
    }
  };

  return (
    <View backgroundColor={colors.white} minH={height} height={height}>
      <Header>
        <HStack space={4}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronBack width={28} />
          </TouchableOpacity>
          <Text fontFamily={fonts.primary[600]} fontSize={width / 24} color="black">
            Edit Pendidikan
          </Text>
        </HStack>
      </Header>
      <VStack mt={5} height={height / 1.2} justifyContent="space-between" px={width / 28}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <VStack space={5}>
            <VStack space={2}>
              <LabelInput text="Nama Sekolah" />
              <Input placeholder="Masukkan nama sekolah" value={onEditPendidikan.values.nama} onChangeText={onEditPendidikan.handleChange('nama')} />
              {onEditPendidikan.errors.nama && onEditPendidikan.touched.nama && <ErrorInput error={onEditPendidikan.errors.nama} />}
            </VStack>
            <HStack space={2}>
              <VStack width={width / 2.2} space={2}>
                <LabelInput text="Tahun Mulai" />
                <Input
                  placeholder="Ketik tahun"
                  icon={<Calender />}
                  onChangeText={onEditPendidikan.handleChange('tahun_awal')}
                  value={onEditPendidikan.values.tahun_awal}
                />
                {onEditPendidikan.errors.tahun_awal && onEditPendidikan.touched.tahun_awal && (
                  <ErrorInput error={onEditPendidikan.errors.tahun_awal} />
                )}
              </VStack>
              <VStack width={width / 2.2} space={2}>
                <LabelInput text="Tahun Selesai" />
                <Input
                  placeholder="Ketik tahun"
                  icon={<Calender />}
                  onChangeText={onEditPendidikan.handleChange('tahun_akhir')}
                  value={onEditPendidikan.values.tahun_akhir}
                />
                {onEditPendidikan.errors.tahun_akhir && onEditPendidikan.touched.tahun_akhir && (
                  <ErrorInput error={onEditPendidikan.errors.tahun_akhir} />
                )}
              </VStack>
            </HStack>
          </VStack>
        </ScrollView>
        {loading ? (
          <LoadingButton />
        ) : (
          <HStack alignItems="center" justifyContent="space-between" space={1}>
            <Button fontSize={width} onPress={handleDelete} text="Hapus" type="red-border" width={width / 3.5} />
            <Button type="primary" onPress={onEditPendidikan.handleSubmit} text="Simpan" width={width / 1.6} fontSize={width} />
          </HStack>
        )}
      </VStack>
    </View>
  );
};

export default EditPendidikan;
