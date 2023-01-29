import { Dimensions, StyleSheet, SafeAreaView, TouchableOpacity, RefreshControl } from 'react-native';
import { Box, HStack, ScrollView, Text, VStack, View } from 'native-base';
import React, { useEffect, useState } from 'react';
import { colors } from '../utils/colors';
import { fonts } from '../utils/fonts';
import { getData } from '../utils/getData';
import { API } from '../config/api';
import { Badge, BoxAddPekerjaan, Card, Header, LoadingSkeleton } from '../components';
import { ILPlaceholder, Notification, StarActive, Timer } from '../assets';
import useLoading from '../store/loadingStore';
import useUserStore from '../store/userStore';
import { useFilterHome, useFilterTersimpan } from '../store/filterHome';
import { convertRupiah } from '../utils/convertRupiah';
import moment from 'moment';
import { showError, showSuccess } from '../utils/showMessages';
import { calculateAge } from '../utils/calculateAge';
import useAuthStore from '../store/authStore';

const Beranda = ({ navigation }) => {
  const { width, height } = Dimensions.get('window');

  const [page, setPage] = useState(1);
  const [dataBidang, setDataBidang] = useState([]);
  const [dataLowongan, setDataLowongan] = useState([]);
  const [dataPekerja, setDataPekerja] = useState([]);
  const [invoke, setInvoke] = useState(false);

  const [countNotif, setCountNotif] = useState(0);
  const { setIsLogin } = useAuthStore();

  const { setFilterHome } = useFilterHome();
  const { setFilterTersimpan } = useFilterTersimpan();

  const { userData } = useUserStore();
  const { loading } = useLoading();

  const isFocused = navigation.isFocused();

  const getAllBidang = async () => {
    const resp = await getData('/user/list-bidang');

    setDataBidang(resp.data);
  };

  useEffect(() => {
    const getAllData = async () => {
      if (userData?.id_role === 2) {
        const resp = await getData(`/lowongan/rekomendasi?bidang_kerja=${userData?.id_bidang_kerja}&page=${page}&limit=5`);

        if (resp?.code === 403) {
          setIsLogin(false);
          showError('Sesi anda telah berakhir, silahkan login kembali');
          return;
        }

        setDataLowongan(resp?.data?.lowongan);
      } else {
        const resp = await getData('/user/rekomendasi-pencari');
        if (resp?.code === 403) {
          setIsLogin(false);
          showError('Sesi anda telah berakhir, silahkan login kembali');
          return;
        }
        setDataPekerja(resp.data);
      }
    };
    getAllBidang();
    setFilterTersimpan(null);

    getAllData();

    return () => {
      setDataBidang([]);
      setDataLowongan([]);
      setDataPekerja([]);
    };
  }, [isFocused, page, userData?.id_role, invoke, setInvoke, navigation, loading]);

  useEffect(() => {
    const loadCount = async () => {
      const resp = await getData('/notifikasi/count');
      setCountNotif(resp.data);
    };

    loadCount();
  }, []);

  const saveLowongan = async (uuid, save) => {
    setInvoke(!invoke);
    if (save === null) {
      try {
        const res = await API.patch(`/lowongan/save/${uuid}`);
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
        const res = await API.delete(`lowongan/delete/save/${uuid}`);
        if (res.data.message === 'SUCCESS_DELETE_SAVE_LOWONGAN') {
          showSuccess('Berhasil menghapus data simpan lowongan');
        } else {
          showError('Gagal menghapus lowongan');
        }
      } catch ({ response }) {
        showError(response.data.message);
      }
    }
  };

  const savePekerja = async (id, simpan_pencari) => {
    setInvoke(!invoke);
    if (simpan_pencari === null) {
      try {
        const res = await API.post('/user/save-pencari', {
          id_pencari: id,
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

  return (
    <SafeAreaView>
      <Header>
        <Text fontFamily={fonts.primary[600]} fontSize={width / 28} color="black">
          Beranda
        </Text>
        <TouchableOpacity style={styles.containerNotif} onPress={() => navigation.navigate('Notifikasi')}>
          <Notification width={28} />
          <Text style={styles.textNotif}>{countNotif >= 9 ? '9+' : countNotif}</Text>
        </TouchableOpacity>
      </Header>

      <ScrollView
        refreshControl={<RefreshControl refreshing={loading} onRefresh={() => setInvoke(!invoke)} />}
        showsVerticalScrollIndicator={false}
        bgColor={colors.text.black10}
        minH={height}
      >
        {userData?.id_role === 2 && (
          <View bgColor={colors.text.black10} showsVerticalScrollIndicator={false} px={width / 28} pt={height / 40}>
            <Text fontFamily={fonts.primary[600]} color="black" fontSize={width / 28}>
              Pilih Bidang Pekerjaan
            </Text>
            <ScrollView mt={3} mb={6} horizontal={true} showsHorizontalScrollIndicator={false}>
              <HStack space={3}>
                {dataBidang?.length > 0 ? (
                  dataBidang?.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() =>
                        navigation.navigate('DetailBidangPekerjaan', {
                          id: item.id,
                          bidang: item.detail_bidang,
                        })
                      }
                      style={styles.cardBidang}
                    >
                      <Card id={item.id} title={item.nama_bidang} subTitle={item.detail_bidang} type="bidang" />
                    </TouchableOpacity>
                  ))
                ) : (
                  <LoadingSkeleton type="medium" jumlah={4} />
                )}
              </HStack>
            </ScrollView>
            <Text fontFamily={fonts.primary[600]} color="black" fontSize={width / 28}>
              Rekomendasi
            </Text>
            <VStack mt={4} mb={height / 3.8} space={4}>
              {dataLowongan?.length > 0 &&
                dataLowongan?.map((lowongan, index) => (
                  <Card
                    key={index}
                    uriImage={{
                      uri:
                        +lowongan?.bidang_kerja?.id === 1
                          ? 'https://res.cloudinary.com/drcocoma3/image/upload/v1669642546/Rumaja/art_tqnghe.png'
                          : +lowongan?.bidang_kerja?.id === 2
                          ? 'https://res.cloudinary.com/drcocoma3/image/upload/v1669642546/Rumaja/pengasuh_chdloc.png'
                          : +lowongan?.bidang_kerja?.id === 3
                          ? 'https://res.cloudinary.com/drcocoma3/image/upload/v1669642546/Rumaja/sopir_pribadi_quexmw.png'
                          : 'https://res.cloudinary.com/drcocoma3/image/upload/v1669642547/Rumaja/tukang_kebun_skhz9a.png',
                    }}
                    title={lowongan?.bidang_kerja?.detail_bidang}
                    subTitle={`${lowongan?.kota_lowongan}, ${lowongan?.provinsi_lowongan?.split(',')[1]}`}
                    dataSave={lowongan?.simpan_lowongan}
                    onSaved={() =>
                      saveLowongan(
                        lowongan?.simpan_lowongan === null ? lowongan?.uuid_lowongan : lowongan?.simpan_lowongan?.uuid_simpan,
                        lowongan?.simpan_lowongan
                      )
                    }
                    onNavigation={() => {
                      navigation.navigate('DetailLowongan', {
                        uuid: lowongan?.uuid_lowongan,
                      });
                    }}
                  >
                    <Badge title={`${convertRupiah(lowongan.gaji)}/${lowongan.skala_gaji}`} />
                    <HStack space={0.5} alignItems="center">
                      <Timer />
                      <Text fontSize={width / 36} fontFamily={fonts.primary[400]} mt={0.5}>
                        {moment(new Date(lowongan.createdAt) * 1000)
                          .startOf('minutes')
                          .fromNow()}
                      </Text>
                    </HStack>
                  </Card>
                ))}
            </VStack>
          </View>
        )}

        {userData?.id_role === 3 && (
          <View bgColor={colors.text.black10} showsVerticalScrollIndicator={false} px={width / 28} pt={height / 40}>
            <BoxAddPekerjaan onPress={() => navigation.navigate('TambahLowongan')} />
            <Text fontFamily={fonts.primary[600]} color="black" fontSize={width / 28}>
              Pilih Layanan
            </Text>
            <ScrollView mt={3} mb={6} horizontal={true} showsHorizontalScrollIndicator={false}>
              <HStack space={3}>
                {dataBidang?.length > 0 ? (
                  dataBidang?.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() =>
                        navigation.navigate('DetailLayanan', {
                          id: item.id,
                          bidang: item.detail_bidang,
                        })
                      }
                      style={styles.cardBidang}
                    >
                      <Card id={item.id} title={item.nama_bidang} subTitle={item.detail_bidang} type="bidang" />
                    </TouchableOpacity>
                  ))
                ) : (
                  <LoadingSkeleton type="medium" jumlah={4} />
                )}
              </HStack>
            </ScrollView>
            <Text fontFamily={fonts.primary[600]} color="black" fontSize={width / 28}>
              Rekomendasi
            </Text>
            <VStack mt={4} mb={height / 3.8} space={4}>
              {dataPekerja?.length > 0 &&
                dataPekerja?.map((pekerja, index) => (
                  <Card
                    key={index}
                    uriImage={pekerja.users.photo_profile ? { uri: pekerja.users.photo_profile } : ILPlaceholder}
                    title={`${pekerja.users.nama_user?.split(' ')[0]} ${pekerja.users.nama_user?.split(' ')[1] || ''}`}
                    uriType="pekerja"
                    subTitle={`${pekerja?.users?.domisili_kota}, ${pekerja?.users?.domisili_provinsi?.split(',')[1]}`}
                    onNavigation={() =>
                      navigation.navigate('DetailPencari', {
                        uuid: pekerja?.users?.uuid_user,
                      })
                    }
                    dataSave={pekerja?.simpan_pencari}
                    onSaved={() => savePekerja(pekerja.id, pekerja.simpan_pencari)}
                  >
                    <HStack space={0.5} alignItems="center">
                      {pekerja?.gender && pekerja?.tanggal_lahir && (
                        <Box bgColor={colors.blue[10]} rounded={12} px={2} py={0.5}>
                          <Text fontSize={width / 32} fontFamily={fonts.primary[500]} textTransform="capitalize">
                            {pekerja?.gender ?? '-'}, {calculateAge(pekerja?.tanggal_lahir) ?? '-'}
                          </Text>
                        </Box>
                      )}
                      <Box bgColor={colors.blue[10]} rounded={12} px={2} py={0.5}>
                        <HStack alignItems="center" space={1}>
                          <Text fontSize={width / 32} fontFamily={fonts.primary[500]}>
                            {pekerja?.ulasan ? pekerja?.ulasan?.toFixed(1) : 0}
                          </Text>
                          <StarActive />
                        </HStack>
                      </Box>
                    </HStack>
                    <Text fontSize={width / 32} fontFamily={fonts.primary[400]}>
                      {pekerja.pengalaman} Pengalaman
                    </Text>
                  </Card>
                ))}
            </VStack>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Beranda;

const styles = StyleSheet.create({
  containerNotif: {
    position: 'relative',
  },
  textNotif: {
    position: 'absolute',
    bottom: -6,
    right: -7,
    backgroundColor: colors.red,
    borderRadius: 100,
    color: colors.white,
    width: 22,
    height: 22,
    paddingTop: 2,
    textAlign: 'center',
    alignItems: 'center',
    fontFamily: fonts.primary[400],
    fontSize: 12,
  },
  cardBidang: {
    width: 88,
    maxWidth: '100%',
    height: 120,
  },
});
