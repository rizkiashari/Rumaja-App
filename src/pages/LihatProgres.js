import { Dimensions, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Box, HStack, ScrollView, Text, VStack, View } from 'native-base';
import { getData } from '../utils/getData';
import { Card, Header } from '../components';
import { ChevronBack } from '../assets';
import { fonts } from '../utils/fonts';
import { colors } from '../utils/colors';
import moment from 'moment';

const LihatProgres = ({ navigation, route }) => {
  const { width, height } = Dimensions.get('window');

  const { uuid, type } = route.params;

  const isFocused = navigation.isFocused();

  const [dataDetail, setDataDetail] = useState();

  useEffect(() => {
    const loadDetail = async () => {
      const resp = await getData(`/lamaran/progres-kerja/${uuid}`);
      setDataDetail(resp.data);
    };

    loadDetail();

    return () => {
      setDataDetail();
    };
  }, [isFocused, uuid]);

  return (
    <SafeAreaView>
      <Header>
        <HStack space="4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronBack width={28} />
          </TouchableOpacity>
          <Text fontFamily={fonts.primary[600]} fontSize={width / 24} color="black">
            Detail Progres
          </Text>
        </HStack>
      </Header>

      <ScrollView
        px={width / 28}
        showsVerticalScrollIndicator={false}
        bgColor={colors.text.black10}
        pt={4}
        contentContainerStyle={{ paddingBottom: height / 2.5 }}
      >
        <VStack vertical={true} space={2}>
          <Card type="detail" title="Status">
            <Text fontFamily={fonts.primary[400]} fontSize={width / 32} color={colors.text.black70} textTransform="capitalize">
              {dataDetail?.riwayat?.status === 'selesai' ? 'Berakhir' : dataDetail?.riwayat?.status}
            </Text>
          </Card>
          <Card type="detail" title="Progres">
            {dataDetail?.progress?.map((progres, idx) => (
              <Box key={idx}>
                <Text fontFamily={fonts.primary[400]} fontSize={width / 32} color={colors.text.black80}>
                  {progres?.informasi.split('-')[0]}
                </Text>
                <Text fontFamily={fonts.primary[400]} fontSize={width / 32} color={colors.text.black50}>
                  {moment(progres?.createdAt * 1000).format('dddd, DD MMMM YYYY - HH:mm')}
                </Text>
              </Box>
            ))}
          </Card>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LihatProgres;

const styles = StyleSheet.create({});
