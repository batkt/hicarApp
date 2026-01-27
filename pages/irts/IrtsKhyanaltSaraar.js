import React, { useMemo, useState} from 'react';
import {
  Box,
  HStack,
  Icon,
  Text,
  IconButton,
  Badge,
  Center,
  Avatar,
  Heading,
  Pressable,
  FlatList, ScrollView, VStack, Button,
} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useAuth} from 'components/context/Auth';
import {rightNavigation} from 'components/layout/LeftDrawer';
import {url} from 'lib/uilchilgee';
import moment from 'moment';
import {RefreshControl} from 'react-native';
import useData from 'hooks/useData';
import {useNavigation} from '@react-navigation/native';
import {MinuteToTime} from "../../tools/function/setTime";

const infoMethod = 'post';
const infoService = '/irtsiinMedeeAvya';
const irtsService = '/irtsiinMedeeAjiltnaarAvya';

const IrtsKhyanaltSaraar = props => {
  const {sonorduulga, ajiltan, token, salbariinId} = useAuth();
  const [chosenMonth, setChosenMonth] = useState(moment().format('MM'));
  const [ognoo, setOgnoo] = useState([moment().toDate(), moment().toDate()]);
  const navigation = useNavigation();

  const queryData = useMemo(() => {
    return {
      ekhlekhOgnoo: moment(ognoo[0]).startOf('month').format('YYYY-MM-DD 00:00:00'),
      duusakhOgnoo: moment(ognoo[1]).endOf('month').format('YYYY-MM-DD 23:59:59'),
      salbariinId,
    }
  }, [ajiltan, ognoo, salbariinId]);

  const info = useData(token, infoService, queryData, infoMethod);

  const dashboard = useMemo(() => {
    // console.log("khariu--------------->",info);
    return {
      kheviin: info?.data?.[0]?.kheviin,
      khotsorson: info?.data?.[0]?.khotsorson,
      tasalsan: info?.data?.[0]?.tasalsan,
      chuluu: info?.data?.[0]?.chuluu,
    };
  }, [info]);

  const irts =  useData(token, irtsService, queryData, infoMethod);

  function DateUnits() {
    const sar = new Array(12).fill('').map((item,index)=>{
      return moment().startOf('year').add(index,'month');
    });

    return (
        <>
          {sar.map(mur=>
              <Pressable w="20" onPress={() => {setChosenMonth(mur.format('MM')); setOgnoo([mur,mur])}}>
                <Center
                    bg={chosenMonth === mur.format('MM') ? 'blue.600' : 'white'}
                    rounded={'20px'} h="55" w="20">
                  <Text color={chosenMonth === mur.format('MM') ? 'white' : 'gray.400'} fontSize={14} fontWeight="bold">
                    {mur.format('MMM')}
                  </Text>
                  <Text color={chosenMonth === mur.format('MM') ? 'white' : 'gray.400'} fontSize={14} fontWeight="bold">
                    {moment().year()}
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
      <HStack mx={2} my={3} py={2} rounded="md" justifyContent="space-between">
        <Button w={110} rounded={'20px'} bg={"white"}  colorScheme={"dark"} _text={{color: "#000", fontWeight: 'bold'}} onPress={() => navigation.navigate('IrtsKhyanalt')}>
          Өдөр
        </Button>
        <Button w={110} rounded={'20px'} bg={"blue.600"} _text={{color: "white", fontWeight: 'bold'}} onPress={() => {}}>
          Сар
        </Button>
        <Button w={110} rounded={'20px'} bg={"white"}  colorScheme={"dark"} _text={{color: "#000", fontWeight: 'bold'}} onPress={() => navigation.navigate('IrtsKhyanaltJileer')}>
          Жил
        </Button>
      </HStack>
      <HStack mx={2} p={2} rounded="md" bg="white" justifyContent="space-between">
        <ScrollView horizontal={true} w="100%" h="55">
          <DateUnits/>
        </ScrollView>
      </HStack>
      <Box pr={4} pl={4}>
        <HStack mt={2} p={3} space={3} justifyContent="center">
          <Box w="25%">
            <Center
              bg={'white'}
              rounded={'md'}
              py={3}>
              <Avatar
                bg={'green.100'}
                size={'lg'}>
                <Center>
                  <Heading color={'green.500'}>
                    {dashboard.kheviin ? dashboard.kheviin : 0}
                  </Heading>
                  <Heading
                    size={'xs'}
                    color={'green.500'}>
                    Хүн
                  </Heading>
                </Center>
              </Avatar>
              <Box
                mt={3}
                _text={{color:'black', fontWeight: 'bold'}}>
                Хэвийн
              </Box>
            </Center>
          </Box>
          <Box w="25%">
            <Center
              bg={'white'}
              rounded={'md'}
              py={3}>
              <Avatar
                bg={'orange.100'}
                size={'lg'}>
                <Center>
                  <Heading
                    color={'orange.500'}>
                    {dashboard.khotsorson ? dashboard.khotsorson : 0}
                  </Heading>
                  <Heading
                    size={'xs'}
                    color={'orange.500'}>
                    Хүн
                  </Heading>
                </Center>
              </Avatar>
              <Box
                mt={3}
                _text={{color:'black', fontWeight: 'bold'}}>
                Хоцролт
              </Box>
            </Center>
          </Box>
          <Box w="25%">
            <Center
                bg={'white'}
                rounded={'md'}
                py={3}>
              <Avatar
                  bg={'red.100'}
                  size={'lg'}>
                <Center>
                  <Heading
                      color={'red.500'}>
                    {dashboard.tasalsan ? dashboard.tasalsan : 0}
                  </Heading>
                  <Heading
                      size={'xs'}
                      color={'red.500'}>
                    Хүн
                  </Heading>
                </Center>
              </Avatar>
              <Box
                  mt={3}
                  _text={{color:'black', fontWeight: 'bold'}}>
                Тасалсан
              </Box>
            </Center>
          </Box>
          <Box w="25%">
            <Center
              bg={'white'}
              rounded={'md'}
              py={3}>
              <Avatar
                bg={'blue.100'}
                size={'lg'}>
                <Center>
                  <Heading
                    color={'blue.500'}>
                    {dashboard.chuluu ? dashboard.chuluu : 0}
                  </Heading>
                  <Heading
                    size={'xs'}
                    color={'blue.500'}>
                    Хүн
                  </Heading>
                </Center>
              </Avatar>
              <Box
                mt={3}
                _text={{color: 'black', fontWeight: 'bold'}}>
                Чөлөө
              </Box>
            </Center>
          </Box>
        </HStack>
      </Box>
      <FlatList
        px={4}
        my={2}
        data={irts.data}
        renderItem={({item}) => {
          // console.log('/irtsiinMedeeAjiltnaarAvya--------->>', item);
          return (
            <Pressable flexDir={'row'} p={4} bg="white" rounded={'md'} mb={2}>
              <VStack w={20} alignItems="center">
                <Avatar
                    size={'lg'}
                    source={{
                      uri: `${url}/ajiltniiZuragAvya/${ajiltan?.baiguullagiinId}/${item._id?.zurgiinNer}`,
                    }}
                />
                <Heading mt={0.48} size={'xs'} adjustsFontSizeToFit numberOfLines={1}>{item._id?.ajiltniiNer}</Heading>
              </VStack>
              <Box flex={1} ml="5">
                <HStack space={4} justifyContent="space-around">
                  <VStack>
                    <Center  mb={2}>
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
                {/*<Box flexDir={'row'} alignItems="center" mt="1">
                  <Icon
                    size="sm"
                    as={<MaterialIcons name="calendar-today" />}
                    color="gray.400"
                  />
                  <Heading size={'xs'} ml="3">
                    {moment(item.ognoo).format('YYYY/MM/DD')}
                  </Heading>
                </Box>*/}
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
              irts.mutate();
              info.mutate();
            }}
          />
        }
      />
    </Box>
  );
};

export default IrtsKhyanaltSaraar;
