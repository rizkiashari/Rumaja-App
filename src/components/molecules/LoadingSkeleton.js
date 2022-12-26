import { Dimensions } from 'react-native';
import React from 'react';
import { HStack, Skeleton, VStack } from 'native-base';
import { colors } from '../../utils/colors';

const LoadingSkeleton = ({ jumlah, type }) => {
  const { width, height } = Dimensions.get('window');

  if (type === 'medium') {
    return Array(jumlah)
      .fill(0)
      .map((_, indx) => {
        return (
          <VStack
            alignItems="center"
            bgColor={colors.white}
            space={width / 40}
            w={width / 5}
            p={3.5}
            rounded={10}
            key={indx}
            _dark={{
              borderColor: 'coolGray.500',
            }}
            _light={{
              borderColor: 'coolGray.200',
            }}
          >
            <Skeleton h={height / 18} />
            <Skeleton.Text px="4" lines={1} />
          </VStack>
        );
      });
  }

  if (type === 'notif') {
    return Array(jumlah)
      .fill(0)
      .map((_, indx) => {
        return (
          <HStack background="white" space={2} key={indx}>
            <Skeleton h={10} w={10} rounded="full" alignItems="flex-start" mt={2} ml={2} />
            <VStack
              alignItems="center"
              bgColor={colors.white}
              space={width / 40}
              w="full"
              p={3.5}
              rounded={10}
              _dark={{
                borderColor: 'coolGray.500',
              }}
              _light={{
                borderColor: 'coolGray.200',
              }}
            >
              <Skeleton h={height / 18} />
              <Skeleton.Text mt="4" lines={1} />
              <Skeleton.Text lines={1} />
              <Skeleton.Text lines={1} />
              <Skeleton.Text lines={1} />
            </VStack>
          </HStack>
        );
      });
  }

  return (
    <VStack space={4}>
      {Array(jumlah)
        .fill(0)
        .map((_, indx) => {
          return (
            <VStack key={indx} background="white" px="4">
              <HStack background="white" space={2}>
                <Skeleton h={10} w={10} rounded="full" alignItems="flex-start" mt={2} ml={2} />
                <VStack
                  bgColor={colors.white}
                  space={width / 40}
                  w="full"
                  p={3.5}
                  rounded={10}
                  _dark={{
                    borderColor: 'coolGray.500',
                  }}
                  _light={{
                    borderColor: 'coolGray.200',
                  }}
                >
                  <Skeleton.Text lines={1} w={width / 2} />
                  <Skeleton.Text lines={1} w={width / 2} />
                </VStack>
              </HStack>
              <HStack
                bgColor={colors.white}
                space={width / 40}
                w="full"
                p={3.5}
                justifyContent="space-between"
                rounded={10}
                _dark={{
                  borderColor: 'coolGray.500',
                }}
                _light={{
                  borderColor: 'coolGray.200',
                }}
              >
                <Skeleton.Text lines={1} w={width / 2.5} />
                <Skeleton.Text lines={1} w={width / 2.5} />
              </HStack>
            </VStack>
          );
        })}
    </VStack>
  );
};

export default LoadingSkeleton;
