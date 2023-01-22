import { Dimensions, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import { HStack, ScrollView, Text, VStack, View } from 'native-base';
import React, { useEffect, useState } from 'react';
import useLoading from '../store/loadingStore';
import { getData } from '../utils/getData';
import { colors } from '../utils/colors';
import { Badge, Card, EmptyContent, Header, KontakItem, LoadingSkeleton, Tab, TopProfile } from '../components';
import { EditIcon, ILEmptyLowongan, ILPlaceholder, SettingBlack, StarActive, Timer } from '../assets';
import { fonts } from '../utils/fonts';
import useUserStore from '../store/userStore';
import { calculateAge } from '../utils/calculateAge';
import { calculateRating } from '../utils/calculateRating';
import { convertRupiah } from '../utils/convertRupiah';
import moment from 'moment';
import { showError } from '../utils/showMessages';

const Profil = ({ navigation }) => {
  const { width, height } = Dimensions.get('window');

  const isFocused = navigation.isFocused();

  const [pengalaman, setPengalaman] = useState(null);
  const [pendidikan, setPendidikan] = useState(null);
  const [lowongan, setLowongan] = useState(null);
  const [ulasan, setUlasan] = useState(null);

  const { setIsLogin } = useUserStore();

  const [detailProfile, setDetailProfile] = useState(null);

  const { userData } = useUserStore();
  const { loading, setLoading } = useLoading();

  const [jenisTabs, setJenisTabs] = useState(userData?.id_role === 2 ? 'Pengalaman' : 'Lowongan');

  useEffect(() => {
    setLoading(true);

    const getAllData = async () => {
      if (userData?.id_role === 3) {
        const resp = await getData('/lowongan/list-lowongan?publish=publish');
        if (resp?.code === 403) {
          setIsLogin(false);
          showError('Sesi anda telah berakhir, silahkan login kembali');
          return;
        }
        if (resp?.message === 'SUCCESS_GET_ALL_LOWONGAN') {
          setLowongan(resp?.data?.lowongan);
          setLoading(false);
        }
        const profileRes = await getData('/user/profile-penyedia');
        if (profileRes?.message === 'SUCCESS_GET_PROFILE_PENYEDIA') {
          setDetailProfile(profileRes?.data);
          setLoading(false);
        }
        setLoading(false);
      }
      if (userData?.id_role === 2) {
        const profileRes = await getData('/user/profile-pencari');
        if (profileRes?.code === 403) {
          setIsLogin(false);
          showError('Sesi anda telah berakhir, silahkan login kembali');
          return;
        }
        if (profileRes?.message === 'SUCCESS_GET_PROFILE_PENCARI') {
          setDetailProfile(profileRes?.data);
          setLoading(false);
        }

        const respPengalaman = await getData('/pengalaman/list-all');
        if (respPengalaman?.message === 'LIST_ALL_PENGALAMAN_SUCCESS') {
          setPengalaman(respPengalaman?.data);
          setLoading(false);
        }

        const respPendidikan = await getData('/pendidikan/list-all');
        if (respPendidikan?.message === 'LIST_ALL_PENDIDIKAN_SUCCESS') {
          setPendidikan(respPendidikan?.data);
          setLoading(false);
        }

        const respUlasan = await getData('/ulasan/list-all');
        if (respUlasan?.message === 'GET_ALL_ULASAN_PENCARI_SUCCESS') {
          setUlasan(respUlasan?.data);
          setLoading(false);
        }
      }
    };

    getAllData();
    setLoading(false);

    return () => {
      setPengalaman(null);
      setPendidikan(null);
      setLowongan(null);
      setUlasan(null);
      setDetailProfile(null);
    };
  }, [isFocused, setLoading, userData?.id_role]);

  return (
    <SafeAreaView style={{ backgroundColor: colors.text.black10 }}>
      <Header>
        <Text fontFamily={fonts.primary[600]} fontSize={width / 28} color="black">
          Profil
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Pengaturan')}>
          <SettingBlack width={28} />
        </TouchableOpacity>
      </Header>

      {userData?.id_role === 2 && (
        <TopProfile
          title={detailProfile?.nama_user}
          subtitle={detailProfile?.pencari?.bidang_kerja?.detail_bidang}
          type="pekerja"
          photo={detailProfile?.photo_profile}
          photoHeight="full"
          photoWidth="full"
          bubble={
            <HStack mt={4} space={2} alignItems="center">
              <Badge
                title={`${detailProfile?.pencari?.gender ?? '-'}, ${
                  detailProfile?.pencari?.tanggal_lahir ? calculateAge(detailProfile?.pencari?.tanggal_lahir) : '-'
                }`}
              />
              <Badge title={calculateRating(detailProfile?.pencari?.ulasan)} type="rating" icon={<StarActive />} />
            </HStack>
          }
        />
      )}

      {/* Pencari */}
      {userData?.id_role === 2 && (
        <HStack w="full" px={3} py={3} justifyContent="space-between" space={1} bgColor={colors.text.black10}>
          <Tab title="Pengalaman" onPress={() => setJenisTabs('Pengalaman')} jenisTabs={jenisTabs} widthTab={width / 3.3} />
          <Tab title="Detail" onPress={() => setJenisTabs('Detail')} jenisTabs={jenisTabs} widthTab={width / 3.3} />
          <Tab title="Ulasan" onPress={() => setJenisTabs('Ulasan')} jenisTabs={jenisTabs} widthTab={width / 3.3} />
        </HStack>
      )}

      {jenisTabs === 'Detail' && userData?.id_role === 2 && (
        <ScrollView
          px={width / 28}
          showsVerticalScrollIndicator={false}
          bgColor={colors.text.black10}
          pt={2}
          height={height}
          _contentContainerStyle={{ paddingBottom: height / 1.5 }}
        >
          <VStack space={4}>
            <Card type="detail" title="Keahlian">
              <Text fontFamily={fonts.primary[400]} fontSize={width / 36} color={colors.text.black70}>
                {detailProfile?.pencari?.tentang ? detailProfile?.pencari?.tentang : '-'}
              </Text>
            </Card>
            <Card type="detail" title="Domisili">
              <Text fontFamily={fonts.primary[400]} fontSize={width / 36} color={colors.text.black70}>
                {detailProfile?.domisili_kota ? detailProfile?.domisili_kota : '-'},{' '}
                {detailProfile?.domisili_provinsi ? detailProfile?.domisili_provinsi?.split(',')[1] : '-'}
              </Text>
            </Card>
            <Card type="detail" title="Kontak">
              <KontakItem nomor={detailProfile?.nomor_wa} email={detailProfile?.email} />
            </Card>
            <Card type="detail" title="Indeks Massa Tubuh (IMT)">
              <VStack space={1}>
                <Text fontFamily={fonts.primary[600]} fontSize={width / 32} color="black">
                  Tinggi Badan
                </Text>
                <Text fontFamily={fonts.primary[400]} fontSize={width / 36} color={colors.text.black70}>
                  {detailProfile?.pencari?.tinggi_badan ? detailProfile?.pencari?.tinggi_badan : '-'} cm
                </Text>
              </VStack>
              <VStack size={1}>
                <Text fontFamily={fonts.primary[600]} fontSize={width / 32} color="black">
                  Berat Badan
                </Text>
                <Text fontFamily={fonts.primary[400]} fontSize={width / 36} color={colors.text.black70}>
                  {detailProfile?.pencari?.berat_badan ? detailProfile?.pencari?.berat_badan : '-'} kg
                </Text>
              </VStack>
            </Card>
          </VStack>
        </ScrollView>
      )}

      {jenisTabs === 'Pengalaman' && userData?.id_role === 2 && (
        <ScrollView
          px={width / 28}
          showsVerticalScrollIndicator={false}
          bgColor={colors.text.black10}
          pt={2}
          height={height}
          _contentContainerStyle={{ paddingBottom: height / 2.5 }}
        >
          <VStack space={4}>
            <VStack space={3}>
              <HStack alignItems="center" justifyContent="space-between">
                <Text fontFamily={fonts.primary[600]} fontSize={width / 28} color="black">
                  Pengalaman Kerja
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('TambahPengalaman')}>
                  <Text fontFamily={fonts.primary[400]} fontSize={width / 32} color={colors.blue[80]}>
                    + Tambah Pengalaman
                  </Text>
                </TouchableOpacity>
              </HStack>
              <VStack space={4}>
                {loading ? (
                  <LoadingSkeleton jumlah={3} />
                ) : pengalaman?.length === 0 ? (
                  <EmptyContent title="Tidak ada pengalaman kerja" />
                ) : (
                  pengalaman?.map((item, idx) => (
                    <Card
                      type="pengalaman"
                      key={idx}
                      title={item?.nama_pengalaman}
                      subTitle={`${moment(item?.tahun_mulai).format('MMMM YYYY')} - ${
                        item?.tahun_akhir === 'Sekarang' ? 'Sekarang' : moment(item?.tahun_akhir).format('MMMM YYYY')
                      }`}
                      lokasi={item?.pengalaman_prov?.split(',')[1]}
                      icon={
                        <TouchableOpacity
                          onPress={() => {
                            navigation.navigate('EditPengalaman', {
                              uuid: item?.uuid_pengalaman,
                            });
                          }}
                        >
                          <EditIcon />
                        </TouchableOpacity>
                      }
                    />
                  ))
                )}
              </VStack>
            </VStack>
            <VStack space={3} mb={height / 3}>
              <HStack alignItems="center" justifyContent="space-between">
                <Text fontFamily={fonts.primary[600]} fontSize={width / 28} color="black">
                  Riwayat Pendidikan
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('TambahPendidikan')}>
                  <Text fontFamily={fonts.primary[400]} fontSize={width / 32} color={colors.blue[80]}>
                    + Tambah Pendidikan
                  </Text>
                </TouchableOpacity>
              </HStack>
              <VStack space={4}>
                {loading ? (
                  <LoadingSkeleton jumlah={3} />
                ) : pendidikan?.length === 0 ? (
                  <EmptyContent title="Tidak ada riwayat pendidikan" />
                ) : (
                  pendidikan?.map((item, idx) => (
                    <Card
                      type="pengalaman"
                      key={idx}
                      title={item?.nama_pendidikan}
                      subTitle={`${item?.tahun_awal} - ${item?.tahun_akhir}`}
                      icon={
                        <TouchableOpacity
                          onPress={() => {
                            navigation.navigate('EditPendidikan', {
                              uuid: item?.uuid_pendidikan,
                            });
                          }}
                        >
                          <EditIcon />
                        </TouchableOpacity>
                      }
                    />
                  ))
                )}
              </VStack>
            </VStack>
          </VStack>
        </ScrollView>
      )}

      {jenisTabs === 'Ulasan' && userData?.id_role === 2 && (
        <ScrollView
          px={width / 28}
          showsVerticalScrollIndicator={false}
          bgColor={colors.text.black10}
          pt={2}
          height={height}
          _contentContainerStyle={{ paddingBottom: height / 2.5 }}
        >
          <VStack space={4} mb={height / 3}>
            {ulasan?.length === 0 ? (
              <EmptyContent title="Tidak ada ulasan" />
            ) : (
              ulasan?.map((item, idx) => (
                <Card
                  key={idx}
                  uriType="pekerja"
                  type="ulasan"
                  title={item?.nama_penyedia}
                  subTitle={item?.catatan}
                  uriImage={item?.photo_profile ? { uri: item?.photo_profile } : ILPlaceholder}
                >
                  <HStack justifyContent="space-between" alignItems="center">
                    <Badge title={item?.rating} type="rating" icon={<StarActive />} />
                    <HStack alignItems="center" space={1}>
                      <Timer />
                      <Text fontSize={width / 32} fontFamily={fonts.primary[400]}>
                        {moment(new Date(item?.createdAt * 1000))
                          .startOf('minutes')
                          .fromNow()}
                      </Text>
                    </HStack>
                  </HStack>
                </Card>
              ))
            )}
          </VStack>
        </ScrollView>
      )}

      {/* Penyedia */}
      {userData?.id_role === 3 && (
        <TopProfile
          title={detailProfile?.nama_user}
          subtitle={`${detailProfile?.domisili_kota}, ${detailProfile?.domisili_provinsi?.split(',')[1]}`}
          photo={detailProfile?.photo_profile}
          photoHeight="full"
          photoWidth="full"
        />
      )}

      {userData?.id_role === 3 && (
        <HStack w="full" px={5} py={3} justifyContent="space-between" bgColor={colors.text.black10}>
          <Tab title="Lowongan" onPress={() => setJenisTabs('Lowongan')} jenisTabs={jenisTabs} widthTab={width / 2.2} />
          <Tab title="Detail" onPress={() => setJenisTabs('Detail')} jenisTabs={jenisTabs} widthTab={width / 2.2} />
        </HStack>
      )}

      {jenisTabs === 'Lowongan' && userData?.id_role === 3 && (
        <ScrollView
          px={width / 28}
          showsVerticalScrollIndicator={false}
          bgColor={colors.text.black10}
          pt={2}
          height={height}
          _contentContainerStyle={{ paddingBottom: height / 2.5 }}
        >
          <VStack space={4} mb={height / 3.5}>
            <VStack space={3}>
              <TouchableOpacity onPress={() => navigation.navigate('TambahLowongan')} style={styles.btnAddLowongan}>
                <HStack justifyContent="space-between" alignItems="center">
                  <Text fontFamily={fonts.primary[500]} fontSize={width / 26} color={colors.blue[80]}>
                    Tambah Lowongan
                  </Text>
                  <Text fontFamily={fonts.primary[600]} fontSize={width / 18} color={colors.blue[80]}>
                    {'>'}
                  </Text>
                </HStack>
              </TouchableOpacity>
              <VStack space={4}>
                {loading ? (
                  <LoadingSkeleton jumlah={3} />
                ) : lowongan?.length === 0 ? (
                  <EmptyContent
                    title="Tidak ada lowongan pekerjaan"
                    subTitle="Anda belum menambahkan lowongan pekerjaan. Tambah untuk mendapatkan pelamar atau mengirim tawaran pekerjaan."
                    image={ILEmptyLowongan}
                  />
                ) : (
                  lowongan?.map((item, index) => (
                    <Card
                      type="lowongan"
                      key={index}
                      title={item?.bidang_kerja?.detail_bidang}
                      subTitle={`${item?.kota_lowongan}, ${item?.provinsi_lowongan?.split(',')[1]}`}
                      uriImage={{ uri: item?.bidang_kerja?.photo }}
                      onNavigation={() => {
                        navigation.navigate('DetailLowongan', {
                          uuid: item?.uuid_lowongan,
                        });
                      }}
                    >
                      <Badge title={`${convertRupiah(item.gaji)}/${item.skala_gaji}`} />
                      <HStack space={1} alignItems="center">
                        <Timer />
                        <Text fontSize={width / 32} fontFamily={fonts.primary[400]} mt={0.5}>
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
          </VStack>
        </ScrollView>
      )}

      {jenisTabs === 'Detail' && userData?.id_role === 3 && (
        <ScrollView
          px={width / 28}
          showsVerticalScrollIndicator={false}
          bgColor={colors.text.black10}
          pt={2}
          height={height}
          _contentContainerStyle={{ paddingBottom: height / 2.5 }}
        >
          <VStack space={4} mb={height / 3.5}>
            <Card type="detail" title="Tentang">
              <Text fontFamily={fonts.primary[400]} fontSize={width / 36} color={colors.text.black70}>
                {detailProfile?.penyedia?.tentang ?? '-'}
              </Text>
            </Card>
            <Card type="detail" title="Kontak">
              <KontakItem nomor={userData?.nomor_wa} email={userData?.email} />
            </Card>
          </VStack>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Profil;

const styles = StyleSheet.create({
  btnAddLowongan: {
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderWidth: 2,
    borderColor: colors.blue[80],
  },
});
