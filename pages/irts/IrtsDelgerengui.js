import React, {useEffect, useMemo, useState} from 'react';
import {
  Box,
  HStack,
  VStack,
  Icon,
  Text,
  IconButton,
  Badge,
  Center,
  Avatar,
  Heading,
  Pressable,
  FlatList,
  Divider,
} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useAuth} from 'components/context/Auth';
import {rightNavigation} from 'components/layout/LeftDrawer';
import {url} from 'lib/uilchilgee';
import moment from 'moment';
import useJagsaalt from 'hooks/useJagsaalt';
import {RefreshControl} from 'react-native';
import DatePicker from 'components/custom/DatePicker';
import useData from 'hooks/useData';

const order = {createdAt: -1};
const infoMethod = 'post';
const infoService = '/irtsiinMedeeAvya';
const irtsService = '/irts';

const formatMinutes = min => {
  if (!min || isNaN(min) || min <= 0) return '0 мин';
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  if (h > 0 && m > 0) return `${h}ц ${m}м`;
  if (h > 0) return `${h}ц`;
  return `${m} мин`;
};

const getTuluvBadge = item => {
  const tuluv = item?.tuluv;
  const khotsorson = Number(item?.khotsorsonMinut || 0);

  if (tuluv === 'kheviin' || (tuluv !== 'chuluu' && tuluv !== 'tasalsan' && khotsorson === 0)) {
    return (
      <Badge colorScheme="success" rounded="md" variant="subtle" _text={{fontSize: 11, fontWeight: 'bold'}}>
        Хэвийн
      </Badge>
    );
  }
  if (tuluv === 'khotsorson' || khotsorson > 0) {
    return (
      <Badge colorScheme="warning" rounded="md" variant="subtle" _text={{fontSize: 11, fontWeight: 'bold'}}>
        {khotsorson > 0 ? `${formatMinutes(khotsorson)} хоцорсон` : 'Хоцорсон'}
      </Badge>
    );
  }
  if (tuluv === 'hagas') {
    return (
      <Badge colorScheme="orange" rounded="md" variant="subtle" _text={{fontSize: 11, fontWeight: 'bold'}}>
        Хагас өдөр
      </Badge>
    );
  }
  if (tuluv === 'chuluu') {
    return (
      <Badge colorScheme="info" rounded="md" variant="subtle" _text={{fontSize: 11, fontWeight: 'bold'}}>
        Чөлөөтэй
      </Badge>
    );
  }
  if (tuluv === 'tasalsan') {
    return (
      <Badge colorScheme="danger" rounded="md" variant="subtle" _text={{fontSize: 11, fontWeight: 'bold'}}>
        Тасалсан
      </Badge>
    );
  }
  return (
    <Badge colorScheme="coolGray" rounded="md" variant="subtle" _text={{fontSize: 11}}>
      {tuluv || 'Тодорхойгүй'}
    </Badge>
  );
};

const isKheviin = item => {
  const tuluv = item?.tuluv;
  const khotsorson = Number(item?.khotsorsonMinut || 0);
  return (
    tuluv === 'kheviin' ||
    (!['khotsorson', 'hagas', 'chuluu', 'tasalsan'].includes(tuluv) && khotsorson === 0)
  );
};

const isKhotsrolt = item => {
  const tuluv = item?.tuluv;
  const khotsorson = Number(item?.khotsorsonMinut || 0);
  return tuluv === 'khotsorson' || tuluv === 'hagas' || khotsorson > 0;
};

const isBurtgeegui = item => {
  const tuluv = item?.tuluv;
  return tuluv === 'chuluu' || tuluv === 'tasalsan';
};

