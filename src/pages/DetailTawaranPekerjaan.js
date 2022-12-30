import { Dimensions, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Box, HStack, Image, ScrollView, Text, VStack, View } from 'native-base';
import useLoading from '../store/loadingStore';
import { getData } from '../utils/getData';
import { API } from '../config/api';
import { showError } from '../utils/showMessages';
import { Badge, Button, Card, Header, LoadingButton, TopProfile } from '../components';
import { ChevronBack, ILPlaceholder, Timer } from '../assets';
import { fonts } from '../utils/fonts';
import { convertRupiah } from '../utils/convertRupiah';
import moment from 'moment';
import { colors } from '../utils/colors';

const DetailTawaranPekerjaan = ({ navigation, route }) => {
  const { width, height } = Dimensions.get('window');

  const { uuid_riwayat } = route.params;

  const isFocused = navigation.isFocused();

  const { setLoading, loading } = useLoading();

  const [dataDetail, setDataDetail] = useState();

  useEffect(() => {
    const loadDetail = async () => {
      const resp = await getData(`/tawarkan/detail-tawaran/${uuid_riwayat}`);
      setDataDetail(resp.data);
    };

    loadDetail();

    return () => {
      setDataDetail();
    };
  }, [isFocused, uuid_riwayat]);

  const terimaTawaranPekerjaan = async () => {
    try {
      setLoading(false);
      const res = await API.patch(`/tawarkan/terima/${uuid_riwayat}`);
      if (res.data.message === 'SUCCESS_TERIMA_TAWARAN') {
        navigation.replace('SuksesTerimaTawaran', {
          title: 'Tawaran berhasil diterima',
          subTitle: 'Tawaran kerja yang anda dapat berhasil diterima. Menunggu konfirmasi dari penyedia kerja.',
        });
      } else {
        showError('Gagal menolak pelamar');
      }
    } catch ({ response }) {
      setLoading(false);
      showError(response.data.message);
    }
  };

  return (
    <SafeAreaView>
      <Header>
        <HStack space="4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronBack width={28} />
          </TouchableOpacity>
          <Text fontFamily={fonts.primary[600]} fontSize={width / 24} color="black">
            Detail Tawaran
          </Text>
        </HStack>
      </Header>

      <TopProfile
        photo={dataDetail?.lowongan?.bidang_kerja?.photo}
        title={dataDetail?.lowongan?.bidang_kerja?.detail_bidang}
        subtitle={`${dataDetail?.lowongan?.kota_lowongan}, ${dataDetail?.lowongan?.provinsi_lowongan?.split(',')[1]}`}
        type="pekerja"
        photoHeight={12}
        photoWidth={12}
        bubble={
          <HStack space={2} alignItems="center">
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
      <View height={height / 1.5}>
        <ScrollView
          px={width / 28}
          showsVerticalScrollIndicator={false}
          bgColor={colors.text.black10}
          pt={4}
          contentContainerStyle={{ paddingBottom: height / 4.5 }}
        >
          <VStack space={4}>
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
            {dataDetail?.temp_status !== 'menunggu' ? (
              <>
                <Card type="detail" title="Kualifikasi">
                  <Text fontFamily={fonts.primary[400]} fontSize={width / 32} color={colors.text.black70} textTransform="capitalize">
                    {dataDetail?.lowongan?.kualifikasi}
                  </Text>
                </Card>
                <Card type="detail" title="Deskripsi Pekerjaan">
                  <Text fontFamily={fonts.primary[400]} fontSize={width / 32} color={colors.text.black70} textTransform="capitalize">
                    {dataDetail?.lowongan?.deskripsi_lowongan}
                  </Text>
                </Card>
                <Card type="detail" title="Fasilitas">
                  <Text fontFamily={fonts.primary[400]} fontSize={width / 32} color={colors.text.black70} textTransform="capitalize">
                    {dataDetail?.lowongan?.fasilitas}
                  </Text>
                </Card>
                <Card type="detail" title="Lokasi Kerja">
                  <Text fontFamily={fonts.primary[400]} fontSize={width / 32} color={colors.text.black70} textTransform="capitalize">
                    {`${dataDetail?.lowongan?.kota_lowongan}, ${dataDetail?.lowongan?.provinsi_lowongan?.split(',')[1]}`}
                  </Text>
                </Card>
                <Card type="detail" title="Permintaan Waktu Mulai Bekerja">
                  <Text fontFamily={fonts.primary[400]} fontSize={width / 32} color={colors.text.black70} textTransform="capitalize">
                    {moment(dataDetail?.tanggal_mulai_kerja * 1000).format('dddd, DD MMMM YYYY')} - {dataDetail?.waktu_mulai_kerja.split(':')[0]}:
                    {dataDetail?.waktu_mulai_kerja.split(':')[1]}
                  </Text>
                </Card>
                <Card type="detail" title="Catatan Dari Penyedia">
                  <Text fontFamily={fonts.primary[400]} fontSize={width / 32} color={colors.text.black70} textTransform="capitalize">
                    {dataDetail?.catatan_riwayat_penyedia}
                  </Text>
                </Card>
              </>
            ) : (
              <>
                <Card type="detail" title="Status">
                  <Text fontFamily={fonts.primary[400]} fontSize={width / 32} color={colors.text.black70} textTransform="capitalize">
                    {dataDetail?.status}
                  </Text>
                </Card>
                <Card type="detail" title="Progres">
                  {dataDetail?.progres?.length > 0 &&
                    dataDetail?.progres?.map((progres, index) => (
                      <Box key={index}>
                        <Text fontFamily={fonts.primary[400]} fontSize={width / 32} color={colors.text.black80}>
                          {progres?.informasi}
                        </Text>
                        <Text fontFamily={fonts.primary[400]} fontSize={width / 32} color={colors.text.black50}>
                          {moment(progres?.createdAt * 1000).format('dddd, DD MMMM YYYY - HH:mm')}
                        </Text>
                      </Box>
                    ))}
                </Card>
              </>
            )}
          </VStack>
        </ScrollView>
      </View>

      {dataDetail?.temp_status !== 'menunggu' ? (
        <Box
          position="absolute"
          bottom={10 - 1}
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
            <HStack alignItems="center" space={2} justifyContent="center">
              <Button
                type="progres"
                fontSize={width}
                text="Tolak"
                onPress={() => {
                  navigation.navigate('TolakTawaran', {
                    uuid: uuid_riwayat,
                  });
                }}
                bgColor={colors.red}
                width={width / 2.2}
              />
              <Button
                type="progres"
                fontSize={width}
                text="Terima"
                onPress={terimaTawaranPekerjaan}
                width={width / 2.2}
                bgColor={colors.text.green}
              />
            </HStack>
          )}
        </Box>
      ) : (
        <Box
          position="absolute"
          bottom={10 - 1}
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
    </SafeAreaView>
  );
};

export default DetailTawaranPekerjaan;

const styles = StyleSheet.create({
  btnKunjungi: (width) => ({
    backgroundColor: colors.blue[80],
    width: width / 4,
    paddingVertical: width / 44,
    borderRadius: 8,
  }),
});
