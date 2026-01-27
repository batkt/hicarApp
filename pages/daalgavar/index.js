import React, {useState} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  IconButton,
  Pressable,
  Text,
  Modal,
  useToast,
  Badge
} from 'native-base';
import moment from 'moment';
import useDaalgavar from 'hooks/useDaalgavar';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useAuth} from 'components/context/Auth';
import {Platform, Appearance} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import SwipeList from 'components/swipeList';
import uilchilgee, {aldaaBarigch} from 'lib/uilchilgee';
import {rightNavigation} from "../../components/layout/LeftDrawer";

const erembleltJagsaalt = [
  {id: '3', name: 'Дуусан огноогоор', key: 'duusakhOgnoo'},
  {id: '6', name: 'Бүртгэсэн огноогоор', key: 'createdAt'},
];

function AjliinTsag() {
  const [ognoo, setOgnoo] = React.useState();

  React.useEffect(() => {
    setInterval(() => {
      setOgnoo(moment());
    }, 1000);
  }, []);

  var minut = moment(moment().format('YYYY-MM-DD 20:00')).diff(
      moment(ognoo),
      'm',
  );

  var tsag = moment(moment().format('YYYY-MM-DD 20:00')).diff(
      moment(ognoo),
      'hour',
  );

  if (minut > 0)
    return (
        <Box ml="7" w="2/3" alignItems={'center'}>
          <Text bold color="gray.400">
            Ажлын цаг дуусахад
          </Text>
          <Text bold color="gray.400">
            {tsag > 0 ? `${tsag} цаг` : ''} {minut % 60} минут
          </Text>
        </Box>
    );
  else
    return (
        <Text ml="7" bold color="gray.400" w="2/3">
          Ажлын цаг дууссан байна
        </Text>
    );
}

