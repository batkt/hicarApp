import React, {useEffect, useMemo, useState} from 'react';
import {
  Box,
  HStack,
  Icon,
  Text,
  IconButton,
  Badge,
  useDisclose,
  Actionsheet,
  Center,
  Heading,
  Pressable,
  Toast,
  Select,
  CheckIcon,
  Button,
} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useAuth} from 'components/context/Auth';
import {rightNavigation} from 'components/layout/LeftDrawer';
import NetInfo from '@react-native-community/netinfo';
import uilchilgee, {aldaaBarigch} from 'lib/uilchilgee';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import useJagsaalt from 'hooks/useJagsaalt';
import Geolocation from '@react-native-community/geolocation';

const tukhuurumjService = '/tukhuurumj';
NetInfo.configure({shouldFetchWiFiSSID: true});
const IrtsTuhuurumjBurtgel = props => {
  const {sonorduulga, ajiltan, baiguullaga, token, salbariinId, salbarSoliyo} =
    useAuth();
  const navigation = useNavigation();
  const {isOpen, onOpen, onClose} = useDisclose();
  const [net, setNet] = useState();
  const [ustgakh, setUstgakh] = useState();
  const tukhuurumjQuery = useMemo(() => {
    return {salbariinId};
  }, [salbariinId]);

  useEffect(() => {
    Geolocation.requestAuthorization();
    var interval = setInterval(async () => {
      let state = await NetInfo.fetch();
      setNet(state);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const tukhuurumjuud = useJagsaalt(token, tukhuurumjService, tukhuurumjQuery);

  function tukhuurumjBurtguulye() {
    uilchilgee(token)
      .post('/tukhuurumjBurtgey', {
        salbariinId: salbariinId,
        macKhayag: net?.details?.bssid,
      })
      .then(({data}) => {
        if (data === 'Amjilttai')
          navigation.navigate('IrtsAmjilttai', {
            title: 'Төхөөрөмж амжилттай бүртгэлээ',
            content: moment().format('HH:mm'),
            count: 2,
          });
        tukhuurumjuud.refresh();
      })
      .catch(e => aldaaBarigch(e, Toast));
  }

  function ustgaya(id) {
    uilchilgee(token)
      .delete(`/tukhuurumj/${id}`, {
        salbariinId: salbariinId,
        macKhayag: net?.details?.bssid,
      })
      .then(({data}) => {
        if (data === 'Amjilttai')
          navigation.navigate('IrtsAmjilttai', {
            title: 'Төхөөрөмж амжилттай усгалаа',
            content: moment().format('HH:mm'),
            count: 2,
          });
        tukhuurumjuud.refresh();
      })
      .catch(e => aldaaBarigch(e, Toast));
  }

  return (
    <Box flex={1} style={{backgroundColor: '#f5f5fb'}}>
      <Box flex={0.3} bg="#1877f2" roundedBottom={'3xl'}>
        <HStack
          bg="#1877f2"
          px={1}
          py={3}
          justifyContent="space-between"
          alignItems="center"
          borderBottomRadius="10px">
          <HStack space={4} alignItems="center">
            <IconButton
              colorScheme="blue"
              icon={
                <Icon
                  size="sm"
                  as={<MaterialIcons name="arrow-back-ios" />}
                  color="white"
                />
              }
              onPress={() => props.navigation.goBack()}
            />
            <Text color="white" fontSize={16} fontWeight="bold">
              Ирцийн тайлан
            </Text>
          </HStack>
          <HStack space={2}>
            <IconButton
              colorScheme="blue"
              icon={
                <React.Fragment>
                  <Icon
                    as={<MaterialIcons name="notifications" />}
                    color="white"
                    size="md"
                  />
                  {sonorduulga?.sonorduulga?.kharaaguiToo > 0 && (
                    <Badge
                      position="absolute"
                      top={2}
                      right={2.5}
                      colorScheme="warning"
                      rounded="full"
                      variant={'solid'}
                      alignSelf="flex-end"
                      padding={1}
                      _text={{fontSize: 8}}></Badge>
                  )}
                </React.Fragment>
              }
              onPress={() => rightNavigation.toggleDrawer()}
            />
          </HStack>
        </HStack>
      </Box>
      <Box flex={0.7}>
        <Box px={7} alignItems="center">
          <Box
            bg="white"
            w="full"
            top={-100}
            position="absolute"
            p={5}
            rounded="lg">
            <Center>
              <Box>Салбарын жагсаалт</Box>
              {baiguullaga?.salbaruud &&
                (ajiltan?.erkh !== 'Zasvarchin' ||
                  ajiltan?.salbaruud?.length > 1) && (
                  <Select
                    w="full"
                    bgColor="white"
                    borderRadius="lg"
                    selectedValue={salbariinId}
                    // minWidth="200"
                    accessibilityLabel="Choose Service"
                    placeholder="Choose Service"
                    _selectedItem={{
                      bg: 'darkBlue.500',
                      endIcon: <CheckIcon size="5" />,
                    }}
                    onValueChange={itemValue => salbarSoliyo(itemValue)}>
                    {baiguullaga?.salbaruud?.map(option => (
                      <Select.Item label={option?.ner} value={option?._id} />
                    ))}
                  </Select>
                )}
            </Center>
            <Center mt={5}>Төхөөрөмжүүд</Center>
            {tukhuurumjuud.jagsaalt?.map(mur => (
              <Box
                key={mur._id}
                borderBottomColor={'blue.100'}
                py={2}
                flexDir="row"
                alignItems={'center'}>
                <Box p={2} bg="blue.100" rounded={'md'}>
                  <Icon
                    color="#1877f2"
                    as={<MaterialIcons name="device-hub" />}
                  />
                </Box>
                <Box ml={2}>{mur.macKhayag}</Box>
                <Pressable
                  p={2}
                  ml="auto"
                  bg="red.100"
                  rounded={'md'}
                  onPress={() => {
                    onOpen();
                    setUstgakh(mur);
                  }}>
                  <Icon color="red.500" as={<MaterialIcons name="close" />} />
                </Pressable>
              </Box>
            ))}
            <Button bg="#1877f2" onPress={onOpen} mt={5}>
              Бүртгэх
            </Button>
          </Box>
        </Box>
        {ajiltan?.erkh === 'Zakhiral' && !ustgakh && (
          <Actionsheet isOpen={isOpen} onClose={onClose}>
            <Actionsheet.Content>
              <Center>
                <Heading size={'md'}>Төхөөрөмж бүртгүүлэх ...</Heading>
                <Box>{`Мак хаяг: ${net?.details?.bssid}`}</Box>
                <Box>{`Интернэт: ${net?.type}`}</Box>
              </Center>
              <Pressable
                w="full"
                rounded={'full'}
                m={5}
                p={2}
                bg="orange.100"
                onPress={tukhuurumjBurtguulye}>
                <Center>
                  <Heading size={'md'} color="orange.500">
                    Төхөөрөмж бүртгэх
                  </Heading>
                </Center>
              </Pressable>
            </Actionsheet.Content>
          </Actionsheet>
        )}
        {!!ustgakh && (
          <Actionsheet
            isOpen={isOpen}
            onClose={() => {
              onClose();
              setUstgakh(undefined);
            }}>
            <Actionsheet.Content>
              <Center>
                <Heading size={'md'}>Төхөөрөмж устгах уу</Heading>
                <Box>{`Мак хаяг: ${ustgakh.macKhayag}`}</Box>
              </Center>
              <Pressable
                w="full"
                rounded={'full'}
                m={5}
                p={2}
                bg="orange.100"
                onPress={() => ustgaya(ustgakh._id)}>
                <Center>
                  <Heading size={'md'} color="orange.500">
                    Устгах
                  </Heading>
                </Center>
              </Pressable>
            </Actionsheet.Content>
          </Actionsheet>
        )}
      </Box>
    </Box>
  );
};

export default IrtsTuhuurumjBurtgel;
