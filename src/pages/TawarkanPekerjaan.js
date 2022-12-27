import { Dimensions, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getData } from '../utils/getData';
import { Button, EmptyContent, Header, LoadingSkeleton, Tawarkan } from '../components';
import { Box, HStack, ScrollView, Text, VStack } from 'native-base';
import { ChevronBack, ILTersimpanEmpty, Timer } from '../assets';
import { fonts } from '../utils/fonts';
import useUserStore from '../store/userStore';
import { colors } from '../utils/colors';
import { convertRupiah } from '../utils/convertRupiah';
import moment from 'moment';

const TawarkanPekerjaan = ({ navigation }) => {
  const { width, height } = Dimensions.get('window');

  const [page, setPage] = useState(1);

  const [lowongan, setLowongan] = useState([]);

  const { idPencari, dataPekerjaan } = useUserStore();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const resLowongan = await getData(`lowongan/list-lowongan?page=${page}&publish=publish`);
      setIsLoading(false);
      setLowongan(resLowongan?.data?.lowongan);
    };

    loadData();
  }, [idPencari, page]);

  return (
    <SafeAreaView>
      <Header>
        <HStack space="4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronBack width={28} />
          </TouchableOpacity>
          <Text fontFamily={fonts.primary[600]} fontSize={width / 24} color="black">
            Tawarkan Pekerjaan
          </Text>
        </HStack>
      </Header>

      <ScrollView
        minHeight={height / 1.5}
        px={width / 28}
        pt={height / 40}
        showsVerticalScrollIndicator={false}
        _contentContainerStyle={{ paddingBottom: height / 9 }}
      >
        {isLoading ? (
          <LoadingSkeleton jumlah={5} />
        ) : lowongan?.length === 0 ? (
          <EmptyContent
            image={ILTersimpanEmpty}
            title="Tidak ada lowongan pekerjaan"
            subTitle="Anda belum membuat lowongan pekerjaan. Tambahkan lowongan pekerjaan untuk bisa menawarkan pekerjaan."
          />
        ) : (
          <VStack mt={1} mb={height / 8} space={4}>
            <Text fontFamily={fonts.primary[600]} fontSize={width / 28} color="black">
              Pilih Lowongan Pekerjaan
            </Text>
            {lowongan?.map((item, index) => (
              <Tawarkan
                key={index}
                id={item?.id}
                title={item?.bidang_kerja?.detail_bidang}
                kota={`${item?.kota_lowongan},`}
                provinsi={item?.provinsi_lowongan}
                photo={item?.bidang_kerja?.photo}
              >
                <HStack space={0.5} alignItems="center">
                  <Box bgColor={colors.blue[10]} rounded={12} px={2} py={0.5}>
                    <Text fontSize={width / 32} fontFamily={fonts.primary[500]}>
                      {convertRupiah(item.gaji)}/{item.skala_gaji}
                    </Text>
                  </Box>
                </HStack>
                <HStack space={0.5} alignItems="center">
                  <Timer />
                  <Text fontSize={width / 32} fontFamily={fonts.primary[400]}>
                    {moment(new Date(item.createdAt) * 1000)
                      .startOf('minutes')
                      .fromNow()}
                  </Text>
                </HStack>
              </Tawarkan>
            ))}
          </VStack>
        )}
      </ScrollView>
      {lowongan?.length === 0 ? (
        <Box top={height / 1.14} position="absolute" px={width / 28} justifyContent="center" py={4} width="full" backgroundColor="white">
          <Button type="primary" text="Kembali ke Halaman Beranda" fontSize={width} onPress={() => navigation.navigate('MainApp')} />{' '}
        </Box>
      ) : (
        <Box top={height / 1.14} position="absolute" px={width / 28} justifyContent="center" py={4} width="full" backgroundColor="white">
          {dataPekerjaan === null || dataPekerjaan === '' ? (
            <Box width="full" rounded={8} py={1} backgroundColor={colors.text.black30}>
              <Text color={colors.text.black50} fontFamily={fonts.primary[500]} textAlign="center" paddingY={2}>
                Selanjutnya
              </Text>
            </Box>
          ) : (
            <Button type="primary" text="Selanjutnya" fontSize={width} onPress={() => navigation.navigate('KonfirmasiWaktu')} />
          )}
        </Box>
      )}
    </SafeAreaView>
  );
};

export default TawarkanPekerjaan;
