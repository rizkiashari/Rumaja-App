import { Dimensions, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Box, HStack, ScrollView, Text, VStack, View } from 'native-base';
import { getData } from '../utils/getData';
import { Badge, Button, Card, Header, TopProfile } from '../components';
import { ChevronBack, StarActive } from '../assets';
import { fonts } from '../utils/fonts';
import { calculateAge } from '../utils/calculateAge';
import { colors } from '../utils/colors';
import moment from 'moment';
import useLoading from '../store/loadingStore';
import { API } from '../config/api';
import { showError } from '../utils/showMessages';
import { calculateRating } from '../utils/calculateRating';

const DetailTawaranTerkirim = ({ navigation, route }) => {
  const { width, height } = Dimensions.get('window');

  const { id_riwayat } = route.params;

  const isFocused = navigation.isFocused();
  const [dataDetail, setDataDetail] = useState();

  const { loading, setLoading } = useLoading();

  useEffect(() => {
    const loadDetail = async () => {
      const resp = await getData(`/tawarkan/progres-tawaran/${id_riwayat}?status=diproses`);
      setDataDetail(resp.data);
    };

    loadDetail();
  }, [isFocused, id_riwayat]);

  const mulaiPekerjaan = async (uuid_riwayat) => {
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
        photo={dataDetail?.riwayat?.pencari?.bidang_kerja?.photo}
        title={dataDetail?.riwayat?.pencari?.users?.nama_user}
        subtitle={dataDetail?.riwayat?.pencari?.bidang_kerja?.detail_bidang}
        type="pekerja"
        photoHeight="12"
        photoWidth="12"
        bubble={
          <HStack alignItems="center" justifyContent="space-between">
            {dataDetail?.riwayat?.pencari?.gender && dataDetail?.riwayat?.pencari?.tanggal_lahir && (
              <Badge title={`${dataDetail?.riwayat?.pencari?.gender}, ${calculateAge(dataDetail?.riwayat?.pencari?.tanggal_lahir)}`} />
            )}
            <Badge type="rating" icon={<StarActive />} title={calculateRating(dataDetail?.riwayat?.pencari?.ulasan)} />
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
          <Card type="detail" title="Status">
            <Text fontFamily={fonts.primary[400]} fontSize={width / 32} color={colors.text.black70} textTransform="capitalize">
              {dataDetail?.riwayat?.status}
            </Text>
          </Card>
          <Card type="detail" title="Progres">
            {dataDetail?.progress?.map((progres, idx) => (
              <Box key={idx}>
                <Text fontFamily={fonts.primary[400]} fontSize={width / 32} color={colors.text.black80}>
                  {progres?.informasi?.split('-')[0]}
                </Text>
                <Text fontFamily={fonts.primary[400]} fontSize={width / 32} color={colors.text.black50}>
                  {moment(progres?.createdAt * 1000).format('dddd, DD MMMM YYYY - HH:mm')}
                </Text>
              </Box>
            ))}
          </Card>
          <Card type="detail" title="Permintaan Waktu Interview">
            <Text fontFamily={fonts.primary[400]} fontSize={width / 32} color={colors.text.black70} textTransform="capitalize">
              {moment(dataDetail?.riwayat?.tanggal_mulai_kerja * 1000).format('dddd, DD MMMM YYYY')} -{' '}
              {dataDetail?.riwayat?.waktu_mulai_kerja?.split(':')[0]}:{dataDetail?.riwayat?.waktu_mulai_kerja?.split(':')[1]}
            </Text>
          </Card>
          <Card type="detail" title="Catatan Tambahan">
            <Text fontFamily={fonts.primary[400]} fontSize={width / 32} color={colors.text.black70} textTransform="capitalize">
              {dataDetail?.riwayat?.catatan_riwayat_penyedia}
            </Text>
          </Card>
        </VStack>
      </ScrollView>
      <Box
        position="absolute"
        bottom={height / 2.8}
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
                uuid: dataDetail?.riwayat?.pencari?.users?.uuid_user,
                type: 'detail-pelamar',
              })
            }
            width={width / 3.4}
          />
          {dataDetail?.riwayat?.temp_status === 'menunggu_pencari' ? (
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
              onPress={() => mulaiPekerjaan(dataDetail?.riwayat?.uuid_riwayat)}
              width={width / 1.7}
            />
          )}
        </HStack>
      </Box>
    </SafeAreaView>
  );
};

export default DetailTawaranTerkirim;

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
