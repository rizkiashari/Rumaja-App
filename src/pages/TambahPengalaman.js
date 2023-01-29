import { Dimensions, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { CheckIcon, Checkbox, HStack, ScrollView, Select, Text, VStack, View } from 'native-base';
import useLoading from '../store/loadingStore';
import moment from 'moment';
import { getData } from '../utils/getData';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { postWithJson } from '../utils/postData';
import { showError, showSuccess } from '../utils/showMessages';
import { colors } from '../utils/colors';
import { Button, ErrorInput, Header, Input, LabelInput, LoadingButton, SelectItem } from '../components';
import { Calender, ChevronBack } from '../assets';
import { fonts } from '../utils/fonts';
import DatePicker from 'react-native-date-picker';

const TambahPengalaman = ({ navigation }) => {
  const { width, height } = Dimensions.get('window');

  const [mode, setMode] = useState(true);
  const [open, setOpen] = useState(false);

  const { loading, setLoading } = useLoading();

  const [dataProvinsi, setDataProvinsi] = useState([]);

  const onPressModal = (arg) => {
    if (arg === 'awal') {
      setMode(true);
    } else {
      setMode(false);
    }

    setOpen(true);
  };

  const handleConfirm = (val) => {
    const formattedDate = moment(val).format('DD-MM-YYYY');
    addPengalaman.setFieldValue(mode ? 'tahun_mulai' : 'tahun_akhir', formattedDate);
    setOpen(false);
  };

  const getDataProvinsi = async () => {
    const resp = await getData('/wilayah-indo/provinsi');
    setDataProvinsi(resp.data);
  };

  useEffect(() => {
    getDataProvinsi();
  }, []);

  const addPengalaman = useFormik({
    initialValues: {
      nama: '',
      pengalaman_prov: '',
      tahun_mulai: '',
      tahun_akhir: '',
      isWork: '',
    },
    validateOnChange: true,
    validationSchema: Yup.object({
      nama: Yup.string().required('Nama bidang pekerjaan wajib diisi'),
      pengalaman_prov: Yup.string().required('Provinsi wajib diisi'),
      tahun_mulai: Yup.string().required('Tanggal mulai wajib diisi'),
      tahun_akhir: Yup.string().optional(),
      isWork: Yup.string().optional(),
    }),
    onSubmit: async (values) => {
      setLoading(true);

      const payload = {
        nama: values.nama,
        pengalaman_prov: values.pengalaman_prov,
        tahun_mulai: moment(values.tahun_mulai, 'DD-MM-YYYY').format('YYYY-MM-DD'),
        tahun_akhir: !values.isWork ? moment(values.tahun_akhir, 'DD-MM-YYYY').format('YYYY-MM-DD') : 'Sekarang',
        isWork: values.isWork !== '' ? 1 : 0,
      };

      const res = await postWithJson('/pengalaman/add', payload);

      setLoading(false);

      if (res.message === 'ADD_PENGALAMAN_SUCCESS') {
        showSuccess('Pengalaman berhasil ditambahkan');
        navigation.navigate('MainApp');
        setLoading(true);
        addPengalaman.resetForm();
      } else {
        setLoading(false);
        showError('Pengalaman gagal ditambahkan');
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
            Tambah Pengalaman
          </Text>
        </HStack>
      </Header>

      <VStack mt={5} height={height / 1.2} justifyContent="space-between" px={width / 28}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <VStack space={5}>
            <VStack space={2}>
              <LabelInput text="Bidang Pekerjaan" />
              <Input
                placeholder="Masukkan bidang pekerjaan (cth: Pengasuh Bayi)"
                onChangeText={addPengalaman.handleChange('nama')}
                value={addPengalaman.values.nama}
              />
              {addPengalaman.errors.nama && addPengalaman.touched.nama && <ErrorInput error={addPengalaman.errors.nama} />}
            </VStack>
            <VStack space={2}>
              <LabelInput text="Lokasi Pekerjaan" />
              <Select
                selectedValue={addPengalaman.values.pengalaman_prov}
                accessibilityLabel="Pilih provinsi"
                placeholder="Pilih provinsi"
                rounded={8}
                px={4}
                py={2}
                borderWidth={1}
                fontSize={width / 32}
                borderColor={colors.text.black30}
                _selectedItem={{
                  bg: colors.white,
                  endIcon: <CheckIcon size={1} />,
                }}
                onValueChange={(itemValue) => addPengalaman.setFieldValue('pengalaman_prov', itemValue)}
              >
                {dataProvinsi.map((item, index) => (
                  <SelectItem key={index} label={item.nama} value={`${item.id},${item.nama}`} />
                ))}
              </Select>
              {addPengalaman.errors.pengalaman_prov && addPengalaman.touched.pengalaman_prov && (
                <ErrorInput error={addPengalaman.errors.pengalaman_prov} />
              )}
            </VStack>

            <HStack space={2}>
              <VStack space={2} width={width / 2.2}>
                <LabelInput text="Mulai Bekerja" />
                <Input
                  type="waktu"
                  placeholder="Pilih tanggal"
                  value={addPengalaman.values.tahun_mulai}
                  onChangeText={addPengalaman.handleChange('tahun_mulai')}
                  onPress={() => onPressModal('awal')}
                  icon={<Calender />}
                />
                {addPengalaman.errors.tahun_mulai && addPengalaman.touched.tahun_mulai && <ErrorInput error={addPengalaman.errors.tahun_mulai} />}
              </VStack>
              <VStack space={2} width={width / 2.2}>
                <LabelInput text="Selesai Bekerja" />
                <Input
                  type="waktu"
                  placeholder="Pilih tanggal"
                  value={addPengalaman.values.tahun_akhir}
                  onChangeText={addPengalaman.handleChange('tahun_akhir')}
                  onPress={() => onPressModal('akhir')}
                  icon={<Calender />}
                />
                {addPengalaman.errors.tahun_akhir && addPengalaman.touched.tahun_akhir && <ErrorInput error={addPengalaman.errors.tahun_akhir} />}
              </VStack>
            </HStack>

            <Checkbox
              value={addPengalaman.values.isWork}
              colorScheme="blue"
              borderColor={colors.text.black70}
              onChange={(val) => {
                addPengalaman.setFieldValue('isWork', val);
              }}
            >
              <Text fontFamily={fonts.primary.normal} color={colors.text.black70} fontSize={width / 30}>
                Saya masih bekerja di sini
              </Text>
            </Checkbox>
          </VStack>
        </ScrollView>

        {loading ? <LoadingButton /> : <Button onPress={addPengalaman.handleSubmit} text="Simpan" fontSize={width} width={width / 1.1} />}
      </VStack>

      <DatePicker
        modal
        date={new Date()}
        open={open}
        onConfirm={handleConfirm}
        mode="date"
        onCancel={() => setOpen(false)}
        minimumDate={new Date(1970, 1, 1)}
      />
    </View>
  );
};

export default TambahPengalaman;
