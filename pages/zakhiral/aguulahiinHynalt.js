import React, {useMemo, useState} from 'react';
import {
  Box,
  HStack,
  Icon,
  IconButton,
  Text,
  FlatList,
  PresenceTransition,
  Button,
  Badge
} from 'native-base';
import {TouchableOpacity, StyleSheet, RefreshControl, Pressable} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useAuth} from 'components/context/Auth';
import {useBaraaToololt, useBaraaTurluur, useNuutsiinToololt} from 'hooks/useBaraa';
import moment from "moment";
import DateTimePicker from "@react-native-community/datetimepicker";
import formatNumber from "../../tools/function/formatNumber";
import {rightNavigation} from 'components/layout/LeftDrawer';

export function Tile({ugugdul, index, setSelectedIndex, selectedIndex}) {
  return (
      <Pressable
          onPress={() =>
              setSelectedIndex(selectedIndex === index ? null : index)
          }>
        <Box key={`mur${index}`} flexDirection="column" margin={2} style={css.suuder}>
          <Box flexDirection="row" width='100%' justifyContent='space-between' padding={2}>
            <Box style={{maxWidth: '70%'}} flexDirection="row">
              <Text style={css.text} mr={1}>
                {index + 1}.
              </Text>
              <Text numberOfLines={(selectedIndex !== index) ? 1 : 10}>
                {ugugdul?._id.ner}
              </Text>
            </Box>
            <Box flexDirection='row'>
              <Text mr={1} style={css.text}>
                {ugugdul?.zarsanToo}
              </Text>
              {
                (selectedIndex !== index) ?
                    <Icon
                        size="md"
                        as={<MaterialIcons name="expand-more" />}
                    />
                    :
                    <Icon
                        size="md"
                        as={<MaterialIcons name="expand-less" />}
                    />
              }
            </Box>
          </Box>
          <PresenceTransition visible={selectedIndex === index} initial={{
          opacity: 0,
            scale: 0
        }} animate={{
            scale: 1,
          opacity: 1,
          transition: {
            duration: 250
          }
        }}>
          <Box
              flexDirection="row"
              padding={2}
              key={`mur${index}`}
              display={(selectedIndex === index)? 'flex' : 'none'}
              justifyContent='space-between'
          >
            <Text width='50%' numberOfLines={1}>
              Код: {ugugdul?._id.kod}
            </Text>
            <Text width='50%' style={{textAlign: 'right'}} numberOfLines={1}>Үнэ: {formatNumber(
                ugugdul?.negjUne &&
                ugugdul?.negjUne,
            )}
            </Text>
          </Box>
        </PresenceTransition>
        </Box>
      </Pressable>
  );
}

