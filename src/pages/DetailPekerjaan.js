import { Dimensions, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { HStack, ScrollView, Text, VStack, View } from 'native-base';
import { getData } from '../utils/getData';
import { Badge, Card, Header, TopProfile } from '../components';
import { ChevronBack, Timer } from '../assets';
import { fonts } from '../utils/fonts';
import { convertRupiah } from '../utils/convertRupiah';
import moment from 'moment';
import { colors } from '../utils/colors';

const DetailPekerjaan = ({ navigation, route }) => {
  const { width, height } = Dimensions.get('window');

  const { uuid } = route.params;
  const isFocused = navigation.isFocused();

  const [detailLowongan, setDetailLowongan] = useState();

  useEffect(() => {
    const loadDetail = async () => {
      const res = await getData(`/lowongan/id/${uuid}`);

      setDetailLowongan(res.data);
    };

    loadDetail();

    return () => {
      setDetailLowongan();
    };
  }, [isFocused, uuid]);

  return (
    <SafeAreaView>
      <Header>
        <HStack space={4}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronBack width={30} />
          </TouchableOpacity>
          <Text fontFamily={fonts.primary[600]} fontSize={width / 24} color="black">
            Detail Pekerjaan
          </Text>
        </HStack>
      </Header>

      {/* Top Profile Pekerjaan */}
      <TopProfile
        title={detailLowongan?.bidang_kerja?.detail_bidang}
        subtitle={`${detailLowongan?.kota_lowongan}, ${detailLowongan?.provinsi_lowongan?.split(',')[1]}`}
        type="pekerja"
        photo={detailLowongan?.bidang_kerja?.photo}
        bubble={
          <HStack justifyContent="space-between" alignItems="center">
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

      <ScrollView
        px={width / 28}
        showsVerticalScrollIndicator={false}
        bgColor={colors.text.black10}
        pt={2}
        height={height}
        _contentContainerStyle={{ paddingBottom: height / 2.5 }}
      >
        <VStack space={4}>
          <Card type="detail" title="Kualifikasi">
            <Text fontFamily={fonts.primary[400]} fontSize={width / 36} color={colors.text.black70}>
              {detailLowongan?.kualifikasi}
            </Text>
          </Card>
          <Card type="detail" title="Deskripsi Pekerjaan">
            <Text fontFamily={fonts.primary[400]} fontSize={width / 36} color={colors.text.black70}>
              {detailLowongan?.deskripsi_lowongan}
            </Text>
          </Card>
          <Card type="detail" title="Fasilitas">
            <Text fontFamily={fonts.primary[400]} fontSize={width / 36} color={colors.text.black70}>
              {detailLowongan?.fasilitas}
            </Text>
          </Card>
          <Card type="detail" title="Lokasi Kerja">
            <Text fontFamily={fonts.primary[400]} fontSize={width / 36} color={colors.text.black70}>
              {`${detailLowongan?.alamat_lengkap}, ${detailLowongan?.kota_lowongan}, ${detailLowongan?.provinsi_lowongan?.split(',')[1]}`}
            </Text>
          </Card>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetailPekerjaan;
