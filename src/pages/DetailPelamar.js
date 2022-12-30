import { Dimensions, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Box, HStack, ScrollView, Text, VStack, View } from 'native-base';
import { getData } from '../utils/getData';
import { Badge, Button, Card, Header, TopProfile } from '../components';
import { ChevronBack, StarActive } from '../assets';
import { fonts } from '../utils/fonts';
import moment from 'moment';
import { calculateRating } from '../utils/calculateRating';
import { calculateAge } from '../utils/calculateAge';
import { colors } from '../utils/colors';
import { showError } from '../utils/showMessages';
import { API } from '../config/api';
import useLoading from '../store/loadingStore';

const DetailPelamar = ({ navigation, route }) => {
  const { width, height } = Dimensions.get('window');

  const { uuid_riwayat, type } = route.params;
  const isFocused = navigation.isFocused();

  const [detailPelamar, setDetailPelamar] = useState();

  const { loading, setLoading } = useLoading();

  useEffect(() => {
    const loadDetail = async () => {
      const res = await getData(`/lamaran/detail-lamaran/${uuid_riwayat}`);

      setDetailPelamar(res.data);
    };

    loadDetail();

    return () => {
      setDetailPelamar();
    };
  }, [isFocused, uuid_riwayat]);

  console.log(detailPelamar);

  const mulaiPekerjaan = async () => {
    try {
      setLoading(true);
      const res = await API.patch(`/lamaran/mulai-bekerja/${uuid_riwayat}`);

      if (res.data.message === 'SUCCESS_MULAI_BEKERJA') {
        navigation.navigate('SuksesBekerja', {
          title: 'Berhasil memulai pekerjaan!',
          subTitle: 'Kandidat akan mulai bekerja pada waktu dan lokasi yang sudah ditetapkan.',
        });
        setLoading(false);
      } else {
        showError('Gagal memulai pekerjaan!');
        setLoading(false);
      }
    } catch ({ response }) {
      showError(response.data.message);
      setLoading(false);
    }
  };

  console.log(detailPelamar);

  return (
    <SafeAreaView>
      <Header>
        <HStack space={4}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronBack width={30} />
          </TouchableOpacity>
          <Text fontFamily={fonts.primary[600]} fontSize={width / 24} color="black">
            Detail Pelamar
          </Text>
        </HStack>
      </Header>
      <TopProfile
        photo={detailPelamar?.pencari?.bidang_kerja?.photo}
        title={detailPelamar?.pencari?.users?.nama_user}
        subtitle={detailPelamar?.pencari?.bidang_kerja?.detail_bidang}
        type="pekerja"
        photoHeight="12"
        photoWidth="12"
        bubble={
          <HStack alignItems="center" justifyContent="space-between">
            {detailPelamar?.pencari?.gender && detailPelamar?.pencari?.tanggal_lahir && (
              <Badge title={`${detailPelamar?.pencari?.gender}, ${calculateAge(detailPelamar?.pencari?.tanggal_lahir)}`} />
            )}
            <Badge type="rating" icon={<StarActive />} title={calculateRating(detailPelamar?.pencari?.ulasan)} />
          </HStack>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        bgColor={colors.text.black10}
        pt={4}
        height={height}
        minHeight={height}
        _contentContainerStyle={{ paddingBottom: height / 1.5 }}
      >
        <VStack space={4} px={width / 28}>
          <Card type="detail" title="Status">
            <Text
              fontSize={width / 32}
              fontFamily={fonts.primary[500]}
              color={colors.text.black50}
              maxW={width / 1.2}
              width="full"
              textTransform="capitalize"
            >
              {detailPelamar?.status}
            </Text>
          </Card>
          <Card type="detail" title="Progres">
            {detailPelamar?.progres?.map((progres, idx) => (
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
          {detailPelamar?.status !== 'ditolak' && (
            <>
              <Card type="detail" title="Permintaan Waktu Mulai Bekerja">
                <Text fontFamily={fonts.primary[400]} fontSize={width / 32} color={colors.text.black70} textTransform="capitalize">
                  {moment(detailPelamar?.tanggal_mulai_kerja * 1000).format('dddd, DD MMMM YYYY')} - {detailPelamar?.waktu_mulai_kerja?.split(':')[0]}
                  :{detailPelamar?.waktu_mulai_kerja?.split(':')[1]}
                </Text>
              </Card>
              <Card type="detail" title="Catatan Tambahan">
                <Text fontFamily={fonts.primary[400]} fontSize={width / 32} color={colors.text.black70} textTransform="capitalize">
                  {detailPelamar?.catatan_riwayat_penyedia}
                </Text>
              </Card>
            </>
          )}
          {detailPelamar?.status === 'ditolak' && (
            <Card type="detail" title="Alasan ditolak">
              <Text fontFamily={fonts.primary[400]} fontSize={width / 32} color={colors.text.black70} textTransform="capitalize">
                {detailPelamar?.catatan_riwayat_pencari}
              </Text>
            </Card>
          )}
        </VStack>
      </ScrollView>
      {type === 'daftar-tolak' ? (
        <Box
          position="absolute"
          bottom={height / 2.6}
          backgroundColor={colors.white}
          px={width / 28}
          py={4}
          justifyContent="center"
          alignItems="center"
          width={width}
        >
          <HStack alignItems="center" justifyContent="space-between" space={2}>
            <Button type="primary" fontSize={width} text="Profil Pekerja" onPress={() => {}} width={width / 1.1} />
          </HStack>
        </Box>
      ) : (
        <Box
          position="absolute"
          bottom={height / 2.6}
          backgroundColor={colors.white}
          px={width / 28}
          py={4}
          justifyContent="center"
          alignItems="center"
          width={width}
        >
          <HStack alignItems="center" justifyContent="space-between" space={2}>
            <Button
              type="secondary"
              fontSize={width}
              text="Lihat Profil"
              onPress={() =>
                navigation.navigate('DetailPencari', {
                  uuid: detailPelamar?.pencari?.users?.uuid_user,
                  type: 'detail-pelamar',
                })
              }
              width={width / 3.4}
            />
            {detailPelamar?.temp_status === 'menunggu-pencari' ? (
              <Box style={styles.btnSelanjutnyaDisabled(width)}>
                <Text color={colors.text.black50} fontFamily={fonts.primary[500]} textAlign="center" paddingY={2}>
                  Mulai Pekerjaan
                </Text>
              </Box>
            ) : (
              <Button
                type="primary"
                fontSize={width}
                text={loading ? 'Loading...' : 'Mulai Pekerjaan'}
                onPress={mulaiPekerjaan}
                width={width / 1.7}
              />
            )}
          </HStack>
        </Box>
      )}
    </SafeAreaView>
  );
};

export default DetailPelamar;

const styles = StyleSheet.create({
  btnSelanjutnyaDisabled: (width) => ({
    backgroundColor: colors.text.black30,
    width: width / 1.7,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.text.black30,
    paddingVertical: 3,
  }),
});
