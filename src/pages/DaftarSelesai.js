import { Dimensions, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getData } from '../utils/getData';
import { HStack, ScrollView, Text } from 'native-base';
import { Badge, Card, EmptyContent, Header, LoadingSkeleton } from '../components';
import { ChevronBack, ILTersimpanEmpty, StarActive } from '../assets';
import { fonts } from '../utils/fonts';
import { colors } from '../utils/colors';
import moment from 'moment';
import { calculateAge } from '../utils/calculateAge';
import { calculateRating } from '../utils/calculateRating';

const DaftarSelesai = ({ navigation, route }) => {
  const { width, height } = Dimensions.get('window');

  const { idLowongan } = route.params;
  const [dataPelamar, setDataPelamar] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const res = await getData(`/lamaran/daftar-pelamar/${idLowongan}?status=selesai`);
      setIsLoading(false);
      setDataPelamar(res.data);
    };

    loadData();

    return () => {
      setDataPelamar(null);
    };
  }, [idLowongan, setIsLoading]);

  console.log(dataPelamar);

  return (
    <SafeAreaView>
      <Header>
        <HStack space={4}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronBack width={28} />
          </TouchableOpacity>
          <Text fontFamily={fonts.primary[600]} fontSize={width / 24} color="black">
            Daftar Pekerja
          </Text>
        </HStack>
      </Header>
      <ScrollView
        px={width / 28}
        showsVerticalScrollIndicator={false}
        bgColor={colors.text.black10}
        pt={2}
        height={height}
        _contentContainerStyle={{ paddingBottom: height / 2.5 }}
      >
        {isLoading ? (
          <LoadingSkeleton jumlah={4} />
        ) : dataPelamar?.length === 0 ? (
          <EmptyContent image={ILTersimpanEmpty} title="Tidak ada pekerja" subTitle="Pekerja akan muncul setelah mereka menerima lamaran Anda" />
        ) : (
          dataPelamar?.map((pelamar, index) => (
            <Card
              type="progres"
              key={index}
              onNavigation={() => {
                if (pelamar?.status === 'selesai') {
                  navigation.navigate('DetailPencari', {
                    uuid: pelamar?.pencari?.users?.uuid_user,
                    type: 'daftar-selesai',
                    uuid_riwayat: pelamar?.uuid_riwayat,
                  });
                }
                if (pelamar?.status === 'ditolak') {
                  navigation.navigate('DetailPelamar', {
                    uuid: pelamar?.pencari?.users?.uuid_user,
                    type: 'daftar-tolak',
                    uuid_riwayat: pelamar?.uuid_riwayat,
                  });
                }
              }}
              id={+pelamar?.pencari?.id_bidang_kerja}
              title={pelamar?.pencari?.users?.nama_user}
              subTitle={`${pelamar?.pencari?.users?.domisili_kota}, ${pelamar?.pencari?.users?.domisili_provinsi?.split(',')[1]}`}
              statusProgress={pelamar?.status === 'selesai' ? 'Berakhir' : 'Ditolak'}
            >
              <HStack space={1}>
                <Badge
                  title={`${pelamar?.pencari?.gender ?? '-'}, ${
                    pelamar?.pencari?.tanggal_lahir ? calculateAge(pelamar?.pencari?.tanggal_lahir) : '-'
                  }`}
                />
                <Badge title={`${calculateRating(pelamar?.pencari?.ulasan)}`} type="rating" icon={<StarActive />} />
              </HStack>
              {pelamar?.status === 'ditolak' ? (
                <Text fontSize={width / 36} fontFamily={fonts.primary[400]} textTransform="capitalize">
                  {pelamar?.pencari?.pengalaman?.length} Pengalaman
                </Text>
              ) : (
                <Text fontSize={width / 36} fontFamily={fonts.primary[400]} textTransform="capitalize">
                  {moment(pelamar?.tanggal_mulai_kerja * 1000).format('MMM YYYY')} - {moment(pelamar?.createdAt * 1000).format('MMM YYYY')}
                </Text>
              )}
            </Card>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default DaftarSelesai;
