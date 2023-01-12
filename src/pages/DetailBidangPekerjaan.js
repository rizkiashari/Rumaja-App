import { Dimensions, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { HStack, ScrollView, Text, View, VStack } from 'native-base';
import { colors } from '../utils/colors';
import { ChevronBack, FilterBlack, ILTersimpanEmpty, Timer } from '../assets';
import { useFilterHome } from '../store/filterHome';
import useLoading from '../store/loadingStore';
import { getData } from '../utils/getData';
import { API } from '../config/api';
import { showError, showSuccess } from '../utils/showMessages';
import { Badge, Card, EmptyContent, Header, LoadingSkeleton } from '../components';
import { convertRupiah } from '../utils/convertRupiah';
import moment from 'moment';
import { fonts } from '../utils/fonts';

const DetailBidangPekerjaan = ({ navigation, route }) => {
  const { bidang, id } = route.params;
  const isFocused = navigation.isFocused();

  const { width, height } = Dimensions.get('window');
  const [invoke, setInvoke] = useState(false);

  const { filterHome, setFilterHome } = useFilterHome();

  const { setLoading, loading } = useLoading();

  const [dataLowongan, setDataLowongan] = useState(null);

  useEffect(() => {
    setLoading(true);
    const loadBidangPekerjaan = async (idPekerjaan) => {
      if (filterHome === null) {
        const resp = await getData(`/lowongan/list/${idPekerjaan}`);
        setDataLowongan(resp?.data?.lowongan);
      } else {
        if (filterHome.jenis_gaji === '' && filterHome.urutan === '') {
          const resp = await getData(`/lowongan/list/${idPekerjaan}`);
          setDataLowongan(resp?.data?.lowongan);
        } else {
          const resp = await getData(`/lowongan/list/${idPekerjaan}?urutan=${filterHome.urutan}&jenis_gaji=${filterHome.jenis_gaji}`);
          setDataLowongan(resp?.data?.lowongan);
        }
      }
    };
    setLoading(false);
    loadBidangPekerjaan(id);

    return () => {
      setDataLowongan(null);
    };
  }, [isFocused, id, filterHome, invoke, setLoading]);

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

  return (
    <SafeAreaView>
      <View backgroundColor={colors.text.black10} minH={height}>
        <Header>
          <HStack alignItems="center" space={2.5}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
                setFilterHome(null);
              }}
            >
              <ChevronBack width={28} />
            </TouchableOpacity>
            <Text fontFamily={fonts.primary[600]} fontSize={width / 28} color="black">
              {bidang}
            </Text>
          </HStack>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('FilterHome', {
                bidang: bidang,
                id: id,
              });
              setFilterHome(null);
            }}
          >
            <FilterBlack width={28} />
          </TouchableOpacity>
        </Header>

        <ScrollView pt={height / 28} showsVerticalScrollIndicator={false} px={width / 28}>
          <VStack space={4} mb={height / 3.7}>
            {loading ? (
              <LoadingSkeleton jumlah={5} />
            ) : dataLowongan?.length === 0 ? (
              <EmptyContent
                image={ILTersimpanEmpty}
                title="Tidak ada lowongan"
                subTitle="Maaf belum ada lowongan yang tersedia di bidang pekerjaan ini."
              />
            ) : (
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
              ))
            )}
          </VStack>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default DetailBidangPekerjaan;

const styles = StyleSheet.create({});
