import { Dimensions, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getData } from '../utils/getData';
import { Badge, Card, EmptyContent, Header, LoadingSkeleton, Status } from '../components';
import { HStack, ScrollView, Text, VStack } from 'native-base';
import { ChevronBack, ILTersimpanEmpty, StarActive } from '../assets';
import { fonts } from '../utils/fonts';
import { colors } from '../utils/colors';
import { calculateAge } from '../utils/calculateAge';
import { calculateRating } from '../utils/calculateRating';

const DaftarTawaranTerkirim = ({ navigation, route }) => {
  const { width, height } = Dimensions.get('window');

  const { idLowongan } = route.params;

  const [isLoading, setIsLoading] = useState(false);

  const [dataTawaranTerkirim, setDataTawaranTerkirim] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const res = await getData(`/tawarkan/daftar-terkirim/${idLowongan}`);
      setIsLoading(false);
      setDataTawaranTerkirim(res.data);
    };

    loadData();

    return () => {
      setDataTawaranTerkirim(null);
    };
  }, [idLowongan]);

  return (
    <SafeAreaView>
      <Header>
        <HStack space={4}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronBack width={28} />
          </TouchableOpacity>
          <Text fontFamily={fonts.primary[600]} fontSize={width / 24} color="black">
            Daftar Kandidat
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
        <VStack mt={1} mb={height / 8} space={4}>
          {isLoading ? (
            <LoadingSkeleton jumlah={4} />
          ) : dataTawaranTerkirim?.length === 0 ? (
            <EmptyContent image={ILTersimpanEmpty} title="Tidak ada kandidat" subTitle="Kandidat nanti akan muncul disini" />
          ) : (
            dataTawaranTerkirim?.map((tawaran, index) => (
              <Card
                type="progres"
                key={index}
                onNavigation={() => {
                  navigation.navigate('DetailTawaranTerkirim', {
                    id_riwayat: tawaran?.id,
                  });
                }}
                id={+tawaran?.pencari?.id_bidang_kerja}
                title={`${tawaran?.pencari?.users?.nama_user?.split(' ')[0]} ${tawaran?.pencari?.users?.nama_user?.split(' ')[1]}`}
                subTitle={`${tawaran?.pencari?.users?.domisili_kota}, ${tawaran?.pencari?.users?.domisili_provinsi?.split(',')[1]}`}
                statusProgress="Diproses"
              >
                <HStack space={1}>
                  <Badge
                    title={`${tawaran?.pencari?.gender ?? '-'}, ${
                      tawaran?.pencari?.tanggal_lahir ? calculateAge(tawaran?.pencari?.tanggal_lahir) : '-'
                    }`}
                  />
                  <Badge type="rating" icon={<StarActive />} title={`${calculateRating(tawaran?.pencari?.ulasan)}`} />
                </HStack>
                <Text fontSize={width / 36} pr={width / 28} fontFamily={fonts.primary[400]} textTransform="capitalize">
                  {tawaran?.pencari?.pengalaman?.length} Pengalaman
                </Text>
              </Card>
            ))
          )}
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DaftarTawaranTerkirim;
