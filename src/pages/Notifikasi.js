import { Dimensions, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import useUserStore from '../store/userStore';
import { getData } from '../utils/getData';
import { API } from '../config/api';
import { Button, HStack, ScrollView, Text, VStack, View } from 'native-base';
import { colors } from '../utils/colors';
import { Card, EmptyContent, Header, LoadingSkeleton } from '../components';
import { ChevronBack, ILNotifEmpty, ILPlaceholder } from '../assets';
import { fonts } from '../utils/fonts';
import moment from 'moment';
import { showError, showSuccess } from '../utils/showMessages';

const Notifikasi = ({ navigation }) => {
  const { width, height } = Dimensions.get('window');
  const [dataNotif, setDataNotif] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = navigation.isFocused();
  const { userData } = useUserStore();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const { data } = await getData('/notifikasi');
      console.log('Notif: ', data);
      setIsLoading(false);
      setDataNotif(data);
    };

    loadData();

    return () => {
      setDataNotif(null);
    };
  }, [isFocused, setIsLoading]);

  const onReadNotif = async (id) => {
    try {
      const { data } = await API.patch(`/notifikasi/read/${id}`);
      console.log('Read Notif: ', data);
      if (data.message === 'SUCCESS_READ_NOTIFIKASI') {
        setIsLoading(false);
        const { data } = await getData('/notifikasi');
        setDataNotif(data);
        showSuccess('Notifikasi berhasil dibaca');
      } else {
        setIsLoading(false);
        showError('Gagal membaca notifikasi');
      }
    } catch ({ response }) {
      setIsLoading(false);
      showError(response.data.message);
    }
  };

  return (
    <SafeAreaView>
      <View bgColor={colors.text.black20} minH={height}>
        <Header>
          <HStack space={4}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ChevronBack width={28} />
            </TouchableOpacity>
            <Text fontFamily={fonts.primary[600]} fontSize={width / 24} color="black">
              Pemberitahuan
            </Text>
          </HStack>
        </Header>
        {userData?.id_role === 2 ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            bgColor={colors.text.black10}
            minH={height}
            pt={height / 40}
            px={width / 28}
            _contentContainerStyle={{
              paddingBottom: height / 3.8,
            }}
          >
            <VStack space={4}>
              {isLoading ? (
                <LoadingSkeleton type="notif" jumlah={4} />
              ) : dataNotif?.length === 0 ? (
                <EmptyContent
                  image={ILNotifEmpty}
                  title="Belum Ada Pemberitahuan"
                  subTitle="Belum ada pemberitahuan saat ini. Segala pemberitahuan akan ditampilkan di halaman ini."
                />
              ) : (
                dataNotif?.map((notif, idx) => (
                  <Button
                    key={idx}
                    onPress={() => {
                      notif?.isRead ? '' : onReadNotif(notif?.id);
                    }}
                    background={!notif?.isRead ? 'green.50' : colors.white}
                    px={5}
                    py={4}
                    rounded={8}
                  >
                    <Card
                      uriImage={{ uri: notif?.photo_bidang }}
                      title={notif.detail_bidang}
                      subTitle={notif.nama_penyedia}
                      detailContent={notif.detail_notifikasi}
                      time={moment(notif.createdAt * 1000).format('DD MMMM YYYY, HH:mm')}
                      type="notif"
                    />
                  </Button>
                ))
              )}
            </VStack>
          </ScrollView>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            bgColor={colors.text.black10}
            minH={height}
            pt={height / 40}
            px={width / 28}
            _contentContainerStyle={{
              paddingBottom: height / 3.8,
            }}
          >
            <VStack space={4}>
              {isLoading ? (
                <LoadingSkeleton type="notif" jumlah={4} />
              ) : dataNotif?.length === 0 ? (
                <EmptyContent
                  image={ILNotifEmpty}
                  title="Belum Ada Pemberitahuan"
                  subTitle="Belum ada pemberitahuan saat ini. Segala pemberitahuan akan ditampilkan di halaman ini."
                />
              ) : (
                dataNotif?.map((notif, idx) => (
                  <Button
                    key={idx}
                    onPress={() => {
                      notif?.isRead ? '' : onReadNotif(notif?.id);
                    }}
                    background={!notif?.isRead ? 'green.50' : colors.white}
                    px={5}
                    py={4}
                    rounded={8}
                  >
                    <Card
                      uriImage={notif?.photo_profile ? { uri: notif?.photo_profile } : ILPlaceholder}
                      title={notif?.nama_pelamar}
                      uriType="pekerja"
                      subTitle={notif?.detail_bidang}
                      detailContent={notif?.detail_notifikasi}
                      time={moment(notif.createdAt * 1000).format('DD MMMM YYYY, HH:mm')}
                      type="notif"
                    />
                  </Button>
                ))
              )}
            </VStack>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Notifikasi;
