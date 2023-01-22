import { SafeAreaView, Dimensions, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import useLoading from '../store/loadingStore';
import useUserStore from '../store/userStore';
import { getData } from '../utils/getData';
import { Badge, Button, Card, EmptyContent, Header, KontakItem, Tab, TopProfile } from '../components';
import { Box, HStack, ScrollView, Text, VStack } from 'native-base';
import { ChevronBack, ILPlaceholder, SaveHeaderActive, SaveHeaderInactive, StarActive, Timer } from '../assets';
import { calculateAge } from '../utils/calculateAge';
import { colors } from '../utils/colors';
import { fonts } from '../utils/fonts';
import moment from 'moment';
import { API } from '../config/api';
import { showError, showSuccess } from '../utils/showMessages';
import { calculateRating } from '../utils/calculateRating';

const DetailPencari = ({ navigation, route }) => {
  const { uuid, type, uuid_riwayat } = route.params;

  const { width, height } = Dimensions.get('window');

  const [invoke, setInvoke] = useState(false);

  const { loading, setLoading } = useLoading();
  const { setIdPencari } = useUserStore();

  const [dataPencari, setDataPencari] = useState();

  const [jenisTabs, setJenisTabs] = useState('Pengalaman');

  const isFocused = navigation.isFocused();

  useEffect(() => {
    const loadData = async () => {
      const res = await getData(`/user/detail-pencari/${uuid}`);
      setDataPencari(res.data);
    };

    loadData();
    return () => {
      setDataPencari();
    };
  }, [invoke, uuid, setInvoke, loading, type, uuid_riwayat, isFocused]);

  const savePekerja = async (id, simpan_pencari) => {
    setInvoke(!invoke);
    setLoading(true);
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
    setLoading(false);
  };

  const onAkhirPekerjaan = async () => {
    setLoading(true);

    try {
      const res = await API.patch(`/lamaran/akhiri-pekerjaan/${uuid_riwayat}`);
      setLoading(false);
      if (res.data.message === 'SUCCESS_AKHIRI_PEKERJAAN') {
        setLoading(true);
        navigation.replace('Nilai', {
          id_lowongan: res?.data?.data?.id_lowongan,
          id_pencari: res?.data?.data?.id_pencari,
        });
      } else {
        showError('Gagal mengakhiri pekerjaan');
      }
    } catch ({ response }) {
      setLoading(false);
      showError(response.data.message);
    }
  };

  return (
    <SafeAreaView>
      <Header>
        <HStack space="4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronBack width={28} />
          </TouchableOpacity>
        </HStack>
        <HStack space={2.5}>
          <TouchableOpacity onPress={() => savePekerja(dataPencari?.pencari?.id, dataPencari?.simpan_pencari)}>
            {dataPencari?.simpan_pencari?.isSave ? <SaveHeaderActive width={width / 20} /> : <SaveHeaderInactive width={width / 20} />}
          </TouchableOpacity>
        </HStack>
      </Header>

      {/* Top Profile */}
      <TopProfile
        title={dataPencari?.nama_user}
        subtitle={dataPencari?.pencari?.bidang_kerja?.detail_bidang}
        type="pekerja"
        photoHeight="full"
        photoWidth="full"
        photo={dataPencari?.photo_profile}
        bubble={
          <HStack space={2} alignItems="center">
            <Badge
              title={`${dataPencari?.pencari?.gender ?? '-'}, ${
                dataPencari?.pencari?.tanggal_lahir ? calculateAge(dataPencari?.pencari?.tanggal_lahir) : '-'
              }`}
            />
            <Badge title={calculateRating(dataPencari?.pencari?.ulasan)} type="rating" icon={<StarActive />} />
          </HStack>
        }
      />

      {/* Tab */}
      <HStack w="full" px={3} py={3} justifyContent="space-between" space={1} bgColor={colors.text.black10}>
        <Tab title="Pengalaman" onPress={() => setJenisTabs('Pengalaman')} jenisTabs={jenisTabs} widthTab={width / 3.3} />
        <Tab title="Detail" onPress={() => setJenisTabs('Detail')} jenisTabs={jenisTabs} widthTab={width / 3.3} />
        <Tab title="Ulasan" onPress={() => setJenisTabs('Ulasan')} jenisTabs={jenisTabs} widthTab={width / 3.3} />
      </HStack>

      {jenisTabs === 'Pengalaman' && (
        <ScrollView
          px={width / 28}
          showsVerticalScrollIndicator={false}
          bgColor={colors.text.black10}
          pt={2}
          height={height / 1.8}
          _contentContainerStyle={{ paddingBottom: height / 8 }}
        >
          <VStack space={4} mb={height / 3.5}>
            <VStack space={3}>
              <Text fontFamily={fonts.primary[600]} fontSize={width / 28} color="black">
                Pengalaman Kerja
              </Text>
              <VStack space={4}>
                {dataPencari?.pencari?.pengalaman?.length === 0 ? (
                  <EmptyContent title="Tidak ada pengalaman kerja" />
                ) : (
                  dataPencari?.pencari?.pengalaman?.map((item, index) => (
                    <Card
                      key={index}
                      title={item?.nama_pengalaman}
                      subTitle={`${moment(item?.tahun_mulai).format('MMMM YYYY')} - ${
                        item?.tahun_akhir === 'Sekarang' ? 'Sekarang' : moment(item?.tahun_akhir).format('MMMM YYYY')
                      }`}
                      lokasi={item?.pengalaman_prov?.split(',')[1]}
                      type="pengalaman"
                    />
                  ))
                )}
              </VStack>
            </VStack>
            <VStack space={3}>
              <Text fontFamily={fonts.primary[600]} fontSize={width / 28} color="black">
                Riwayat Pendidikan
              </Text>
              <VStack space={4}>
                {dataPencari?.pencari?.pendidikan?.length === 0 ? (
                  <EmptyContent title="Tidak ada riwayat pendidikan" />
                ) : (
                  dataPencari?.pencari?.pendidikan?.map((item, index) => (
                    <Card key={index} title={item?.nama_pendidikan} subTitle={`${item?.tahun_awal} - ${item?.tahun_akhir}`} type="pengalaman" />
                  ))
                )}
              </VStack>
            </VStack>
          </VStack>
        </ScrollView>
      )}

      {jenisTabs === 'Detail' && (
        <ScrollView
          px={width / 28}
          showsVerticalScrollIndicator={false}
          bgColor={colors.text.black10}
          pt={2}
          height={height / 1.8}
          _contentContainerStyle={{ paddingBottom: height / 8 }}
        >
          <VStack space={4} mb={height / 3.5}>
            <Card type="detail" title="Keahlian">
              <Text fontFamily={fonts.primary[400]} fontSize={width / 36} color={colors.text.black70}>
                {dataPencari?.pencari?.tentang ? dataPencari?.pencari?.tentang : '-'}
              </Text>
            </Card>
            <Card type="detail" title="Domisili">
              <Text fontFamily={fonts.primary[400]} fontSize={width / 36} color={colors.text.black70}>
                {dataPencari?.domisili_kota ? dataPencari?.domisili_kota : '-'},{' '}
                {dataPencari?.domisili_provinsi ? dataPencari?.domisili_provinsi?.split(',')[1] : '-'}
              </Text>
            </Card>
            <Card type="detail" title="Kontak">
              <KontakItem nomor={dataPencari?.nomor_wa} email={dataPencari?.email} />
            </Card>
            <Card type="detail" title="Indeks Massa Tubuh (IMT)">
              <VStack space={1}>
                <Text fontFamily={fonts.primary[600]} fontSize={width / 32} color="black">
                  Tinggi Badan
                </Text>
                <Text fontFamily={fonts.primary[400]} fontSize={width / 36} color={colors.text.black70}>
                  {dataPencari?.pencari?.tinggi_badan ? dataPencari?.pencari?.tinggi_badan : '-'} cm
                </Text>
              </VStack>
              <VStack size={1}>
                <Text fontFamily={fonts.primary[600]} fontSize={width / 32} color="black">
                  Berat Badan
                </Text>
                <Text fontFamily={fonts.primary[400]} fontSize={width / 36} color={colors.text.black70}>
                  {dataPencari?.pencari?.berat_badan ? dataPencari?.pencari?.berat_badan : '-'} kg
                </Text>
              </VStack>
            </Card>
          </VStack>
        </ScrollView>
      )}

      {jenisTabs === 'Ulasan' && (
        <ScrollView
          px={width / 28}
          showsVerticalScrollIndicator={false}
          bgColor={colors.text.black10}
          pt={2}
          height={height / 1.8}
          _contentContainerStyle={{ paddingBottom: height / 8 }}
        >
          <VStack space={4} mb={height / 3.5}>
            {dataPencari?.pencari?.ulasan?.length === 0 ? (
              <EmptyContent title="Tidak ada riwayat ulasan" />
            ) : (
              dataPencari?.pencari?.ulasan?.map((item, index) => (
                <Card
                  key={index}
                  type="ulasan"
                  title={item?.lowongan?.penyedia?.users?.nama_user}
                  subTitle={item?.catatan}
                  uriImage={item?.lowongan?.bidang_kerja?.photo ? { uri: item?.lowongan?.bidang_kerja?.photo } : ILPlaceholder}
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

      {type === 'daftar-pelamar' ? (
        <Box position="absolute" safeAreaBottom bottom={0} width="full" px={width / 28} justifyContent="center" py={4} backgroundColor="white">
          <HStack space={2}>
            <Button
              type="progres"
              fontSize={width}
              text="Tolak"
              onPress={() => {
                navigation.navigate('TolakPelamar', {
                  uuid: uuid_riwayat,
                });
              }}
              width={width / 2.25}
              bgColor={colors.red}
            />
            <Button
              type="progres"
              fontSize={width}
              text="Terima"
              onPress={() => {
                navigation.navigate('TerimaPelamar', {
                  uuid: uuid_riwayat,
                  noWa: dataPencari?.nomor_wa,
                });
              }}
              width={width / 2.2}
              bgColor={colors.text.green}
            />
          </HStack>
        </Box>
      ) : type === 'detail-pelamar' ? null : type === 'daftar-pekerja' ? (
        <Box position="absolute" safeAreaBottom bottom={0} width="full" px={width / 28} justifyContent="center" py={4} backgroundColor="white">
          <HStack alignItems="center" justifyContent="center" space={2}>
            <Button
              type="primary"
              fontSize={width}
              text="Lihat Progres"
              onPress={() => {
                navigation.navigate('LihatProgres', {
                  uuid: uuid_riwayat,
                  type: 'penyedia',
                });
              }}
              width={width / 2.2}
            />
            <Button type="progres" fontSize={width} text="Akhiri Pekerjaan" onPress={onAkhirPekerjaan} width={width / 2.2} bgColor={colors.red} />
          </HStack>
        </Box>
      ) : type === 'daftar-selesai' ? (
        <Box position="absolute" safeAreaBottom bottom={0} width="full" px={width / 28} justifyContent="center" py={4} backgroundColor="white">
          <Button
            type="primary"
            fontSize={width}
            text="Lihat Progres"
            onPress={() => {
              navigation.navigate('LihatProgres', {
                uuid: uuid_riwayat,
                type: 'penyedia',
              });
            }}
          />
        </Box>
      ) : (
        <Box position="absolute" safeAreaBottom bottom={0} width="full" px={width / 28} justifyContent="center" py={4} backgroundColor="white">
          <Button
            type="primary"
            text="Tawarkan Pekerjaan"
            fontSize={width}
            onPress={() => {
              setIdPencari(dataPencari?.pencari?.id);
              navigation.navigate('TawarkanPekerjaan');
            }}
          />
        </Box>
      )}
    </SafeAreaView>
  );
};

export default DetailPencari;
