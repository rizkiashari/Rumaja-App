import { StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { HStack, ScrollView, Text, VStack, View } from 'native-base';
import useLoading from '../store/loadingStore';
import moment from 'moment';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { API } from '../config/api';
import { showError } from '../utils/showMessages';
import { colors } from '../utils/colors';
import { Header, LabelInput, Input, ErrorInput, TextArea, LoadingButton, Button } from '../components';
import { Calender, ChevronBack, ProgresInactive } from '../assets';
import { fonts } from '../utils/fonts';
import DatePicker from 'react-native-date-picker';

const TerimaPelamar = ({ navigation, route }) => {
  const { width, height } = Dimensions.get('window');

  const { uuid } = route.params;

  const { setLoading, loading } = useLoading();

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
    onTerimaPelamar.setFieldValue(mode ? 'waktu' : 'tanggal', formattedDate);
    setOpen(false);
  };

  const onTerimaPelamar = useFormik({
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
        catatan_riwayat_penyedia: values.catatan,
        waktu_mulai_kerja: moment(values.waktu, 'hh:mm A').format('hh:mm'),
        tanggal_mulai_kerja: moment(values.tanggal, 'DD-MM-YYYY').format('YYYY-MM-DD'),
      };

      try {
        const res = await API.patch(`/lamaran/terima/${uuid}`, payload);

        if (res.data.message === 'SUCCESS_TERIMA_LAMARAN') {
          navigation.replace('SuksesTerimaPelamar');
        } else {
          showError('Gagal menawarkan pekerjaan');
        }
        setLoading(false);
      } catch ({ response }) {
        setLoading(false);
        showError(response.data.message);
      }
    },
  });

  return (
    <View backgroundColor={colors.white}>
      <Header>
        <HStack space={4}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronBack width={28} />
          </TouchableOpacity>
          <Text fontFamily={fonts.primary[600]} fontSize={width / 24} color="black">
            Terima Pelamar
          </Text>
        </HStack>
      </Header>
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack mt={5} height={height / 1.2} justifyContent="space-between" px={width / 28} background={colors.white}>
          <VStack space={5}>
            <VStack space={2}>
              <LabelInput text="Waktu Interview" />
              <HStack space={2}>
                <VStack width={width / 3.2} space={2}>
                  <Input
                    type="waktu"
                    icon={<ProgresInactive />}
                    onPress={() => onPressModal('waktu')}
                    placeholder="07:00"
                    value={onTerimaPelamar.values.waktu}
                    onChangeText={onTerimaPelamar.handleChange('waktu')}
                  />
                  {onTerimaPelamar.errors.waktu && onTerimaPelamar.touched.waktu && <ErrorInput error={onTerimaPelamar.errors.waktu} />}
                </VStack>
                <VStack width={width / 1.7} space={2}>
                  <Input
                    type="waktu"
                    icon={<Calender />}
                    onPress={() => onPressModal('tanggal')}
                    placeholder="DD-MM-YYYY"
                    value={onTerimaPelamar.values.tanggal}
                    onChangeText={onTerimaPelamar.handleChange('tanggal')}
                  />
                  {onTerimaPelamar.errors.tanggal && onTerimaPelamar.touched.tanggal && <ErrorInput error={onTerimaPelamar.errors.tanggal} />}
                </VStack>
              </HStack>
            </VStack>
            <VStack space={2}>
              <LabelInput text="Catatan Tambahan" />
              <TextArea
                placeholder="Masukkan catatan"
                value={onTerimaPelamar.values.catatan}
                onChangeText={onTerimaPelamar.handleChange('catatan')}
              />
              {onTerimaPelamar.errors.catatan && onTerimaPelamar.touched.catatan && <ErrorInput error={onTerimaPelamar.errors.catatan} />}
            </VStack>
          </VStack>
          {loading ? (
            <LoadingButton />
          ) : (
            <Button type="primary" text="Konfirmasi" fontSize={width} onPress={onTerimaPelamar.handleSubmit} width={width / 1.1} />
          )}
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

export default TerimaPelamar;

const styles = StyleSheet.create({});
