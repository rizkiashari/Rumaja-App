import { Dimensions, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button, ErrorInput, Header, Input, LabelInput, LoadingButton, SelectItem, TextArea } from '../components';
import { Box, CheckIcon, HStack, Image, ScrollView, Select, Text, VStack } from 'native-base';
import { Calender, ChevronBack, Info, ProfilEdit } from '../assets';
import { fonts } from '../utils/fonts';
import useUserStore from '../store/userStore';
import useLoading from '../store/loadingStore';
import * as ImagePicker from 'react-native-image-picker';
import { postWithFormData, postWithJson } from '../utils/postData';
import { showError, showSuccess } from '../utils/showMessages';
import { getData } from '../utils/getData';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DatePicker from 'react-native-date-picker';
import { colors } from '../utils/colors';
import moment from 'moment';

const EditProfile = ({ navigation }) => {
  const { width, height } = Dimensions.get('window');

  const { userData } = useUserStore();

  const isFocused = navigation.isFocused();
  const { setLoading, loading } = useLoading();

  const [photo, setPhoto] = useState(userData?.photo_profile);

  const [bidang, setBidang] = useState([]);
  const [dataProvinsi, setDataProvinsi] = useState([]);
  const [dataKota, setDataKota] = useState([]);
  const [tglLahir, setTglLahir] = useState('');
  const [provinsi, setProvinsi] = useState(updateProfil?.values?.domisili_provinsi);

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());

  const onProfilChange = () => {
    ImagePicker.launchImageLibrary({ quality: 0.5, maxWidth: 200, maxHeight: 200 }, async (response) => {
      if (response.didCancel || response.error) {
        showError('Oppss, sepertinya anda tidak memilih fotonya?');
      } else {
        const source = response.assets;

        const payload = new FormData();
        payload.append('photo_profile', {
          uri: source[0].uri,
          type: source[0].type,
          name: source[0].fileName,
        });

        const res = await postWithFormData('/user/update-photo', payload);

        if (res.message === 'SUCCESS_UPDATE_PHOTO_PROFILE') {
          setPhoto(source);
          showSuccess('Foto berhasil diubah');
          setLoading(false);
        } else {
          showError('Foto gagal diubah');
        }
      }
    });
  };

  const getDataProvinsi = async () => {
    const resp = await getData('/wilayah-indo/provinsi');
    setDataProvinsi(resp.data);
  };

  const getDataKota = async (id) => {
    if (id === '') return;
    const resp = await getData(`/wilayah-indo/kota?id_provinsi=${id?.split(',')[0]}`);
    setDataKota(resp.data);
  };

  const getBidangPekerjaan = async () => {
    const res = await getData('/user/list-bidang');
    setBidang(res.data);
  };

  const updateProfil = useFormik({
    initialValues: {
      nama_lengkap: '',
      jenis_kelamin: '',
      bidang_pekerjaan: '',
      nomor_wa: '',
      tanggal_lahir: '',
      domisili_kota: '',
      domisili_provinsi: '',
      tempat_lahir: '',
      tinggi_badan: '',
      berat_badan: '',
      tentang: '',
      alamat_rumah: '',
    },
    validateOnChange: true,
    validationSchema: Yup.object({
      nama_lengkap: Yup.string().required('Nama lengkap harus diisi').min(3, 'Nama lengkap minimal 3 karakter'),
      jenis_kelamin: Yup.string().required('Jenis kelamin harus diisi'),
      bidang_pekerjaan: Yup.number().optional(),
      nomor_wa: Yup.string().required('Nomor Hp harus diisi').min(10, 'Nomor Hp minimal 10 karakter').max(17, 'Nomor Hp maksimal 17 karakter'),
      tanggal_lahir: Yup.string().required('Tanggal lahir harus diisi'),
      domisili_kota: Yup.string().required('Kota harus diisi'),
      domisili_provinsi: Yup.string().required('Provinsi harus diisi'),
      tempat_lahir: Yup.string().required('Tempat lahir harus diisi'),
      tinggi_badan: Yup.number().optional(),
      berat_badan: Yup.number().optional(),
      tentang: Yup.string().required('Tentang harus diisi'),
      alamat_rumah: Yup.string().required('Alamat rumah harus diisi'),
    }),
    onSubmit: async (values) => {
      setLoading(true);

      if (userData?.id_role === 3) {
        const payload = {
          gender: values.jenis_kelamin,
          nama_user: values.nama_lengkap,
          nomor_wa: values.nomor_wa,
          alamat_rumah: values.alamat_rumah,
          domisili_kota: values.domisili_kota,
          domisili_provinsi: values.domisili_provinsi,
          tentang: values.tentang,
          tempat_lahir: values.tempat_lahir,
          tanggal_lahir: moment(values.tanggal_lahir, 'DD/MM/YYYY').format('YYYY-MM-DD'),
        };

        const res = await postWithJson('/user/update/penyedia', payload);
        if (res.message === 'SUCCESS_UPDATE_USER_PENYEDIA') {
          showSuccess('Berhasil update profil');
          navigation.navigate('MainApp');
        } else {
          showError('Gagal update profil');
        }
      }
      if (userData?.id_role === 2) {
        const payload = {
          gender: values.jenis_kelamin,
          bidang_kerja: Number(values.bidang_pekerjaan),
          tempat_lahir: values.tempat_lahir,
          berat_badan: Number(values.berat_badan),
          tinggi_badan: Number(values.tinggi_badan),
          tanggal_lahir: moment(values.tanggal_lahir, 'DD/MM/YYYY').format('YYYY-MM-DD'),
          domisili_kota: values.domisili_kota,
          domisili_provinsi: values.domisili_provinsi,
          nama_user: values.nama_lengkap,
          nomor_wa: values.nomor_wa,
          alamat_rumah: values.alamat_rumah,
          tentang: values.tentang,
        };

        const res = await postWithJson('/user/update/pencari', payload);

        if (res.message === 'SUCCESS_UPDATE_USER_PENCARI') {
          showSuccess('Berhasil update profil');
          navigation.navigate('MainApp');
        } else {
          showError('Gagal update profil');
        }
      }

      setLoading(false);
    },
  });

  useEffect(() => {
    const loadProfil = async () => {
      if (userData?.id_role === 3) {
        const { data } = await getData('/user/profile-penyedia');
        updateProfil.setFieldValue('nama_lengkap', data?.nama_user);
        updateProfil.setFieldValue('jenis_kelamin', data?.penyedia?.gender);
        updateProfil.setFieldValue('nomor_wa', data?.nomor_wa);
        updateProfil.setFieldValue('tempat_lahir', data?.penyedia?.tempat_lahir);
        updateProfil.setFieldValue('domisili_kota', data?.domisili_kota);
        updateProfil.setFieldValue('domisili_provinsi', data?.domisili_provinsi);
        updateProfil.setFieldValue(
          'tanggal_lahir',
          data?.penyedia?.tanggal_lahir !== null ? moment(data?.penyedia?.tanggal_lahir).format('DD/MM/YYYY') : ''
        );
        updateProfil.setFieldValue('alamat_rumah', data?.penyedia?.alamat_rumah);
        updateProfil.setFieldValue('tentang', data?.penyedia?.tentang);
        setPhoto(data?.photo_profile);
      }
      if (userData?.id_role === 2) {
        const { data } = await getData('/user/profile-pencari');
        updateProfil.setFieldValue('nama_lengkap', data?.nama_user);
        updateProfil.setFieldValue('jenis_kelamin', data?.pencari?.gender);
        updateProfil.setFieldValue('bidang_pekerjaan', data?.pencari?.bidang_kerja?.id);
        updateProfil.setFieldValue('nomor_wa', data?.nomor_wa);
        updateProfil.setFieldValue('tempat_lahir', data?.pencari?.tempat_lahir);
        updateProfil.setFieldValue(
          'tanggal_lahir',
          data?.pencari?.tanggal_lahir !== null ? moment(data?.pencari?.tanggal_lahir).format('DD/MM/YYYY') : ''
        );
        updateProfil.setFieldValue('tinggi_badan', data?.pencari?.tinggi_badan?.toString());
        updateProfil.setFieldValue('berat_badan', data?.pencari?.berat_badan?.toString());
        updateProfil.setFieldValue('alamat_rumah', data?.pencari?.alamat_rumah);
        updateProfil.setFieldValue('domisili_kota', data?.domisili_kota);
        updateProfil.setFieldValue('domisili_provinsi', data?.domisili_provinsi);
        updateProfil.setFieldValue('tentang', data?.pencari?.tentang);
        setPhoto(data?.photo_profile);
      }
    };

    loadProfil();
  }, [userData?.id_role, isFocused]);

  useEffect(() => {
    getBidangPekerjaan();
    getDataProvinsi();
    getDataKota(provinsi);
  }, [isFocused, provinsi]);

  return (
    <SafeAreaView>
      <Header>
        <HStack space={4}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronBack width={30} />
          </TouchableOpacity>
          <Text fontFamily={fonts.primary[600]} fontSize={width / 24} color="black">
            Edit Profil
          </Text>
        </HStack>
      </Header>
      <KeyboardAwareScrollView extraHeight={250} enableAutomaticScroll={true} extraScrollHeight={250} showsVerticalScrollIndicator={false}>
        <ScrollView px={width / 26} bgColor={colors.text.white} minH={height} pt={height / 40} showsVerticalScrollIndicator={false}>
          <VStack justifyContent="center" alignItems="center" space={1}>
            <Box bgColor={photo ? null : colors.text.black30} w={16} h={16} rounded="full" justifyContent="center" alignItems="center">
              {photo === null || photo === undefined || photo === '' ? (
                <Box>
                  <ProfilEdit width="60" height="60" />
                </Box>
              ) : (
                <Image source={{ uri: photo[0]?.uri ? photo[0]?.uri : photo }} alt="image base 64" style={styles.avatar} />
              )}
            </Box>
            <TouchableOpacity onPress={onProfilChange}>
              <Text fontSize={width / 28} color={colors.blue[80]} textAlign="center" fontFamily={fonts.primary[400]}>
                Ubah Profil
              </Text>
            </TouchableOpacity>
          </VStack>
          <VStack space={4} mt={height / 36} mb={height / 8}>
            <VStack space={2}>
              <LabelInput text="Nama Lengkap" />
              <Input
                placeholder="Masukkan nama lengkap"
                value={updateProfil.values.nama_lengkap}
                onChangeText={updateProfil.handleChange('nama_lengkap')}
              />
              {updateProfil.errors.nama_lengkap && updateProfil.touched.nama_lengkap ? <ErrorInput error={updateProfil.errors.nama_lengkap} /> : null}
            </VStack>
            <VStack space={2}>
              <LabelInput text="Jenis Kelamin" />
              <Select
                selectedValue={updateProfil.values.jenis_kelamin}
                accessibilityLabel="Pilih jenis kelamin"
                placeholder="Pilih jenis kelamin"
                rounded={8}
                px={4}
                py={2}
                fontFamily={fonts.primary[400]}
                fontSize={width / 32}
                backgroundColor={colors.white}
                borderColor={colors.text.black30}
                borderWidth={1}
                _selectedItem={{
                  bg: colors.white,
                  endIcon: <CheckIcon size={1} />,
                }}
                onValueChange={(itemValue) => updateProfil.setFieldValue('jenis_kelamin', itemValue)}
              >
                <Select.Item label="Pria" value="pria" />
                <Select.Item label="Wanita" value="wanita" />
              </Select>
            </VStack>
            {userData?.id_role === 2 && (
              <VStack space={2}>
                <LabelInput text="Bidang Pekerjaan" />
                <Select
                  selectedValue={updateProfil.values.bidang_pekerjaan}
                  accessibilityLabel="Pilih bidang pekerjaan"
                  placeholder="Pilih bidang pekerjaan"
                  rounded={8}
                  px={4}
                  py={2}
                  fontFamily={fonts.primary[400]}
                  fontSize={width / 32}
                  backgroundColor={colors.white}
                  borderColor={colors.text.black30}
                  borderWidth={1}
                  _selectedItem={{
                    bg: colors.white,
                    endIcon: <CheckIcon size={1} />,
                  }}
                  onValueChange={(itemValue) => updateProfil.setFieldValue('bidang_pekerjaan', itemValue)}
                >
                  {bidang?.length > bidang?.map((item, index) => <SelectItem key={index} label={item.detail_bidang} value={item.id} />)}
                </Select>
                {updateProfil.errors.bidang_pekerjaan && updateProfil.touched.bidang_pekerjaan ? (
                  <ErrorInput error={updateProfil.errors.bidang_pekerjaan} />
                ) : null}
              </VStack>
            )}
            <VStack space={2}>
              <LabelInput text="Nomor Telepon" />
              <Input
                placeholder="Masukkan nomor telepon"
                type="number"
                value={updateProfil.values.nomor_wa}
                onChangeText={updateProfil.handleChange('nomor_wa')}
              />
              {updateProfil.errors.nomor_wa && updateProfil.touched.nomor_wa ? <ErrorInput error={updateProfil.errors.nomor_wa} /> : null}
            </VStack>
            <VStack space={2}>
              <LabelInput text="Tempat Lahir" />
              <Input
                placeholder="Masukkan tempat lahir"
                value={updateProfil.values.tempat_lahir}
                onChangeText={updateProfil.handleChange('tempat_lahir')}
              />
            </VStack>
            <VStack space={2}>
              <LabelInput text="Tanggal Lahir" />
              <Input
                placeholder="20/12/1990"
                value={tglLahir}
                onChangeText={updateProfil.handleChange('tanggal_lahir')}
                icon={<Calender />}
                type="waktu"
                onPress={() => setOpen(true)}
              />
            </VStack>
            {userData?.id_role === 2 && (
              <VStack space={2}>
                <LabelInput text="Keahlian" />
                <TextArea
                  placeholder="Ceritakan keahlian diri anda"
                  value={updateProfil.values.tentang}
                  onChangeText={updateProfil.handleChange('tentang')}
                />
                {updateProfil.errors.tentang && updateProfil.touched.tentang ? <ErrorInput error={updateProfil.errors.tentang} /> : null}
              </VStack>
            )}
            <VStack space={2}>
              <LabelInput text="Domisili" />
              <HStack space={2}>
                <VStack w={width / 2.24}>
                  <Select
                    selectedValue={updateProfil.values.domisili_provinsi}
                    accessibilityLabel="Pilih provinsi"
                    placeholder="Pilih provinsi"
                    rounded={8}
                    px={4}
                    py={2}
                    fontFamily={fonts.primary[400]}
                    fontSize={width / 32}
                    backgroundColor={colors.white}
                    borderColor={colors.text.black30}
                    borderWidth={1}
                    _selectedItem={{
                      bg: colors.white,
                      endIcon: <CheckIcon size={1} />,
                    }}
                    onValueChange={(itemValue) => {
                      setProvinsi(itemValue);
                      updateProfil.setFieldValue('domisili_provinsi', itemValue);
                      updateProfil.setFieldValue('domisili_kota', '');
                    }}
                  >
                    {dataProvinsi?.length > 0 &&
                      dataProvinsi?.map((item, index) => <SelectItem key={index} label={item.nama} value={`${item.id},${item.nama}`} />)}
                  </Select>
                  {updateProfil.errors.domisili_provinsi && updateProfil.touched.domisili_provinsi ? (
                    <ErrorInput error={updateProfil.errors.domisili_provinsi} />
                  ) : null}
                </VStack>
                <VStack w={width / 2.24}>
                  <Select
                    selectedValue={updateProfil.values.domisili_kota}
                    accessibilityLabel="Pilih kota"
                    placeholder="Pilih kota"
                    rounded={8}
                    px={4}
                    py={2}
                    fontFamily={fonts.primary[400]}
                    fontSize={width / 32}
                    backgroundColor={colors.white}
                    borderColor={colors.text.black30}
                    borderWidth={1}
                    _selectedItem={{
                      bg: colors.white,
                      endIcon: <CheckIcon size={1} />,
                    }}
                    onValueChange={(itemValue) => updateProfil.setFieldValue('domisili_kota', itemValue)}
                  >
                    {dataKota?.length > 0 && dataKota?.map((item, index) => <SelectItem key={index} label={item.nama} value={item.nama} />)}
                  </Select>
                </VStack>
              </HStack>
            </VStack>
            <VStack space={2}>
              <LabelInput text="Alamat Rumah" />
              <TextArea
                placeholder="Masukkan alamat rumah"
                value={updateProfil.values.alamat_rumah}
                onChangeText={updateProfil.handleChange('alamat_rumah')}
              />
              {updateProfil.errors.alamat_rumah && updateProfil.touched.alamat_rumah ? <ErrorInput error={updateProfil.errors.alamat_rumah} /> : null}
            </VStack>
            <HStack px={width / 28} bgColor={colors.gray20} rounded={8} py={width / 40} space={width / 40} alignItems="center">
              <Info />
              <Text color={colors.text.black100} fontFamily={fonts.primary[400]} fontSize={width / 32}>
                Alamat anda tidak akan ditampilkan
              </Text>
            </HStack>
            {userData?.id_role === 2 && (
              <VStack space={2}>
                <LabelInput text="Tinggi Badan" />
                <Input
                  placeholder="Masukkan tinggi badan (cm)"
                  type="number"
                  value={updateProfil.values.tinggi_badan}
                  onChangeText={updateProfil.handleChange('tinggi_badan')}
                />
                {updateProfil.errors.tinggi_badan && updateProfil.touched.tinggi_badan ? (
                  <ErrorInput error={updateProfil.errors.tinggi_badan} />
                ) : null}
              </VStack>
            )}
            {userData?.id_role === 2 && (
              <VStack space={2}>
                <LabelInput text="Berat Badan" />
                <Input
                  placeholder="Masukkan berat badan (kg)"
                  type="number"
                  value={updateProfil.values.berat_badan}
                  onChangeText={updateProfil.handleChange('berat_badan')}
                />
                {updateProfil.errors.berat_badan && updateProfil.touched.berat_badan ? <ErrorInput error={updateProfil.errors.berat_badan} /> : null}
              </VStack>
            )}
            {userData?.id_role == 3 && (
              <VStack space={2}>
                <LabelInput text="Tentang" />
                <TextArea
                  placeholder="Ceritakan tentang diri anda"
                  value={updateProfil.values.tentang}
                  onChangeText={updateProfil.handleChange('tentang')}
                />
                {updateProfil.errors.tentang && updateProfil.touched.tentang ? <ErrorInput error={updateProfil.errors.tentang} /> : null}
              </VStack>
            )}
            {loading ? (
              <LoadingButton />
            ) : (
              <Button type="primary" onPress={updateProfil.handleSubmit} text="Simpan" width={width / 1.09} fontSize={width} />
            )}
          </VStack>
        </ScrollView>
      </KeyboardAwareScrollView>

      <DatePicker
        modal
        date={date}
        open={open}
        onConfirm={(val) => {
          setOpen(false);
          setDate(val);
          updateProfil.setFieldValue('tanggal_lahir', val);
          const tgl = moment(val).format('DD/MM/YYYY');
          setTglLahir(tgl);
        }}
        onDateChange={(val) => {
          setOpen(false);
          setDate(val);
          updateProfil.setFieldValue('tanggal_lahir', val);
          const tgl = moment(val).format('DD/MM/YYYY');
          setTglLahir(tgl);
        }}
        mode="date"
        onCancel={() => setOpen(false)}
      />
    </SafeAreaView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 80 / 2,
    overflow: 'hidden',
    resizeMode: 'contain',
  },
});
