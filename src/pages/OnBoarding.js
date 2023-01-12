import { Dimensions, Image, ScrollView, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors } from '../utils/colors';
import { fonts } from '../utils/fonts';
import { ILOnBoarding1, ILOnBoarding2 } from '../assets';
import { Box, Button, View, Text } from 'native-base';
import useUserStore from '../store/userStore';

const OnBoarding = ({ navigation }) => {
  const [urutan, setUrutan] = useState(1);
  const width = Dimensions.get('window').width;
  const heigth = Dimensions.get('window').height;

  useEffect(() => {
    if (isBoarding === false) {
      navigation.replace('Login');
    }
  }, [isBoarding, navigation]);

  const dataOnBoarding = [
    {
      id: 1,
      title: 'Selamat Datang Di Rumaja',
      subTitle: 'Rumaja membantu proses perekrutan dari pihak pencari kerja dan penyedia kerja',
      image: ILOnBoarding1,
    },
    {
      id: 2,
      title: 'Cari Pekerja atau Pekerjaan',
      subTitle: 'Tentukan peran dan temukan kebutuhan anda',
      image: ILOnBoarding2,
    },
  ];

  const { isBoarding, setIsBoarding } = useUserStore();

  return (
    <ScrollView style={styles.container(width)} showsVerticalScrollIndicator={false}>
      {dataOnBoarding.map((item) => {
        if (item.id === urutan) {
          return (
            <View key={item.id} style={styles.content(width)}>
              <Box alignItems="center" height={heigth / 1.65}>
                <Image source={item.image} alt="OnBoarding" style={styles.image(width)} />
              </Box>
              <View>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subTitle}>{item.subTitle}</Text>
              </View>
            </View>
          );
        }
      })}
      {urutan === 2 ? (
        <View marginTop={10}>
          <Button
            py="3"
            rounded={8}
            background={colors.blue[80]}
            onPress={() => {
              navigation.replace('Login');
              setIsBoarding(false);
            }}
          >
            <Text color={colors.white} fontSize="14" fontFamily={fonts.primary[500]}>
              Mulai Sekarang
            </Text>
          </Button>
        </View>
      ) : (
        <View marginTop={10}>
          <Button
            py="3"
            rounded={8}
            background={colors.blue[80]}
            onPress={() => {
              setUrutan(urutan + 1);
            }}
          >
            <Text color={colors.white} fontSize="14" fontFamily={fonts.primary[500]}>
              Selanjutnya
            </Text>
          </Button>
          <Button py="3" my="3" rounded={8} background={colors.white} onPress={() => setUrutan(2)}>
            <Text color="#1F1F1F" fontSize="14" fontFamily={fonts.primary[500]}>
              Lewati
            </Text>
          </Button>
        </View>
      )}
    </ScrollView>
  );
};

export default OnBoarding;

const styles = StyleSheet.create({
  container: (width) => ({
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: width / 28,
  }),
  content: (width) => ({
    marginBottom: 20,
    width: width / 1.1,
  }),
  image: (width) => ({
    width: width / 1.3,
    height: width / 1.3,
    resizeMode: 'contain',
    marginTop: width / 8,
  }),
  title: {
    fontSize: 20,
    fontFamily: fonts.primary[600],
    color: '#000',
    textAlign: 'center',
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 16,
    fontFamily: fonts.primary[400],
    color: colors.text.black70,
    textAlign: 'center',
    marginBottom: 10,
  },
});
