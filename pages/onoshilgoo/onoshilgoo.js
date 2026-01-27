import React, {useEffect, useMemo, useState} from 'react';
import {
  Box,
  HStack,
  Icon,
  Text,
  IconButton,
  Badge,
  Checkbox,
  Skeleton,
  VStack, Pressable,
  Actionsheet,
  Heading,
  ScrollView
} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useAuth} from 'components/context/Auth';
import {rightNavigation} from 'components/layout/LeftDrawer';
import NetInfo from '@react-native-community/netinfo';
import {Dimensions, Image, View} from 'react-native';
import Button from "native-base/src/components/primitives/Button/Button";
import useJagsaalt from "../../hooks/useJagsaalt";
import {useNavigation} from "@react-navigation/native";
import {useLogic} from "../../components/context/Logic";
import TreeView from "react-native-final-tree-view";

NetInfo.configure({shouldFetchWiFiSSID: true});
const onoshService = '/onosh';
const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 20;
  return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
};
function generateChild(mur,zam=[],undsen) {
  if(mur?.dedOnoshuud?.length > 0)
    return (
        mur.dedOnoshuud.map(a=>({
          id: `${[...zam,a.ner].join('-')}`+'?'+(zam.length === 0 ? a : undsen).bairlal+'?'+(zam.length === 0 ? a : undsen).turul,
          ner: a.ner,
          children: generateChild(a,[...zam,a.ner],zam.length === 0 ? a : undsen),
        }))
    );
  return ([])
}

