import React, {useMemo} from 'react';
import {Badge, Box, HStack, Icon, IconButton, ScrollView, Text, VStack, Toast} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useAuth} from 'components/context/Auth';
import {rightNavigation} from 'components/layout/LeftDrawer';
import NetInfo from '@react-native-community/netinfo';
import {Dimensions} from 'react-native';
import Heading from "native-base/src/components/primitives/Heading/index";
import {useNavigation} from "@react-navigation/native";
import {useLogic} from "../../components/context/Logic";
import useJagsaalt from "../../hooks/useJagsaalt";

NetInfo.configure({shouldFetchWiFiSSID: true});
const onoshilgooDelgerengui = props => {
  const params = props?.route?.params;
  const onoshuud = params?.onosh;
  const mashiniiDugaar = params?.mashiniiDugaar;
  const {token, sonorduulga} = useAuth();
  const screenHeight = Dimensions.get('window').height;
  const cH = screenHeight-200;
  const query = useMemo(
      () => ({
        plateNumber: mashiniiDugaar
      }),
      [mashiniiDugaar],
  );
  const {jagsaalt} = useJagsaalt(token, '/mashin', query, null);
  let onoshJags = [];
  for (let i=0; onoshuud.length > i ; i++){
    const ff = onoshuud[i].bairlal;
    const valid = onoshJags?.find((item)=>item?.pos === ff);
    let jags = [];
    if(!valid){
      for(let z=0; onoshuud.length > z ; z++){
        const zz = onoshuud[z];
        if(zz.bairlal===ff){
          zz.dedOnoshuud.length > 0 ? zz.dedOnoshuud.map((mur)=>{
              mur?.dedOnoshuud?.length >0 ?
                  mur.dedOnoshuud.map((a) => {
                      return a?.dedOnoshuud?.length > 0 ? a.dedOnoshuud.map((b)=>{
                              return b?.dedOnoshuud?.length>0 ? b.dedOnoshuud.map((c)=>{
                                  return jags.push({ner: `${zz.ner}~${mur.ner}~${a.ner}~${b.ner}~${c.ner}`});
                              }) : jags.push({ner: `${zz.ner}~${mur.ner}~${a.ner}~${b.ner}`})
                          })
                          : jags.push({ner: `${zz.ner}~${mur.ner}~${a.ner}`})
                  })
                  : jags.push({ner: `${zz.ner}~${mur.ner}`})
          }) : jags.push({ner:  zz.ner});

        }
      }
        onoshJags.push({
            pos: ff,
            list: jags
        });
    }
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
            Оношилгоо дэлгэрэнгүй
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
      <Box style={{height: screenHeight - 75, justifyContent: 'space-between'}}>
        <HStack px={3} mt={3} justifyContent="space-between">
          <Text style={{fontSize: 18, fontWeight: 'bold'}}>Машины дугаар:</Text>
          <Text style={{fontSize: 18, color: '#565656'}}> {params?.mashiniiDugaar}</Text>
        </HStack>
        <HStack px={3} mt={2} justifyContent="space-between">
          <Text style={{fontSize: 18, fontWeight: 'bold'}}>Урд тэнхлэг: </Text>
          <Text style={{fontSize: 18, color: '#565656'}}>{jagsaalt[0]?.fAxle}</Text>
        </HStack>
        <HStack px={3} my={2} justifyContent="space-between">
          <Text style={{fontSize: 18, fontWeight: 'bold'}}>Хойд тэнхлэг: </Text>
          <Text style={{fontSize: 18, color: '#565656'}}>{jagsaalt[0]?.rAxle}</Text>
        </HStack>
        <VStack p={5} style={{flex: 1, backgroundColor: '#fff', borderRadius: 25}}>
          <ScrollView>
              <Box bg="#F1F1F1" p={2} mb={2}>
                  <Text style={{fontSize: 18, fontWeight: 'bold'}}>Тайлбар</Text>
                  <Text style={{fontSize: 14}}>{params.tailbar}</Text>
              </Box>
            {
              onoshJags.map((onosh, index) => (
                  <VStack key={index} mb={5}>
                    <Heading>{onosh.pos}</Heading>
                    {
                      onosh.list.map((item, index)=><Text ml={3} key={index}>{index+1}. { item.ner}</Text>)
                    }
                  </VStack>
              ))
            }
          </ScrollView>
        </VStack>
      </Box>
    </Box>
  );
};

export default onoshilgooDelgerengui;
