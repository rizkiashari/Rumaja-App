import { Dimensions, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Box, HStack, Image, ScrollView, Text, VStack, View } from 'native-base';
import { getData } from '../utils/getData';
import { fonts } from '../utils/fonts';
import { Badge, Button, Card, Header, TopProfile } from '../components';
import { convertRupiah } from '../utils/convertRupiah';
import { ChevronBack, ILPlaceholder, Timer } from '../assets';
import moment from 'moment';
import { colors } from '../utils/colors';

const DetailBekerja = ({ navigation, route }) => {
  const { width, height } = Dimensions.get('window');

  const { uuid_riwayat } = route.params;
  const isFocused = navigation.isFocused();

  const [detailBekerja, setDetaiBekerja] = useState();

  useEffect(() => {
    const loadDetail = async () => {
      const res = await getData(`/lamaran/detail-lamaran/${uuid_riwayat}`);

      setDetaiBekerja(res.data);
    };

    loadDetail();

    return () => {
      setDetaiBekerja();
    };
  }, [isFocused, uuid_riwayat]);

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

      <TopProfile
        type="pekerja"
        photoHeight="12"
        photoWidth="12"
        photo={detailBekerja?.lowongan?.bidang_kerja?.photo}
        title={detailBekerja?.lowongan?.bidang_kerja?.detail_bidang}
        subtitle={`${detailBekerja?.lowongan?.kota_lowongan}, ${detailBekerja?.lowongan?.provinsi_lowongan?.split(',')[1]}`}
        bubble={
          <HStack justifyContent="space-between" alignItems="center">
            <Badge title={`${convertRupiah(detailBekerja?.lowongan?.gaji)}/${detailBekerja?.lowongan?.skala_gaji}`} />
            <HStack space={0.5} alignItems="center">
              <Timer />
              <Text fontSize={width / 36} fontFamily={fonts.primary[400]} mt={0.5}>
                {moment(new Date(detailBekerja?.lowongan?.createdAt) * 1000)
                  .startOf('minutes')
                  .fromNow()}
              </Text>
            </HStack>
          </HStack>
        }
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        bgColor={colors.text.black10}
        pt={4}
        height={height}
        minHeight={height}
        _contentContainerStyle={{ paddingBottom: height / 1.7 }}
      >
        <VStack space={4} px={width / 28}>
          <Card type="detail" title="Penyedia Lowongan">
            <HStack space={0.5} justifyContent="space-between" alignItems="center">
              <HStack space={2} alignItems="center">
                <Box w={12} h={12} rounded="full">
                  <Image
                    alt="photo profile"
                    source={
                      detailBekerja?.lowongan?.penyedia?.users?.photo_profile
                        ? {
                            uri: detailBekerja?.lowongan?.penyedia?.users?.photo_profile,
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
                    {detailBekerja?.lowongan?.penyedia?.users?.nama_user}
                  </Text>
                  <Text fontSize={width / 32} fontFamily={fonts.primary[500]} color={colors.text.black50}>
                    {detailBekerja?.lowongan?.penyedia?.users?.nomor_wa}
                  </Text>
                </VStack>
              </HStack>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('DetailPenyedia', {
                    uuid: detailBekerja?.lowongan?.penyedia?.users?.uuid_user,
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
          <Card type="detail" title="Kualifikasi">
            <Text fontSize={width / 32} fontFamily={fonts.primary[500]} color={colors.text.black50} maxW={width / 1.2} width="full">
              {detailBekerja?.lowongan?.kualifikasi}
            </Text>
          </Card>
          <Card type="detail" title="Deskripsi Pekerjaan">
            <Text fontSize={width / 32} fontFamily={fonts.primary[500]} color={colors.text.black50} maxW={width / 1.2} width="full">
              {detailBekerja?.lowongan?.deskripsi_lowongan}
            </Text>
          </Card>
          <Card type="detail" title="Fasilitas">
            <Text fontSize={width / 32} fontFamily={fonts.primary[500]} color={colors.text.black50} maxW={width / 1.2} width="full">
              {detailBekerja?.lowongan?.fasilitas}
            </Text>
          </Card>
          <Card type="detail" title="Lokasi Kerja">
            <Text fontSize={width / 32} fontFamily={fonts.primary[500]} color={colors.text.black50} maxW={width / 1.2} width="full">
              {`${detailBekerja?.lowongan?.kota_lowongan}, ${detailBekerja?.lowongan?.provinsi_lowongan?.split(',')[1]}`}
            </Text>
          </Card>
        </VStack>
      </ScrollView>
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
        <Button
          type="primary"
          width={width / 1.1}
          fontSize={width}
          onPress={() => {
            navigation.navigate('LihatProgres', {
              uuid: uuid_riwayat,
              type: 'pencari',
            });
          }}
          text="Lihat Progres"
        />
      </Box>
    </SafeAreaView>
  );
};

export default DetailBekerja;

const styles = StyleSheet.create({
  btnKunjungi: (width) => ({
    backgroundColor: colors.blue[80],
    width: width / 4,
    paddingVertical: width / 44,
    borderRadius: 8,
  }),
});
