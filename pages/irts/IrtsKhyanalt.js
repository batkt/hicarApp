import React, { useMemo, useState } from 'react';
import {
  Box,
  HStack,
  Icon,
  Text,
  IconButton,
  Badge,
  Button,
  ScrollView,
  Center,
  Avatar,
  Heading,
  Pressable,
  FlatList, VStack,
} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useAuth} from 'components/context/Auth';
import {rightNavigation} from 'components/layout/LeftDrawer';
import {url} from 'lib/uilchilgee';
import moment from 'moment';
import useJagsaalt from 'hooks/useJagsaalt';
import {Dimensions, RefreshControl} from 'react-native';
import useData from 'hooks/useData';
import {useNavigation} from '@react-navigation/native';
import {useAjiltniiJagsaalt} from "../../hooks/useAjiltan";
import {MinuteToTime} from "../../tools/function/setTime";

const order = {createdAt: -1};
const infoMethod = 'post';
const irtsService = '/irts';
const infoService = '/irtsiinMedeeAvya';

const IrtsKhyanalt = props => {
  const {sonorduulga, ajiltan, token, salbariinId} = useAuth();
  const [turul, setTurul] = useState('kheviin');
  const [chosenDay, setChosenDay] = useState(moment().format('DD'));
  const [ognoo, setOgnoo] = useState([moment().toDate(), moment().toDate()]);
  const navigation = useNavigation();

  const queryData = useMemo(() => {
    return {
      ekhlekhOgnoo: moment(ognoo[0]).format('YYYY-MM-DD 00:00:00'),
      duusakhOgnoo: moment(ognoo[1]).format('YYYY-MM-DD 23:59:59'),
      salbariinId,
    };
  }, [ajiltan, ognoo, salbariinId]);

  const info = useData(token, infoService, queryData, infoMethod);

  const dashboard = useMemo(() => {
    // console.log("khariu==++++>",info);
    return {
      kheviin: info?.data?.[0]?.kheviin,
      khotsorson: info?.data?.[0]?.khotsorson,
      tasalsan: info?.data?.[0]?.tasalsan,
      chuluu: info?.data?.[0]?.chuluu,
    };
  }, [info]);

  const query = useMemo(() => {
    let value = {
      salbariinId,
      ognoo: {
        $gte: moment(ognoo[0]).format('YYYY-MM-DD 00:00:00'),
        $lte: moment(ognoo[1]).format('YYYY-MM-DD 23:59:59'),
      },
    };
    // console.log('-----', value.ognoo);
    if (turul === 'kheviin') value.tuluv = 'kheviin';
    else if (turul === 'khotsorson') value.khotsorsonMinut = {
      $gt :0
    };
    else if (turul === 'tasalsan') value["tasalsanTurul.ekhlekhOgnoo"] = {
      $exists :true
    };
    else value["chuluuniiTurul.ekhlekhOgnoo"] = {
        $exists :true
      };
    return value;
  }, [turul, ognoo, ajiltan, salbariinId]);

  const irts = useJagsaalt(token, irtsService, query, order);
  const queryAjiltan = useMemo(() => {
    const baiguullagiinId = ajiltan.baiguullagiinId;
    return {
      baiguullagiinId,
    }
  }, [ajiltan, salbariinId]);
  const hariu = useAjiltniiJagsaalt(
      token,
      ajiltan?.baiguullagiinId,
      null,
  );
  const ajiltanuud = hariu?.ajilchdiinGaralt?.jagsaalt;
  function DateUnits() {
    const udur = new Array(moment().daysInMonth()).fill('').map((item,index)=>{
      return moment().startOf('month').add(index,'day')
    });

    return (
        <>
          {udur.map(mur=>
              <Pressable w="55" onPress={() => {setChosenDay(mur.format('DD')); setOgnoo([mur,mur])}}>
                <Center
                    bg={chosenDay === mur.format('DD') ? 'blue.600' : 'white'}
                    rounded={'20px'} h="55" w="90%">
                  <Text color={chosenDay === mur.format('DD') ? 'white' : 'gray.400'} fontSize={14} fontWeight="bold">
                    {mur.format('ddd')}
                  </Text>
                  <Text color={chosenDay === mur.format('DD') ? 'white' : 'gray.400'} fontSize={14} fontWeight="bold">
                    {mur.format('DD')}
                  </Text>
                </Center>
              </Pressable>
          )}
        </>
    )
  }

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
                    _text={{fontSize: 8}}>
                  </Badge>
                )}
              </React.Fragment>
            }
            onPress={() => rightNavigation.toggleDrawer()}
          />
        </HStack>
      </HStack>
      <HStack mx={2} my={3} mb={1} py={2} rounded="md" justifyContent="space-between">
        <Button w={110} rounded={'20px'} bg={"blue.600"} _text={{color: "white", fontWeight: 'bold'}} onPress={() => {}}>
          Өдөр
        </Button>
        <Button w={110} rounded={'20px'} bg={"white"} colorScheme={"dark"} _text={{color: "#000", fontWeight: 'bold'}} onPress={() => navigation.navigate('IrtsKhyanaltSaraar')}>
          Сар
        </Button>
        <Button w={110} rounded={'20px'} bg={"white"} colorScheme={"dark"} _text={{color: "#000", fontWeight: 'bold'}} onPress={() => navigation.navigate('IrtsKhyanaltJileer')}>
          Жил
        </Button>
      </HStack>
      <HStack mx={2} m={3} mb={1} p={2} rounded="md" bg="white" justifyContent="space-between">
        <ScrollView horizontal={true} w="100%" h="55">
          <DateUnits/>
        </ScrollView>
      </HStack>
      <Box pr={4} pl={4}>
        <HStack mt={2} p={3} space={3} justifyContent="center">
          {/*<IrtsBox/>*/}

          <Pressable w="25%" onPress={() => setTurul('kheviin')}>
            <Center
              bg={turul === 'kheviin' ? 'green.600' : 'white'}
              rounded={'md'}
              py={3}>
              <Avatar
                bg={turul === 'kheviin' ? 'green.500' : 'green.100'}
                size={'lg'}>
                <Center>
                  <Heading color={turul === 'kheviin' ? 'white' : 'green.500'}>
                    {dashboard.kheviin ? dashboard.kheviin : 0}
                  </Heading>
                  <Heading
                    size={'xs'}
                    color={turul === 'kheviin' ? 'white' : 'green.500'}>
                    Хүн
                  </Heading>
                </Center>
              </Avatar>
              <Box
                mt={3}
                _text={{color: turul === 'kheviin' ? 'white' : 'black', fontWeight: 'bold'}}>
                Хэвийн
              </Box>
            </Center>
          </Pressable>
          <Pressable w="25%" onPress={() => setTurul('khotsrolt')}>
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
                    {dashboard.khotsorson ? dashboard.khotsorson : 0}
                  </Heading>
                  <Heading
                    size={'xs'}
                    color={turul === 'khotsrolt' ? 'white' : 'orange.500'}>
                    Хүн
                  </Heading>
                </Center>
              </Avatar>
              <Box
                mt={3}
                _text={{color: turul === 'khotsrolt' ? 'white' : 'black', fontWeight: 'bold'}}>
                Хоцролт
              </Box>
            </Center>
          </Pressable>
          <Pressable w="25%" onPress={() => setTurul('tasalsan')}>
            <Center
                bg={turul === 'tasalsan' ? 'red.600' : 'white'}
                rounded={'md'}
                py={3}>
              <Avatar
                  bg={turul === 'tasalsan' ? 'red.500' : 'red.100'}
                  size={'lg'}>
                <Center>
                  <Heading
                      color={turul === 'tasalsan' ? 'white' : 'red.500'}>
                    {dashboard.tasalsan ? dashboard.tasalsan : 0}
                  </Heading>
                  <Heading
                      size={'xs'}
                      color={turul === 'tasalsan' ? 'white' : 'red.500'}>
                    Хүн
                  </Heading>
                </Center>
              </Avatar>
              <Box
                  mt={3}
                  _text={{color: turul === 'tasalsan' ? 'white' : 'black', fontWeight: 'bold'}}>
                Тасалсан
              </Box>
            </Center>
          </Pressable>
          <Pressable w="25%" onPress={() => setTurul('chuluu')}>
            <Center
              bg={turul === 'chuluu' ? 'blue.600' : 'white'}
              rounded={'md'}
              py={3}>
              <Avatar
                bg={turul === 'chuluu' ? 'blue.500' : 'blue.100'}
                size={'lg'}>
                <Center>
                  <Heading
                    color={turul === 'chuluu' ? 'white' : 'blue.500'}>
                    {dashboard.chuluu ? dashboard.chuluu : 0}
                  </Heading>
                  <Heading
                    size={'xs'}
                    color={turul === 'chuluu' ? 'white' : 'blue.500'}>
                    Хүн
                  </Heading>
                </Center>
              </Avatar>
              <Box
                mt={3}
                _text={{color: turul === 'chuluu' ? 'white' : 'black', fontWeight: 'bold'}}>
                Чөлөө
              </Box>
            </Center>
          </Pressable>
        </HStack>
      </Box>
      {
        <FlatList
            px={4}
            my={2}
            data={irts.jagsaalt}
            renderItem={({item}) => {
              let zurag = '';
              ajiltanuud.map(mur=>{
                if(mur._id === item.ajiltniiId)
                  zurag = mur.zurgiinNer;
              })
              // console.log('/irts--------->>', item);
              return (
                  <Pressable flexDir={'row'} p={4} bg="white" rounded={'md'} mb={2}>
                    <VStack w={20} alignItems="center">
                      <Avatar
                          size={'lg'}
                          source={{
                            uri: `${url}/ajiltniiZuragAvya/${ajiltan?.baiguullagiinId}/${zurag}`,
                          }}
                      />
                      <Heading mt={0.48} size={'xs'} adjustsFontSizeToFit numberOfLines={1}>{item.ajiltniiNer}</Heading>
                    </VStack>
                    <Box flex={1} ml="5">
                      <HStack space={4} justifyContent="space-between">
                        <Center>
                          <Heading size={'xs'}>Орсон</Heading>
                          <Heading mb={1} size={'xs'} color="blue.500">
                            {moment(item.irsenTsag).format('HH:mm')}
                          </Heading>
                          <Heading mt={1} size={'xs'}>Гарсан</Heading>
                          <Heading size={'xs'} color="orange.500">
                            {item.yawsanTsag
                                ? moment(item.yawsanTsag).format('HH:mm')
                                : '*'}
                          </Heading>
                        </Center>
                        {/*<Center>
                          <Heading size={'sm'}>Хоцролт</Heading>
                          <Heading size={'sm'} color="orange.500">
                            {item.khotsorsonMinut}
                          </Heading>
                        </Center>*/}
                        <VStack>
                          <Center mb={2}>
                            <Heading size={'xs'} color="gray.500">Ажилласан</Heading>
                            <MinuteToTime min={item.ajillasanMinut}/>
                          </Center>
                          <Center>
                            <Heading size={'xs'} color="gray.500">Чөлөө</Heading>
                            <MinuteToTime min={item.chuluuniiMinut}/>
                          </Center>
                        </VStack>
                        <VStack>
                          <Center mb={2}>
                            <Heading size={'xs'} color="gray.500">Хоцролт</Heading>
                            <MinuteToTime min={item.khotsorsonMinut}/>
                          </Center>
                          <Center>
                            <Heading size={'xs'} color="gray.500">Тасалсан</Heading>
                            <MinuteToTime min={item.tasalsanMinut}/>
                          </Center>
                        </VStack>
                      </HStack>
                    </Box>
                  </Pressable>
              );
            }}
            onEndReached={irts.next}
            keyExtractor={m => m._id}
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
      }
    </Box>
  );
};

export default IrtsKhyanalt;