const IrtsDelgerengui = props => {
  const {defaultTuluv} = props?.route?.params || {};
  const {sonorduulga, ajiltan, token, salbariinId} = useAuth();
  const [turul, setTurul] = useState(defaultTuluv || 'all');
  const [ognoo, setOgnoo] = useState([
    moment().startOf('month').toDate(),
    moment().endOf('month').toDate(),
  ]);

  const queryData = useMemo(() => {
    return {
      ekhlekhOgnoo: moment(ognoo[0]).format('YYYY-MM-DD 00:00:00'),
      duusakhOgnoo: moment(ognoo[1]).format('YYYY-MM-DD 23:59:59'),
      ajiltniiId: ajiltan?._id,
      salbariinId: salbariinId,
    };
  }, [ajiltan, ognoo, salbariinId]);

  const info = useData(token, infoService, queryData, infoMethod);

  useEffect(() => {
    if (defaultTuluv) setTurul(defaultTuluv);
  }, [defaultTuluv]);

  const query = useMemo(() => {
    return {
      ajiltniiId: ajiltan?._id,
      ognoo: {
        $gte: moment(ognoo[0]).format('YYYY-MM-DD 00:00:00'),
        $lte: moment(ognoo[1]).format('YYYY-MM-DD 23:59:59'),
      },
    };
  }, [ognoo, ajiltan]);

  const irts = useJagsaalt(token, irtsService, query, order);

  const filteredJagsaalt = useMemo(() => {
    const list = irts?.jagsaalt || [];
    if (turul === 'kheviin') return list.filter(isKheviin);
    if (turul === 'khotsrolt') return list.filter(isKhotsrolt);
    if (turul === 'burtguuleegui') return list.filter(isBurtgeegui);
    return list;
  }, [irts?.jagsaalt, turul]);

  const dashboard = useMemo(() => {
    const list = irts?.jagsaalt || [];
    const kheviinCount = list.filter(isKheviin).length;
    const khotsroltCount = list.filter(isKhotsrolt).length;
    const burtgeeguiCount = list.filter(isBurtgeegui).length;

    const findToo = id => info?.data?.find?.(a => a._id === id)?.too;
    const firstItem = Array.isArray(info?.data) ? info?.data?.[0] : info?.data;

    const infoKheviin = findToo('kheviin') !== undefined 
      ? Number(findToo('kheviin') || 0) 
      : Number(firstItem?.kheviin || 0);

    const infoKhotsrolt = info?.data?.some?.(a => a._id)
      ? (info?.data?.filter?.(a => a._id === 'hagas' || a._id === 'khotsorson')?.reduce((a, b) => a + Number(b.too), 0) || 0)
      : (Number(firstItem?.khotsorson || 0) + Number(firstItem?.hagas || 0));

    const infoBurtgeegui = info?.data?.some?.(a => a._id)
      ? (info?.data?.filter?.(a => a._id === 'chuluu' || a._id === 'tasalsan')?.reduce((a, b) => a + Number(b.too), 0) || 0)
      : (Number(firstItem?.chuluu || 0) + Number(firstItem?.tasalsan || 0));

    if (list.length > 0) {
      return {
        kheviin: kheviinCount,
        kheviinbus: khotsroltCount,
        burtgeegui: burtgeeguiCount,
        niit: list.length,
      };
    }

    return {
      kheviin: infoKheviin,
      kheviinbus: infoKhotsrolt,
      burtgeegui: infoBurtgeegui,
      niit: infoKheviin + infoKhotsrolt + infoBurtgeegui,
    };
  }, [irts?.jagsaalt, info]);

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
                as={<MaterialIcons name="arrow-back-ios" />}
                color="white"
              />
            }
            onPress={() => props.navigation.goBack()}
          />
          <Text color="white" fontSize={16} fontWeight="bold">
            Ирцийн дэлгэрэнгүй тайлан
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
      <Box p={4} pb={0}>
        <HStack justifyContent="space-between">
          <DatePicker
            width="45%"
            value={ognoo[0]}
            onChange={v =>
              !!v &&
              setOgnoo(d => {
                d[0] = v;
                return [...d];
              })
            }>
            {moment(ognoo[0]).format('YYYY-MM-DD')}
          </DatePicker>
          <DatePicker
            width="45%"
            value={ognoo[1]}
            onChange={v =>
              !!v &&
              setOgnoo(d => {
                d[1] = v;
                return [...d];
              })
            }>
            {moment(ognoo[1]).format('YYYY-MM-DD')}
          </DatePicker>
        </HStack>

        {/* Filter Toggle Buttons */}
        <HStack mt={3} space={2} justifyContent="center">
          <Pressable
            flex={1}
            onPress={() => setTurul(turul === 'kheviin' ? 'all' : 'kheviin')}>
            <Center
              bg={turul === 'kheviin' ? 'blue.600' : 'white'}
              rounded={'lg'}
              py={2.5}
              shadow={turul === 'kheviin' ? 3 : 1}>
              <Avatar
                bg={turul === 'kheviin' ? 'blue.500' : 'blue.100'}
                size={'sm'}>
                <Heading size="xs" color={turul === 'kheviin' ? 'white' : 'blue.500'}>
                  {dashboard.kheviin}
                </Heading>
              </Avatar>
              <Text
                mt={1}
                fontSize="2xs"
                fontWeight="bold"
                color={turul === 'kheviin' ? 'white' : 'gray.700'}>
                Хэвийн
              </Text>
            </Center>
          </Pressable>
          <Pressable
            flex={1}
            onPress={() => setTurul(turul === 'khotsrolt' ? 'all' : 'khotsrolt')}>
            <Center
              bg={turul === 'khotsrolt' ? 'orange.500' : 'white'}
              rounded={'lg'}
              py={2.5}
              shadow={turul === 'khotsrolt' ? 3 : 1}>
              <Avatar
                bg={turul === 'khotsrolt' ? 'orange.400' : 'orange.100'}
                size={'sm'}>
                <Heading
                  size="xs"
                  color={turul === 'khotsrolt' ? 'white' : 'orange.500'}>
                  {dashboard.kheviinbus}
                </Heading>
              </Avatar>
              <Text
                mt={1}
                fontSize="2xs"
                fontWeight="bold"
                color={turul === 'khotsrolt' ? 'white' : 'gray.700'}>
                Хоцролт
              </Text>
            </Center>
          </Pressable>
          <Pressable
            flex={1}
            onPress={() => setTurul(turul === 'burtguuleegui' ? 'all' : 'burtguuleegui')}>
            <Center
              bg={turul === 'burtguuleegui' ? 'red.600' : 'white'}
              rounded={'lg'}
              py={2.5}
              shadow={turul === 'burtguuleegui' ? 3 : 1}>
              <Avatar
                bg={turul === 'burtguuleegui' ? 'red.500' : 'red.100'}
                size={'sm'}>
                <Heading
                  size="xs"
                  color={turul === 'burtguuleegui' ? 'white' : 'red.500'}>
                  {dashboard.burtgeegui}
                </Heading>
              </Avatar>
              <Text
                mt={1}
                fontSize="2xs"
                fontWeight="bold"
                color={turul === 'burtguuleegui' ? 'white' : 'gray.700'}>
                Бүртгээгүй
              </Text>
            </Center>
          </Pressable>
        </HStack>

        {turul !== 'all' && (
          <HStack justifyContent="flex-end" mt={2}>
            <Pressable onPress={() => setTurul('all')}>
              <Text fontSize="2xs" color="blue.600" fontWeight="bold">
                ✕ Бүх ирцийг харах
              </Text>
            </Pressable>
          </HStack>
        )}
      </Box>
      <FlatList
        px={4}
        my={4}
        data={filteredJagsaalt || []}
        onEndReached={irts.next}
        keyExtractor={m => m._id || m.ognoo + (m.irsenTsag || '')}
        ListEmptyComponent={
          !irts.isValidating && (!filteredJagsaalt || filteredJagsaalt.length === 0) ? (
            <Center py={10}>
              <Text color="gray.500">
                {turul !== 'all'
                  ? 'Энэ ангилалд ирцийн мэдээлэл олдсонгүй'
                  : 'Ирцийн мэдээлэл олдсонгүй'}
              </Text>
              {turul !== 'all' && (
                <Pressable mt={3} onPress={() => setTurul('all')}>
                  <Badge colorScheme="info" rounded="md" variant="subtle" py={1.5} px={3}>
                    Бүх ирцийг харах
                  </Badge>
                </Pressable>
              )}
            </Center>
          ) : null
        }
        renderItem={({item}) => {
          const zuragNer = item?.ajiltan?.zurgiinNer || ajiltan?.zurgiinNer;
          const khotsorson = Number(item?.khotsorsonMinut || 0);
          const ajillasan = Number(item?.ajillasanMinut || 0);

          return (
            <Box p={4} bg="white" rounded={'lg'} mb={3} shadow={1}>
              {/* Top Row: Date & Status Badge */}
              <HStack justifyContent="space-between" alignItems="center" mb={3}>
                <HStack space={2} alignItems="center">
                  <Icon
                    size="sm"
                    as={<MaterialIcons name="event" />}
                    color="blue.500"
                  />
                  <Heading size={'xs'} color="gray.800">
                    {moment(item.ognoo).format('YYYY-MM-DD')}
                  </Heading>
                  <Text fontSize="2xs" color="gray.400">
                    ({moment(item.ognoo).format('dddd')})
                  </Text>
                </HStack>
                {getTuluvBadge(item)}
              </HStack>

              <Divider mb={3} />

              {/* Main Info Columns */}
              <HStack justifyContent="space-between" alignItems="center">
                <HStack space={3} alignItems="center">
                  <Avatar
                    size={'md'}
                    source={
                      zuragNer && ajiltan?.baiguullagiinId
                        ? {
                            uri: `${url}/ajiltniiZuragAvya/${ajiltan.baiguullagiinId}/${zuragNer}`,
                          }
                        : undefined
                    }
                  />
                  <VStack>
                    <HStack space={1} alignItems="center">
                      <Text fontSize="2xs" color="gray.400" w="36px">Ирсэн:</Text>
                      <Heading size={'xs'} color="blue.600">
                        {item.irsenTsag ? moment(item.irsenTsag).format('HH:mm') : '-'}
                      </Heading>
                    </HStack>
                    <HStack space={1} alignItems="center" mt={1}>
                      <Text fontSize="2xs" color="gray.400" w="36px">Гарсан:</Text>
                      <Heading size={'xs'} color={item.yawsanTsag ? 'orange.500' : 'gray.400'}>
                        {item.yawsanTsag ? moment(item.yawsanTsag).format('HH:mm') : '*'}
                      </Heading>
                    </HStack>
                  </VStack>
                </HStack>

                {/* Metrics: Late & Worked Hours */}
                <HStack space={4} alignItems="center">
                  <VStack alignItems="center">
                    <Text fontSize="2xs" color="gray.400">Хоцролт</Text>
                    <Heading
                      size={'xs'}
                      color={khotsorson > 0 ? 'orange.500' : 'gray.400'}>
                      {formatMinutes(khotsorson)}
                    </Heading>
                  </VStack>
                  <VStack alignItems="center">
                    <Text fontSize="2xs" color="gray.400">Ажилласан</Text>
                    <Heading
                      size={'xs'}
                      color={ajillasan > 0 ? 'blue.600' : 'gray.400'}>
                      {formatMinutes(ajillasan)}
                    </Heading>
                  </VStack>
                </HStack>
              </HStack>
            </Box>
          );
        }}
        refreshControl={
          <RefreshControl
            refreshing={irts.isValidating}
            onRefresh={() => {
              irts.refresh();
              info.mutate();
            }}
          />
        }
      />
    </Box>
  );
};

export default IrtsDelgerengui;
