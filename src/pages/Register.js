import { Dimensions, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Box, CheckIcon, HStack, ScrollView, Select, Text, VStack } from 'native-base';
import { fonts } from '../utils/fonts';
import { colors } from '../utils/colors';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getData } from '../utils/getData';
import { postWithJson } from '../utils/postData';
import { showSuccess, showError } from '../utils/showMessages';
import { getDataLocal, removeLocalStorage } from '../utils/localStorage';
import { Button, Divider, ErrorInput, Input, LabelInput, LoadingButton, SelectItem } from '../components';

const Register = ({ navigation }) => {
  const { width } = Dimensions.get('window');

  const [role, setRole] = useState('');
  const [idBidang, setIdBidang] = useState('');

  const getRole = async () => {
    getDataLocal('peran').then((res) => {
      setRole(res);
    });
  };

  const getBidangPekerjaan = () => {
    getDataLocal('id_bidang').then((res) => {
      setIdBidang(res);
    });
  };

  const [isLoading, setIsLoading] = useState(false);

  const [dataProvinsi, setDataProvinsi] = useState([]);
  const [dataKota, setDataKota] = useState([]);
  const [currentProvinsi, setCurrentProvinsi] = useState('');

  const getDataProvinsi = async () => {
    const resp = await getData('/wilayah-indo/provinsi');
    setDataProvinsi(resp.data);
  };

  const getDataKota = async (id) => {
    if (id === '') {
      return;
    }
    const resp = await getData(`/wilayah-indo/kota?id_provinsi=${id?.split(',')[0]}`);
    setDataKota(resp.data);
  };

  useEffect(() => {
    getDataProvinsi();
    getDataKota(currentProvinsi);
    getRole();
    getBidangPekerjaan();
  }, [currentProvinsi]);

  const registerUser = useFormik({
    initialValues: {
      nama_lengkap: '',
      email: '',
      nomor_wa: '',
      domisili_kota: '',
      domisili_provinsi: '',
      password: '',
      konfirmasi_password: '',
    },
    validateOnChange: true,
    validationSchema: Yup.object({
      nama_lengkap: Yup.string().required('Nama lengkap harus diisi').min(3, 'Nama lengkap minimal 3 karakter'),
      email: Yup.string().email('Email tidak valid').required('Email tidak boleh kosong'),
      nomor_wa: Yup.string()
        .required('Nomor WA harus diisi')
        .matches(/^[0-9]+$/, 'Nomor Telepon harus berupa angka')
        .matches(/^(08)/, 'Nomor Telepon harus diawali dengan 08')
        .min(10, 'Nomor Telepon minimal 10 karakter')
        .max(17, 'Nomor Telepon maksimal 17 karakter'),
      domisili_kota: Yup.string().required('Kota harus diisi'),
      domisili_provinsi: Yup.string().required('Provinsi harus diisi'),
      password: Yup.string().required('Password tidak boleh kosong').min(8, 'Password minimal 8 karakter'),
      konfirmasi_password: Yup.string().when('password', {
        is: (val) => (val && val.length > 0 ? true : false),
        then: Yup.string().oneOf([Yup.ref('password')], 'Maaf password tidak sama'),
      }),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);

      const payload = {
        nama_user: values.nama_lengkap,
        email: values.email,
        password: values.password,
        role: role === 'pencari' ? 2 : 3,
        bidang_kerja: idBidang,
        nomor_wa: values.nomor_wa,
        domisili_provinsi: values.domisili_provinsi,
        domisili_kota: values.domisili_kota,
      };

      const resp = await postWithJson('/auth/register', payload);
      setIsLoading(false);
      switch (resp.message) {
        case 'EMAIL_ALREADY_EXIST':
          showError('Email sudah terdaftar');
          break;
        case 'USER_REGISTER_SUCCESS':
          removeLocalStorage('peran');
          removeLocalStorage('id_bidang');
          showSuccess('Berhasil mendaftar');
          setTimeout(() => {
            navigation.navigate('Login');
          }, 1000);
          registerUser.resetForm();
          break;
        default:
          showError(resp.message);
          break;
      }
    },
  });

  return (
    <ScrollView showsVerticalScrollIndicator={false} bgColor={colors.white}>
      <Box pt="12" px={width / 28} pb="5" h="100%" width="full" maxHeight="full">
        <VStack space={5}>
          <VStack justifyContent="center" alignItems="center">
            <Text fontFamily={fonts.primary[600]} color="black" fontSize={width / 20}>
              Buat Akun
            </Text>
          </VStack>
          <VStack space={2}>
            <LabelInput text="Nama Lengkap" />
            <Input
              placeholder="Masukkan nama lengkap"
              value={registerUser.values.nama_lengkap}
              onChangeText={registerUser.handleChange('nama_lengkap')}
            />
            {registerUser.touched.nama_lengkap && registerUser.errors.nama_lengkap ? <ErrorInput error={registerUser.errors.nama_lengkap} /> : null}
          </VStack>
          <VStack space={2}>
            <LabelInput text="Alamat Email" />
            <Input
              type="email"
              placeholder="Masukkan alamat email (cth: nama@gmail.com)"
              value={registerUser.values.email}
              onChangeText={registerUser.handleChange('email')}
            />
            {registerUser.touched.email && registerUser.errors.email ? <ErrorInput error={registerUser.errors.email} /> : null}
          </VStack>
          <VStack space={2}>
            <LabelInput text="Nomor Telepon" />
            <Input
              type="number"
              placeholder="Masukkan nomor telepon (cth: 08xxxxxxxxxx)"
              value={registerUser.values.nomor_wa}
              onChangeText={registerUser.handleChange('nomor_wa')}
            />
            {registerUser.touched.nomor_wa && registerUser.errors.nomor_wa ? <ErrorInput error={registerUser.errors.nomor_wa} /> : null}
          </VStack>
          <VStack space={2}>
            <LabelInput text="Domisili" />
            <HStack w="full" space={3}>
              <VStack w={width / 2.2}>
                <Select
                  selectedValue={registerUser.values.domisili_provinsi}
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
                    registerUser.setFieldValue('domisili_provinsi', itemValue);
                    registerUser.setFieldValue('domisili_kota', '');
                  }}
                >
                  {dataProvinsi?.map((item, index) => (
                    <SelectItem key={index} label={item.nama} value={`${item.id},${item.nama}`} />
                  ))}
                </Select>
                {registerUser.touched.domisili_provinsi && registerUser.errors.domisili_provinsi ? (
                  <ErrorInput error={registerUser.errors.domisili_provinsi} />
                ) : null}
              </VStack>
              <VStack w={width / 2.2}>
                <Select
                  selectedValue={registerUser.values.domisili_kota}
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
                  onValueChange={(itemValue) => {
                    registerUser.setFieldValue('domisili_kota', itemValue);
                  }}
                >
                  {dataKota?.map((item, index) => (
                    <SelectItem key={index} label={item.nama} value={item.nama} />
                  ))}
                </Select>
                {registerUser.touched.domisili_kota && registerUser.errors.domisili_kota ? (
                  <ErrorInput error={registerUser.errors.domisili_kota} />
                ) : null}
              </VStack>
            </HStack>
          </VStack>
          <VStack space={2}>
            <LabelInput text="Kata Sandi" />
            <Input
              type="password"
              placeholder="Masukkan kata sandi (minimal 8 karakter)"
              value={registerUser.values.password}
              onChangeText={registerUser.handleChange('password')}
            />
            {registerUser.touched.password && registerUser.errors.password ? <ErrorInput error={registerUser.errors.password} /> : null}
          </VStack>
          <VStack space={2}>
            <LabelInput text="Konfirmasi Kata Sandi" />
            <Input
              type="password"
              placeholder="Ulangi kata sandi"
              value={registerUser.values.konfirmasi_password}
              onChangeText={registerUser.handleChange('konfirmasi_password')}
            />
            {registerUser.touched.konfirmasi_password && registerUser.errors.konfirmasi_password ? (
              <ErrorInput error={registerUser.errors.konfirmasi_password} />
            ) : null}
          </VStack>
          <VStack space={5} alignItems="center" justifyContent="center">
            {!isLoading ? (
              <Button type="primary" onPress={registerUser.handleSubmit} text="Buat Akun" width={width / 1.1} fontSize={width} />
            ) : (
              <LoadingButton />
            )}
            <HStack space={6} alignItems="center" justifyContent="center">
              <Divider />
              <Text fontFamily={fonts.primary[400]} color={colors.text.black70} fontSize="xs" textAlign="center" fontWeight="thin" width={width / 7}>
                atau
              </Text>
              <Divider />
            </HStack>
            <Button type="secondary" onPress={() => navigation.navigate('Login')} text="Masuk" width={width / 1.1} fontSize={width} />
          </VStack>
        </VStack>
      </Box>
    </ScrollView>
  );
};

export default Register;

const styles = StyleSheet.create({});
