import { SafeAreaView, Dimensions, TouchableOpacity } from 'react-native';
import React from 'react';
import { HStack, Text, View, VStack, Box } from 'native-base';
import { Header } from '../components';
import { colors } from '../utils/colors';
import { ChevronBack, FullLogo } from '../assets';
import { fonts } from '../utils/fonts';

const TentangKami = ({ navigation }) => {
  const height = Dimensions.get('window').height;
  const width = Dimensions.get('window').width;

  return (
    <SafeAreaView>
      <View bgColor={colors.text.white} minH={height}>
        <Header>
          <HStack space={4}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ChevronBack width={28} />
            </TouchableOpacity>
            <Text
              fontFamily={fonts.primary[600]}
              fontSize={width / 24}
              color="black"
            >
              Tentang Kami
            </Text>
          </HStack>
        </Header>

        <VStack alignItems={'center'} px={width / 28} space={width / 28}>
          <View py={width / 20}>
            <FullLogo />
          </View>

          <Box
            bgColor={colors.gray10}
            rounded={8}
            width="full"
            px={width / 20}
            py={width / 20}
          >
            <VStack space={4}>
              <Text
                fontFamily={fonts.primary[600]}
                fontSize={width / 28}
                color={colors.text.black100}
                textAlign="left"
              >
                Tentang Rumaja
              </Text>
              <Text
                fontFamily={fonts.primary[400]}
                fontSize={width / 28}
                color={colors.text.black100}
                textAlign="left"
              >
                Rumaja adalah aplikasi yang membantu proses perekrutan dari
                pihak pencari kerja dan penyedia kerja khususnya di bidang
                pekerjaan Asisten Rumah Tangga (ART), Pengasuh Anak, Supir
                Pribadi, dan Tukang Kebun sesuai dengan kriteria yang
                dibutuhkan. Dengan Rumaja, anda dapat menerima informasi
                mengenai progres prekrutan secara lengkap dan jelas.
              </Text>
            </VStack>
          </Box>
        </VStack>
      </View>
    </SafeAreaView>
  );
};

export default TentangKami;
