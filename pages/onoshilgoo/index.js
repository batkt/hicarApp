import React, {useMemo, useState, useEffect} from 'react';
import {
  Box,
  HStack,
  Icon,
  Text,
  IconButton,
  Badge,
  Input,
  Button,
  Select,
  VStack,
  Popover,
  Pressable, Modal, ScrollView
} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useAuth} from 'components/context/Auth';
import {rightNavigation} from 'components/layout/LeftDrawer';
import NetInfo from '@react-native-community/netinfo';
import {Appearance, Dimensions, Platform, RefreshControl} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import moment from "moment";
import DateTimePicker from "@react-native-community/datetimepicker";
import useJagsaalt from "../../hooks/useJagsaalt";
import {useLogic} from "../../components/context/Logic";

NetInfo.configure({shouldFetchWiFiSSID: true});

const index = props => {
  const colorScheme = Appearance.getColorScheme();
  const {ajiltan, token, sonorduulga, baiguullaga,} = useAuth();
  const [ognoo, setOgnoo] = useState([new Date(), new Date()]);
  const [ognooniiIndex, setOgnooniiIndex] = useState(0);
  const [show, setShow] = useState(false);
  const os = useMemo(() => Platform.OS, []);
  const cxt = useLogic();

  const navigation = useNavigation();

  const onChange = (event, selectedDate) => {
    ognoo[ognooniiIndex] = selectedDate || ognoo[ognooniiIndex];
    setShow(false);
    setOgnoo([...ognoo]);
  };

  const showDatepicker = index => {
    setOgnooniiIndex(index);
    setShow(true);
  };
  const query = useMemo(
      () => ({
        ajiltaniiId: ajiltan?._id,
        ognoo: {
          $gte: moment(ognoo[0]).format('YYYY-MM-DD 00:00:00'),
          $lte: moment(ognoo[1]).format('YYYY-MM-DD 23:59:59'),
        },
      }),
      [ognoo, ajiltan, cxt.onoshilgoo],
  );
  const {jagsaalt, next, data,refresh} = useJagsaalt(token, '/onoshilgoo', query, null);
  useEffect(()=>{
    if(cxt.onoshilgoo===true){
      refresh();
      cxt.onoshilgooTuluw(false);
    }
  },[cxt.onoshilgoo]);

  const urgeljluuleh = () => {
    navigation.navigate('onoshilgooBurtgel');
  };
  const delgerenguiUzya = data => {
    props.navigation.navigate('onoshilgooDelgerengui', data);
  };

  return (
    <Box flex={1} style={{backgroundColor: '#f5f5fb'}}>
      <HStack
        bg="#1877f2"
        px={1}
        h={55}
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
            Оношилгоо
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
          onScrollEndDrag={next}
          refreshControl={
            <RefreshControl
                refreshing={!data}
                onRefresh={() => {
                  refresh();
                }}
            />
          }
      >
        {jagsaalt?.map(
            (a, i) => (
                <Pressable
                    onPress={() => delgerenguiUzya(a)}
                    key={a._id}
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
                        {/*<Box
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
                              alignSelf="center"></Box>*/}
                        {/*<Text fontSize={14}>{a.zakhialgiinDugaar}</Text>*/}
                      </Box>
                    </Box>
                    <Box flexDirection="row" justifyContent="space-between">
                      <Text bold fontSize={14}>
                        Илгээгдсэн
                      </Text>
                      <Text bold fontSize={14}>
                        {a.mashiniiDugaar}
                      </Text>
                    </Box>
                    <Box flexDirection="row" justifyContent="space-between">
                      <Text fontSize={14}>
                        {/*{a.temdeglel || a.tutsalsanShaltgaan}*/}
                      </Text>
                      <Text fontSize={14}>{a.utasniiDugaar !== 'undefined' && a.utasniiDugaar ?  a.utasniiDugaar : ''}</Text>
                    </Box>
                  </Box>
                </Pressable>
            ),
        )}
      </ScrollView>
      <Button m={2} colorScheme={'blue'} size="lg" onPress={() => urgeljluuleh()}>
        Шинээр үүсгэх
      </Button>
    </Box>
  );
};

export default index;
