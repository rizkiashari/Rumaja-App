import { Dimensions, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { postWithJson } from '../utils/postData';
import { showError } from '../utils/showMessages';
import { HStack, ScrollView, Text, VStack, View } from 'native-base';
import { colors } from '../utils/colors';
import { Button, ErrorInput, Header, Input, LabelInput } from '../components';
import { ChevronBack } from '../assets';
import { fonts } from '../utils/fonts';

const UbahKataSandi = ({ navigation }) => {
  const { width, height } = Dimensions.get('window');

  const onSubmitKataSandi = useFormik({
    initialValues: {
      password: '',
      newPassword: '',
      confirmPassword: '',
    },
    validateOnChange: true,
    enableReinitialize: true,
    validationSchema: Yup.object({
      password: Yup.string().required('Kata Sandi harus diisi'),
      newPassword: Yup.string().min(8, 'Minimal 8 Karakter Huruf').required('Kata Sandi harus diisi'),
      confirmPassword: Yup.string()
        .when('newPassword', {
          is: (val) => (val && val.length > 0 ? true : false),
          then: Yup.string().oneOf([Yup.ref('newPassword')], 'Kata Sandi Harus Sama'),
        })
        .required('Konfirmasi Kata Sandi harus diisi'),
    }),
    onSubmit: async (values) => {
      const payload = {
        password: values.password,
        newPassword: values.newPassword,
        confirmPasword: values.confirmPassword,
      };

      const res = await postWithJson('/auth/change-password', payload);

      switch (res.message) {
        case 'CONFIRM_PASSWORD_NOT_MATCH':
          showError('Konfirmasi Kata Sandi Tidak Sama');
          break;
        case 'PASSWORD_NOT_MATCH':
          showError('Kata Sandi Tidak Sama');
          break;
        case 'SUCCESS_PASSWORD_CHANGED':
          navigation.replace('SuksesGantiPassword');
          break;
        default:
          showError('Gagal Mengubah Kata Sandi');
          break;
      }
    },
  });

  return (
    <SafeAreaView>
      <View bgColor={colors.white} minH={height}>
        <Header>
          <HStack space={4}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ChevronBack width={28} />
            </TouchableOpacity>
            <Text fontFamily={fonts.primary[600]} fontSize={width / 24} color="black">
              Ubah Kata Sandi
            </Text>
          </HStack>
        </Header>
        <View px={width / 28} height={height / 1.2} justifyContent="space-between">
          <ScrollView height={height}>
            <VStack space={4} pt={height / 40}>
              <VStack space={2}>
                <LabelInput text="Kata Sandi Sekarang" />
                <Input
                  type="password"
                  value={onSubmitKataSandi.values.password}
                  onChangeText={onSubmitKataSandi.handleChange('password')}
                  placeholder="Masukkan Kata Sandi Sekarang"
                />
                {onSubmitKataSandi.errors.password && onSubmitKataSandi.touched.password && <ErrorInput error={onSubmitKataSandi.errors.password} />}
              </VStack>
              <VStack space={2}>
                <LabelInput text="Kata Sandi Baru" />
                <Input
                  type="password"
                  value={onSubmitKataSandi.values.newPassword}
                  onChangeText={onSubmitKataSandi.handleChange('newPassword')}
                  placeholder="Masukkan Kata Sandi Baru"
                />
                {onSubmitKataSandi.errors.newPassword && onSubmitKataSandi.touched.newPassword && (
                  <ErrorInput error={onSubmitKataSandi.errors.newPassword} />
                )}
              </VStack>
              <VStack space={2}>
                <LabelInput text="Konfirmasi Kata Sandi Baru" />
                <Input
                  type="password"
                  value={onSubmitKataSandi.values.confirmPassword}
                  onChangeText={onSubmitKataSandi.handleChange('confirmPassword')}
                  placeholder="Masukkan Konfirmasi Kata Sandi Baru"
                />
                {onSubmitKataSandi.errors.confirmPassword && onSubmitKataSandi.touched.confirmPassword && (
                  <ErrorInput error={onSubmitKataSandi.errors.confirmPassword} />
                )}
              </VStack>
            </VStack>
          </ScrollView>
          <HStack mb="-4" alignItems="center" justifyContent="space-between" space={2}>
            <TouchableOpacity
              style={styles.btnReset(width, onSubmitKataSandi)}
              onPress={() => {
                onSubmitKataSandi.resetForm();
              }}
              disabled={
                onSubmitKataSandi.values.password === '' &&
                onSubmitKataSandi.values.newPassword === '' &&
                onSubmitKataSandi.values.confirmPassword === ''
              }
            >
              <Text
                fontFamily={fonts.primary[500]}
                color={
                  onSubmitKataSandi.values.password === '' &&
                  onSubmitKataSandi.values.newPassword === '' &&
                  onSubmitKataSandi.values.confirmPassword === ''
                    ? colors.text.black50
                    : '#C86161'
                }
                textAlign="center"
                fontSize={width / 28}
              >
                Reset
              </Text>
            </TouchableOpacity>
            <Button type="password" fontSize={width} onPress={onSubmitKataSandi.handleSubmit} width={width / 1.6} text="Simpan" />
          </HStack>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default UbahKataSandi;

const styles = StyleSheet.create({
  btnReset: (width, onSubmitKataSandi) => ({
    backgroundColor:
      onSubmitKataSandi.values.password === '' && onSubmitKataSandi.values.newPassword === '' && onSubmitKataSandi.values.confirmPassword === ''
        ? colors.text.black20
        : colors.white,
    width: width / 3.5,
    borderColor:
      onSubmitKataSandi.values.password === '' && onSubmitKataSandi.values.newPassword === '' && onSubmitKataSandi.values.confirmPassword === ''
        ? colors.text.black20
        : '#C86161',
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 8,
  }),
});
