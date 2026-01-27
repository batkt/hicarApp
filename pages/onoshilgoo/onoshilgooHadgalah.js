import React, {useState, useEffect} from 'react';
import {
  Badge,
  Box,
  HStack,
  Icon,
  IconButton,
  ScrollView,
  Text,
  VStack,
  Toast,
  TextArea,
} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useAuth} from 'components/context/Auth';
import {rightNavigation} from 'components/layout/LeftDrawer';
import NetInfo from '@react-native-community/netinfo';
import Button from 'native-base/src/components/primitives/Button/Button';
import Heading from 'native-base/src/components/primitives/Heading/index';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import uilchilgee from '../../lib/uilchilgee';
import {useLogic} from '../../components/context/Logic';

NetInfo.configure({shouldFetchWiFiSSID: true});
const onoshilgooHadgalah = props => {
  // console.log('------', props?.route?.params);
  const params = props?.route?.params;
  const onoshuud = params?.onosh;
  const {token, sonorduulga, ajiltan, salbariinId} = useAuth();
  const navigation = useNavigation();
  const cxt = useLogic();
  const [disableBtn, setDisableBtn] = useState(false);
  const [tailbar, setTailbar] = React.useState('');

  const isFocused = useIsFocused();

  useEffect(() => {
    if (cxt.onoshilgoo === false && isFocused) setDisableBtn(false);
  }, [isFocused]);

  useEffect(() => {
    setTailbar('');
  }, [cxt.onoshilgoo]);

  const ilgeeh = () => {
    if (onoshuud.length > 0) {
      let onosh = [];
      for (let i = 0; onoshuud.length > i; i++) {
        const e = onoshuud[i];
        const ff = e.split('?');
        const ner = ff[0].split('~');
        const valid = onosh?.find(
          item => item?.ner === ner[0] && item?.bairlal === ff[1],
        );
        if (!valid) {
          onosh.push({
            ner: ner[0],
            turul: ff[2],
            bairlal: ff[1],
            dedOnoshuud:
              ner.length > 1
                ? [
                    {
                      ner: ner[1],
                      dedOnoshuud:
                        ner.length > 2
                          ? [
                              {
                                ner: ner[2],
                                dedOnoshuud:
                                  ner.length > 3
                                    ? [
                                        {
                                          ner: ner[3],
                                          dedOnoshuud:
                                            ner.length > 4
                                              ? [
                                                  {
                                                    ner: ner[4],
                                                  },
                                                ]
                                              : [],
                                        },
                                      ]
                                    : [],
                              },
                            ]
                          : [],
                    },
                  ]
                : [],
          });
        } else {
          let a = valid.dedOnoshuud.find(item => item?.ner === ner[1]);
          if (!a) {
            valid.dedOnoshuud = [
              {
                ner: ner[1],
                dedOnoshuud: ner.length > 2 && [
                  {
                    ner: ner[2],
                    dedOnoshuud: ner.length > 3 && [
                      {
                        ner: ner[3],
                        dedOnoshuud: ner.length > 4 && [
                          {
                            ner: ner[4],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              ...valid.dedOnoshuud,
            ];
          } else {
            let b = valid.dedOnoshuud?.dedOnoshuud?.find(
              item => item?.ner === ner[2],
            );
            if (!b) {
              a.dedOnoshuud = [
                {
                  ner: ner[2],
                  dedOnoshuud: ner.length > 3 && [
                    {
                      ner: ner[3],
                      dedOnoshuud: ner.length > 4 && [
                        {
                          ner: ner[4],
                        },
                      ],
                    },
                  ],
                },
                ...a.dedOnoshuud,
              ];
            } else {
              let c = valid.dedOnoshuud?.dedOnoshuud?.find(
                item => item?.ner === ner[2],
              );
              if (!c)
                valid.dedOnoshuud.dedOnoshuud.dedOnoshuud = [
                  {
                    ner: ner[3],
                    dedOnoshuud: ner.length > 4 && [
                      {
                        ner: ner[4],
                      },
                    ],
                  },
                  ...c.dedOnoshuud,
                ];
            }
          }
        }
      }
      navigation.navigate('Оношилгоо');
      const ugugdul = {
        salbariinId: salbariinId,
        ajiltaniiId: ajiltan?._id,
        ajiltaniiNer: ajiltan?.ner,
        mashiniiDugaar: `${props?.route?.params?.mashin?.mashiniiDugaar}${props?.route?.params?.mashin?.seri}`,
        utasniiDugaar: `${props?.route?.params?.mashin?.utasniiDugaar}`,
        tailbar: tailbar,
        mashiniiZagvar: `${props?.route?.params?.mashin?.zagvar}`,
        mashiniiUildver: `${props?.route?.params?.mashin?.uildver}`,
        onosh: onosh,
      };
      uilchilgee(token)
        .post('/onoshilgoo', ugugdul)
        .then(({data}) => {
          if (data === 'Amjilttai') {
            Toast.show({
              title: 'Амжилттай илгээдлээ.',
              status: 'success',
            });
            navigation.navigate('Оношилгоо');
          } else {
            navigation.navigate('Оношилгоо');
            Toast.show({
              title: 'Алдаа гарлаа.',
              status: 'error',
            });
          }
        });
    } else {
      Toast.show({
        title: 'Оношилгоо хоосон байна.',
        status: 'warning',
      });
      navigation.navigate('Оношилгоо');
    }
    cxt.onoshilgooTuluw(true);
  };

  let onoshJags = [];
  for (let i = 0; onoshuud.length > i; i++) {
    const ff = onoshuud[i].split('?')[1];
    const valid = onoshJags?.find(item => item?.pos === ff);
    let jags = [];
    if (!valid) {
      for (let z = 0; onoshuud.length > z; z++) {
        if (onoshuud[z].split('?')[1] === ff) {
          jags.push({
            ner: onoshuud[z].split('?')[0],
          });
        }
      }
      onoshJags.push({
        pos: ff,
        list: jags,
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
                    _text={{fontSize: 8}}></Badge>
                )}
              </React.Fragment>
            }
            onPress={() => rightNavigation.toggleDrawer()}
          />
        </HStack>
      </HStack>
      <Box style={{flex: 1}}>
        <HStack px={3} mt={3} justifyContent="space-between">
          <Text style={{fontSize: 18, color: '#565656'}}>Машины дугаар:</Text>
          <Text style={{fontSize: 18, fontWeight: 'bold'}}>
            {' '}
            {params?.mashin.mashiniiDugaar} {params?.mashin.seri}
          </Text>
        </HStack>
        <HStack px={3} mt={2} justifyContent="space-between">
          <Text style={{fontSize: 18, color: '#565656'}}>Урд тэнхлэг: </Text>
          <Text style={{fontSize: 18, fontWeight: 'bold'}}>
            {params?.mashin.fAxle}
          </Text>
        </HStack>
        <HStack px={3} my={2} justifyContent="space-between">
          <Text style={{fontSize: 18, color: '#565656'}}>Хойд тэнхлэг: </Text>
          <Text style={{fontSize: 18, fontWeight: 'bold'}}>
            {params?.mashin.rAxle}
          </Text>
        </HStack>
        <Box p={3}>
          <TextArea
            bg="#fff"
            placeholder="Тайлбар"
            value={tailbar || ''}
            onChangeText={setTailbar}
          />
        </Box>
        <VStack
          p={5}
          style={{flex: 1, backgroundColor: '#fff', borderRadius: 25}}>
          <ScrollView>
            {onoshJags.map((onosh, index) => (
              <VStack key={index} mb={5}>
                <Heading>{onosh.pos}</Heading>
                {onosh.list.map((item, index) => (
                  <Text ml={3} key={index}>
                    {index + 1}. {item.ner}
                  </Text>
                ))}
              </VStack>
            ))}
          </ScrollView>
        </VStack>
        <Button
          disabled={disableBtn}
          m={3}
          colorScheme={'blue'}
          size="lg"
          onPress={() => {
            setDisableBtn(true);
            ilgeeh();
          }}>
          Илгээх
        </Button>
      </Box>
    </Box>
  );
};

export default onoshilgooHadgalah;
