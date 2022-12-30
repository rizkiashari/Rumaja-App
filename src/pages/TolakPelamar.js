import { StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import React from 'react';
import { fonts } from '../utils/fonts';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { HStack, ScrollView, Text, View, VStack } from 'native-base';
import useLoading from '../store/loadingStore';
import { showError } from '../utils/showMessages';
import { API } from '../config/api';
import { colors } from '../utils/colors';
import { Button, ErrorInput, Header, LabelInput, LoadingButton, TextArea } from '../components';
import { ChevronBack } from '../assets';

const TolakPelamar = ({ navigation, route }) => {
  const { width, height } = Dimensions.get('window');

  const { uuid } = route.params;

  const { setLoading, loading } = useLoading();

  const onTolakPelamar = useFormik({
    initialValues: {
      catatan_riwayat_penyedia: '',
    },
    validateOnChange: true,
    validationSchema: Yup.object({
      catatan_riwayat_penyedia: Yup.string().required('Catatan riwayat harus diisi'),
    }),
    onSubmit: async (values) => {
      setLoading(true);

      const payload = {
        status_riwayat: 'ditolak',
        catatan_riwayat_penyedia: values.catatan_riwayat_penyedia,
      };

      try {
        const res = await API.patch(`/lamaran/tolak/${uuid}`, payload);
        setLoading(false);
        if (res.data.message === 'SUCCESS_TOLAK_LAMARAN') {
          navigation.replace('SuksesTolakPelamar', {
            title: 'Lamaran berhasil ditolak!',
            subTitle: 'Lamaran yang anda dapat berhasil ditolak. Alasan penolakan telah dikirim ke pelamar.',
          });
        } else {
          showError('Gagal menolak pelamar');
        }
      } catch ({ response }) {
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
            <LabelInput text="Alasan menolak lamaran" />
            <TextArea
              placeholder="Masukan alasan"
              onChangeText={onTolakPelamar.handleChange('catatan_riwayat_penyedia')}
              value={onTolakPelamar.values.catatan_riwayat_penyedia}
            />
            {onTolakPelamar.errors.catatan_riwayat_penyedia && onTolakPelamar.touched.catatan_riwayat_penyedia && (
              <ErrorInput error={onTolakPelamar.errors.catatan_riwayat_penyedia} />
            )}
          </VStack>
          {loading ? (
            <LoadingButton />
          ) : (
            <Button type="primary" text="Konfirmasi" fontSize={width} onPress={onTolakPelamar.handleSubmit} width={width / 1.1} />
          )}
        </VStack>
      </ScrollView>
    </View>
  );
};

export default TolakPelamar;

const styles = StyleSheet.create({});
