import { Dimensions, TouchableOpacity } from 'react-native';
import React from 'react';
import { HStack, ScrollView, Text, VStack, View } from 'native-base';
import useLoading from '../store/loadingStore';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { API } from '../config/api';
import { showError } from '../utils/showMessages';
import { colors } from '../utils/colors';
import { Button, ErrorInput, Header, LabelInput, LoadingButton, TextArea } from '../components';
import { ChevronBack } from '../assets';
import { fonts } from '../utils/fonts';
import useUserStore from '../store/userStore';

const TolakLamaran = ({ navigation, route }) => {
  const { width, height } = Dimensions.get('window');

  const { uuid } = route.params;

  const { setLoading, loading } = useLoading();

  const onTolakLamaran = useFormik({
    initialValues: {
      catatan_tolak_pencari: '',
    },
    validateOnChange: true,
    validationSchema: Yup.object({
      catatan_tolak_pencari: Yup.string().required('Catatan riwayat harus diisi'),
    }),
    onSubmit: async (values) => {
      setLoading(true);

      const payload = {
        status_riwayat: 'ditolak',
        catatan_tolak_pencari: values.catatan_tolak_pencari,
      };

      try {
        const res = await API.patch(`/lamaran/tolak/${uuid}`, payload);
        setLoading(false);
        if (res.data.message === 'SUCCESS_TOLAK_LAMARAN') {
          navigation.replace('SuksesTolakPelamar', {
            title: 'Tawaran berhasil ditolak!',
            subTitle: 'Tawaran kerja yang anda dapat berhasil ditolak. Alasan penolakan telah dikirim ke penyedia kerja.',
          });
          setLoading(true);
        } else {
          showError('Gagal menolak pelamar');
        }
      } catch ({ response }) {
        setLoading(false);
        showError(response.data.message);
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
            Tolak Pelamar
          </Text>
        </HStack>
      </Header>

      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack mt={5} height={height / 1.2} justifyContent="space-between" px={width / 28}>
          <VStack space={2}>
            <LabelInput text="Alasan menolak tawaran" />
            <TextArea
              onChangeText={onTolakLamaran.handleChange('catatan_tolak_pencari')}
              value={onTolakLamaran.values.catatan_tolak_pencari}
              placeholder="Masukkan alasan"
            />
            {onTolakLamaran.errors.catatan_tolak_pencari && onTolakLamaran.touched.catatan_tolak_pencari && (
              <ErrorInput error={onTolakLamaran.errors.catatan_tolak_pencari} />
            )}
          </VStack>
          {loading ? <LoadingButton /> : <Button type="primary" fontSize={width} text="Konfirmasi" onPress={onTolakLamaran.handleSubmit} />}
        </VStack>
      </ScrollView>
    </View>
  );
};

export default TolakLamaran;
