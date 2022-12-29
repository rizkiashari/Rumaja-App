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
        photo={dataPencari?.photo_profile}
        bubble={
          <HStack space={2} alignItems="center">
            <Badge
              title={`${dataPencari?.pencari?.gender ?? '-'}, ${
                dataPencari?.pencari?.tanggal_lahir ? calculateAge(dataPencari?.pencari?.tanggal_lahir) : '-'
              }`}
            />
            <Badge title={dataPencari?.pencari?.ulasan?.length} type="rating" icon={<StarActive />} />
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
          height={height}
          _contentContainerStyle={{ paddingBottom: height / 2.5 }}
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
                      lokasi={item?.pengalaman_prov}
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
                    <Card key={idx} title={item?.nama_pendidikan} subtitle={`${item?.tahun_awal} - ${item?.tahun_akhir}`} type="pengalaman" />
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
          height={height}
          _contentContainerStyle={{ paddingBottom: height / 2.5 }}
        >
          <VStack space={4} mb={height / 3.5}>
            <Card type="detail" title="Tentang">
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
          height={height}
          _contentContainerStyle={{ paddingBottom: height / 2.5 }}
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

      <Box position="absolute" bottom={height / 2.3} width="100%" px={width / 28} justifyContent="center" py={4} backgroundColor="white">
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
    </SafeAreaView>
  );
};

export default DetailPencari;
