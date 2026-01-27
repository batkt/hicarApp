import React, {useState, useMemo, useEffect} from 'react';
import {
  Box,
  HStack,
  Pressable,
  Icon,
  Text,
  IconButton,
  ScrollView,
  Badge,
  Input,
  Button,
  Modal,
} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useAuth} from 'components/context/Auth';
import BottomTabs from 'components/layout/BottomTabs';
import useUridchilsanZakhialgaToololt from 'hooks/useUridchilsanZakhialgaToololt';
import useZakhialga from 'hooks/useZakhialga';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import {rightNavigation} from 'components/layout/LeftDrawer';
import {Platform, RefreshControl, Appearance} from 'react-native';
import useKhabTuukh from 'hooks/useKhabTuukh';

function Tuluv({ugugdul}) {
  var tuluv = '';
  let color = 'geekblue';
  switch (ugugdul.tuluv) {
    case '1':
      tuluv = 'Эхлээгүй';
      color = 'danger';
      break;
    case '2':
      tuluv = 'ХИЙГДЭЖ БАЙНА';
      color = 'warning';
      break;
    case '3':
      tuluv = 'ДУУССАН';
      color = 'success';
      break;
    case '-1':
      tuluv = 'ЦУЦЛАГДСАН';
      color = 'danger';
      break;
    default:
      break;
  }
  return (
    <Badge colorScheme={color} rounded="md">
      <Text>{tuluv}</Text>
    </Badge>
  );
}

