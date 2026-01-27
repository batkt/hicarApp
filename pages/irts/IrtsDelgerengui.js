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
  Pressable,
  FlatList,
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

const IrtsDelgerengui = props => {
  const {defaultTuluv} = props?.route?.params || {};
  const {sonorduulga, ajiltan, token} = useAuth();
  const [turul, setTurul] = useState('kheviin');
  const [ognoo, setOgnoo] = useState([
    moment().startOf('month').toDate(),
    moment().endOf('month').toDate(),
  ]);

  const queryData = useMemo(() => {
    return {
      ekhlekhOgnoo: moment(ognoo[0]).format('YYYY-MM-DD 00:00:00'),
      duusakhOgnoo: moment(ognoo[1]).format('YYYY-MM-DD 23:59:59'),
      ajiltniiId: ajiltan?._id,
    };
  }, [ajiltan, ognoo]);

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

  useEffect(() => {
    defaultTuluv && setTurul(defaultTuluv);
  }, [defaultTuluv]);

  const query = useMemo(() => {
    var value = {
      ajiltniiId: ajiltan?._id,
      ognoo: {
        $gte: moment(ognoo[0]).format('YYYY-MM-DD 00:00:00'),
        $lte: moment(ognoo[1]).format('YYYY-MM-DD 23:59:59'),
      },
    };
    if (turul === 'khotsrolt') value.tuluv = ['hagas', 'khotsorson'];
    else if (turul === 'burtguuleegui') value.tuluv = ['chuluu', 'tasalsan'];
    else value.tuluv = 'kheviin';

    return value;
  }, [turul, ognoo, ajiltan]);

  const irts = useJagsaalt(token, irtsService, query, order);

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
        <HStack mt={5} space={4} justifyContent="center">
          <Pressable w="30%" onPress={() => setTurul('kheviin')}>
            <Center
              bg={turul === 'kheviin' ? 'blue.600' : 'white'}
              rounded={'md'}
              py={3}>
              <Avatar
                bg={turul === 'kheviin' ? 'blue.500' : 'blue.100'}
                size={'lg'}>
                <Center>
                  <Heading color={turul === 'kheviin' ? 'white' : 'blue.500'}>
                    {dashboard.kheviin}
                  </Heading>
                  <Heading
                    size={'xs'}
                    color={turul === 'kheviin' ? 'white' : 'blue.500'}>
                    Өдөр
                  </Heading>
                </Center>
              </Avatar>
              <Box
                mt={3}
                _text={{color: turul === 'kheviin' ? 'white' : 'black'}}>
                Хэвийн
              </Box>
            </Center>
          </Pressable>
          <Pressable w="30%" onPress={() => setTurul('khotsrolt')}>
            <Center
              bg={turul === 'khotsrolt' ? 'orange.600' : 'white'}
              rounded={'md'}
              py={3}>
              <Avatar
                bg={turul === 'khotsrolt' ? 'orange.500' : 'orange.100'}
                size={'lg'}>
                <Center>
                  <Heading
                    color={turul === 'khotsrolt' ? 'white' : 'orange.500'}>
                    {dashboard.kheviinbus}
                  </Heading>
                  <Heading
                    size={'xs'}
                    color={turul === 'khotsrolt' ? 'white' : 'orange.500'}>
                    Өдөр
                  </Heading>
                </Center>
              </Avatar>
              <Box
                mt={3}
                _text={{color: turul === 'khotsrolt' ? 'white' : 'black'}}>
                Хоцролт
              </Box>
            </Center>
          </Pressable>
          <Pressable w="30%" onPress={() => setTurul('burtguuleegui')}>
            <Center
              bg={turul === 'burtguuleegui' ? 'red.600' : 'white'}
              rounded={'md'}
              py={3}>
              <Avatar
                bg={turul === 'burtguuleegui' ? 'red.500' : 'red.100'}
                size={'lg'}>
                <Center>
                  <Heading
                    color={turul === 'burtguuleegui' ? 'white' : 'red.500'}>
                    {dashboard.burtgeegui}
                  </Heading>
                  <Heading
                    size={'xs'}
                    color={turul === 'burtguuleegui' ? 'white' : 'red.500'}>
                    Өдөр
                  </Heading>
                </Center>
              </Avatar>
              <Box
                mt={3}
                _text={{color: turul === 'burtguuleegui' ? 'white' : 'black'}}>
                Бүртгээгүй
              </Box>
            </Center>
          </Pressable>
        </HStack>
      </Box>
      <FlatList
        px={4}
        my={4}
        data={irts.jagsaalt}
        onEndReached={irts.next}
        keyExtractor={m => m._id}
        renderItem={({item}) => {
          return (
            <Pressable flexDir={'row'} p={4} bg="white" rounded={'md'} mb={5}>
              <Avatar
                size={'lg'}
                source={{
                  uri: `${url}/ajiltniiZuragAvya/${ajiltan?.baiguullagiinId}/${ajiltan?.zurgiinNer}`,
                }}
              />
              <Box flex={1} ml="5">
                <HStack space={4}>
                  <Center>
                    <Heading size={'sm'}>Ирсэн</Heading>
                    <Heading size={'sm'} color="blue.500">
                      {moment(item.irsenTsag).format('HH:mm')}
                    </Heading>
                  </Center>
                  <Center>
                    <Heading size={'sm'}>Гарсан</Heading>
                    <Heading size={'sm'} color="orange.500">
                      {item.yawsanTsag
                        ? moment(item.yawsanTsag).format('HH:mm')
                        : '*'}
                    </Heading>
                  </Center>
                </HStack>
                <Box flexDir={'row'} alignItems="center" mt="1">
                  <Icon
                    size="sm"
                    as={<MaterialIcons name="calendar-today" />}
                    color="gray.400"
                  />
                  <Heading size={'xs'} ml="3">
                    {moment(item.ognoo).format('YYYY/MM/DD')}
                  </Heading>
                </Box>
              </Box>
            </Pressable>
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
