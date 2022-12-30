import { Dimensions, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Box, HStack, Image, ScrollView, Text, VStack, View } from 'native-base';
import { Badge, Button, Card, Header, TopProfile } from '../components';
import { ChevronBack, ILPlaceholder, Timer } from '../assets';
import { fonts } from '../utils/fonts';
import useLoading from '../store/loadingStore';
import { getData } from '../utils/getData';
import { API } from '../config/api';
import { showError } from '../utils/showMessages';
import { convertRupiah } from '../utils/convertRupiah';
import moment from 'moment';
import { colors } from '../utils/colors';

const DetailLamaran = ({ navigation, route }) => {
  const { width, height } = Dimensions.get('window');

  const isFocused = navigation.isFocused();
  const { uuid_riwayat, type } = route.params;

  const [dataDetail, setDataDetail] = useState();

  const { setLoading } = useLoading();

  useEffect(() => {
    const loadDetail = async () => {
      const resp = await getData(`/lamaran/detail-lamaran/${uuid_riwayat}`);
      setDataDetail(resp.data);
    };

    loadDetail();

    return () => {
      setDataDetail();
    };
  }, [isFocused, uuid_riwayat]);

  const onTerimaLamaranKerja = async () => {
    try {
      setLoading(true);
      const res = await API.patch(`/lamaran/terima/${uuid_riwayat}`);
      if (res.data.message === 'SUCCESS_TERIMA_LAMARAN') {
        navigation.replace('SuksesBekerja', {
          uuid: res?.data?.data?.uuid_lowongan,
          subTitle: 'Tawaran kerja yang anda dapat berhasil diterima. Menunggu penyedia kerja memulai pekerjaan.',
          title: 'Tawaran berhasil diterima!',
        });
      } else {
        showError('Gagal menerima lamaran');
      }
      setLoading(false);
    } catch ({ response }) {
      setLoading(false);
      showError(response.data.message);
    }
  };

  console.log('dataDetail', dataDetail);

  return (
    <SafeAreaView>
      <Header>
        <HStack space="4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronBack width={28} />
          </TouchableOpacity>
          <Text fontFamily={fonts.primary[600]} fontSize={width / 24} color="black">
            {dataDetail?.info_riwayat === 'applied' ? 'Detail Lamaran' : 'Detail Tawaran'}
          </Text>
        </HStack>
      </Header>

      <TopProfile
        photo={dataDetail?.lowongan?.bidang_kerja?.photo}
        title={dataDetail?.lowongan?.bidang_kerja?.detail_bidang}
        subtitle={`${dataDetail?.lowongan?.kota_lowongan}, ${dataDetail?.lowongan?.provinsi_lowongan?.split(',')[1]}`}
        type="pekerja"
        photoHeight="12"
        photoWidth="12"
        bubble={
          <HStack alignItems="center" justifyContent="space-between">
            <Badge title={`${convertRupiah(dataDetail?.lowongan?.gaji)}/${dataDetail?.lowongan?.skala_gaji}`} />
            <HStack space={0.5} alignItems="center">
              <Timer />
              <Text fontSize={width / 36} fontFamily={fonts.primary[400]} mt={0.5}>
                {moment(new Date(dataDetail?.lowongan.createdAt) * 1000)
                  .startOf('minutes')
                  .fromNow()}
              </Text>
            </HStack>
          </HStack>
        }
      />

      <ScrollView
        px={width / 28}
        showsVerticalScrollIndicator={false}
        bgColor={colors.text.black10}
        pt={4}
        contentContainerStyle={{ paddingBottom: height / 1.8 }}
      >
        <VStack space={2}>
          <Card type="detail" title="Penyedia Lowongan">
            <HStack space={0.5} justifyContent="space-between" alignItems="center">
              <HStack space={2} alignItems="center">
                <Box w={12} h={12} rounded="full">
                  <Image
                    alt="photo profile"
                    source={
                      dataDetail?.lowongan?.penyedia?.users?.photo_profile
                        ? {
                            uri: dataDetail?.lowongan?.penyedia?.users?.photo_profile,
                          }
                        : ILPlaceholder
                    }
                    width="full"
                    height="full"
                    rounded="full"
                  />
                </Box>
                <VStack space={1}>
                  <Text fontSize={width / 32} fontFamily={fonts.primary[500]} color="black">
                    {dataDetail?.lowongan?.penyedia?.users?.nama_user}
                  </Text>
                  <Text fontSize={width / 32} fontFamily={fonts.primary[500]} color={colors.text.black50}>
                    {dataDetail?.lowongan?.penyedia?.users?.nomor_wa}
                  </Text>
                </VStack>
              </HStack>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('DetailPenyedia', {
                    uuid: dataDetail?.lowongan?.penyedia?.users?.uuid_user,
                  });
                }}
                style={styles.btnKunjungi(width)}
              >
                <Text fontSize={width / 32} fontFamily={fonts.primary[600]} color={colors.white} textAlign="center">
                  Kunjungi
                </Text>
              </TouchableOpacity>
            </HStack>
          </Card>
          <Card type="detail" title="Status">
            <Text fontFamily={fonts.primary[400]} fontSize={width / 32} color={colors.text.black70} textTransform="capitalize">
              {dataDetail?.status}
            </Text>
          </Card>
          <Card type="detail" title="Progres">
            {dataDetail?.progres?.map((progres, idx) => (
              <VStack space={0.5} key={idx}>
                <Text fontFamily={fonts.primary[400]} fontSize={width / 32} color={colors.text.black80}>
                  {progres?.informasi}
                </Text>
                <Text fontFamily={fonts.primary[400]} fontSize={width / 32} color={colors.text.black50}>
                  {moment(progres?.createdAt * 1000).format('dddd, DD MMMM YYYY - HH:mm')}
                </Text>
              </VStack>
            ))}
          </Card>
          {type === 'ditolak' ? (
            <Card type="detail" title="Alasan Ditolak">
              <Text fontFamily={fonts.primary[400]} fontSize={width / 32} color={colors.text.black70} textTransform="capitalize">
                {dataDetail?.catatan_riwayat_pencari}
              </Text>
            </Card>
          ) : (
            <>
              {dataDetail?.tanggal_mulai_kerja && dataDetail?.catatan_riwayat_pencari === null && (
                <Card type="detail" title="Permintaan Waktu Mulai Bekerja">
                  <Text fontFamily={fonts.primary[400]} fontSize={width / 32} color={colors.text.black70} textTransform="capitalize">
                    {moment(dataDetail?.tanggal_mulai_kerja * 1000).format('dddd, DD MMMM YYYY')} - {dataDetail?.waktu_mulai_kerja.split(':')[0]}:
                    {dataDetail?.waktu_mulai_kerja.split(':')[1]}
                  </Text>
                </Card>
              )}
              {dataDetail?.catatan_riwayat_penyedia && dataDetail?.catatan_riwayat_pencari === null && (
                <Card type="detail" title="Catatan Penyedia">
                  <Text fontFamily={fonts.primary[400]} fontSize={width / 32} color={colors.text.black70} textTransform="capitalize">
                    {dataDetail?.catatan_riwayat_penyedia}
                  </Text>
                </Card>
              )}
            </>
          )}
        </VStack>
      </ScrollView>
      {dataDetail?.temp_status === 'menunggu-penyedia' ? (
        <Box
          position="absolute"
          bottom={height / 2.9}
          backgroundColor={colors.white}
          px={width / 28}
          py={4}
          justifyContent="center"
          alignItems="center"
          width={width}
        >
          <Button
            type="primary"
            fontSize={width}
            text="Detail Lowongan"
            onPress={() =>
              navigation.navigate('DetailLowongan', {
                uuid: dataDetail?.lowongan?.uuid_lowongan,
                type: 'tawaran',
              })
            }
            width={width / 1.1}
          />
        </Box>
      ) : (
        <>
          {(dataDetail?.catatan_riwayat_penyedia === null || dataDetail?.tanggal_mulai_kerja === null) && type === 'diproses' && (
            <Box
              position="absolute"
              bottom={height / 4.1}
              backgroundColor={colors.white}
              px={width / 28}
              py={4}
              justifyContent="center"
              alignItems="center"
              width={width}
            >
              <Button
                type="primary"
                fontSize={width}
                text="Detail Lowongan"
                onPress={() =>
                  navigation.navigate('DetailLowongan', {
                    uuid: dataDetail?.lowongan?.uuid_lowongan,
                    type: 'tawaran',
                  })
                }
                width={width / 1.1}
              />
            </Box>
          )}

          {(dataDetail?.catatan_riwayat_penyedia || dataDetail?.tanggal_mulai_kerja) && type === 'diproses' && (
            <Box
              position="absolute"
              bottom={height / 2.9}
              backgroundColor={colors.white}
              px={width / 28}
              py={4}
              justifyContent="center"
              alignItems="center"
              width={width}
            >
              <VStack space={2}>
                <HStack alignItems="center" space={2} justifyContent="center">
                  <Button
                    type="progres"
                    fontSize={width}
                    text="Tolak"
                    onPress={() => {
                      navigation.navigate('TolakLamaran', {
                        uuid: uuid_riwayat,
                      });
                    }}
                    bgColor={colors.red}
                    width={width / 2.25}
                  />
                  <Button
                    type="progres"
                    fontSize={width}
                    text="Terima"
                    onPress={onTerimaLamaranKerja}
                    width={width / 2.25}
                    bgColor={colors.text.green}
                  />
                </HStack>
                <Button
                  type="secondary"
                  fontSize={width}
                  text="Detail Lowongan"
                  onPress={() =>
                    navigation.navigate('DetailLowongan', {
                      uuid: dataDetail?.lowongan?.uuid_lowongan,
                      type: 'tawaran',
                    })
                  }
                  width={width / 1.1}
                />
              </VStack>
            </Box>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

export default DetailLamaran;

const styles = StyleSheet.create({
  btnKunjungi: (width) => ({
    backgroundColor: colors.blue[80],
    width: width / 4,
    paddingVertical: width / 44,
    borderRadius: 8,
  }),
});
