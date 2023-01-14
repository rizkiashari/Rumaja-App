import { StyleSheet, Dimensions, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Box, HStack, InfoIcon, Input, ScrollView, Text, View, VStack } from 'native-base';
import { colors } from '../utils/colors';
import { Header } from '../components';
import { ChevronBack, HidePassword, ShowPassword } from '../assets';
import { fonts } from '../utils/fonts';
import { showError, showSuccess } from '../utils/showMessages';
import { postWithJson } from '../utils/postData';

const LupaKataSandi = ({ navigation }) => {
  const height = Dimensions.get('window').height;
  const width = Dimensions.get('window').width;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [valReset, setValReset] = useState('');

  const [isDone, setIsDone] = useState(false);

  const [border, setBorder] = useState(colors.text.black30);

  const validationEmail = async () => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      setBorder(colors.red);
      showError('Email tidak valid');
    }

    if (emailRegex.test(email)) {
      const pauload = {
        email: email,
      };

      const res = await postWithJson('/user/forgot-password', pauload);

      if (res.message === 'SUCCESS_FIND_EMAIL') {
        setIsDone(true);
        setValReset(res.data.link);
      } else {
        setBorder(colors.red);
        showError('Email tidak terdaftar');
      }
    }
  };

  const onForgotPassword = async () => {
    const payload = {
      resetPassword: valReset,
      password: password,
    };

    const res = await postWithJson('/user/change-password', payload);

    if (res.message === 'SUCCESS_CHANGE_PASSWORD') {
      navigation.navigate('Login');
      showSuccess('Kata sandi berhasil diubah, silahkan login kembali!');
    } else {
      showError('Gagal mengubah kata sandi, silahkan coba lagi!');
    }
  };

  return (
    <>
      {isDone ? (
        <SafeAreaView>
          <View bgColor={colors.white} minH={height}>
            <Header>
              <HStack space={4}>
                <TouchableOpacity onPress={() => setIsDone(false)}>
                  <ChevronBack width={28} />
                </TouchableOpacity>
                <Text fontFamily={fonts.primary[600]} fontSize={width / 24} color="black">
                  Buat Kata Sandi Baru
                </Text>
              </HStack>
            </Header>

            <ScrollView>
              <View px={width / 28} height={height / 1.2} justifyContent="space-between">
                <VStack space={4} pt={height / 40}>
                  <VStack space={2}>
                    <Text fontFamily={fonts.primary.normal} color={colors.text.black70} fontSize={width / 30}>
                      Kata Sandi Baru
                    </Text>
                    <Box position="relative">
                      <Input
                        placeholder="Masukkan kata sandi baru"
                        rounded={8}
                        px="3"
                        fontFamily={fonts.primary[400]}
                        type={showPassword ? 'text' : 'password'}
                        borderColor={border}
                        backgroundColor={colors.white}
                        py="2"
                        fontSize={width / 30}
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                        w="100%"
                      />
                      {showPassword ? (
                        <TouchableOpacity style={styles.actionPassword(width)} onPress={() => setShowPassword(!showPassword)}>
                          <ShowPassword />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity style={styles.actionPassword(width)} onPress={() => setShowPassword(!showPassword)}>
                          <HidePassword />
                        </TouchableOpacity>
                      )}
                    </Box>
                    {password.length < 8 && password.length > 0 ? (
                      <Text fontFamily={fonts.primary.normal} color={colors.red} fontSize={width / 35}>
                        Minimal 8 karakter Huruf
                      </Text>
                    ) : null}
                  </VStack>
                  <VStack space={2}>
                    <Text fontFamily={fonts.primary.normal} color={colors.text.black70} fontSize={width / 30}>
                      Konfirmasi Kata Sandi
                    </Text>
                    <Box position="relative">
                      <Input
                        placeholder="Masukkan konfirmasi kata sandi"
                        rounded={8}
                        px="3"
                        fontFamily={fonts.primary[400]}
                        type={showConfirmPassword ? 'text' : 'password'}
                        borderColor={border}
                        backgroundColor={colors.white}
                        py="2"
                        fontSize={width / 30}
                        value={confirmPassword}
                        onChangeText={(text) => setConfirmPassword(text)}
                        w="100%"
                      />
                      {showConfirmPassword ? (
                        <TouchableOpacity style={styles.actionPassword(width)} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                          <ShowPassword />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity style={styles.actionPassword(width)} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                          <HidePassword />
                        </TouchableOpacity>
                      )}
                    </Box>
                    {password !== confirmPassword && (
                      <Text fontFamily={fonts.primary.normal} color={colors.red} fontSize={width / 35}>
                        Kata sandi harus sama
                      </Text>
                    )}
                  </VStack>
                </VStack>
                <HStack alignItems="center" justifyContent="space-between" space={2}>
                  <TouchableOpacity
                    style={styles.btnReset(width)}
                    onPress={() => {
                      setBorder(colors.gray10);
                      setPassword('');
                      setConfirmPassword('');
                    }}
                  >
                    <Text color="#C86161" textAlign="center" fontFamily={fonts.primary[500]}>
                      Reset
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.btnSave(width)}
                    onPress={onForgotPassword}
                    disabled={password.length < 8 || password !== confirmPassword || password === '' || confirmPassword === ''}
                  >
                    <Text color={colors.blue[10]} textAlign="center" fontFamily={fonts.primary[500]}>
                      Simpan
                    </Text>
                  </TouchableOpacity>
                </HStack>
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      ) : (
        <SafeAreaView>
          <View bgColor={colors.white} minH={height}>
            <Header>
              <HStack space={4}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <ChevronBack width={28} />
                </TouchableOpacity>
                <Text fontFamily={fonts.primary[600]} fontSize={width / 24} color="black">
                  Lupa Kata Sandi
                </Text>
              </HStack>
            </Header>

            <ScrollView>
              <View px={width / 28} height={height / 1.2} justifyContent="space-between">
                <VStack space={4} pt={height / 40}>
                  <Box width="full" bgColor={'#F5F6F6'} p={3} rounded={8}>
                    <HStack space={2} alignItems="center">
                      <InfoIcon />
                      <Text fontFamily={fonts.primary.normal} color={colors.text.black100} fontSize={width / 30} w="90%">
                        Masukan alamat email yang kamu daftarkan untuk mengubah kata sandi.
                      </Text>
                    </HStack>
                  </Box>

                  <VStack space={2}>
                    <Text fontFamily={fonts.primary.normal} color={colors.text.black70} fontSize={width / 30}>
                      Alamat Email
                    </Text>
                    <Input
                      onBlur={() => {
                        setBorder(colors.text.black30);
                      }}
                      placeholder="Masukkan alamat email"
                      rounded={8}
                      px="3"
                      fontFamily={fonts.primary[500]}
                      type="email"
                      keyboardType="email-address"
                      borderColor={border}
                      backgroundColor={colors.white}
                      py="2"
                      onChangeText={(text) => setEmail(text)}
                      value={email}
                      fontSize={width / 30}
                      w="100%"
                    />
                  </VStack>
                </VStack>
                <TouchableOpacity style={styles.btnSimpan(email)} disabled={email ? false : true} onPress={validationEmail}>
                  <Text fontFamily={fonts.primary[500]} fontSize={width / 28} color={email ? colors.white : colors.text.black50} textAlign="center">
                    Buat Kata Sandi Baru
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      )}
    </>
  );
};

export default LupaKataSandi;

const styles = StyleSheet.create({
  actionPassword: (width) => ({
    position: 'absolute',
    right: width / 38,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  }),
  btnSimpan: (email) => ({
    backgroundColor: email ? colors.blue[80] : colors.text.black20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 30,
  }),
  btnReset: (width) => ({
    backgroundColor: colors.white,
    width: width / 3.5,
    borderColor: '#C86161',
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 6,
  }),
  btnSave: (width) => ({
    backgroundColor: colors.blue[80],
    width: width / 1.6,
    borderColor: colors.blue[80],
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 6,
  }),
});
