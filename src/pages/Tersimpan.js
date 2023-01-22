import { Dimensions, RefreshControl, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Badge, Card, EmptyContent, Header, LoadingSkeleton } from '../components';
import { Box, HStack, ScrollView, Text, VStack } from 'native-base';
import { fonts } from '../utils/fonts';
import { FilterBlack, ILPlaceholder, ILTersimpanEmpty, StarActive, Timer } from '../assets';
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
import useAuthStore from '../store/authStore';

const Tersimpan = ({ navigation }) => {
  const { width, height } = Dimensions.get('window');

  const [dataSimpanPekerja, setDataSimpanPekerja] = useState(null);
  const [dataLowongan, setDataLowongan] = useState(null);

  const [invoke, setInvoke] = useState(false);

  const { setIsLogin } = useAuthStore();

  const isFocused = navigation.isFocused();

  const { userData } = useUserStore();
  const { setLoading, loading } = useLoading();
  const { filterTersimpan, setFilterTersimpan } = useFilterTersimpan();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      if (filterTersimpan === null) {
        if (userData?.id_role === 3) {
          const resp = await getData('/user/pencari/all-save');
          if (resp?.code === 403) {
            setIsLogin(false);
            showError('Sesi anda telah berakhir, silahkan login kembali');
            return;
          }
          setDataSimpanPekerja(resp.data.pekerja);
        }
        if (userData?.id_role === 2) {
          const resp = await getData('/lowongan/list-save');
          if (resp?.code === 403) {
            setIsLogin(false);
            showError('Sesi anda telah berakhir, silahkan login kembali');
            return;
          }
          setDataLowongan(resp?.data?.lowongan);
        }
      } else {
        if (userData?.id_role === 2) {
          if (filterTersimpan.bidang_kerja === '' && filterTersimpan.skala_gaji === '' && filterTersimpan.urutan === '') {
            const resp = await getData('/lowongan/list-save');
            if (resp?.code === 403) {
              setIsLogin(false);
              showError('Sesi anda telah berakhir, silahkan login kembali');
              return;
            }
            setDataLowongan(resp?.data?.lowongan);
          } else {
            const resp = await getData(
              `/lowongan/list-save?bidang_kerja=${filterTersimpan.bidang_kerja}&skala_gaji=${filterTersimpan.skala_gaji}&urutan=${filterTersimpan.urutan}`
            );
            if (resp?.code === 403) {
              setIsLogin(false);
              return;
            }
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
            if (resp?.code === 403) {
              setIsLogin(false);
              showError('Sesi anda telah berakhir, silahkan login kembali');
              return;
            }
            setDataSimpanPekerja(resp.data.pekerja);
          } else {
            const resp = await getData(
              `/user/pencari/all-save?bidang_kerja=${filterTersimpan.bidang_kerja}&provinsi=${filterTersimpan.provinsi}&gender=${filterTersimpan.jenis_kelamin}&max_usia=${filterTersimpan.max_usia}&min_usia=${filterTersimpan.min_usia}&urutan=${filterTersimpan.urutan}`
            );
            if (resp?.code === 403) {
              setIsLogin(false);
              showError('Sesi anda telah berakhir, silahkan login kembali');
              return;
            }
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
          Tersimpan
        </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('FilterTersimpan');
            setFilterTersimpan(null);
          }}
        >
          <FilterBlack width={28} />
        </TouchableOpacity>
      </Header>
      <ScrollView
        background={colors.text.black10}
        px={width / 28}
        py={width / 28}
        showsVerticalScrollIndicator={false}
        minHeight={height}
        height="full"
        refreshControl={<RefreshControl refreshing={loading} onRefresh={() => setInvoke(!invoke)} />}
        _contentContainerStyle={{ paddingBottom: height / 5 }}
      >
        {userData?.id_role === 2 && (
          <VStack mt={1} space={4} mb={height / 8}>
            {loading ? (
              <LoadingSkeleton jumlah={4} />
            ) : dataLowongan?.length === 0 ? (
              <EmptyContent
                image={ILTersimpanEmpty}
                title="Tidak ada lowongan yang  tersimpan"
                subTitle="Lowongan yang kamu simpan akan muncul di halaman ini."
              />
            ) : (
              dataLowongan?.map((lowongan, index) => (
                <Card
                  key={index}
                  title={lowongan?.bidang_kerja?.detail_bidang}
                  subTitle={`${lowongan?.kota_lowongan}, ${lowongan?.provinsi_lowongan?.split(',')[1]}`}
                  uriImage={{
                    uri:
                      lowongan?.bidang_kerja?.id === 1
                        ? 'https://res.cloudinary.com/drcocoma3/image/upload/v1669642546/Rumaja/art_tqnghe.png'
                        : lowongan?.bidang_kerja?.id === 2
                        ? 'https://res.cloudinary.com/drcocoma3/image/upload/v1669642546/Rumaja/pengasuh_chdloc.png'
                        : lowongan?.bidang_kerja?.id === 3
                        ? 'https://res.cloudinary.com/drcocoma3/image/upload/v1669642546/Rumaja/sopir_pribadi_quexmw.png'
                        : 'https://res.cloudinary.com/drcocoma3/image/upload/v1669642547/Rumaja/tukang_kebun_skhz9a.png',
                  }}
                  onSaved={() =>
                    saveLowongan(
                      lowongan?.simpan_lowongan === null ? lowongan?.uuid_lowongan : lowongan?.simpan_lowongan?.uuid_simpan,
                      lowongan.simpan_lowongan
                    )
                  }
                  dataSave={lowongan.simpan_lowongan}
                  onNavigation={() => {
                    navigation.navigate('DetailLowongan', {
                      uuid: lowongan?.uuid_lowongan,
                    });
                  }}
                >
                  <Badge title={`${convertRupiah(lowongan.gaji)}/${lowongan.skala_gaji}`} />
                  <HStack space={0.5} alignItems="center">
                    <Timer />
                    <Text fontSize={width / 32} fontFamily={fonts.primary[400]} mt={0.5}>
                      {moment(new Date(lowongan.createdAt) * 1000)
                        .startOf('minutes')
                        .fromNow()}
                    </Text>
                  </HStack>
                </Card>
              ))
            )}
          </VStack>
        )}

        {userData?.id_role === 3 && (
          <VStack mt={1} space={4} mb={height / 8}>
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
                  title={`${pekerja.users.nama_user?.split(' ')[0]} ${pekerja.users.nama_user?.split(' ')[1] || ''}`}
                  subTitle={`${pekerja?.users?.domisili_kota}, ${pekerja?.users?.domisili_provinsi?.split(',')[1]}`}
                  key={index}
                  uriType="pekerja"
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
                          {pekerja?.rating ? pekerja?.rating?.toFixed(1) : 0}
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
