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

const TolakTawaran = ({ navigation, route }) => {
  const { width, height } = Dimensions.get('window');

  const { uuid } = route.params;

  const { setLoading, loading } = useLoading();

  const onTolakTawaran = useFormik({
    initialValues: {
      catatan_riwayat_pencari: '',
    },
    validateOnChange: true,
    validationSchema: Yup.object({
      catatan_riwayat_pencari: Yup.string().required('Catatan riwayat harus diisi'),
    }),
    onSubmit: async (values) => {
      setLoading(true);

      const payload = {
        catatan_riwayat_pencari: values.catatan_riwayat_pencari,
      };

      try {
        const res = await API.patch(`/tawarkan/tolak/${uuid}`, payload);
        setLoading(false);
        if (res.data.message === 'SUCCESS_TOLAK_TAWARAN') {
          navigation.replace('SuksesTolakTawaran');
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
            Tolak Tawaran
          </Text>
        </HStack>
      </Header>

      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack mt={5} height={height / 1.2} justifyContent="space-between" px={width / 28}>
          <VStack space={2}>
            <LabelInput text="Alasan menolak tawaran" />
            <TextArea
              placeholder="Masukkan alasan"
              onChangeText={onTolakTawaran.handleChange('catatan_riwayat_pencari')}
              value={onTolakTawaran.values.catatan_riwayat_pencari}
            />
            {onTolakTawaran.errors.catatan_riwayat_pencari && onTolakTawaran.touched.catatan_riwayat_pencari && (
              <ErrorInput error={onTolakTawaran.errors.catatan_riwayat_pencari} />
            )}
          </VStack>
          {loading ? <LoadingButton /> : <Button type="primary" fontSize={width} text="Konfirmasi" onPress={onTolakTawaran.handleSubmit} />}
        </VStack>
      </ScrollView>
    </View>
  );
};

export default TolakTawaran;
