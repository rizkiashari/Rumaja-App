import { Dimensions, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import useLoading from '../store/loadingStore';
import { getData } from '../utils/getData';
import { useFormik } from 'formik';
import moment from 'moment';
import * as Yup from 'yup';
import { API } from '../config/api';
import { showError, showSuccess } from '../utils/showMessages';
import { CheckIcon, Checkbox, HStack, ScrollView, Select, Text, VStack, View } from 'native-base';
import { colors } from '../utils/colors';
import { Button, ErrorInput, Header, Input, LabelInput, LoadingButton, SelectItem } from '../components';
import { Calender, ChevronBack } from '../assets';
import DatePicker from 'react-native-date-picker';
import { fonts } from '../utils/fonts';

const EditPengalaman = ({ navigation, route }) => {
  const { width, height } = Dimensions.get('window');

  const { uuid } = route.params;
  const isFocused = navigation.isFocused();

  const [mode, setMode] = useState(true);
  const [open, setOpen] = useState(false);

  const [detailPengalaman, setDetailPengalaman] = useState();

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

  useEffect(() => {
    getDataProvinsi();

    const getDetailPengalaman = async () => {
      const resp = await getData(`/pengalaman/id/${uuid}`);
      setDetailPengalaman(resp.data);
    };

    getDetailPengalaman();

    return () => {
      setDetailPengalaman([]);
      setDataProvinsi([]);
    };
  }, [uuid, isFocused]);

  const handleConfirm = (val) => {
    const formattedDate = moment(val).format('DD-MM-YYYY');
    onEditPengalaman.setFieldValue(mode ? 'tahun_mulai' : 'tahun_akhir', formattedDate);
    setOpen(false);
  };

  const getDataProvinsi = async () => {
    const resp = await getData('/wilayah-indo/provinsi');
    setDataProvinsi(resp.data);
  };

  const onEditPengalaman = useFormik({
    initialValues: {
      nama_pengalaman: detailPengalaman?.nama_pengalaman,
      pengalaman_prov: detailPengalaman?.pengalaman_prov,
      tahun_mulai: moment(detailPengalaman?.tahun_mulai, 'YYYY-MM-DD').format('DD-MM-YYYY'),
      tahun_akhir:
        detailPengalaman?.tahun_akhir === 'Sekarang'
          ? moment(new Date()).format('DD-MM-YYYY')
          : moment(detailPengalaman?.tahun_akhir, 'YYYY-MM-DD').format('DD-MM-YYYY'),
      isWork: detailPengalaman?.isWork,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      nama_pengalaman: Yup.string().required('Nama pengalaman harus diisi'),
      pengalaman_prov: Yup.string().required('Provinsi harus diisi'),
      tahun_mulai: Yup.string().required('Tanggal mulai wajib diisi'),
      tahun_akhir: Yup.string().optional(),
      isWork: Yup.string().optional(),
    }),
    validateOnChange: true,
    onSubmit: async (values) => {
      setLoading(true);
      const payload = {
        nama: values.nama_pengalaman,
        pengalaman_prov: values.pengalaman_prov,
        tahun_mulai: moment(values.tahun_mulai, 'DD-MM-YYYY').format('YYYY-MM-DD'),
        tahun_akhir: !values.isWork ? moment(values.tahun_akhir, 'DD-MM-YYYY').format('YYYY-MM-DD') : 'Sekarang',
        isWork: values.isWork !== '' ? 1 : 0,
      };

      try {
        const res = await API.patch(`/pengalaman/edit/${uuid}`, payload);
        setLoading(false);
        if (res.data.message === 'EDIT_PENGALAMAN_SUCCESS') {
          showSuccess('Pengalaman berhasil diubah');
          navigation.navigate('MainApp');
          setLoading(true);
        } else {
          showError('Pengalaman gagal diubah');
        }
      } catch ({ response }) {
        setLoading(false);
        switch (response.data.message) {
          case 'PENGALAMAN_NOT_FOUND':
            showError('Pengalaman tidak ditemukan');
            break;
          case 'YEAR_NOT_VALID':
            showError('Tahun mulai tidak boleh lebih besar dari tahun akhir');
            break;
          default:
            showError(response.data.message);
            break;
        }
      }
    },
  });

  const handleDelete = async () => {
    setLoading(true);
    try {
      setLoading(false);
      const resp = await API.delete(`/pengalaman/delete/${uuid}`);
      if (resp.data.message === 'DELETE_PENGALAMAN_SUCCESS') {
        showSuccess('Pengalaman berhasil dihapus');
        navigation.navigate('MainApp');
        setLoading(true);
      } else {
        showError('Pengalaman gagal dihapus');
      }
    } catch ({ response }) {
      setLoading(false);
      switch (response.data.message) {
        case 'PENGALAMAN_NOT_FOUND':
          showError('Pengalaman tidak ditemukan');
          break;
        default:
          showError(response.data.message);
          break;
      }
    }
  };

  return (
    <View backgroundColor={colors.white} height={height} minH={height}>
      <Header>
        <HStack space={4}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronBack width={28} />
          </TouchableOpacity>
          <Text fontFamily={fonts.primary[600]} fontSize={width / 24} color="black">
            Edit Pengalaman
          </Text>
        </HStack>
      </Header>

      <VStack mt={5} height={height / 1.2} justifyContent="space-between" px={width / 28}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <VStack space={5}>
            <VStack space={2}>
              <LabelInput text="Bidang Pekerjaan" />
              <Input
                placeholder="Masukkan bidang pekerjaan"
                value={onEditPengalaman.values.nama_pengalaman}
                onChangeText={onEditPengalaman.handleChange('nama_pengalaman')}
              />
              {onEditPengalaman.errors.nama_pengalaman && onEditPengalaman.touched.nama_pengalaman && (
                <ErrorInput error={onEditPengalaman.errors.nama_pengalaman} />
              )}
            </VStack>
            <VStack space={2}>
              <LabelInput text="Lokasi Kerja" />
              <Select
                selectedValue={onEditPengalaman.values.pengalaman_prov}
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
                onValueChange={(itemValue) => onEditPengalaman.setFieldValue('pengalaman_prov', itemValue)}
              >
                {dataProvinsi.map((item, index) => (
                  <SelectItem key={index} label={item.nama} value={`${item.id},${item.nama}`} />
                ))}
              </Select>
            </VStack>
            <HStack space={2}>
              <VStack w={width / 2.2} space={2}>
                <LabelInput text="Mulai Bekerja" />
                <Input
                  type="waktu"
                  placeholder="Pilih tanggal"
                  value={onEditPengalaman.values.tahun_mulai}
                  onChangeText={onEditPengalaman.handleChange('tahun_mulai')}
                  onPress={() => onPressModal('awal')}
                  icon={<Calender />}
                />
                {onEditPengalaman.errors.tahun_mulai && onEditPengalaman.touched.tahun_mulai && (
                  <ErrorInput error={onEditPengalaman.errors.tahun_mulai} />
                )}
              </VStack>
              <VStack w={width / 2.2} space={2}>
                <LabelInput text="Selesai Bekerja" />
                <Input
                  type="waktu"
                  placeholder="Pilih tanggal"
                  value={onEditPengalaman.values.tahun_akhir}
                  onChangeText={onEditPengalaman.handleChange('tahun_akhir')}
                  onPress={() => onPressModal('akhir')}
                  icon={<Calender />}
                />
                {onEditPengalaman.errors.tahun_akhir && onEditPengalaman.touched.tahun_akhir && (
                  <ErrorInput error={onEditPengalaman.errors.tahun_akhir} />
                )}
              </VStack>
            </HStack>
            <Checkbox
              value={onEditPengalaman.values.isWork}
              colorScheme="blue"
              borderColor={colors.text.black70}
              onChange={(val) => {
                onEditPengalaman.setFieldValue('isWork', val);
              }}
              isChecked={onEditPengalaman.values.isWork === true ? onEditPengalaman.values.isWork : false}
            >
              <Text fontFamily={fonts.primary.normal} color={colors.text.black70} fontSize={width / 30}>
                Saya masih bekerja di sini
              </Text>
            </Checkbox>
          </VStack>
        </ScrollView>
        {loading ? (
          <LoadingButton />
        ) : (
          <HStack alignItems="center" justifyContent="space-between" space={1}>
            <Button fontSize={width} onPress={handleDelete} text="Hapus" type="red-border" width={width / 3.5} />
            <Button type="primary" onPress={onEditPengalaman.handleSubmit} text="Simpan" width={width / 1.6} fontSize={width} />
          </HStack>
        )}
      </VStack>

      <DatePicker
        modal
        date={new Date()}
        open={open}
        onConfirm={handleConfirm}
        mode="date"
        title="Pilih Tanggal"
        onCancel={() => setOpen(false)}
        minimumDate={new Date(1970, 1, 1)}
      />
    </View>
  );
};

export default EditPengalaman;
