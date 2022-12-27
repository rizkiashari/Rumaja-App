import { Dimensions, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import useLoading from '../store/loadingStore';
import { getData } from '../utils/getData';
import { API } from '../config/api';
import { showError, showSuccess } from '../utils/showMessages';
import { Badge, Button, Card, EmptyContent, Header, LoadingSkeleton } from '../components';
import { ChevronBack, ILTersimpanEmpty } from '../assets';
import { fonts } from '../utils/fonts';
import { Box, HStack, ScrollView, Text, VStack } from 'native-base';
import { colors } from '../utils/colors';
import { convertRupiah } from '../utils/convertRupiah';

const LowonganTerhapus = ({ navigation }) => {
  const { width, height } = Dimensions.get('window');
  const isFocused = navigation.isFocused();

  const [page, setPage] = useState(1);

  const [lowongan, setLowongan] = useState(null);

  const { setLoading, loading } = useLoading();

  const [invoke, setInvoke] = useState(false);

  const onPublish = async (uuid) => {
    setInvoke(!invoke);
    try {
      const res = await API.patch(`/lowongan/publish/${uuid}`);
      setLoading(true);
      if (res.data.message === 'SUCCESS_PUBLISH_LOWONGAN') {
        showSuccess('Berhasil mempublish lowongan');
      } else {
        showError('Gagal mempublish lowongan');
      }
      setLoading(false);
    } catch ({ response }) {
      setLoading(false);
      switch (response.data.message) {
        case 'LOWONGAN_NOT_FOUND':
          showError('Lowongan tidak ditemukan');
          break;
        default:
          showError(response.data.message);
          break;
      }
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const resLowongan = await getData(`/lowongan/list-lowongan?page=${page}&publish=`);
      setLoading(false);
      setLowongan(resLowongan?.data?.lowongan);
    };

    loadData();
  }, [isFocused, page, invoke, setLoading]);

  return (
    <SafeAreaView>
      <Header>
        <HStack space="4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronBack width={28} />
          </TouchableOpacity>
          <Text fontFamily={fonts.primary[600]} fontSize={width / 24} color="black">
            Lowongan Terhapus
          </Text>
        </HStack>
      </Header>

      <ScrollView px={width / 28} pt={height / 40} showsVerticalScrollIndicator={false}>
        <VStack mt={1} mb={height / 8} space={4}>
          {loading ? (
            <LoadingSkeleton jumlah={4} />
          ) : lowongan?.length === 0 ? (
            <EmptyContent image={ILTersimpanEmpty} title="Lowongan Tidak Ditemukan" subTitle="Lowongan yang telah dihapus akan muncul disini" />
          ) : (
            lowongan?.map((item, index) => (
              <Card
                key={index}
                type="lowongan"
                title={item?.bidang_kerja?.detail_bidang}
                subTitle={`${item?.provinsi_lowongan?.split(',')[1]}, ${item?.kota_lowongan}`}
                onNavigation={() => {
                  navigation.navigate('DetailLowongan', {
                    uuid: item?.uuid_lowongan,
                  });
                }}
                uriImage={{ uri: item?.bidang_kerja?.photo }}
              >
                <Badge title={`${convertRupiah(item?.gaji)}/${item?.skala_gaji}`} />
                <Button type="primary" text="Publish" onPress={() => onPublish(item?.uuid_lowongan)} width={width / 3.6} fontSize={width} />
              </Card>
            ))
          )}
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LowonganTerhapus;
