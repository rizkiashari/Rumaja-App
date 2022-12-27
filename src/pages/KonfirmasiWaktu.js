import { Dimensions, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import useLoading from '../store/loadingStore';
import useUserStore from '../store/userStore';
import { HStack, ScrollView, Text, VStack, View } from 'native-base';
import DatePicker from 'react-native-date-picker';
import { colors } from '../utils/colors';
import { Button, ErrorInput, Header, Input, LabelInput, LoadingButton, TextArea } from '../components';
import { Calender, ChevronBack, ProgresInactive } from '../assets';
import moment from 'moment';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { fonts } from '../utils/fonts';
import { postWithJson } from '../utils/postData';
import { showError } from '../utils/showMessages';

const KonfirmasiWaktu = ({ navigation }) => {
  const { width, height } = Dimensions.get('window');

  const { setLoading, loading } = useLoading();
  const { idPencari, dataPekerjaan, setDataPekerjaan } = useUserStore();

  const [mode, setMode] = useState(true);
  const [open, setOpen] = useState(false);

  const onPressModal = (arg) => {
    if (arg === 'waktu') {
      setMode(true);
    } else {
      setMode(false);
    }

    setOpen(true);
  };

  const handleConfirm = (val) => {
    const formattedDate = mode ? moment(val).format('hh:mm A') : moment(val).format('DD-MM-YYYY');
    onKonfirmasiWaktu.setFieldValue(mode ? 'waktu' : 'tanggal', formattedDate);
    setOpen(false);
  };

  const onKonfirmasiWaktu = useFormik({
    initialValues: {
      catatan: '',
      waktu: '',
      tanggal: '',
    },
    validateOnChange: true,
    validationSchema: Yup.object({
      catatan: Yup.string().required('Catatan tidak boleh kosong'),
      waktu: Yup.string().required('Waktu tidak boleh kosong'),
      tanggal: Yup.string().required('Tanggal tidak boleh kosong'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      const payload = {
        status_riwayat: 'diproses',
        info_riwayat: 'hired',
        catatan_riwayat_penyedia: values.catatan,
        waktu_mulai_kerja: moment(values.waktu, 'hh:mm A').format('hh:mm'),
        tanggal_mulai_kerja: moment(values.tanggal, 'DD-MM-YYYY').format('YYYY-MM-DD'),
        id_pencari: idPencari,
        id_lowongan: dataPekerjaan,
      };

      const res = await postWithJson('/tawarkan/tawarkan-pekerjaan', payload);

      if (res.message === 'SUCCESS_TAWARKAN_PEKERJAAN') {
        navigation.replace('SuksesTawaranTerkirim');
        setDataPekerjaan(null);
      } else {
        showError('Gagal menawarkan pekerjaan');
      }
      setLoading(false);
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
            Konfirmasi Waktu
          </Text>
        </HStack>
      </Header>
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack mt={5} height={height / 1.2} justifyContent="space-between" px={width / 28}>
          <VStack space={5}>
            <VStack space={2}>
              <LabelInput text="Waktu Mulai Bekerja" />
              <HStack space={2}>
                <VStack space={2} w={width / 3.2}>
                  <Input
                    value={onKonfirmasiWaktu.values.waktu}
                    onPress={() => onPressModal('waktu')}
                    placeholder="Pilih Waktu"
                    icon={<ProgresInactive />}
                    onChangeText={onKonfirmasiWaktu.handleChange('waktu')}
                    type="waktu"
                  />
                  {onKonfirmasiWaktu.errors.waktu && onKonfirmasiWaktu.touched.waktu ? <ErrorInput error={onKonfirmasiWaktu.errors.waktu} /> : null}
                </VStack>
                <VStack w={width / 1.7} space={2}>
                  <Input
                    value={onKonfirmasiWaktu.values.tanggal}
                    onPress={() => onPressModal('tanggal')}
                    placeholder="Pilih Tanggal"
                    icon={<Calender />}
                    onChangeText={onKonfirmasiWaktu.handleChange('tanggal')}
                    type="waktu"
                  />
                  {onKonfirmasiWaktu.errors.tanggal && onKonfirmasiWaktu.touched.tanggal ? (
                    <ErrorInput error={onKonfirmasiWaktu.errors.tanggal} />
                  ) : null}
                </VStack>
              </HStack>
            </VStack>
            <VStack space={2}>
              <LabelInput text="Catatan" />
              <TextArea
                value={onKonfirmasiWaktu.values.catatan}
                onChangeText={onKonfirmasiWaktu.handleChange('catatan')}
                placeholder="Masukkan catatan"
              />
              {onKonfirmasiWaktu.errors.catatan && onKonfirmasiWaktu.touched.catatan ? <ErrorInput error={onKonfirmasiWaktu.errors.catatan} /> : null}
            </VStack>
          </VStack>

          {loading ? <LoadingButton /> : <Button type="primary" text="Selanjutnya" fontSize={width} onPress={onKonfirmasiWaktu.handleSubmit} />}
        </VStack>
      </ScrollView>

      <DatePicker
        modal
        androidVariant="iosClone"
        date={new Date()}
        open={open}
        onConfirm={handleConfirm}
        mode={mode ? 'time' : 'date'}
        onCancel={() => setOpen(false)}
        minimumDate={new Date(1970, 1, 1)}
      />
    </View>
  );
};

export default KonfirmasiWaktu;
