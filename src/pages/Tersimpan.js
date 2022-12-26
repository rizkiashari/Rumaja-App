import { Dimensions, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Card, EmptyContent, Header, LoadingSkeleton } from '../components';
import { Box, HStack, Image, ScrollView, Text, VStack } from 'native-base';
import { fonts } from '../utils/fonts';
import { FilterBlack, ILPlaceholder, ILTersimpanEmpty, StarActive, Timer, UnSaved } from '../assets';
import { colors } from '../utils/colors';
import useUserStore from '../store/userStore';
import { API } from '../config/api';
import { getData } from '../utils/getData';
import { showError, showSuccess } from '../utils/showMessages';
import { calculateAge } from '../utils/calculateAge';
import moment from 'moment';
import { convertRupiah } from '../utils/convertRupiah';
import { useFilterTersimpan } from '../store/filterHome';
import useLoading from '../store/loadingStore';

const Tersimpan = ({ navigation }) => {
  const { width, height } = Dimensions.get('window');

  const [dataSimpanPekerja, setDataSimpanPekerja] = useState(null);
  const [dataLowongan, setDataLowongan] = useState(null);

  const [invoke, setInvoke] = useState(false);

  const isFocused = navigation.isFocused();

  const { userData } = useUserStore();
  const { setLoading, loading } = useLoading();
  const { filterTersimpan } = useFilterTersimpan();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      if (filterTersimpan === null) {
        if (userData?.id_role === 3) {
          const resp = await getData('/user/pencari/all-save');
          setDataSimpanPekerja(resp.data.pekerja);
        }
        if (userData?.id_role === 2) {
          const resp = await getData('/lowongan/list-save');
          setDataLowongan(resp?.data?.lowongan);
        }
      } else {
        if (userData?.id_role === 2) {
          if (
            filterTersimpan.bidang_kerja === '' &&
            filterTersimpan.kota === '' &&
            filterTersimpan.provinsi === '' &&
            filterTersimpan.skala_gaji === '' &&
            filterTersimpan.urutan === ''
          ) {
            const resp = await getData('/lowongan/list-save');
            setDataLowongan(resp?.data?.lowongan);
          } else {
            const resp = await getData(
              `/lowongan/list-save?bidang_kerja=${filterTersimpan.bidang_kerja}&kota=${filterTersimpan.kota}&provinsi=${filterTersimpan.provinsi}&skala_gaji=${filterTersimpan.skala_gaji}&urutan=${filterTersimpan.urutan}`
            );
            setDataLowongan(resp?.data?.lowongan);
          }
        }

        if (userData?.id_role === 3) {
          if (
            filterTersimpan.bidang_kerja === '' &&
            filterTersimpan.jenis_kelamin === '' &&
            filterTersimpan.kota === '' &&
            filterTersimpan.max_usia === '' &&
            filterTersimpan.min_usia === '' &&
            filterTersimpan.provinsi === '' &&
            filterTersimpan.urutan === ''
          ) {
            const resp = await getData('/user/pencari/all-save');
            setDataSimpanPekerja(resp.data.pekerja);
          } else {
            const resp = await getData(
              `/user/pencari/all-save?bidang_kerja=${filterTersimpan.bidang_kerja}&provinsi=${filterTersimpan.provinsi}&gender=${filterTersimpan.jenis_kelamin}&max_usia=${filterTersimpan.max_usia}&min_usia=${filterTersimpan.min_usia}&urutan=${filterTersimpan.urutan}`
            );
            setDataSimpanPekerja(resp.data.pekerja);
          }
        }
      }
      setLoading(false);
    };

    loadData();

    return () => {
      setDataLowongan(null);
      setDataSimpanPekerja(null);
    };
  }, [isFocused, userData?.id_role, invoke, setInvoke, filterTersimpan, setLoading]);

  console.log(dataSimpanPekerja);

  return (
    <SafeAreaView>
      <Header>
        <Text fontFamily={fonts.primary[600]} fontSize={width / 28} color="black">
          Tersimpan
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('FilterTersimpan')}>
          <FilterBlack width={28} />
        </TouchableOpacity>
      </Header>
      <ScrollView px={width / 28} py={width / 28} showsVerticalScrollIndicator={false} _contentContainerStyle={{ paddingBottom: width / 28 }}>
        {userData?.id_role === 2 && (
          <VStack mt={1}>
            {loading ? (
              <LoadingSkeleton jumlah={4} />
            ) : dataLowongan?.length === 0 ? (
              <EmptyContent
                image={ILTersimpanEmpty}
                title="Tidak ada lowongan yang  tersimpan"
                subTitle="Lowongan yang kamu simpan akan muncul di halaman ini."
              />
            ) : (
              dataLowongan?.map((item, index) => <Text>Hel</Text>)
            )}
          </VStack>
        )}

        {userData?.id_role === 3 && (
          <VStack mt={1}>
            {loading ? (
              <LoadingSkeleton jumlah={4} />
            ) : dataSimpanPekerja?.length === 0 ? (
              <EmptyContent
                image={ILTersimpanEmpty}
                title="Tidak ada pencari kerja yang tersimpan"
                subTitle="Pencari kerja yang kamu simpan akan muncul di halaman ini."
              />
            ) : (
              dataSimpanPekerja?.map((pekerja, index) => (
                <Card
                  title={pekerja.users.nama_user}
                  subTitle={`${pekerja?.users?.domisili_kota}, ${pekerja?.users?.domisili_provinsi?.split(',')[1]}`}
                  key={index}
                  uriImage={pekerja?.users?.photo_profile ? { uri: pekerja?.users?.photo_profile } : ILPlaceholder}
                  onSaved={() => savePekerja(pekerja?.id, pekerja?.simpan_pencari)}
                  dataSave={pekerja?.simpan_pencari}
                  onNavigation={() =>
                    navigation.navigate('DetailPencari', {
                      uuid: pekerja?.users?.uuid_user,
                    })
                  }
                >
                  <HStack space={0.5} alignItems="center">
                    {pekerja?.gender && pekerja?.tanggal_lahir && (
                      <Box bgColor={colors.blue[10]} rounded={12} px={2} py={0.5}>
                        <Text fontSize={width / 32} fontFamily={fonts.primary[500]} textTransform="capitalize">
                          {pekerja?.gender}, {calculateAge(pekerja?.tanggal_lahir)}
                        </Text>
                      </Box>
                    )}
                    <Box bgColor={colors.blue[10]} rounded={12} px={2} py={0.5}>
                      <HStack alignItems="center" space={1}>
                        <Text fontSize={width / 32} fontFamily={fonts.primary[500]}>
                          {pekerja?.ulasan ? pekerja?.ulasan : 0}
                        </Text>
                        <StarActive />
                      </HStack>
                    </Box>
                  </HStack>
                  <Text fontSize={width / 32} fontFamily={fonts.primary[400]}>
                    {pekerja?.pengalaman} Pengalaman
                  </Text>
                </Card>
              ))
            )}
          </VStack>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Tersimpan;

const styles = StyleSheet.create({});