const index = props => {
  const colorScheme = Appearance.getColorScheme();
  const {
    ajiltan,
    token,
    sonorduulga,
    baiguullaga,
    irtsBurtgekh,
    unuudriinIrts,
  } = useAuth();
  const [ognoo, setOgnoo] = useState([new Date(), new Date()]);
  const [search, setSearch] = useState(undefined);
  const [queryTuluv, setQueryTuluv] = useState('1');
  const [ognooniiIndex, setOgnooniiIndex] = useState(0);
  const [show, setShow] = useState(false);

  const query = useMemo(
    () => ({
      baiguullagiinId: ajiltan?.baiguullagiinId,
      ajiltniiId: ajiltan?._id,
      ognoo: {
        $gte: moment(ognoo[0]).format('YYYY-MM-DD 00:00:00'),
        $lte: moment(ognoo[1]).format('YYYY-MM-DD 23:59:59'),
      },
      tuluv: queryTuluv,
    }),
    [ognoo, ajiltan, queryTuluv],
  );

  const {
    zakhialgiinGaralt,
    zakhialgaMutate,
    nextZakhialguud,
    zakhialgiinJagsaalt,
    onSearch,
  } = useZakhialga(token, ajiltan?.baiguullagiinId, undefined, query);

  const {asuultTuukhGaralt} = useKhabTuukh(token, ajiltan, ognoo);

  const zakhialgaToollolt = useUridchilsanZakhialgaToololt(
    token,
    ajiltan?.baiguullagiinId,
    zakhialgaMutate,
    ognoo[0],
    ognoo[1],
    ajiltan?._id,
  );

  useEffect(() => {
    /*if (irtsBurtgekh) props.navigation.navigate('Ирц');
    else */if (
      asuultTuukhGaralt?.jagsaalt?.length === 0 &&
      baiguullaga?.tokhirgoo?.khabAshiglakhEsekh === true
    )
      props.navigation.navigate('asuulgaBuglukh');
  }, [asuultTuukhGaralt, baiguullaga, irtsBurtgekh]);

  const onChange = (event, selectedDate) => {
    ognoo[ognooniiIndex] = selectedDate || ognoo[ognooniiIndex];
    setShow(false);
    setOgnoo([...ognoo]);
  };

  const showMode = () => {
    setShow(true);
  };

  const showDatepicker = index => {
    setOgnooniiIndex(index);
    showMode('date');
  };

  const delgerenguiUzya = data => {
    props.navigation.navigate('zakhialgiinDelgerengui', data);
  };

  const onRefresh = () => {
    zakhialgaMutate();
    zakhialgaToollolt.toololtMutate();
  };

  const onTabChanged = id => {
    setQueryTuluv(id);
    zakhialgaMutate();
  };

  const os = useMemo(() => Platform.OS, []);

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
          {search ? (
            <Input
              mx={2}
              color="white"
              onChangeText={onSearch}
              InputRightElement={
                <IconButton
                  onPress={() => setSearch(false)}
                  colorScheme="blue"
                  icon={
                    <Icon
                      size="sm"
                      as={<MaterialIcons name="close" />}
                      color="white"
                    />
                  }
                />
              }
            />
          ) : (
            <>
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
                Захиалга
              </Text>
            </>
          )}
        </HStack>
        <HStack space={2}>
          {!search && (
            <IconButton
              colorScheme="blue"
              onPress={() => setSearch(true)}
              icon={
                <Icon
                  as={<MaterialIcons name="search" />}
                  color="white"
                  size="sm"
                />
              }
            />
          )}

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
                    _text={{fontSize: 8}}>
                  </Badge>
                )}
              </React.Fragment>
            }
            onPress={() => rightNavigation.toggleDrawer()}
          />
        </HStack>
      </HStack>
      <Box
        padding={2}
        paddingX={4}
        paddingBottom={0}
        flexDirection="row"
        justifyContent="space-between">
        <Button
          width="48%"
          bg="#1877f2"
          colorScheme="blue"
          _text={{color: 'white'}}
          onPress={() => showDatepicker(0)}>
          {moment(ognoo[0]).format('YYYY-MM-DD')}
        </Button>
        <Button
          width="48%"
          bg="#1877f2"
          colorScheme="blue"
          _text={{color: 'white'}}
          onPress={() => showDatepicker(1)}>
          {moment(ognoo[1]).format('YYYY-MM-DD')}
        </Button>
      </Box>
      {show && os === 'android' && (
        <DateTimePicker
          testID="dateTimePicker"
          mode={'date'}
          display="spinner"
          value={ognoo[ognooniiIndex]}
          onChange={onChange}
          onTouchCancel={() => setShow(false)}
        />
      )}
      <Modal
        size="lg"
        isOpen={show && os === 'ios'}
        onClose={() => setShow(false)}>
        <Modal.Content bgColor={colorScheme === 'dark' ? 'gray.800' : '#fff'}>
          <DateTimePicker
            testID="dateTimePicker"
            mode={'date'}
            display="inline"
            value={ognoo[ognooniiIndex]}
            onChange={onChange}
            onTouchCancel={() => setShow(false)}
          />
        </Modal.Content>
      </Modal>
      <ScrollView
        marginTop={2}
        px={4}
        refreshControl={
          <RefreshControl
            refreshing={!zakhialgiinGaralt}
            onRefresh={onRefresh}
          />
        }
        onScrollEndDrag={nextZakhialguud}>
        {[...zakhialgiinJagsaalt, ...(zakhialgiinGaralt?.jagsaalt || [])].map(
          (a, i) => (
            <Pressable
              onPress={() => delgerenguiUzya(a)}
              key={i}
              flex={1}
              padding={2}
              marginTop={2}
              rounded="xl"
              bg="#fff"
              borderLeftColor="#1877f2"
              borderLeftWidth={4}
              flexDirection="row"
              alignItems="center">
              <Box width="10%" alignItems="center">
                <Text bold fontSize={14}>
                  {1 + i}
                </Text>
              </Box>
              <Box width="90%" justifyContent="space-between">
                <Box flexDirection="row" justifyContent="space-between">
                  <Text fontSize={14}>
                    {moment(a.ognoo).format('YYYY-MM-DD hh:mm')}
                  </Text>
                  <Box flexDirection="row" style={{alignSelf: 'center'}}>
                    <Box
                      marginRight={2}
                      bg={
                        a.tuluv === '1'
                          ? '#ff4444'
                          : a.tuluv === '2'
                          ? '#ffbb33'
                          : a.tuluv === '3'
                          ? '#00C851'
                          : a.tuluv === '-1'
                          ? '#ff4444'
                          : '#33b5e5'
                      }
                      width={2}
                      height={2}
                      rounded="full"
                      alignSelf="center"></Box>
                    <Text fontSize={14}>{a.zakhialgiinDugaar}</Text>
                  </Box>
                </Box>
                <Box flexDirection="row" justifyContent="space-between">
                  <Text bold fontSize={14}>
                    {a.tuluv === '1'
                      ? 'Эхлээгүй'
                      : a.tuluv === '2'
                      ? 'Хийгдэж байна'
                      : a.tuluv === '3'
                      ? 'Дууссан'
                      : a.tuluv === '-1'
                      ? 'Цуцлагдсан'
                      : 'Цуцлагдсан'}
                  </Text>
                  {a.tuluv === '3' && a?.khuvaaltssan?.length > 0 && (
                    <Box>
                      <Icon
                        size="sm"
                        as={<MaterialIcons name="share" />}
                        color="blue.500"
                      />
                    </Box>
                  )}
                  <Text bold fontSize={14}>
                    {a.mashiniiDugaar}
                  </Text>
                </Box>
                <Box flexDirection="row" justifyContent="space-between">
                  <Text fontSize={14}>
                    {a.temdeglel || a.tutsalsanShaltgaan}
                  </Text>
                  {
                    ((baiguullaga.tokhirgoo?.joloochiinUtasNuukh === undefined) || !baiguullaga.tokhirgoo?.joloochiinUtasNuukh) &&
                  <Text fontSize={14}>
                    {a.khariltsagchiinUtas}
                  </Text>
                  }

                </Box>
              </Box>
            </Pressable>
          ),
        )}
      </ScrollView>
      <BottomTabs
        tabs={[
          {
            id: '1',
            icon: 'pause-circle',
            toololt: zakhialgaToollolt?.khuviarlagdsan,
          },
          {id: '2', icon: 'clock-o', toololt: zakhialgaToollolt?.ekhlesen},
          {
            id: '3',
            icon: 'check-circle-o',
            toololt: zakhialgaToollolt?.duussan,
          },
          {id: '-1', icon: 'close', toololt: zakhialgaToollolt?.tsutslagdsan},
        ]}
        onTabChanged={onTabChanged}
        songogdsonId={queryTuluv}
      />
    </Box>
  );
};

export default index;
