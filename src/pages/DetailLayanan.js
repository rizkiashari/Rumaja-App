import { Dimensions, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Text, View, Box, VStack, HStack, ScrollView, Input, Image } from 'native-base';
import { Card, Cards, EmptyContent, Header, LoadingSkeleton } from '../components';
import { ChevronBack, FilterBlack, ILPlaceholder, ILTersimpanEmpty, SearchBlack, SearchGray, StarActive, Timer } from '../assets';
import { fonts } from '../utils/fonts';
import { colors } from '../utils/colors';
import { getData } from '../utils/getData';
import { API } from '../config/api';
import { showError, showSuccess } from '../utils/showMessages';
import { useFilterHome } from '../store/filterHome';
import { calculateAge } from '../utils/calculateAge';
import useLoading from '../store/loadingStore';

const DetailLayanan = ({ navigation, route }) => {
  const { bidang, id } = route.params;
  const { width, height } = Dimensions.get('window');

  const isFocused = navigation.isFocused();

  const [invoke, setInvoke] = useState(false);
  const [isSearch, setIsSearch] = useState(false);

  const [search, setSearch] = useState('');

  const { filterHome } = useFilterHome();

  const [dataPekerja, setDataPekerja] = useState([]);

  const { setLoading, loading } = useLoading();

  useEffect(() => {
    const loadBidangPekerjaan = async (idPekerjaan) => {
      setLoading(true);
      if (filterHome === null) {
        const resp = await getData(`/user/pencari/${idPekerjaan}`);
        setDataPekerja(resp?.data?.pekerja);
      } else {
        if (
          filterHome.kota === '' &&
          filterHome.provinsi === '' &&
          filterHome.urutan === '' &&
          filterHome.gender === '' &&
          filterHome.min_rentang === '' &&
          filterHome.max_rentang === ''
        ) {
          const resp = await getData(`/user/pencari/${idPekerjaan}`);
          setDataPekerja(resp?.data?.pekerja);
        } else {
          const resp = await getData(
            `/user/pencari/${idPekerjaan}?kota=${filterHome.kota}&provinsi=${filterHome.provinsi}&urutan=${filterHome.urutan}&jenis_kelamin=${
              filterHome.gender
            }&min_usia=${+filterHome.min_rentang}&max_usia=${+filterHome.max_rentang}`
          );
          setDataPekerja(resp?.data?.pekerja);
        }
      }
      setLoading(false);
    };
    loadBidangPekerjaan(id);

    return () => {
      setDataPekerja([]);
    };
  }, [isFocused, id, filterHome, invoke, setLoading]);

  const savePekerja = async (id_pencari, simpan_pencari) => {
    setInvoke(!invoke);
    if (simpan_pencari === null) {
      try {
        const res = await API.post('/user/save-pencari', {
          id_pencari: id_pencari,
          isSave: true,
        });
        if (res.data.message === 'SUCCESS_SAVE_PENCARI') {
          showSuccess('Berhasil menyimpan pencari kerja');
        } else {
          showError('Gagal menyimpan pencari kerja');
        }
      } catch ({ response }) {
        showError(response.data.message);
      }
    } else {
      try {
        const res = await API.patch(`/user/unsave-pencari/${simpan_pencari?.uuid_simpan}`);
        if (res.data.message === 'SUCCESS_UNSAVE_PENCARI') {
          showSuccess('Berhasil menghapus data simpan pencari kerja');
        } else {
          showError('Gagal menghapus pencari kerja');
        }
      } catch ({ response }) {
        showError(response.data.message);
      }
    }
  };

  const onSearchPekerja = async (val, idPekerjaan) => {
    const resp = await getData(`/user/pencari/${idPekerjaan}?search=${val}`);
    setDataPekerja(resp.data.pekerja);
  };

  return (
    <SafeAreaView>
      <View bgColor={colors.text.black10} minH={height}>
        <Header>
          <HStack alignItems="center" space={2.5}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ChevronBack width={28} />
            </TouchableOpacity>
            {!isSearch && (
              <Text fontFamily={fonts.primary[600]} fontSize={width / 28} color="black">
                {bidang}
              </Text>
            )}
          </HStack>
          {isSearch && (
            <Box position="relative">
              <Input
                placeholder="Masukkan nama pekerjaan"
                rounded={8}
                px="2"
                fontFamily={fonts.primary[500]}
                type="text"
                backgroundColor={colors.white}
                py="1"
                fontSize={width / 32}
                w={width / 1.4}
                value={search}
                onChange={(e) => onSearchPekerja(e.nativeEvent.text, id)}
                onChangeText={(text) => setSearch(text)}
              />
              <TouchableOpacity
                style={styles.btnSearch(width)}
                onPress={() => {
                  onSearchPekerja(search, id);
                  setIsSearch(false);
                }}
              >
                <SearchGray />
              </TouchableOpacity>
            </Box>
          )}
          <HStack space={2} alignItems="center" justifyContent="center">
            {!isSearch && (
              <TouchableOpacity onPress={() => setIsSearch(!isSearch)}>
                <SearchBlack width={28} />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('FilterHome', {
                  bidang: bidang,
                  id: id,
                })
              }
            >
              <FilterBlack width={28} />
            </TouchableOpacity>
          </HStack>
        </Header>
        <ScrollView pt={height / 28} showsVerticalScrollIndicator={false} px={width / 28} _contentContainerStyle={{ paddingBottom: height / 14 }}>
          <VStack space={4}>
            {loading ? (
              <LoadingSkeleton jumlah={4} />
            ) : dataPekerja?.length === 0 ? (
              <EmptyContent
                image={ILTersimpanEmpty}
                title="Tidak ada pencari kerja"
                subTitle="Maaf belum ada pencari kerja yang tersedia untuk bidang pekerjaan ini."
              />
            ) : (
              dataPekerja?.map((pekerja, index) => (
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
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default DetailLayanan;

const styles = StyleSheet.create({
  btnSearch: (width) => ({
    position: 'absolute',
    right: width / 32,
    top: 7,
  }),
});
