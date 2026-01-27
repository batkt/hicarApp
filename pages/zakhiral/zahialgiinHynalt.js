import React, {useMemo, useState} from 'react';
import {
  Box,
  HStack,
  Icon,
  Text,
  IconButton,
  FlatList,
  PresenceTransition,
  Badge
} from 'native-base';
import {TouchableOpacity} from 'react-native';
import {useAuth} from 'components/context/Auth';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Pressable} from 'react-native';
import useZakhilgiinToo from 'hooks/useZakhialgiinToo';
import useZakhialga from 'hooks/useZakhialga';
import moment from 'moment';
import formatNumber from 'tools/function/formatNumber';
import {rightNavigation} from 'components/layout/LeftDrawer';
import CardList from 'components/custom/CardList';
import BottomTabs from 'components/layout/ZakhiralBottomTabs';

export function Tile({ugugdul, index, setSelectedIndex, selectedIndex}) {
  return (
    <Box flexDirection="row" py={1}>
      <Box
        flexDirection="column"
        flex={1}
        borderLeftColor={
          ugugdul?.tuluv === '3'
            ? '#32bb9f'
            : ugugdul?.tuluv === '-1'
            ? '#ff0000'
            : '#ffff66'
        }
        borderLeftWidth={3}
        padding={3}
        paddingRight={5}
        bg="white"
        borderRadius={5}>
        <Box>
          <Box flexDirection="row">
            <Box width="5%" marginRight={2}>
              {index + 1}
            </Box>
            <Box flexDirection="row" width="45%" style={{alignSelf: 'center'}}>
              <Text fontSize={14}>
                {moment(ugugdul?.ognoo).format('YYYY-MM-DD')}
              </Text>
            </Box>
            <Box
              flexDirection="row-reverse"
              style={{alignSelf: 'center'}}
              width="50%">
              <Text fontSize={14}> {ugugdul.zakhialgiinDugaar}</Text>
              <Box
                bg={
                  ugugdul?.tuluv === '3'
                    ? '#32bb9f'
                    : ugugdul?.tuluv === '-1'
                    ? '#ff0000'
                    : '#ffff66'
                }
                width={2}
                height={2}
                rounded="full"
                alignSelf="center"></Box>
            </Box>
          </Box>
          <Box flexDirection="row" paddingY="1">
            <Box width="5%" marginRight={2}></Box>
            <Box width="45%" style={{alignSelf: 'center'}}>
              {/* <Text   fontSize={14} bold >{ugugdul?.tuluv==="3" ? "Амжилттай": ugugdul?.tuluv==="-1" ? "Цуцалсан":"Дуусаагүй"}</Text> */}
              <Text fontSize={14} bold>
                {ugugdul?.ajiltniiNer}
              </Text>
            </Box>
            <Box flexDirection="row-reverse" width="50%">
              <Text fontSize={14}> {ugugdul?.khugatsaa} минут</Text>
              <Icon
                size={5}
                as={
                  <MaterialIcons
                    name={'access-time'}
                    style={{alignSelf: 'center'}}
                  />
                }
              />
            </Box>
          </Box>
          <Pressable
            onPress={() =>
              setSelectedIndex(selectedIndex === index ? undefined : index)
            }>
            <Box flexDirection="row">
              <Box width="5%" marginRight={2}>
                <Icon
                  size={5}
                  as={
                    <MaterialIcons
                      name={
                        selectedIndex === index
                          ? 'arrow-drop-up'
                          : 'arrow-drop-down'
                      }
                    />
                  }
                  color="black"
                />
              </Box>

              <Box
                flexDirection="row"
                width="55%"
                justifyContent="space-between">
                <Text fontSize={14} style={{alignSelf: 'center'}}>
                  Барааны мэдээлэл
                </Text>
              </Box>
              <Box width="40%" style={{alignItems: 'flex-end'}}>
                <Text fontSize={14}> {formatNumber(ugugdul?.niitDun)}</Text>
              </Box>
            </Box>
          </Pressable>
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
              <Box flexDirection="row">
                <Box
                  width="3%"
                  borderRightWidth={0.5}
                  borderColor="#32bb9f"
                  marginRight={2}></Box>
                <Box>
                  <Box flexDirection="row">
                    <Box
                      flex={1}
                      paddingX={3}
                      borderBottomWidth={0.5}
                      borderColor="#32bb9f"
                      marginTop={2}>
                      <Box flexDirection="row" justifyContent="space-between">
                        <Text paddingRight={2} fontSize={14}>
                          {ugugdul?.khariltsagchiinNer}
                        </Text>
                      </Box>
                      <Box flexDirection="row" justifyContent="space-between">
                        <Text paddingRight={2} fontSize={14}>
                          {ugugdul?.khariltsagchiinUtas}
                        </Text>
                        <Text
                          bold
                          fontSize={14}
                          style={{alignItems: 'flex-end'}}>
                          {ugugdul?.mashiniiDugaar}
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                  {ugugdul?.zakhialguud?.map((mur, index) => (
                    <Box paddingX={3} key={`mur${index}`}>
                      <Box>
                        <Box flexDirection="row">
                          <Box width="50%" style={{alignItems: 'flex-start'}}>
                            <Text fontSize={14}>{mur?.ner} </Text>
                          </Box>
                          <Box width="10%" style={{alignSelf: 'center'}}>
                            <Text fontSize={14}>{mur?.tooKhemjee} ш </Text>
                          </Box>
                          <Box
                            width="40%"
                            style={{
                              alignItems: 'flex-end',
                              alignSelf: 'center',
                            }}>
                            <Text fontSize={14}> {formatNumber(mur?.une)}</Text>
                          </Box>
                        </Box>
                        {mur?.uilchilgeeniiKhuls && (
                          <Box style={{alignItems: 'flex-end'}}>
                            <Text fontSize={14}>
                              Ажлын хөлс :{' '}
                              {formatNumber(mur?.uilchilgeeniiKhuls)}
                            </Text>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </PresenceTransition>
        </Box>
      </Box>
    </Box>
  );
}

const zahialgiinHynalt = props => {
  const {ognoo} = props.route.params;
  const {token, sonorduulga, ajiltan} = useAuth();
  const [selectedIndex, setSelectedIndex] = useState();
  const [tuluv, setTuluv] = useState(undefined);
  const {khuviarlagdaagui, khuviarlagdsan, ekhlesen, duussan, tsutslagdsan} =
    useZakhilgiinToo(
      token,
      ajiltan?.baiguullagiinId,
      () => console.log('as'),
      ognoo[0],
      ognoo[1],
    );
  const query = useMemo(
    () => ({
      ognoo: {
        $gte: moment(ognoo[0]).format('YYYY-MM-DD 00:00:00'),
        $lte: moment(ognoo[1]).format('YYYY-MM-DD 23:59:59'),
      },
      tuluv,
    }),
    [ognoo, tuluv],
  );

  const {
    zakhialgiinGaralt,
    zakhialgiinJagsaaltMixed,
    nextZakhialguud,
    zakhialgaMutate,
  } = useZakhialga(token, ajiltan?.baiguullagiinId, undefined, query);

  function tuluvSoliyo(v) {
    setTuluv(v);
    zakhialgaMutate();
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
        <HStack space={4} alignItems="center" marginBottom="10">
          <IconButton
            colorScheme="blue"
            icon={
              <Icon
                size="sm"
                as={<MaterialIcons name="arrow-back" />}
                color="white"
              />
            }
            onPress={() => {
              setTuluv(undefined);
              props.navigation.goBack();
            }}
          />
          <Text color="white" fontSize="lg" fontWeight="bold">
            Захиалгын хяналт
          </Text>
        </HStack>
        <HStack space={2} marginBottom="10">
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
                    top={-8}
                    right={-8}
                    colorScheme="warning"
                    rounded="full"
                    borderWidth={2}
                    borderColor="blue.600"
                    alignItems="center"
                    minWidth={6}>
                    <Text>{sonorduulga?.sonorduulga?.kharaaguiToo}</Text>
                  </Badge>
                )}
              </React.Fragment>
            }
            onPress={() => rightNavigation.toggleDrawer()}
          />
        </HStack>
      </HStack>
      <Box px={4} width="full" alignItems={'center'}>
        <Box
          shadow={8}
          flexDirection="row"
          justifyContent="space-between"
          bg="white"
          padding={3}
          width="full"
          borderRadius={12}
          position="absolute"
          top={-40}>
          <TouchableOpacity onPress={() => tuluvSoliyo('3')}>
            <Box alignItems="center">
              <Text bold fontSize={20}>
                {duussan}
              </Text>
              <Text fontSize={14} color="#6f6e6e">
                Амжилттай
              </Text>
            </Box>
          </TouchableOpacity>
          <TouchableOpacity>
            <Box alignItems="center">
              <Text bold fontSize={20}>
                0
              </Text>
              <Text fontSize={14} color="#6f6e6e">
                Бараа
              </Text>
            </Box>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => tuluvSoliyo(['2', '1'])}>
            <Box alignItems="center">
              <Text bold fontSize={20}>
                {ekhlesen + khuviarlagdaagui + khuviarlagdsan}
              </Text>
              <Text fontSize={14} color="#6f6e6e">
                Дуусаагүй
              </Text>
            </Box>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => tuluvSoliyo(['-1'])}>
            <Box alignItems="center">
              <Text bold fontSize={20}>
                {tsutslagdsan}
              </Text>
              <Text fontSize={14} color="#6f6e6e">
                Цуцлагдсан
              </Text>
            </Box>
          </TouchableOpacity>
        </Box>
      </Box>
      <CardList
        marginTop={10}
        marginBottom={4}
        paddingX={4}
        loading={!zakhialgiinGaralt}
        next={nextZakhialguud}
        onRefresh={zakhialgaMutate}
        jagsaalt={zakhialgiinJagsaaltMixed}
        renderItem={({item, index}) => (
          <Tile
            ugugdul={item}
            index={index}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
          />
        )}
        keyExtractor={item => item._id}
      />
      <BottomTabs {...props} />
    </Box>
  );
};

export default zahialgiinHynalt;
