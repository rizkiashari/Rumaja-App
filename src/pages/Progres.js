import { Dimensions, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import useLoading from '../store/loadingStore';
import useUserStore from '../store/userStore';
import { getData } from '../utils/getData';
import { Badge, Card, DaftarWithJumlah, EmptyContent, Header, LoadingSkeleton, Tab } from '../components';
import { Box, HStack, ScrollView, Text, VStack } from 'native-base';
import { ChevronDown, ChevronRight, Notification, Timer } from '../assets';
import { fonts } from '../utils/fonts';
import { colors } from '../utils/colors';
import { convertRupiah } from '../utils/convertRupiah';
import moment from 'moment';
import useAuthStore from '../store/authStore';
import { showError } from '../utils/showMessages';

const Progres = ({ navigation }) => {
  const { width, height } = Dimensions.get('window');

  const { userData } = useUserStore();
  const { loading } = useLoading();

  const isFocused = navigation.isFocused();

  const [jenisTabs, setJenisTabs] = useState('Diproses');
  const [showUp, setShowUp] = useState(true);
  const [showDown, setShowDown] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [countNotif, setCountNotif] = useState(0);

  const { setIsLogin } = useAuthStore();

  const [tawaranPekerjaan, setTawaranPekerjaan] = useState(null);
  const [lamaranTerkirim, setLamaranTerkirim] = useState(null);
  const [allProgres, setAllProgres] = useState(null);
  const [dataPelamar, setDataPelamar] = useState(null);
  const [dataTawaranTerkirim, setDataTawaranTerkirim] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    const loadData = async () => {
      if (jenisTabs === 'Diproses' && userData?.id_role === 2) {
        const resTawaran = await getData('/tawarkan/tawarkan-all');
        setTawaranPekerjaan(resTawaran.data);
        if (resTawaran?.code === 403) {
          setIsLogin(false);
          showError('Sesi anda telah berakhir, silahkan login kembali');
          return;
        }
        const resLamaran = await getData('/lamaran/applied-all');
        setLamaranTerkirim(resLamaran.data);
      }

      if (jenisTabs === 'Bekerja' && userData?.id_role === 2) {
        const resProgres = await getData('/tawarkan/progres-pencari?status=bekerja');
        setAllProgres(resProgres.data);
      }

      if (jenisTabs === 'Selesai' && userData?.id_role === 2) {
        const resProgres = await getData('/tawarkan/progres-pencari?status=selesai');
        setAllProgres(resProgres.data);
      }

      if (jenisTabs === 'Diproses' && userData?.id_role === 3) {
        const resPelamar = await getData('/lamaran/pelamar');
        setDataPelamar(resPelamar.data);
        if (resPelamar?.code === 403) {
          setIsLogin(false);
          showError('Sesi anda telah berakhir, silahkan login kembali');
          return;
        }
        const resTawaranTerkirim = await getData('/tawarkan/tawaran-terkirim');
        setDataTawaranTerkirim(resTawaranTerkirim.data);
      }

      if (jenisTabs === 'Bekerja' && userData?.id_role === 3) {
        const resProgres = await getData('/lamaran/progres?status=bekerja');
        setAllProgres(resProgres.data);
      }

      if (jenisTabs === 'Selesai' && userData?.id_role === 3) {
        const resProgres = await getData('/lamaran/progres?status=selesai');
        setAllProgres(resProgres.data);
      }
    };
    setIsLoading(false);

    loadData();

    return () => {
      setTawaranPekerjaan(null);
      setLamaranTerkirim(null);
      setDataPelamar(null);
      setDataTawaranTerkirim(null);
      setAllProgres(null);
    };
  }, [jenisTabs, userData?.id_role, isFocused, loading, setIsLoading]);

  useEffect(() => {
    const loadCount = async () => {
      const resp = await getData('/notifikasi/count');
      setCountNotif(resp.data);
    };

    loadCount();
  }, []);

  return (
    <SafeAreaView>
      <Header>
        <Text fontFamily={fonts.primary[600]} fontSize={width / 28} color="black">
          Status
        </Text>
        <TouchableOpacity style={styles.containerNotif} onPress={() => navigation.navigate('Notifikasi')}>
          <Notification width={28} />
          <Text style={styles.textNotif}>{countNotif >= 9 ? '9+' : countNotif}</Text>
        </TouchableOpacity>
      </Header>

      <HStack w="full" px={5} py={3} justifyContent="space-between" space={2} bgColor={colors.text.black10}>
        <Tab title="Diproses" onPress={() => setJenisTabs('Diproses')} jenisTabs={jenisTabs} widthTab={width / 3.5} />
        <Tab title="Bekerja" onPress={() => setJenisTabs('Bekerja')} jenisTabs={jenisTabs} widthTab={width / 3.5} />
        <Tab title="Selesai" onPress={() => setJenisTabs('Selesai')} jenisTabs={jenisTabs} widthTab={width / 3.5} />
      </HStack>

      {/* Pencari  */}
      {jenisTabs === 'Diproses' && userData?.id_role === 2 && (
        <ScrollView
          px={width / 28}
          showsVerticalScrollIndicator={false}
          bgColor={colors.text.black10}
          pt={2}
          height={height}
          _contentContainerStyle={{ paddingBottom: height / 2.5 }}
        >
          <ScrollView minHeight={height}>
            <ScrollView space={3} mb={3}>
              <HStack alignItems="center" justifyContent="space-between">
                <Text fontFamily={fonts.primary[600]} fontSize={width / 28} color="black">
                  Tawaran Pekerjaan
                </Text>
                <TouchableOpacity onPress={() => setShowUp(!showUp)}>{showUp ? <ChevronDown /> : <ChevronRight />}</TouchableOpacity>
              </HStack>
              {showUp && (
                <VStack space={3} mt={1.5}>
                  {isLoading ? (
                    <LoadingSkeleton jumlah={4} />
                  ) : tawaranPekerjaan?.length === 0 ? (
                    <EmptyContent title="Tidak ada tawaran pekerjaan" />
                  ) : (
                    tawaranPekerjaan?.map((tawaran, index) => (
                      <Card
                        type="progres"
                        key={index}
                        uriImage={{ uri: tawaran?.lowongan?.bidang_kerja?.photo }}
                        statusProgress="Diproses"
                        title={tawaran?.lowongan?.bidang_kerja?.detail_bidang}
                        subTitle={`${tawaran?.lowongan?.kota_lowongan}, ${tawaran?.lowongan?.provinsi_lowongan?.split(',')[1]}`}
                        onNavigation={() => {
                          navigation.navigate('DetailTawaranPekerjaan', {
                            uuid_riwayat: tawaran?.uuid_riwayat,
                            type: 'diproses',
                          });
                        }}
                      >
                        <Badge title={`${convertRupiah(tawaran?.lowongan?.gaji)}/${tawaran?.lowongan?.skala_gaji}`} />
                        <HStack space={2} alignItems="center" pr={5}>
                          <Timer />
                          <Text fontSize={width / 32} fontFamily={fonts.primary[400]}>
                            {moment(new Date(tawaran?.createdAt) * 1000)
                              .startOf('minutes')
                              .fromNow()}
                          </Text>
                        </HStack>
                      </Card>
                    ))
                  )}
                </VStack>
              )}
            </ScrollView>
            <ScrollView space={3}>
              <HStack alignItems={'center'} justifyContent="space-between">
                <Text fontFamily={fonts.primary[600]} fontSize={width / 28} color="black">
                  Lamaran Terkirim
                </Text>
                <TouchableOpacity onPress={() => setShowDown(!showDown)}>{showDown ? <ChevronDown /> : <ChevronRight />}</TouchableOpacity>
              </HStack>
              {showDown && (
                <VStack space={3} mt={1.5}>
                  {isLoading ? (
                    <LoadingSkeleton jumlah={4} />
                  ) : lamaranTerkirim?.length === 0 ? (
                    <EmptyContent title="Tidak ada lamaran terkirim" />
                  ) : (
                    lamaranTerkirim?.map((lamaran, index) => (
                      <Card
                        type="progres"
                        key={index}
                        uriImage={{ uri: lamaran?.lowongan?.bidang_kerja?.photo }}
                        statusProgress="Diproses"
                        title={lamaran?.lowongan?.bidang_kerja?.detail_bidang}
                        subTitle={`${lamaran?.lowongan?.kota_lowongan}, ${lamaran?.lowongan?.provinsi_lowongan?.split(',')[1]}`}
                        onNavigation={() => {
                          navigation.navigate('DetailLamaran', {
                            uuid_riwayat: lamaran?.uuid_riwayat,
                            type: 'diproses',
                          });
                        }}
                      >
                        <Badge title={`${convertRupiah(lamaran?.lowongan?.gaji)}/${lamaran?.lowongan?.skala_gaji}`} />
                        <HStack space={2} alignItems="center" pr={5}>
                          <Timer />
                          <Text fontSize={width / 32} fontFamily={fonts.primary[400]}>
                            {moment(new Date(lamaran?.createdAt) * 1000)
                              .startOf('minutes')
                              .fromNow()}
                          </Text>
                        </HStack>
                      </Card>
                    ))
                  )}
                </VStack>
              )}
            </ScrollView>
          </ScrollView>
        </ScrollView>
      )}

      {jenisTabs === 'Bekerja' && userData?.id_role === 2 && (
        <ScrollView
          px={width / 28}
          showsVerticalScrollIndicator={false}
          bgColor={colors.text.black10}
          pt={2}
          height={height}
          _contentContainerStyle={{ paddingBottom: height / 2.5 }}
        >
          <VStack space={3} mt={1.5}>
            {isLoading ? (
              <LoadingSkeleton jumlah={4} />
            ) : allProgres?.length === 0 ? (
              <EmptyContent title="Belum ada riwayat bekerja" />
            ) : (
              allProgres?.map((progres, index) => (
                <Card
                  type="progres"
                  key={index}
                  uriImage={{ uri: progres?.lowongan?.bidang_kerja?.photo }}
                  statusProgress="Bekerja"
                  title={progres?.lowongan?.bidang_kerja?.detail_bidang}
                  subTitle={`${progres?.lowongan?.kota_lowongan}, ${progres?.lowongan?.provinsi_lowongan?.split(',')[1]}`}
                  onNavigation={() => {
                    navigation.navigate('DetailBekerja', {
                      uuid_riwayat: progres?.uuid_riwayat,
                    });
                  }}
                >
                  <Badge title={`${convertRupiah(progres?.lowongan?.gaji)}/${progres?.lowongan?.skala_gaji}`} />
                </Card>
              ))
            )}
          </VStack>
        </ScrollView>
      )}

      {jenisTabs === 'Selesai' && userData?.id_role === 2 && (
        <ScrollView
          px={width / 28}
          showsVerticalScrollIndicator={false}
          bgColor={colors.text.black10}
          pt={2}
          height={height}
          _contentContainerStyle={{ paddingBottom: height / 2.5 }}
        >
          <VStack space={3} mt={1.5}>
            {isLoading ? (
              <LoadingSkeleton jumlah={4} />
            ) : allProgres?.length === 0 ? (
              <EmptyContent title="Belum ada riwayat selesai atau ditolak" />
            ) : (
              allProgres?.map((selesai, index) => (
                <Card
                  type="progres"
                  key={index}
                  uriImage={{ uri: selesai?.lowongan?.bidang_kerja?.photo }}
                  statusProgress={selesai?.status === 'selesai' ? 'Berakhir' : 'Ditolak'}
                  title={selesai?.lowongan?.bidang_kerja?.detail_bidang}
                  subTitle={`${selesai?.lowongan?.kota_lowongan}, ${selesai?.lowongan?.provinsi_lowongan?.split(',')[1]}`}
                  onNavigation={() => {
                    navigation.navigate(selesai?.status === 'selesai' ? 'DetailPekerjaanSelesai' : 'DetailLamaran', {
                      uuid_riwayat: selesai?.uuid_riwayat,
                      type: selesai?.status,
                    });
                  }}
                >
                  {selesai?.status === 'selesai' ? (
                    <Badge
                      title={`${moment(selesai?.tanggal_mulai_kerja * 1000).format('MMM YYYY')} - ${moment(selesai?.createdAt * 1000).format(
                        'MMM YYYY'
                      )}`}
                    />
                  ) : (
                    <Badge title={`${convertRupiah(selesai?.lowongan?.gaji)}/${selesai?.lowongan?.skala_gaji}`} />
                  )}
                  {selesai?.status === 'selesai' && moment(selesai?.createdAt * 1000).add(3, 'days') >= moment() && (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('Nilai', {
                          id_lowongan: selesai?.lowongan?.id,
                          id_pencari: selesai?.id_pencari,
                        })
                      }
                      style={{ marginRight: 20 }}
                    >
                      <Box backgroundColor={colors.blue[80]} style={styles.btnTab(width)}>
                        <Text textAlign="center" fontFamily={fonts.primary[400]} fontSize={width / 32} color={colors.white}>
                          Beri Masukan
                        </Text>
                      </Box>
                    </TouchableOpacity>
                  )}
                </Card>
              ))
            )}
          </VStack>
        </ScrollView>
      )}

      {/* Penyedia */}
      {jenisTabs === 'Diproses' && userData?.id_role === 3 && (
        <ScrollView
          px={width / 28}
          showsVerticalScrollIndicator={false}
          bgColor={colors.text.black10}
          pt={2}
          height={height}
          _contentContainerStyle={{ paddingBottom: height / 2.5 }}
        >
          <ScrollView minHeight={height}>
            <ScrollView space={3} mb={3}>
              <HStack alignItems="center" justifyContent="space-between">
                <Text fontFamily={fonts.primary[600]} fontSize={width / 28} color="black">
                  Pelamar
                </Text>
                <TouchableOpacity onPress={() => setShowUp(!showUp)}>{showUp ? <ChevronDown /> : <ChevronRight />}</TouchableOpacity>
              </HStack>
              {showUp && (
                <VStack space={3} mt={1.5}>
                  {isLoading ? (
                    <LoadingSkeleton jumlah={3} />
                  ) : dataPelamar?.length === 0 ? (
                    <EmptyContent title="Tidak ada pelamar yang mendaftar." />
                  ) : (
                    dataPelamar?.map((pelamar, index) => (
                      <DaftarWithJumlah
                        key={index}
                        daftar="Daftar Pelamar"
                        total={pelamar?.jumlah_pelamar}
                        title={pelamar?.bidang_kerja?.detail_bidang}
                        subTitle={`${pelamar?.kota_lowongan}, ${pelamar?.provinsi_lowongan?.split(',')[1]}`}
                        navDetail={() =>
                          navigation.navigate('DetailPekerjaan', {
                            uuid: pelamar?.uuid_lowongan,
                          })
                        }
                        photo={pelamar?.bidang_kerja?.photo}
                        daftarNavigate={() =>
                          navigation.navigate('DaftarPelamar', {
                            idLowongan: pelamar?.id,
                          })
                        }
                      >
                        <Badge title={`${convertRupiah(pelamar.gaji)}/${pelamar.skala_gaji}`} />
                        <HStack space={0.5} alignItems="center" pr={5}>
                          <Timer />
                          <Text fontSize={width / 32} fontFamily={fonts.primary[400]}>
                            {moment(new Date(pelamar?.createdAtRiwayat?.createdAt) * 1000)
                              .startOf('minutes')
                              .fromNow()}
                          </Text>
                        </HStack>
                      </DaftarWithJumlah>
                    ))
                  )}
                </VStack>
              )}
            </ScrollView>
            <ScrollView space={3} mb={3}>
              <HStack alignItems={'center'} justifyContent="space-between">
                <Text fontFamily={fonts.primary[600]} fontSize={width / 28} color="black">
                  Tawaran Terkirim
                </Text>
                <TouchableOpacity onPress={() => setShowDown(!showDown)}>{showDown ? <ChevronDown /> : <ChevronRight />}</TouchableOpacity>
              </HStack>
              {showDown && (
                <VStack space={3} mt={1.5}>
                  {loading ? (
                    <LoadingSkeleton jumlah={3} />
                  ) : dataTawaranTerkirim?.length === 0 ? (
                    <EmptyContent title="Tidak ada tawaran yang terkirim." />
                  ) : (
                    dataTawaranTerkirim?.map((tawaran, index) => (
                      <DaftarWithJumlah
                        key={index}
                        title={tawaran?.bidang_kerja?.detail_bidang}
                        subTitle={`${tawaran?.kota_lowongan}, ${tawaran?.provinsi_lowongan?.split(',')[1]}`}
                        daftar="Daftar Kandidat"
                        total={tawaran?.jumlah_pelamar}
                        photo={tawaran?.bidang_kerja?.photo}
                        navDetail={() =>
                          navigation.navigate('DetailPekerjaan', {
                            uuid: tawaran?.uuid_lowongan,
                          })
                        }
                        daftarNavigate={() =>
                          navigation.navigate('DaftarTawaranTerkirim', {
                            idLowongan: tawaran?.id,
                          })
                        }
                      >
                        <Badge title={`${convertRupiah(tawaran?.gaji)}/${tawaran?.skala_gaji}`} />
                        <HStack space={0.5} alignItems="center" pr={5}>
                          <Timer />
                          <Text fontSize={width / 32} fontFamily={fonts.primary[400]}>
                            {moment(new Date(tawaran?.createdAtRiwayat?.createdAt) * 1000)
                              .startOf('minutes')
                              .fromNow()}
                          </Text>
                        </HStack>
                      </DaftarWithJumlah>
                    ))
                  )}
                </VStack>
              )}
            </ScrollView>
          </ScrollView>
        </ScrollView>
      )}

      {jenisTabs === 'Bekerja' && userData?.id_role === 3 && (
        <ScrollView
          px={width / 28}
          showsVerticalScrollIndicator={false}
          bgColor={colors.text.black10}
          pt={2}
          height={height}
          _contentContainerStyle={{ paddingBottom: height / 2.5 }}
        >
          <ScrollView minH={height}>
            <ScrollView space={3} mb={3}>
              <VStack space={3} mt={1.5}>
                {isLoading ? (
                  <LoadingSkeleton jumlah={3} />
                ) : allProgres?.length === 0 ? (
                  <EmptyContent title="Tidak ada data bekerja" />
                ) : (
                  allProgres?.map((progres, index) => (
                    <DaftarWithJumlah
                      key={index}
                      title={progres?.bidang_kerja?.detail_bidang}
                      subTitle={`${progres?.kota_lowongan}, ${progres?.provinsi_lowongan?.split(',')[1]}`}
                      daftar="Daftar Pekerja"
                      total={progres?.jumlah_pelamar}
                      photo={progres?.bidang_kerja?.photo}
                      daftarNavigate={() =>
                        navigation.navigate('DaftarBekerja', {
                          idLowongan: progres?.id,
                        })
                      }
                      navDetail={() =>
                        navigation.navigate('DetailPekerjaan', {
                          uuid: progres?.uuid_lowongan,
                        })
                      }
                    >
                      <Badge title={`${convertRupiah(progres.gaji)}/${progres.skala_gaji}`} />
                    </DaftarWithJumlah>
                  ))
                )}
              </VStack>
            </ScrollView>
          </ScrollView>
        </ScrollView>
      )}

      {jenisTabs === 'Selesai' && userData?.id_role === 3 && (
        <ScrollView
          px={width / 28}
          showsVerticalScrollIndicator={false}
          bgColor={colors.text.black10}
          pt={2}
          height={height}
          _contentContainerStyle={{ paddingBottom: height / 2.5 }}
        >
          <ScrollView minH={height}>
            <ScrollView space={3} mb={3}>
              <VStack space={3} mt={1.5}>
                {isLoading ? (
                  <LoadingSkeleton jumlah={3} />
                ) : allProgres?.length === 0 ? (
                  <EmptyContent title="Tidak ada data selesai or ditolak" />
                ) : (
                  allProgres?.map((progres, index) => (
                    <DaftarWithJumlah
                      key={index}
                      title={progres?.bidang_kerja?.detail_bidang}
                      subTitle={`${progres?.kota_lowongan}, ${progres?.provinsi_lowongan?.split(',')[1]}`}
                      daftar="Daftar Pekerja"
                      total={progres?.jumlah_pelamar}
                      photo={progres?.bidang_kerja?.photo}
                      daftarNavigate={() =>
                        navigation.navigate('DaftarSelesai', {
                          idLowongan: progres?.id,
                        })
                      }
                      navDetail={() =>
                        navigation.navigate('DetailPekerjaan', {
                          uuid: progres?.uuid_lowongan,
                        })
                      }
                    >
                      <Badge title={`${convertRupiah(progres.gaji)}/${progres.skala_gaji}`} />
                    </DaftarWithJumlah>
                  ))
                )}
              </VStack>
            </ScrollView>
          </ScrollView>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Progres;

const styles = StyleSheet.create({
  btnTab: (width) => ({
    width: width / 3.6,
    paddingVertical: 6,
    borderRadius: 8,
    rounded: 8,
  }),
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
});
