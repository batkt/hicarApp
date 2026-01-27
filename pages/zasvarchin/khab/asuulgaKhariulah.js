import React from 'react';
import {
  Pressable,
  Radio,
  Box,
  Input,
  Text,
  PresenceTransition,
  Icon,
} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const asuulgaKhariulah = ({
  ugugdul,
  index,
  setAsuulgaJagsaalt,
  setSelectedIndex,
  selectedIndex,
}) => {
  function onChange(nextValue) {
    setAsuulgaJagsaalt(jagsaalt => {
      jagsaalt[index].khariult = nextValue;
      return [...jagsaalt];
    });
  }

  function onChangeText(v) {
    setAsuulgaJagsaalt(jagsaalt => {
      jagsaalt[index].tailbar = v;
      return [...jagsaalt];
    });
  }

  return (
    <Box
      flexDirection="row"
      p={4}
      my={1}
      borderRadius={5}
      bg={selectedIndex === index ? '#1877f2' : 'white'}>
      <Pressable onPress={() => setSelectedIndex(index)} flexDirection="row">
        <Box width="10%" pr={3}>
          {selectedIndex === index ? (
            <Text
              color={selectedIndex !== index ? '#1877f2' : 'white'}
              borderColor="white"
              borderWidth="2px"
              rounded="full"
              width="100%"
              fontSize="lg"
              textAlign="center">
              {index + 1}
            </Text>
          ) : ugugdul.khariult !== undefined ? (
            <Icon
              size={5}
              bgColor="white"
              borderColor="green.500"
              color="green.500"
              borderWidth="2px"
              rounded="full"
              as={<MaterialCommunityIcons name="check" />}
            />
          ) : (
            <Icon
              size={5}
              bgColor="white"
              borderColor="yellow.400"
              color="yellow.400"
              borderWidth="2px"
              rounded="full"
              as={<MaterialCommunityIcons name="exclamation" />}
            />
          )}
        </Box>
        <Box width="90%">
          <Text
            color={selectedIndex !== index ? '#1877f2' : 'white'}
            fontSize={14}>
            {ugugdul.asuult}
          </Text>
          <PresenceTransition
            visible={selectedIndex === index}
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
              transition: {
                duration: 250,
              },
            }}>
            {selectedIndex === index && (
              <Radio.Group
                marginY={2}
                paddingTop={2}
                style={{flexDirection: 'row'}}
                value={ugugdul.khariult !== undefined ? ugugdul.khariult : ''}
                onChange={onChange}>
                <Radio
                  _text={{color: 'white'}}
                  value={true}
                  mx={1}
                  colorScheme="green">
                  Тийм
                </Radio>
                <Radio
                  _text={{color: 'white'}}
                  value={false}
                  mx={1}
                  colorScheme="green">
                  Үгүй
                </Radio>
              </Radio.Group>
            )}
            {ugugdul.khariult === false && (
              <Input
                my={2}
                bgColor="white"
                fontSize="lg"
                textAlign="left"
                placeholder="Шалгаан оруулна уу"
                value={ugugdul.tailbar || ''}
                onChangeText={onChangeText}
              />
            )}
          </PresenceTransition>
        </Box>
      </Pressable>
    </Box>
  );
};

export default asuulgaKhariulah;