const onoshilgoo = props => {
  // console.log('-=-=-==-=-', props?.route?.params);
  const fAxle = props?.route.params?.fAxle;
  const rAxle = props?.route.params?.rAxle;
  const {token, sonorduulga} = useAuth();
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const cH = screenHeight-200;

  const [turul, setTurul] = useState('');
  const [bairlal, setBairlal] = useState();
  const [songogdsonBairlal, setSongogdsonBairlal] = useState([]);

  const [songogdsonUtga, setSongogdsonUtga] = React.useState([]);
  const [open, setOpen] = useState(false);

  const navigation = useNavigation();
  const cxt = useLogic();

  useEffect(()=>{
    setSongogdsonBairlal([]);
    setSongogdsonUtga([]);
  }, [cxt.onoshilgoo,fAxle, rAxle]);

  const query = useMemo(() => {
    let a = bairlal==='HEAD' || bairlal ==='BODY' ? {"bairlal" : bairlal} : {"turul" : turul, "bairlal" : bairlal};
    // console.log(bairlal, turul);
     return a;
  }, [bairlal, turul]);

  let onoshKhariu = useJagsaalt(token, onoshService, query, null);

  const khariuu = useMemo(()=> generateChild({dedOnoshuud:onoshKhariu?.jagsaalt}),[onoshKhariu?.jagsaalt]);

  const openModal = (t) => {
    setOpen(true);
    if(t==='FR'||t==='FL') setTurul(fAxle);
    else if(t==='RR'||t==='RL') setTurul(rAxle);
    else setTurul("");
    setBairlal(t);
  };
  const positionHandler = () => {
    const bb = [];
    songogdsonUtga.map(utga=>{
      bb.push(utga.split('?')[1]);
    });
    // console.log('----------->', songogdsonUtga);
    setSongogdsonBairlal(bb);
  };
  const urgeljluuleh = () => {
    navigation.navigate('onoshilgooHadgalah', {
      mashin: props?.route?.params,
      onosh: songogdsonUtga
    });
  };

  function TireBtn(p) {
    let shalgah = null;
    shalgah = songogdsonBairlal.find(item=> item===p.bairlal);
    const ungu = shalgah? '#47D321' : '#E11736';
    return (
        <Pressable w="20" onPress={() => openModal(p.bairlal)}>
          <Box bg={shalgah? '#CFE2CA' : '#ECB1BA'} style={{width:p.w, height: p.h, marginBottom: 10, borderRadius: p.r, borderWidth: 2, borderColor: ungu, alignItems:'center', justifyContent: 'center'}} _text={{color: '#363636', fontWeight: 'bold',}}>
            {p.bairlal}
          </Box>
        </Pressable>
    )
  }

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
      <Box style={{flex: 1, justifyContent: 'space-around'}}>
        <HStack m={2} h={cH}>
          <VStack justifyContent="space-around">
            <TireBtn bairlal={'FL'} w={80} h={80} r={80}/>
            <TireBtn bairlal={'RL'} w={80} h={80} r={80}/>
          </VStack>
          <Box style={{width: screenWidth-176}} h={cH} alignItems={'center'}>
            <Box style={{width: 100, position:'absolute', zIndex: 5, top: screenHeight/10}}>
              <TireBtn bairlal={'HEAD'} w={100} h={30} r={10}/>
            </Box>
            <Image
                source={require('../../assets/images/car.png')}
                style={{width: screenWidth-176, height: cH, resizeMode: 'contain'}}
            />
            <Box style={{width: 100, position:'absolute', zIndex: 5, top: screenHeight/2.7}}>
              <TireBtn bairlal={'BODY'} w={100} h={30} r={10}/>
            </Box>
          </Box>
          <VStack justifyContent="space-around">
            <TireBtn bairlal={'FR'} w={80} h={80} r={80}/>
            <TireBtn bairlal={'RR'} w={80} h={80} r={80}/>
          </VStack>
        </HStack>
      </Box>
      <Button m={3} colorScheme={'blue'} size="lg" onPress={() => urgeljluuleh()}>
        Үргэлжлүүлэх
      </Button>
      <Actionsheet isOpen={open} onClose={() => {setOpen(false);positionHandler();}} size="full">
        <Actionsheet.Content minH="75%" bg={"#D4E0EA"}>
        <Heading pb={2} size="md">Онош сонгох</Heading>
          <Box px={3} bg="#fff" pt={2} style={{flex: 1, width: "100%", borderRadius: 10}}>
            <ScrollView onScroll={({nativeEvent}) => {
              if (isCloseToBottom(nativeEvent)) {
                onoshKhariu.next()
              }
            }}
            >
              <Checkbox.Group onChange={setSongogdsonUtga} value={songogdsonUtga}>
                {
                  !khariuu ?
                      <>
                        <Skeleton h="4" my="2"/>
                        <Skeleton h="4" my="2"/>
                        <Skeleton h="4" my="2"/>
                        <Skeleton h="4" my="2"/>
                      </>
                      :
                      <TreeView
                          data={khariuu}
                          renderNode={({ node, level, isExpanded, hasChildrenNodes }) => {
                            return (
                                !hasChildrenNodes ?
                                    <Checkbox colorScheme="blue" my={1} _text={{fontSize: 20}} value={node.id} style={{
                                      marginLeft: 25 * level
                                    }}>{node.ner}</Checkbox>
                                    :
                                    isExpanded ?
                                        <HStack alignItems="center" my={0.5} style={{
                                          marginLeft: 25 * level,
                                        }}>
                                          <Icon
                                              color="red.500"
                                              size={5}
                                              as={<MaterialIcons name="remove" />}
                                          />
                                          <Text ml={2} fontWeight="bold" fontSize={20}>{node.ner}</Text>
                                        </HStack>
                                        :
                                        <HStack alignItems="center" p={2} style={{
                                          marginLeft: 25 * level,
                                        }}>
                                          <Icon
                                              color="green.500"
                                              size={5}
                                              as={<MaterialIcons name="add" />}
                                          />
                                          <Text ml={2} fontSize={20}>{node.ner}</Text>
                                        </HStack>
                            )
                          }}
                      />
                }
              </Checkbox.Group>
            </ScrollView>
          </Box>
          <HStack w="100%" justifyContent="flex-end">
            <Button colorScheme="gray" mt={2} mr={3} onPress={() => {setOpen(false)}}>Хаах</Button>
            <Button colorScheme="blue" mt={2} onPress={() => {setOpen(false);positionHandler()}}>Хадгалах</Button>
          </HStack>
        </Actionsheet.Content>
      </Actionsheet>
    </Box>
  );
};

export default onoshilgoo;