const aguulahiinHynalt = props => {
  const {token, sonorduulga, baiguullaga} = useAuth();
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [ognoo, setOgnoo] = useState([moment().startOf('month').format('YYYY-MM-DD 00:00:00'), moment().endOf('month').format('YYYY-MM-DD 23:59:59')]);
  const [ognooniiIndex, setOgnooniiIndex] = useState(0);
  const [show, setShow] = useState(false);
  const [dashBoard, setDashBoard] = useState({ner:'Их зарсан'});
  const [sort, setSort] = useState(-1);
  const [niitMur, setNiitMur] = useState(0);
  const os = useMemo(() => Platform.OS, []);
  // console.log('0', baraaiiGaralt?.jagsaalt[0]);
  const qq = useMemo(
      ()=>{
        return {
          baiguullagiinId: baiguullaga?._id,
          ekhlekhOgnoo: ognoo[0],
          duusakhOgnoo: ognoo[1],
          sort: sort,
        }
      },[baiguullaga, sort, ognoo]
  );
  const query = useMemo(
      ()=>{
        return {
          baiguullagiinId: baiguullaga?._id,
          ekhlekhOgnoo: ognoo[0],
          duusakhOgnoo: ognoo[1],
        }
      },[baiguullaga, ognoo]
  );
  const {baraaniiToo} = useBaraaToololt(token,query);
  const { nJagsaalt, nuutsiinToo, nNext, nRefresh, nValidating} = useNuutsiinToololt(token,qq);

  const {baraaniiJagsaalt, baraaniiJagsaaltMutate, next, setKhuudaslalt,isValidating, refresh} = useBaraaTurluur(token,qq);
  /*if(!!nuutsiinToo){
    nuutsiinToo[0].jagsaalt.map(a=>{
      console.log('++++++++=', a);
    })
  }*/
  const showDatepicker = index => {
    setOgnooniiIndex(index);
    setShow(true);
  };

  if(!!(baraaniiToo && baraaniiToo[0]?.ikhzarsan[0]?.zarsanToo) && niitMur===0)
    setNiitMur(baraaniiToo[0].ikhzarsan[0].zarsanToo);

  const onChange = (event, selectedDate) => {
    ognoo[ognooniiIndex] = selectedDate || ognoo[ognooniiIndex];
    setShow(false);
    setOgnoo([...ognoo]);
    // tailanMutate();
    // borluulaltiinTailanMutate();
  };
  return (
    <Box flex={1} style={{backgroundColor: '#f5f5fb'}}>
      <HStack
        bg="#1877f2"
        px={1}
        py={4}
        justifyContent="space-between"
        alignItems="center"
        borderBottomRadius="10px">
        <HStack space={4} alignItems="center">
          <IconButton
            colorScheme="blue"
            icon={
              <Icon
                size="sm"
                as={<MaterialIcons name="arrow-back" />}
                color="white"
              />
            }
            onPress={() => props.navigation.goBack()}
          />
          <Text color="white" fontSize={16} fontWeight="bold">
            Агуулахын хяналт
          </Text>
        </HStack>
        <HStack space={2}>
          <IconButton
            colorScheme="blue"
            icon={
              <React.Fragment>
                <Icon
                  right={2}
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
                    borderColor="#1877f2"
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
      <Box flex={1} margin={4}>
        {show && os === 'android' && (
            <DateTimePicker
                testID="dateTimePicker"
                mode={'date'}
                display="spinner"
                value={moment(ognoo[ognooniiIndex]).toDate()}
                onChange={onChange}
                onTouchCancel={() => setShow(false)}
            />
        )}
        <Box padding={2} flexDirection="row" justifyContent="space-between">
          <Button
              width="48%"
              borderRadius="lg"
              shadow={3}
              alignItems="center"
              justifyContent="center"
              bgColor="white"
              _pressed={{backgroundColor: 'darkBlue.300'}}
              onPress={() => showDatepicker(0)}>
            <Box alignItems="center" flexDirection="row" padding={2}>
              <Icon
                  size="md"
                  as={<MaterialIcons name="access-time" />}
              />
              <Text ml={2} color={'black'}>{moment(ognoo[0]).format('YYYY-MM-DD')}</Text>
            </Box>
          </Button>
          <Button
              width="48%"
              borderRadius="lg"
              shadow={3}
              alignItems="center"
              justifyContent="center"
              bgColor="white"
              _pressed={{backgroundColor: 'darkBlue.300'}}
              onPress={() => showDatepicker(1)}>
            <Box alignItems="center" flexDirection="row" padding={2}>
              <Icon
                  size="md"
                  as={<MaterialIcons name="access-time" />}
              />
              <Text ml={2} color={'black'}>{moment(ognoo[1]).format('YYYY-MM-DD')}</Text>
            </Box>
          </Button>
        </Box>
        <Box padding={2} flexDirection="row" justifyContent="space-between">
          <Button
            style={[dashBoard.ner==='Их зарсан' ? css.clickedBg : "#8B8B8B",{maxHeight: 63}]}
            width="48%"
            borderRadius="lg"
            shadow={3}
            // colorScheme={dashBoard.ner==='Их зарсан' ? "secondary" : "primary"}
              // bg="#1877f2"
            // bg={dashBoard.ner==='Их зарсан'?"#1877f2":"#fff"}
            alignItems="center"
            justifyContent="center"
            onPress={() => {
              setKhuudaslalt(a => {
                a.jagsaalt = [];
                a.khuudasniiDugaar = 1;
                return {...a};
              });
              setNiitMur(!!(baraaniiToo[0]?.ikhzarsan[0]?.zarsanToo) ? baraaniiToo[0].ikhzarsan[0].zarsanToo : 0);
              setDashBoard({ner: 'Их зарсан'});
              setSort(-1);
              }}
            bgColor="white">
            <Box pl={2} width="100%" alignItems="center" flexDirection="row" justifyContent="flex-start">
              <Text fontSize={16} bold style={dashBoard.ner==='Их зарсан'&&css.clickedCl} color="#8B8B8B">Их зарсан</Text>
            </Box>
            <Box width="100%" alignItems="center" flexDirection="row" justifyContent="flex-end">
              {!!(baiguullaga?.tokhirgoo?.ikhZaragdsan) ?
                  <Text pr={2} >{baiguullaga.tokhirgoo.ikhZaragdsan}-с дээш</Text>
                  :
                  <Text color='#F64545' pr={2} >тохиргоогүй</Text>
              }
              <Text style={dashBoard.ner==='Их зарсан'&&css.clickedCl} bold>({!!(baraaniiToo && baraaniiToo[0]?.ikhzarsan[0]?.zarsanToo) ? baraaniiToo[0].ikhzarsan[0].zarsanToo : 0})</Text>
            </Box>
          </Button>
          <Button
            style={[dashBoard.ner==='Бага зарсан' ? css.clickedBg : "#8B8B8B",{maxHeight: 63}]}
            width="48%"
            borderRadius="lg"
            shadow={3}
            alignItems="center"
            justifyContent="center"
            onPress={() => {
              setKhuudaslalt(a => {
                a.jagsaalt = [];
                a.khuudasniiDugaar = 1;
                return {...a};
              });
              setNiitMur(!!(baraaniiToo[0]?.bagazarsan[0]?.zarsanToo) ? baraaniiToo[0].bagazarsan[0].zarsanToo : 0);
              setDashBoard({ner: 'Бага зарсан'});
              setSort(1);
            }}
            bgColor="white">
            <Box pl={2} width="100%" alignItems="center" flexDirection="row" justifyContent="flex-start">
              <Text fontSize={16} bold style={dashBoard.ner==='Бага зарсан'&&css.clickedCl} color="#8B8B8B">Бага зарсан</Text>
            </Box>
            <Box width="100%" alignItems="center" flexDirection="row" justifyContent="flex-end">
              {!!(baiguullaga?.tokhirgoo?.bagaZaragdsan) ?
                  <Text pr={2} >{baiguullaga.tokhirgoo.bagaZaragdsan}-с доош</Text>
                  :
                  <Text color='#F64545' pr={2} >тохиргоогүй</Text>
              }
              <Text style={dashBoard.ner==='Бага зарсан'&&css.clickedCl} bold>({!!(baraaniiToo && baraaniiToo[0]?.bagazarsan[0]?.zarsanToo) ? baraaniiToo[0].bagazarsan[0].zarsanToo : 0})</Text>
            </Box>
          </Button>
        </Box>
        <Box padding={2} flexDirection="row" justifyContent="space-between">
          <Button
              style={[dashBoard.ner==='Нөөц бага' ? css.clickedBg : "#8B8B8B",{maxHeight: 63}]}
              width="48%"
              borderRadius="lg"
              // bg={dashBoard.ner==='Нөөц бага' ? ("#1877f2") : ("#fff")}
              // colorScheme={dashBoard.ner==='Нөөц бага' ? "#1877f2" : "#fff"}
              shadow={3}
              alignItems="center"
              onPress={() => {setDashBoard({ner: 'Нөөц бага'})}}
              bgColor="white">
            <Box pl={2} width="100%" alignItems="center" flexDirection="row" justifyContent="flex-start">
              <Text fontSize={16} bold style={dashBoard.ner==='Нөөц бага'&&css.clickedCl} color="#8B8B8B">Нөөц бага</Text>
            </Box>
            <Box width="100%" alignItems="center" flexDirection="row" justifyContent="flex-end">
              {!!(baiguullaga?.tokhirgoo?.nuutsBaga) ?
                  <Text pr={2} >{baiguullaga.tokhirgoo.nuutsBaga}-с доош</Text>
                  :
                  <Text color='#F64545' pr={2} >тохиргоогүй</Text>
              }
              <Text style={dashBoard.ner==='Нөөц бага'&&css.clickedCl} bold>({!!(nuutsiinToo && nuutsiinToo[0]?.too[0]?.too) ? nuutsiinToo[0].too[0].too : 0})</Text>
            </Box>
          </Button>
          <Button
            style={{maxHeight: 63}}
            width="48%"
            borderRadius="lg"
            shadow={3}
            alignItems="center"
            justifyContent="center"
            // onPress={() => {setDashBoard({sort: null, ner: 'Хугацаа дуусах'})}}
            bgColor="white">
            <Box pl={2} width="100%" alignItems="center" flexDirection="row" justifyContent="flex-start">
              <Text fontSize={16} bold color="#8B8B8B">Хугацаа дуусах</Text>
            </Box>
            <Box pr={2} width="100%" alignItems="center" flexDirection="row" justifyContent="flex-end">
              <Text bold>(0)</Text>
            </Box>
          </Button>
        </Box>
        <Box bg="#fff" flex={4} marginX={2} marginTop={2}>
          <Box
              flexDirection="row"
              bg="#1877f2"
              borderRadius={5}
              padding={3}
              >
            <Box
                flexDirection="row"
                width="50%"
                justifyContent="space-between"
                paddingRight={2}
            >
              <Text fontSize={16} color="white" style={{alignSelf: 'center'}}>
                {dashBoard.ner}
              </Text>
            </Box>
            <Box
                width="50%"
                style={{alignItems: 'flex-end'}}
                >
                {
                  dashBoard.ner==='Их зарсан' ?
                      <Text fontSize={16} color="white">{formatNumber(
                          !!baraaniiToo ? baraaniiToo[0].ikhzarsan[0]?.niitUne : 0
                      )} ₮</Text>
                      :
                      dashBoard.ner==='Бага зарсан' ?
                          <Text fontSize={16} color="white">{formatNumber(
                              !!baraaniiToo ? baraaniiToo[0].bagazarsan[0]?.niitUne : 0
                          )} ₮</Text>
                          : ''
                }
            </Box>
          </Box>
          {/*(item._id.kod+item.zarsanToo)*/}
          {dashBoard.ner !== 'Нөөц бага' ?
              !!baraaniiJagsaalt &&
              <FlatList
                  data={baraaniiJagsaalt}
                  refreshControl={
                    <RefreshControl
                        refreshing={isValidating}
                        onRefresh={refresh}
                    />
                  }
                  renderItem={({item, index}) => (
                      <Tile
                          ugugdul={item}
                          index={index}
                          selectedIndex={selectedIndex}
                          setSelectedIndex={setSelectedIndex}
                      />
                  )}
                  keyExtractor={(item,index) => (item._id.kod+index)}
                  onEndReached={()=>next(niitMur)}
                  onEndReachedThreshold={0.5}
              />
              :
              !!nJagsaalt &&
              <FlatList
                  data={nJagsaalt}
                  refreshControl={
                    <RefreshControl
                        refreshing={nValidating}
                        onRefresh={nRefresh}
                    />
                  }
                  renderItem={({item, index}) => (
                      <Tile
                          ugugdul={item}
                          index={index}
                          selectedIndex={selectedIndex}
                          setSelectedIndex={setSelectedIndex}
                      />
                  )}
                  keyExtractor={(item,index) => (item._id.kod+index)}
                  onEndReached={()=>nNext(Number(nuutsiinToo[0]?.too[0]?.too))}
                  onEndReachedThreshold={0.5}
              />
          }
        </Box>
      </Box>
    </Box>
  );
};

const css = StyleSheet.create({
  suuder: {
    padding: 6,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    shadowColor: '#0098E8',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  text: {
    fontSize: 14,
  },
  clickedBg: {
    backgroundColor: '#1877f2',
  },
  clickedCl: {
    color: '#fff',
  },
});

export default aguulahiinHynalt;
