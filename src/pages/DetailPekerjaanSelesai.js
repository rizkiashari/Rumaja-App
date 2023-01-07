import { Dimensions, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Box, Checkbox, HStack, Image, ScrollView, Text, VStack, Button as ButtonAsNativabase } from 'native-base';
import { getData } from '../utils/getData';
import { convertRupiah } from '../utils/convertRupiah';
import moment from 'moment';
import { postWithJson } from '../utils/postData';
import { showError, showSuccess } from '../utils/showMessages';
import { API } from '../config/api';
import { Badge, Button, Card, Header, TopProfile } from '../components';
import { ChevronBack, ILPlaceholder, Timer } from '../assets';
import { fonts } from '../utils/fonts';
import { colors } from '../utils/colors';

const DetailPekerjaanSelesai = ({ navigation, route }) => {
  const { width, height } = Dimensions.get('window');

  const { uuid_riwayat } = route.params;

  const isFocused = navigation.isFocused();
  const [invoke, setInvoke] = useState(false);

  const [dataDetail, setDataDetail] = useState();
  const [isCheck, setIsCheck] = useState(false);

  useEffect(() => {
    const loadDetail = async () => {
      const resp = await getData(`/lamaran/selesai/${uuid_riwayat}`);
      setDataDetail(resp.data);
    };

    loadDetail();

    return () => {
      setDataDetail();
    };
  }, [isFocused, uuid_riwayat, invoke]);

  const onPengalaman = async () => {
    const payload = {
      nama: dataDetail?.lowongan?.bidang_kerja?.detail_bidang,
      pengalaman_prov: dataDetail?.lowongan?.provinsi_lowongan,
      tahun_mulai: moment(dataDetail?.tanggal_mulai_kerja * 1000).format('YYYY-MM-DD'),
      tahun_akhir: moment(dataDetail?.createdAt * 1000).format('YYYY-MM-DD'),
      isWork: 0,
    };
    const pengalaman = await postWithJson('/pengalaman/add', payload);

    if (pengalaman.code === 423) {
      showError('Pengalaman anda tidak dapat ditambahkan');
    }

    try {
      await API.patch(`/pengalaman/ulasan/${uuid_riwayat}`);
      setInvoke(!invoke);
      showSuccess('Pengalaman berhasil ditambahkan');
    } catch ({ response }) {
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
            Detail Pekerjaan
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
        contentContainerStyle={{ paddingBottom: height / 2.9 }}
      >
        <VStack vertical={true} space={2}>
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
          <Card type="detail" title="Periode Bekerja">
            <Text fontFamily={fonts.primary[400]} fontSize={width / 32} color={colors.text.black70} textTransform="capitalize">
              {moment(dataDetail?.tanggal_mulai_kerja * 1000).format('MMMM YYYY')} - {moment(dataDetail?.createdAt * 1000).format('MMMM YYYY')}
            </Text>
          </Card>
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
        </VStack>
      </ScrollView>
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
        <VStack space={4}>
          {!dataDetail?.isPengalaman && (
            <Checkbox zIndex="-1" isChecked={isCheck}>
              <ButtonAsNativabase onPress={onPengalaman} backgroundColor={colors.white} p="0">
                <Text fontFamily={fonts.primary[400]} fontSize={width / 32} color={colors.blue[80]}>
                  Tampilkan di pengalaman kerja anda
                </Text>
              </ButtonAsNativabase>
            </Checkbox>
          )}
          <HStack justifyContent="space-between" space={2}>
            <Button
              type="secondary"
              fontSize={width}
              onPress={() => {
                navigation.navigate('LihatProgres', {
                  uuid: uuid_riwayat,
                });
              }}
              width={moment(dataDetail?.createdAt * 1000).add(3, 'days') >= moment() ? width / 2.25 : width / 1.1}
              text="Lihat Progres"
            />
            {moment(dataDetail?.createdAt * 1000).add(3, 'days') >= moment() && (
              <Button
                bgColor={colors.blue[80]}
                rounded={8}
                onPress={() => {
                  navigation.navigate('Nilai', {
                    id_lowongan: dataDetail?.lowongan?.id,
                    id_pencari: dataDetail?.id_pencari,
                  });
                }}
                width={width / 2.25}
                text="Berikan Masukan"
                fontSize={width}
              />
            )}
          </HStack>
        </VStack>
      </Box>
    </SafeAreaView>
  );
};

export default DetailPekerjaanSelesai;

const styles = StyleSheet.create({
  btnKunjungi: (width) => ({
    backgroundColor: colors.blue[80],
    width: width / 4,
    paddingVertical: width / 44,
    borderRadius: 8,
  }),
});
