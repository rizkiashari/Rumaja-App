import { Dimensions, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import useUserStore from '../store/userStore';
import useLoading from '../store/loadingStore';
import { getData } from '../utils/getData';
import { postWithJson } from '../utils/postData';
import { showError, showSuccess } from '../utils/showMessages';
import { API } from '../config/api';
import { Badge, Button, Card, Header, LoadingButton, TopProfile } from '../components';
import { Box, HStack, ScrollView, Text, VStack, View } from 'native-base';
import { ChevronBack, SaveHeaderActive, SaveHeaderInactive, Timer } from '../assets';
import { fonts } from '../utils/fonts';
import { convertRupiah } from '../utils/convertRupiah';
import moment from 'moment';
import { colors } from '../utils/colors';

const DetailLowongan = ({ navigation, route }) => {
  const { width, height } = Dimensions.get('window');

  const { uuid } = route.params;
  const isFocused = navigation.isFocused();

  const [detailLowongan, setDetailLowongan] = useState();

  const { userData } = useUserStore();

  const [invoke, setInvoke] = useState(false);

  const { loading, setLoading } = useLoading();

  useEffect(() => {
    setLoading(true);
    const loadDetail = async () => {
      const res = await getData(`/lowongan/id/${uuid}`);

      setDetailLowongan(res.data);
    };
    loadDetail();

    setLoading(false);

    return () => {
      setDetailLowongan();
    };
  }, [isFocused, uuid, invoke, setLoading]);

  const handleLamaran = async (id) => {
    setLoading(true);
    const payload = {
      status_riwayat: 'diproses',
      info_riwayat: 'applied',
      id_lowongan: id,
    };

    const res = await postWithJson('/lamaran/applied', payload);
    setLoading(false);

    if (res.message === 'SUCCESS_APPLIED_PEKERJAAN') {
      navigation.navigate('SuksesMelamar');
    } else {
      switch (res.message) {
        case 'PENCARI_NOT_FOUND':
          showError('Pencari tidak diketahui');
          break;
        case 'PENCARI_ALREADY_APPLIED':
          showError('Sudah pernah melamar pekerjaan ini atau cek progress lamaran');
          break;
        default:
          showError(res.message);
          break;
      }
    }
  };

  const saveLowongan = async (uuid_lowongan, save) => {
    setInvoke(!invoke);
    if (save === null) {
      try {
        const res = await API.patch(`/lowongan/save/${uuid_lowongan}`);
        if (res.data.message === 'SUCCESS_SAVE_LOWONGAN') {
          showSuccess('Berhasil menyimpan lowongan');
        } else {
          showError('Gagal menyimpan lowongan');
        }
      } catch ({ response }) {
        showError(response.data.message);
      }
    } else {
      try {
        const res = await API.delete(`lowongan/delete/save/${uuid_lowongan}`);
        if (res.data.message === 'SUCCESS_DELETE_SAVE_LOWONGAN') {
          showSuccess('Berhasil menghapus data simpan lowongan');
        } else {
          showError('Gagal menghapus lowongan');
        }
      } catch ({ response }) {
        showError(response.data.message);
      }
    }
  };

  const unPublish = async (uuid_lowongan) => {
    setInvoke(!invoke);
    try {
      const res = await API.patch(`/lowongan/publish/${uuid_lowongan}`);
      setLoading(true);
      if (res.data.message === 'SUCCESS_UNPUBLISH_LOWONGAN') {
        showSuccess('Berhasil unpublish lowongan');
      } else if (res.data.message === 'SUCCESS_PUBLISH_LOWONGAN') {
        showSuccess('Berhasil publish lowongan');
      } else {
        showError('Gagal unpublish lowongan');
      }
      setLoading(false);
    } catch ({ response }) {
      setLoading(false);
      switch (response.data.message) {
        case 'LOWONGAN_NOT_FOUND':
          showError('Lowongan tidak ditemukan');
          break;
        default:
          showError(response.data.message);
          break;
      }
    }
  };

  return (
    <SafeAreaView>
      <Header>
        <HStack space={4}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronBack width={30} />
          </TouchableOpacity>
          <Text fontFamily={fonts.primary[600]} fontSize={width / 24} color="black">
            Detail Lowongan
          </Text>
        </HStack>
        <HStack space={2.5}>
          {userData?.id_role === 2 && (
            <TouchableOpacity
              onPress={() =>
                saveLowongan(
                  detailLowongan?.simpan_lowongan === null ? detailLowongan?.uuid_lowongan : detailLowongan?.simpan_lowongan?.uuid_simpan,
                  detailLowongan?.simpan_lowongan
                )
              }
            >
              {detailLowongan?.simpan_lowongan?.isSave ? <SaveHeaderActive width={width / 20} /> : <SaveHeaderInactive width={width / 20} />}
            </TouchableOpacity>
          )}
        </HStack>
      </Header>

      <TopProfile
        photo={detailLowongan?.bidang_kerja?.photo}
        title={detailLowongan?.bidang_kerja?.detail_bidang}
        subtitle={`${detailLowongan?.kota_lowongan}, ${detailLowongan?.provinsi_lowongan?.split(',')[1]}`}
        type="pekerja"
        bubble={
          <HStack mb={2} justifyContent="space-between">
            <Badge title={`${convertRupiah(detailLowongan?.gaji)}/${detailLowongan?.skala_gaji}`} />
            <HStack space={0.5} alignItems="center">
              <Timer />
              <Text fontSize={width / 36} fontFamily={fonts.primary[400]} mt={0.5}>
                {moment(new Date(detailLowongan?.createdAt) * 1000)
                  .startOf('minutes')
                  .fromNow()}
              </Text>
            </HStack>
          </HStack>
        }
      />
      <View
        px={width / 28}
        showsVerticalScrollIndicator={false}
        bgColor={colors.text.black10}
        pt={2}
        height={height / 1.68}
        _contentContainerStyle={{ paddingBottom: height / 2.5 }}
      >
        <VStack space={4}>
          <Card type="detail" title="Kualifikasi">
            <Text fontSize={width / 32} fontFamily={fonts.primary[500]} color={colors.text.black50} maxW={width / 1.2} width="full">
              {detailLowongan?.kualifikasi}
            </Text>
          </Card>
          <Card type="detail" title="Deskripsi Pekerjaan">
            <Text fontSize={width / 32} fontFamily={fonts.primary[500]} color={colors.text.black50} maxW={width / 1.2} width="full">
              {detailLowongan?.deskripsi_lowongan}
            </Text>
          </Card>
          <Card type="detail" title="Fasilitas">
            <Text fontSize={width / 32} fontFamily={fonts.primary[500]} color={colors.text.black50} maxW={width / 1.2} width="full">
              {detailLowongan?.fasilitas}
            </Text>
          </Card>
          <Card type="detail" title="Lokasi Kerja">
            <Text fontSize={width / 32} fontFamily={fonts.primary[500]} color={colors.text.black50} maxW={width / 1.2} width="full">
              {`${detailLowongan?.kota_lowongan}, ${detailLowongan?.provinsi_lowongan?.split(',')[1]}`}
            </Text>
          </Card>
        </VStack>
      </View>

      {userData?.id_role === 2 && (
        <Box
          position="absolute"
          bottom={0}
          backgroundColor={colors.white}
          px={width / 28}
          py={4}
          justifyContent="center"
          alignItems="center"
          width={width}
        >
          {loading ? (
            <LoadingButton />
          ) : (
            <Button type="primary" onPress={() => handleLamaran(detailLowongan?.id)} text="Kirim Lamaran" width={width / 1.1} fontSize={width} />
          )}
        </Box>
      )}

      {userData?.id_role === 3 && (
        <Box
          position="absolute"
          bottom={0}
          backgroundColor={colors.white}
          px={width / 28}
          py={4}
          justifyContent="center"
          alignItems="center"
          width={width}
        >
          {detailLowongan?.isPublish ? (
            <HStack alignItems="center" space={2} justifyContent="space-between">
              <Button fontSize={width} onPress={() => unPublish(detailLowongan?.uuid_lowongan)} text="Hapus" type="red-border" width={width / 3.5} />
              <Button
                type="primary"
                onPress={() =>
                  navigation.navigate('EditLowongan', {
                    uuid: detailLowongan?.uuid_lowongan,
                  })
                }
                text="Edit Lowongan"
                width={width / 1.6}
                fontSize={width}
              />
            </HStack>
          ) : (
            <Button
              type="primary"
              onPress={() =>
                navigation.navigate('EditLowongan', {
                  uuid: detailLowongan?.uuid_lowongan,
                })
              }
              text="Pulihkan"
              width={width / 1.6}
              fontSize={width}
            />
          )}
        </Box>
      )}
    </SafeAreaView>
  );
};

export default DetailLowongan;

const styles = StyleSheet.create({});