export default function Daalgavar({title, ...props}) {
  const colorScheme = Appearance.getColorScheme();
  const toast = useToast();
  const {token, sonorduulga, baiguullaga} = useAuth();
  const [ognoo, setOgnoo] = useState([undefined, undefined]);
  const [tuluv, setTuluv] = React.useState(0);
  const [erembelt, setEremblelt] = React.useState({
    key: undefined,
    value: undefined,
  });

  const [show, setShow] = useState(false);
  const [ognooniiIndex, setOgnooniiIndex] = useState(0);
  const showDatepicker = index => {
    setOgnooniiIndex(index);
    showMode('date');
  };
  const showMode = () => {
    setShow(true);
  };

  const [tsutslakhDaalgavar, setTsutslakhDaalgavar] = React.useState(null);

  const onClose = () => setTsutslakhDaalgavar(null);

  const cancelRef = React.useRef(null);

  const onChange = (event, selectedDate) => {
    ognoo[ognooniiIndex] = selectedDate || ognoo[ognooniiIndex];
    setShow(false);
    setOgnoo([...ognoo]);
  };

  const query = React.useMemo(() => {
    if (tuluv === 0)
      return {
        tuluv: [0, 1],
        duusakhOgnoo:
            !!ognoo[1] && !!ognoo[0]
                ? {
                  $gte: moment(ognoo[0]).format('YYYY-MM-DD 00:00:00'),
                  $lte: moment(ognoo[1]).format('YYYY-MM-DD 23:59:59'),
                }
                : undefined,
      };
    return {
      tuluv,
      duusakhOgnoo:
          !!ognoo[1] && !!ognoo[0]
              ? {
                $gte: moment(ognoo[0]).format('YYYY-MM-DD 00:00:00'),
                $lte: moment(ognoo[1]).format('YYYY-MM-DD 23:59:59'),
              }
              : undefined,
    };
  }, [tuluv, ognoo]);

  const order = React.useMemo(() => {
    if (erembelt?.key) {
      return {
        [erembelt.key]: erembelt.value,
      };
    } else return {createdAt: -1};
  }, [erembelt]);

  const {jagsaalt, daalgavarMutate, refresh, daalgavarGaralt, next} =
      useDaalgavar(token, baiguullaga._id, query, order);

  // let jagsaalt, daalgavarMutate, refresh, daalgavarGaralt, next;

  const isFocused = useIsFocused();

  React.useEffect(() => {
    if (isFocused) daalgavarMutate();
  }, [isFocused]);

  return (
      <Box bg="#1877f2" style={{flex: 1}}>
        <HStack
            h={120}
            flexDirection="column"
            alignItems="center">
          <Box alignItems="center" flexDirection="row" w="full" p={2}>
            <IconButton
                colorScheme="tertiary"
                icon={
                  <Icon
                      size="sm"
                      as={<MaterialIcons name="arrow-back-ios" />}
                      color="white"
                  />
                }
                onPress={() => props.navigation.navigate('jagsaalt')}
            />
            <Text color="white" bold textAlign={'center'} w={'4/5'}>
              {moment().format('YYYY-MM-DD')}
            </Text>
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
          </Box>
          <Box
              justifyContent={'space-between'}
              flexDirection="row"
              w="full"
              px={4}
              paddingBottom={2}>
            <Box>
              <Heading color="white">Өнөөдөр</Heading>
              <Text bold color="white">
                {jagsaalt.length} даалгавар
              </Text>
            </Box>
            <Pressable
                rounded={'xl'}
                p={2}
                px="4"
                bg="white"
                onPress={() => props.navigation.navigate('daalgavarBurtgekh')}
                justifyContent={'center'}>
              <Text color="#1877f2" fontSize={'sm'} bold>
                Нэмэх
              </Text>
            </Pressable>
          </Box>
        </HStack>
        <Box safeAreaBottom roundedTopLeft={40} flex={1} bg="white">
          <Box
              w="full"
              justifyContent={'space-between'}
              flexDirection="row"
              p={5}>
            <Box flexDirection={'row'} alignItems="center" w="4/5">
              <Pressable
                  alignItems="center"
                  justifyContent="center"
                  bg="#1877f2"
                  flexDirection="column"
                  rounded={'2xl'}
                  _pressed={{bgColor: 'blue.400'}}
                  w="16"
                  h="16"
                  onPress={() => showDatepicker(0)}>
                <Text bold color="white" fontSize={'lg'}>
                  {moment(ognoo[0]).format('DD')}
                </Text>
                <Text bold fontSize={'xs'} color="gray.100">
                  {moment(ognoo[0]).format('MM')} сар
                </Text>
              </Pressable>
              <AjliinTsag />
            </Box>
            <Pressable
                bg="#1877f2"
                _pressed={{bgColor: 'blue.400'}}
                flexDirection="column"
                rounded={'2xl'}
                alignItems="center"
                justifyContent={'center'}
                w="16"
                h="16"
                onPress={() => showDatepicker(1)}>
              <Text bold color="white" fontSize={'lg'}>
                {moment(ognoo[1]).format('DD')}
              </Text>
              <Text bold fontSize={'xs'} color="gray.100">
                {moment(ognoo[1]).format('MM')} сар
              </Text>
            </Pressable>
          </Box>
          {show && Platform.OS === 'android' && (
              <DateTimePicker
                  testID="dateTimePicker"
                  mode={'date'}
                  display="spinner"
                  value={moment(ognoo[ognooniiIndex]).toDate()}
                  onChange={onChange}
                  onTouchCancel={() => setShow(false)}
              />
          )}
          <Modal
              size="lg"
              isOpen={show && Platform.OS === 'ios'}
              onClose={() => setShow(false)}>
            <Modal.Content bgColor={colorScheme === 'dark' ? 'gray.800' : null}>
              <DateTimePicker
                  testID="dateTimePicker"
                  mode={'date'}
                  display="inline"
                  value={moment(ognoo[ognooniiIndex]).toDate()}
                  onChange={onChange}
                  onTouchCancel={() => setShow(false)}
              />
            </Modal.Content>
          </Modal>
          <SwipeList
              isRefreshing={!daalgavarGaralt}
              onRefresh={refresh}
              next={next}
              data={jagsaalt}
              navigation={props.navigation}
              // daalgavarTsutsalya={setTsutslakhDaalgavar}
              // tsutslakhEsekh={tuluv === 0}
          />
          <Box flexDirection={'row'} p={2}>
            <Pressable
                py={2}
                w="1/3"
                rounded={tuluv === 0 ? 'xl' : undefined}
                shadow={tuluv === 0 ? '4' : undefined}
                bg={tuluv === 0 ? "#1877f2" : 'white'}
                alignItems={'center'}
                onPress={() => {
                  setTuluv(0);
                  refresh();
                }}>
              <Text color={tuluv === 0 ? 'white' : 'gray.600'} fontSize={'lg'}>
                Идэвхитэй
              </Text>
            </Pressable>
            <Pressable
                py={2}
                w="1/3"
                rounded={tuluv === 2 ? 'xl' : undefined}
                shadow={tuluv === 2 ? '4' : undefined}
                bg={tuluv === 2 ? "#1877f2" : 'white'}
                alignItems={'center'}
                onPress={() => {
                  setTuluv(2);
                  refresh();
                }}>
              <Text color={tuluv === 2 ? 'white' : 'gray.600'} fontSize={'lg'}>
                Дууссан
              </Text>
            </Pressable>
            <Pressable
                py={2}
                w="1/3"
                rounded={tuluv === -1 ? 'xl' : undefined}
                shadow={tuluv === -1 ? '4' : undefined}
                bg={tuluv === -1 ? "#1877f2" : 'white'}
                alignItems={'center'}
                onPress={() => {
                  setTuluv(-1);
                  refresh();
                }}>
              <Text color={tuluv === -1 ? 'white' : 'gray.600'} fontSize={'lg'}>
                Цуцлагдсан
              </Text>
            </Pressable>
          </Box>
        </Box>
{/*
        <AlertDialog
            leastDestructiveRef={cancelRef}
            isOpen={!!tsutslakhDaalgavar}
            onClose={onClose}>
          <AlertDialog.Content>
            <AlertDialog.CloseButton />
            <AlertDialog.Header>Даалагвар устгах</AlertDialog.Header>
            <AlertDialog.Body>
              {`Та ${tsutslakhDaalgavar?.dugaar} дугаартай даалгавар устгахдаа итгэлтэй байна уу`}
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button.Group space={2}>
                <Button
                    variant="unstyled"
                    colorScheme="coolGray"
                    onPress={onClose}
                    ref={cancelRef}>
                  Үгүй
                </Button>
                <Button
                    colorScheme="danger"
                    onPress={() => daalgavarTsutsalya(tsutslakhDaalgavar)}>
                  Тийм
                </Button>
              </Button.Group>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog>
*/}
      </Box>
  );
}
