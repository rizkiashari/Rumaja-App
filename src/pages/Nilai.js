import { StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { HStack, ScrollView, Text, VStack, View } from 'native-base';
import useLoading from '../store/loadingStore';
import useUserStore from '../store/userStore';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { postWithJson } from '../utils/postData';
import { showError, showSuccess } from '../utils/showMessages';
import { colors } from '../utils/colors';
import { Button, ErrorInput, Header, LabelInput, LoadingButton, TextArea } from '../components';
import { ChevronBack } from '../assets';
import { fonts } from '../utils/fonts';
import { AirbnbRating } from 'react-native-ratings';
import { API } from '../config/api';

const Nilai = ({ navigation, route }) => {
  const { width, height } = Dimensions.get('window');

  const { userData } = useUserStore();

  const [isLoading, setIsLoading] = useState(false);

  const { setLoading } = useLoading();

  const { id_lowongan, id_pencari, uuid_riwayat } = route.params;

  const ulasanPencari = useFormik({
    initialValues: {
      rating: 0,
      catatan: '',
    },
    validateOnChange: true,
    validationSchema: Yup.object({
      rating: Yup.number().required('Rating harus diisi').min(1),
      catatan: Yup.string().required('Catatan harus diisi'),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setIsLoading(true);
        const payload = {
          id_lowongan: id_lowongan,
          id_pencari: id_pencari,
          rating: values.rating,
          catatan: values.catatan,
        };

        const res = await API.patch(`/lamaran/akhiri-pekerjaan/${uuid_riwayat}`);

        if (res.data.message === 'SUCCESS_AKHIRI_PEKERJAAN') {
          setLoading(true);

          const addUlasan = await postWithJson('/ulasan/add', payload);
          setLoading(false);
          if (addUlasan.message === 'ADD_ULASAN_SUCCESS') {
            navigation.replace('SuksesMengakhiriPekerjaan');
            setIsLoading(false);
          } else {
            setIsLoading(false);
            showError('Gagal mengirim ulasan');
          }
        } else {
          setIsLoading(false);
          showError('Gagal mengakhiri pekerjaan');
        }
      } catch (error) {
        setIsLoading(false);
        setLoading(false);
        showError('Gagal mengakhiri pekerjaan');
      }
    },
  });

  const masukkanUntukPenyedia = useFormik({
    initialValues: {
      detail_masukkan: '',
    },
    validateOnChange: true,
    validationSchema: Yup.object({
      detail_masukkan: Yup.string().required('Masukkan harus diisi'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setIsLoading(true);
      const payload = {
        id_lowongan: id_lowongan,
        detail_masukkan: values.detail_masukkan,
      };

      const res = await postWithJson('/masukkan/add', payload);
      setLoading(false);
      if (res.message === 'ADD_MASUKKAN_SUCCESS') {
        navigation.replace('MainApp');
        showSuccess('Berhasil melakukan masukan untuk penyedia');
        setIsLoading(false);
      } else {
        setIsLoading(false);
        showError('Gagal melakukan masukan untuk penyedia');
      }
    },
  });

  return (
    <>
      {userData.id_role === 3 && (
        <View bgColor={colors.white} minH={height}>
          <Header>
            <HStack space="4">
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <ChevronBack width={28} />
              </TouchableOpacity>
              <Text fontFamily={fonts.primary[600]} fontSize={width / 24} color="black">
                Nilai
              </Text>
            </HStack>
          </Header>

          <ScrollView showsVerticalScrollIndicator={false}>
            <VStack mt={3} height={height / 1.2} justifyContent="space-between" px={width / 28}>
              <VStack space={width / 20}>
                {/* Penilaian */}
                <VStack space={width / 40}>
                  <Text fontFamily={fonts.primary[400]} fontSize={width / 32} color={colors.text.black70}>
                    Bagaimana kinerja dari pekerja?
                  </Text>
                  <HStack marginTop="-4">
                    <AirbnbRating
                      defaultRating={1}
                      imageSize={20}
                      count={5}
                      size={20}
                      reviewColor={colors.text.black50}
                      reviewSize={13}
                      showRating={true}
                      reviews={['Kurang!', 'Perlu ditingkatkan!', 'Lumayan!', 'Pekerjaan Mantap!', 'Luar biasa!']}
                      ratingContainerStyle={{
                        paddingBottom: 10,
                      }}
                      onFinishRating={(rating) => {
                        ulasanPencari.setFieldValue('rating', rating);
                      }}
                    />
                  </HStack>
                  {ulasanPencari.touched.rating && ulasanPencari.errors.rating && <ErrorInput error={ulasanPencari.errors.rating} />}
                </VStack>
                {/* Ulasan */}
                <VStack space={width / 40}>
                  <LabelInput text="Ulasan untuk pekerja" />
                  <TextArea
                    placeholder="Tulis ulasan anda"
                    onChangeText={ulasanPencari.handleChange('catatan')}
                    value={ulasanPencari.values.catatan}
                  />
                  {ulasanPencari.touched.catatan && ulasanPencari.errors.catatan && <ErrorInput error={ulasanPencari.errors.catatan} />}
                </VStack>
              </VStack>
              {isLoading ? (
                <LoadingButton />
              ) : (
                <Button
                  type="progres"
                  text="Akhiri Pekerjaan"
                  onPress={ulasanPencari.handleSubmit}
                  bgColor={colors.red}
                  fontSize={width}
                  width={width / 1.1}
                />
              )}
            </VStack>
          </ScrollView>
        </View>
      )}
      {userData.id_role === 2 && (
        <View bgColor={colors.white} minH={height}>
          <Header>
            <HStack space="4">
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <ChevronBack width={28} />
              </TouchableOpacity>
              <Text fontFamily={fonts.primary[600]} fontSize={width / 24} color="black">
                Masukan
              </Text>
            </HStack>
          </Header>
          <ScrollView showsVerticalScrollIndicator={false}>
            <VStack mt={3} height={height / 1.2} justifyContent="space-between" px={width / 28}>
              <VStack space={width / 20}>
                {/* Masukkan */}
                <VStack space={width / 40}>
                  <LabelInput text="Masukkan untuk penyedia" />
                  <TextArea
                    placeholder="Tulis masukkan anda"
                    onChangeText={masukkanUntukPenyedia.handleChange('detail_masukkan')}
                    value={masukkanUntukPenyedia.values.detail_masukkan}
                  />
                  {masukkanUntukPenyedia.touched.detail_masukkan && masukkanUntukPenyedia.errors.detail_masukkan && (
                    <ErrorInput error={masukkanUntukPenyedia.errors.detail_masukkan} />
                  )}
                </VStack>
              </VStack>
              {isLoading ? (
                <LoadingButton />
              ) : (
                <Button type="primary" text="Konfirmasi" onPress={masukkanUntukPenyedia.handleSubmit} fontSize={width} width={width / 1.1} />
              )}
            </VStack>
          </ScrollView>
        </View>
      )}
    </>
  );
};

export default Nilai;

const styles = StyleSheet.create({});
