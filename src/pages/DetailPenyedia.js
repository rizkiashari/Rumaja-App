import { Dimensions, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { HStack, ScrollView, Text, VStack, View } from 'native-base';
import useLoading from '../store/loadingStore';
import { getData } from '../utils/getData';
import { API } from '../config/api';
import { showError, showSuccess } from '../utils/showMessages';
import { Badge, Card, EmptyContent, Header, KontakItem, LoadingSkeleton, Tab, TopProfile } from '../components';
import { ChevronBack, Timer } from '../assets';
import { colors } from '../utils/colors';
import { convertRupiah } from '../utils/convertRupiah';
import moment from 'moment';
import { fonts } from '../utils/fonts';

const DetailPenyedia = ({ navigation, route }) => {
  const { width, height } = Dimensions.get('window');

  const { uuid } = route.params;

  const [jenisTabs, setJenisTabs] = useState('Lowongan');
  const [detailProfil, setDetailProfil] = useState('');

  const [invoke, setInvoke] = useState(false);

  const { loading, setLoading } = useLoading();

  useEffect(() => {
    const loadProfil = async () => {
      const { data } = await getData(`/user/detail-penyedia/${uuid}`);
      setDetailProfil(data);
    };

    loadProfil();
  }, [uuid, invoke]);

  const saveLowongan = async (uuidLowongan, save) => {
    setInvoke(!invoke);
    setLoading(true);
    if (save === null) {
      try {
        const res = await API.patch(`/lowongan/save/${uuidLowongan}`);
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
        const res = await API.delete(`lowongan/delete/save/${uuidLowongan}`);
        if (res.data.message === 'SUCCESS_DELETE_SAVE_LOWONGAN') {
          showSuccess('Berhasil menghapus data simpan lowongan');
        } else {
          showError('Gagal menghapus lowongan');
        }
      } catch ({ response }) {
        showError(response.data.message);
      }
    }
    setLoading(false);
  };

  return (
    <SafeAreaView>
      <Header>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronBack width={28} />
        </TouchableOpacity>
      </Header>

      <TopProfile
        title={detailProfil?.penyedia?.nama_user}
        subtitle={`${detailProfil?.penyedia?.domisili_kota}, ${detailProfil?.penyedia?.domisili_provinsi?.split(',')[1]}`}
        photo={detailProfil?.penyedia?.photo_profile}
        photoHeight="full"
        photoWidth="full"
      />

      <HStack w="full" px={5} py={3} justifyContent="space-between" bgColor={colors.text.black10}>
        <Tab title="Lowongan" onPress={() => setJenisTabs('Lowongan')} jenisTabs={jenisTabs} widthTab={width / 2.2} />
        <Tab title="Detail" onPress={() => setJenisTabs('Detail')} jenisTabs={jenisTabs} widthTab={width / 2.2} />
      </HStack>

      {jenisTabs === 'Lowongan' && (
        <ScrollView
          px={width / 28}
          showsVerticalScrollIndicator={false}
          bgColor={colors.text.black10}
          pt={2}
          height={height}
          _contentContainerStyle={{ paddingBottom: height / 2.5 }}
        >
          <VStack space={4} pb={height / 3.6}>
            <VStack space={4}>
              {loading ? (
                <LoadingSkeleton jumlah={1} />
              ) : detailProfil?.lowongan?.length === 0 ? (
                <EmptyContent title="Tida ada lowongan pekerjaan" />
              ) : (
                detailProfil?.lowongan?.map((item, index) => (
                  <Card
                    key={index}
                    title={item?.bidang_kerja?.detail_bidang}
                    uriImage={{ uri: item?.bidang_kerja?.photo }}
                    dataSave={item?.simpan_lowongan}
                    onSaved={() =>
                      saveLowongan(item?.simpan_lowongan === null ? item?.uuid_lowongan : item?.simpan_lowongan?.uuid_simpan, item?.simpan_lowongan)
                    }
                    onNavigation={() => {
                      navigation.navigate('DetailLowongan', {
                        uuid: item?.uuid_lowongan,
                      });
                    }}
                    subTitle={`${item?.kota_item}, ${item?.provinsi_lowongan?.split(',')[1]}`}
                  >
                    <Badge title={`${convertRupiah(item.gaji)}/${item.skala_gaji}`} />
                    <HStack space={0.5} alignItems="center">
                      <Timer />
                      <Text fontSize={width / 36} fontFamily={fonts.primary[400]} mt={0.5}>
                        {moment(new Date(item.createdAt) * 1000)
                          .startOf('minutes')
                          .fromNow()}
                      </Text>
                    </HStack>
                  </Card>
                ))
              )}
            </VStack>
          </VStack>
        </ScrollView>
      )}

      {jenisTabs === 'Detail' && (
        <ScrollView
          px={width / 28}
          showsVerticalScrollIndicator={false}
          bgColor={colors.text.black10}
          pt={2}
          height={height}
          _contentContainerStyle={{ paddingBottom: height / 2.5 }}
        >
          <VStack space={4}>
            <Card type="detail" title="Tentang">
              <Text fontFamily={fonts.primary[400]} fontSize={width / 36} color={colors.text.black70}>
                {detailProfil?.penyedia?.tentang ?? '-'}
              </Text>
            </Card>
            <Card type="detail" title="Kontak">
              <KontakItem nomor={detailProfil?.penyedia?.nomor_wa ?? '-'} email={detailProfil?.penyedia?.email ?? '-'} />
            </Card>
          </VStack>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default DetailPenyedia;

const styles = StyleSheet.create({});
