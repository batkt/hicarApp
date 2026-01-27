import React, {useEffect, useMemo, useState} from 'react';
import {
  Box,
  HStack,
  Icon,
  Text,
  IconButton,
  Badge,
  ScrollView,
  Center,
  Avatar,
  Heading,
  Row,
  Pressable,
  useDisclose,
  Skeleton,
  VStack,
  Toast,
} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useAuth} from 'components/context/Auth';
import {rightNavigation} from 'components/layout/LeftDrawer';
import uilchilgee, {aldaaBarigch, url} from 'lib/uilchilgee';
import {useNavigation} from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import NetInfo from '@react-native-community/netinfo';
import {PermissionsAndroid, Platform} from 'react-native';
import moment from 'moment';
import useData from 'hooks/useData';
import {RefreshControl} from 'react-native';

const infoMethod = 'post';
const infoService = '/irtsiinMedeeAvya';
// NetInfo.configure({shouldFetchWiFiSSID: true});
const index = props => {
  const {token, sonorduulga, ajiltan, baiguullaga, unuudriinIrts, salbariinId} =
    useAuth();
  const navigation = useNavigation();
  const {isOpen, onOpen, onClose} = useDisclose();
  const [netDetails, setNetDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [countdown, setCountdown] = useState(5);
  // const [turul, setTurul] = useState();
  const queryData = useMemo(() => {
    return {
      ekhlekhOgnoo: moment().startOf('month').format('YYYY-MM-DD 00:00:00'),
      duusakhOgnoo: moment().endOf('month').format('YYYY-MM-DD 23:59:59'),
      ajiltniiId: ajiltan?._id,
    };
  }, [ajiltan]);
  const currTime = moment().format('YYYY/MM/DD hh:mm');

  const info = useData(token, infoService, queryData, infoMethod);

  const dashboard = useMemo(() => {
    return {
      kheviin: info?.data?.find(a => a._id === 'kheviin')?.too || 0,
      kheviinbus:
        info?.data
          ?.filter(a => a._id === 'hagas' || a._id === 'khotsorson')
          ?.reduce((a, b) => a + Number(b.too), 0) || 0,
      burtgeegui:
        info?.data
          ?.filter(a => a._id === 'chuluu' || a._id === 'tasalsan')
          ?.reduce((a, b) => a + Number(b.too), 0) || 0,
    };
  }, [info]);

  const irtsUgukhEsekh = useMemo(() => {
    return !unuudriinIrts?.data?.yawsanTsag || !unuudriinIrts?.data?.irsenTsag;
  }, [unuudriinIrts]);

  const ilgeekh = location => {
    console.log('12312313 ', netDetails, location);
    const urn = unuudriinIrts?.data?.irsenTsag
      ? '/garsanTsagBurtguulye'
      : '/irtsBurtguulye';

    if (
      !!netDetails?.details ||
      netDetails?.details.bssid === '94:00:b0:3b:0b:5c'
    ) {
      uilchilgee(token)
        .post(urn, {
          salbariinId: salbariinId,
          suljeeniiMacKhayag: netDetails?.details?.bssid,
          bairshil: [location?.longitude, location?.latitude],
        })
        .then(({data}) => {
          if (data === 'Amjilttai') {
            onClose();
            unuudriinIrts.mutate();
            navigation.navigate('IrtsAmjilttai', {
              title: 'Ирц амжилттай бүртгэлээ',
              content: moment().format('HH:mm'),
              count: 2,
            });
          }
          setIsLoading(false);
        })
        .catch(e => aldaaBarigch(e, Toast));
    } else {
      alert(
        'Ажлын интернет сүлжээний хаяг буруу байна.' +
          netDetails?.details.bssid,
      );
      NetInfo.fetch().then(networkState => {
        setNetDetails(networkState);
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setNetDetails(state);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // Reset countdown when switching to "Гарах" mode
  useEffect(() => {
    const isGarakh = unuudriinIrts?.data?.irsenTsag;
    if (isGarakh) {
      setCountdown(5);
      setIsButtonDisabled(true);
    } else {
      setIsButtonDisabled(false);
    }
  }, [unuudriinIrts?.data?.irsenTsag]);

  useEffect(() => {
    // Countdown from 5 to 0 only for "Гарах" (exit)
    const isGarakh = unuudriinIrts?.data?.irsenTsag;

    if (isGarakh && countdown > 0) {
      // Only countdown for "Гарах"
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isGarakh && countdown === 0) {
      setIsButtonDisabled(false);
    }
  }, [countdown, unuudriinIrts?.data?.irsenTsag]);
  const tsagBurtgel = async () => {
    try {
      const granted = await PermissionsAndroid?.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Hicarwork App Location Permission',
          message:
            'Ирц бүртгүүлэхэд таны байршлын мэдээлэл хэрэгтэй ' +
            'тул апп-н байршилд хандах эрхийг зөвшөөрнө үү.',
          buttonNeutral: 'Дараа асуу',
          // buttonNegative: 'ЦУЦЛАХ',
          buttonPositive: 'ҮРГЭЛЖЛҮҮЛЭХ',
        },
      );
      if (
        Platform.OS === 'ios' ||
        granted === PermissionsAndroid.RESULTS.GRANTED
      ) {
        // Geolocation.requestAuthorization();
        setIsLoading(true);
        Geolocation.getCurrentPosition(
          position => {
            ilgeekh(position.coords);
          },
          error => {
            setIsLoading(false);
            return alert(
              'Амжилтгүй боллоо. Та байршил тогтоогчийг асаасан эсэхээ шалгана уу.',
            );
          },
          {enableHighAccuracy: false, timeout: 8000, maximumAge: 0},
        );
      } else alert('Байршлын мэдээлэлд хандах эрхийг зөвшөөрнө үү.');
    } catch (err) {
      console.warn(err);
    }
  };

  const tsag = useMemo(() => {
    return baiguullaga?.salbaruud
      ?.find(a => a._id === salbariinId)
      ?.ajillakhUdruud?.find(
        x => !x.udruud.find(d => d === new Date().getDay().toString()),
      );
  }, [baiguullaga]);

  return (
    <Box flex={1} style={{backgroundColor: '#f5f5fb'}}>
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
                as={<MaterialIcons name="menu" />}
                color="white"
              />
            }
            onPress={() => props.navigation.toggleDrawer()}
          />
          <Text color="white" fontSize={16} fontWeight="bold">
            Ирц
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
      {isLoading ? (
        <Center w="100%">
          <VStack w="100%" space={6} alignItems="center">
            <Skeleton h="20" />
            <Skeleton
              borderWidth={1}
              borderColor="coolGray.200"
              endColor="warmGray.50"
              size="130"
              rounded="full"
              mt="-70"
            />
            <Skeleton.Text lines={2} alignItems="center" px="12" />
            <HStack space="10">
              <Skeleton h="55" w="130" rounded="10" />
              <Skeleton h="55" w="130" rounded="10" />
            </HStack>
            <Skeleton.Text my={5} lines={3} alignItems="center" px="12" />
            <HStack space="10">
              <Skeleton size="20" rounded="full" />
              <Skeleton size="20" rounded="full" />
              <Skeleton size="20" rounded="full" />
            </HStack>
            <Skeleton mt={5} h="20" w="full" rounded="10" />
          </VStack>
        </Center>
      ) : (
        <>
          <ScrollView
            p={4}
            refreshControl={
              <RefreshControl
                refreshing={info.isValidating}
                onRefresh={() => info.mutate()}
              />
            }>
            <Center py={'5'} bg="white" rounded={'md'}>
              <Avatar
                size={'2xl'}
                source={require('../../assets/images/oyuk.jpg')}
              />
              <Box flexDir={'row'} alignItems="center">
                <Heading>{ajiltan.ner}</Heading>
                <Icon
                  ml="1"
                  bg="green.600"
                  size="sm"
                  rounded={'full'}
                  as={<MaterialIcons name="check" />}
                  color="white"
                />
              </Box>
              <Heading size={'sm'} fontWeight={400} color="orange.600">
                {ajiltan?.albanTushaal}
                {/*latitude:  {location?.latitude} {"\n"}
                    longitude:  {location?.longitude} {"\n"}
                    altitude:  {location?.altitude} {"\n"}
                    accuracy:  {location?.accuracy} {"\n"}
                    speed:  {location?.speed} {"\n"}
                    macbssid:  {netDetails?.details.bssid} {"\n"}*/}
              </Heading>
            </Center>
            <Row mt={5} justifyContent="space-between">
              <Pressable
                w="45%"
                bg={unuudriinIrts?.data?.irsenTsag ? 'white' : 'blue.100'}
                rounded={'md'}
                py={2}>
                <Center>
                  <Box>Ирэх</Box>
                  <Heading size={'sm'} color="blue.500">
                    {tsag?.neekhTsag}
                  </Heading>
                </Center>
              </Pressable>
              <Pressable
                w="45%"
                bg={unuudriinIrts?.data?.yawsanTsag ? 'white' : 'orange.100'}
                rounded={'md'}
                py={2}>
                <Center>
                  <Box>Гарах</Box>
                  <Heading size={'sm'} color="orange.500">
                    {tsag?.khaakhTsag}
                  </Heading>
                </Center>
              </Pressable>
            </Row>
            <Pressable
              mt={5}
              onPress={() =>
                navigation.navigate('IrtsDelgerengui', {
                  defaultTuluv: 'kheviin',
                })
              }>
              <Box ml="auto" flexDir={'row'} alignItems="center">
                <Heading size="md" fontWeight={400}>
                  Ирцийн дэлгэрэнгүй
                </Heading>
                <Icon
                  ml="1"
                  size={'md'}
                  rounded={'full'}
                  as={<MaterialIcons name="arrow-forward-ios" />}
                  color="black"
                />
              </Box>
            </Pressable>

            <Box py={2} px={4} bg="white" rounded={'md'} w="full" mt={5}>
              <Heading size={'md'} fontWeight={400}>{`${
                new Date().getMonth() + 1
              }-р сар хураангуй`}</Heading>
            </Box>
            <HStack mt={5} space={4} justifyContent="center">
              <Pressable
                w="30%"
                bg="white"
                rounded={'md'}
                py={3}
                onPress={() =>
                  navigation.navigate('IrtsDelgerengui', {
                    defaultTuluv: 'kheviin',
                  })
                }>
                <Center>
                  <Avatar bg="blue.100" size={'lg'}>
                    <Center>
                      <Heading color={'blue.500'}>{dashboard.kheviin}</Heading>
                      <Heading size={'xs'} color={'blue.500'}>
                        Өдөр
                      </Heading>
                    </Center>
                  </Avatar>
                  <Box mt={3}>Хэвийн</Box>
                </Center>
              </Pressable>
              <Pressable
                w="30%"
                bg="white"
                rounded={'md'}
                py={3}
                onPress={() =>
                  navigation.navigate('IrtsDelgerengui', {
                    defaultTuluv: 'khotsrolt',
                  })
                }>
                <Center>
                  <Avatar bg="orange.100" size={'lg'}>
                    <Center>
                      <Heading color={'orange.500'}>
                        {dashboard.kheviinbus}
                      </Heading>
                      <Heading size={'xs'} color={'orange.500'}>
                        Өдөр
                      </Heading>
                    </Center>
                  </Avatar>
                  <Box mt={3}>Хоцролт</Box>
                </Center>
              </Pressable>
              <Pressable
                w="30%"
                bg="white"
                rounded={'md'}
                py={3}
                onPress={() =>
                  navigation.navigate('IrtsDelgerengui', {
                    defaultTuluv: 'burtguuleegui',
                  })
                }>
                <Center>
                  <Avatar bg="red.100" size={'lg'}>
                    <Center>
                      <Heading color={'red.500'}>
                        {dashboard.burtgeegui}
                      </Heading>
                      <Heading size={'xs'} color={'red.500'}>
                        Өдөр
                      </Heading>
                    </Center>
                  </Avatar>
                  <Box mt={3}>Бүртгээгүй</Box>
                </Center>
              </Pressable>
            </HStack>
          </ScrollView>
          {irtsUgukhEsekh && (
            <Pressable
              bg={unuudriinIrts?.data?.irsenTsag ? 'orange.100' : 'blue.100'}
              rounded={'md'}
              py={4}
              disabled={isButtonDisabled}
              opacity={isButtonDisabled ? 0.5 : 1}
              onPress={() => {
                if (!isButtonDisabled) {
                  tsagBurtgel();
                }
                /*setTurul(unuudriinIrts?.data?.irsenTsag ? 'garakh' : 'irekh');
                                    onOpen();*/
              }}>
              <Center>
                <Heading
                  color={
                    unuudriinIrts?.data?.irsenTsag ? 'orange.500' : 'blue.500'
                  }>
                  {isButtonDisabled && unuudriinIrts?.data?.irsenTsag
                    ? `${countdown} секунд`
                    : unuudriinIrts?.data?.irsenTsag
                    ? 'Гарах'
                    : 'Орох'}
                </Heading>
              </Center>
            </Pressable>
          )}
        </>
      )}
      {/*<Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Center>
            <Avatar
              alt={ajiltan?.zurgiinNer}
              size={'2xl'}
              source={{
                uri: `${url}/ajiltniiZuragAvya/${ajiltan?.baiguullagiinId}/${ajiltan?.zurgiinNer}`,
              }}
            />
            <Heading size={'md'}>Орох цаг</Heading>
            <Box>{`${turul === 'irekh' ? currTime : 'Гарах'}`}</Box>
          </Center>
          <Pressable
            w="full"
            rounded={'full'}
            m={5}
            p={2}
            bg="orange.100"        
            onPress={turul === 'irekh' ? tsagBurtguulye : garakhTsagBurtguulye}>
            <Center>
              <Heading size={'md'} color="orange.500">
                Бүртгүүлэх
              </Heading>
            </Center>
          </Pressable>
        </Actionsheet.Content>
      </Actionsheet>*/}
    </Box>
  );
};

export default index;
