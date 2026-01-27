import React, {useEffect, useState} from 'react';
import {Keyboard} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  Actionsheet,
  AlertDialog,
  Box,
  Button,
  Divider,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  Pressable,
  ScrollView,
  Text,
  TextArea,
  useToast,
  Spinner
} from 'native-base';
import {useAjiltniiJagsaalt} from 'hooks/useAjiltan';
import {useAuth} from 'components/context/Auth';
import uilchilgee, {aldaaBarigch, url} from 'lib/uilchilgee';
import {rightNavigation} from 'components/layout/LeftDrawer';
import * as ImagePicker from 'react-native-image-picker';
import {PermissionsAndroid, Platform} from 'react-native';
import moment from 'moment';
import _ from 'lodash';
import Recorder from 'components/recoreder';
import useSetgegdel from 'hooks/useSetgegdel';
import {useIsFocused} from '@react-navigation/native';

const createFormData = (file, body = {}) => {
  const data = new FormData();

  data.append('file', {
    name: file.fileName,
    type: file.type,
    uri: Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri,
  });

  Object.keys(body).forEach(key => {
    data.append(key, body[key]);
  });
  // console.log('data', data);
  return data;
};

export default function DaalgavarBurtgekh({title, params, ...props}) {
  const {medeelel} = props.route.params || {};
  const {token, ajiltan, baiguullaga} = useAuth();
  const {ajilchdiinGaralt} = useAjiltniiJagsaalt(
    token,
    ajiltan.baiguullagiinId,
  );
  const [daalgavar, setDaalgavar] = React.useState({});
  const [keyboardStatus, setKeyboardStatus] = React.useState(undefined);
  const [showSheet, setShowSheet] = React.useState(false);
  const [showImageSheet, setShowImageSheet] = React.useState(false);
  const [pickerResponse, setPickerResponse] = React.useState();
  const [voiceUri, setVoiceUri] = React.useState(null);
  const [disableBtn, setDisableBtn] = useState(false);

  const query = React.useMemo(() => {
    return {
      daalgavriinId: medeelel?._id,
    };
  }, [medeelel]);

  // console.log('----baiguullaga-------', baiguullaga.tokhirgoo);

  const order = React.useMemo(() => {
    return {createdAt: -1};
  }, []);

  const setgegdel = useSetgegdel(medeelel && token, token, query, order);

  const [isOpen, setIsOpen] = React.useState(false);

  const onClose = () => setIsOpen(false);

  const cancelRef = React.useRef(null);

  const toast = useToast();

  React.useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardStatus('shown');
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardStatus('hidden');
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const isFocused = useIsFocused();

  const refRecorder = React.useRef(null);

  useEffect(() => {
    if (isFocused) {
      setDisableBtn(false);
    }

  }, [isFocused]);

  const ognooniiJagsaalt = React.useMemo(() => {
    var jagsaalt = new Array(30)
      .fill('')
      .map((mur, index) => moment(medeelel?.duusakhOgnoo).add(index, 'day'));
    return jagsaalt;
  }, [medeelel?.duusakhOgnoo]);

  React.useEffect(() => {
    // console.log('--------------', `${url}/fileAvya/${ajiltan.baiguullagiinId}/${medeelel?.file[0]}`);
/*
    if (medeelel?.file?.length > 0) {
      setVoiceUri(
        `${url}/fileAvya/${ajiltan.baiguullagiinId}/${medeelel.file[0]}`,
      );
    }
*/
    if (medeelel?.zurguud?.length > 0) {
      setPickerResponse({
        ...{},
        assets: medeelel?.zurguud.map(a => ({
          uri: `${url}/zuragAvya/jpg/${ajiltan.baiguullagiinId}/${a}`,
        })),
      });
    }
    setDaalgavar({...medeelel});
  }, [medeelel]);

  function onChange(k, v) {
    setDaalgavar(d => ({...d, [k]: v}));
  }

  function goBack() {
    setDaalgavar({});
    setPickerResponse({});
    props.navigation.navigate('daalgavar');
  }

  async function khadgalya() {
    setDisableBtn(true);
    if (!daalgavar.ajiltniiId) {
      toast.show({
        title: 'Анхаар',
        description: 'Ажилтан сонгоно уу!',
        status: 'warning',
        placement: 'top',
      });
      setDisableBtn(false);
      return;
    }
    if (!daalgavar.tailbar && !voiceUri && !(!!pickerResponse?.assets && pickerResponse?.assets.length > 0)) {
      toast.show({
        title: 'Анхаар',
        description: 'Даалгавар бичнэ үү!',
        status: 'warning',
        placement: 'top',
      });
      setDisableBtn(false);
      return;
    }
    if (!daalgavar.duusakhOgnoo) {
      toast.show({
        title: 'Анхаар',
        description: 'Гүйцэтгэж дуусгах огноо сонгоно уу!',
        status: 'warning',
        placement: 'top',
      });
      setDisableBtn(false);
      return;
    }
    if (!!voiceUri) {
      _.set(daalgavar, 'file', []);
      const formdata = createFormData({
        fileName: `${ajiltan._id}${moment().format('YYYY-MM-DD_HH:mm:ss')}.mp4`,
        type: 'video/mp4',
        uri: voiceUri,
      });
      // console.log('formdata', formdata);
      const result = await uilchilgee(token)
        .post('/fileKhadgalya', formdata, {
          headers: {'Content-Type': 'multipart/form-data'},
        })
        .then(({data}) => data)
        .catch(e => aldaaBarigch(e, toast));
      // console.log('result', result, voiceUri);
      if (!!result?.id) daalgavar.file.push(result.id);
    }
    if (!!pickerResponse?.assets && pickerResponse?.assets.length > 0) {
      _.set(daalgavar, 'zurguud', []);
      for await (const variable of pickerResponse?.assets) {
        const formdata = createFormData(
          {
            fileName: variable.fileName,
            type: variable.type,
            uri: variable.uri,
          },
          {turul: 'jpg'},
        );
        const result = await uilchilgee(token)
          .post('/zuragKhadgalya', formdata, {
            headers: {'Content-Type': 'multipart/form-data'},
          })
          .then(({data}) => data)
          .catch(e => aldaaBarigch(e, toast));
        if (!!result?.id) daalgavar.zurguud.push(result.id);
      }
    }
    uilchilgee(token)
      .post('/daalgavarOruulya', daalgavar)
      .then(({data}) => {
        if (data === 'Amjilttai') {
          toast.show({
            title: 'Амжилттай',
            description: 'Илгээлээ',
            status: 'success',
            placement: 'top',
          });
          refRecorder.current?.clearAllData();
          setVoiceUri(null);
          goBack();
        }
      })
      .catch(e => aldaaBarigch(e, toast));
  }

  function onImagePicked(e) {
    setPickerResponse(e);
    setShowImageSheet(false);
  }

  const onImageLibraryPress = React.useCallback(() => {
    const options = {
      selectionLimit: 3,
      mediaType: 'photo',
      includeBase64: false,
    };
    ImagePicker.launchImageLibrary(options, onImagePicked);
  }, []);

  const onCameraPress = React.useCallback(async () => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
        ]);

        if (
          grants['android.permission.CAMERA'] ===
          PermissionsAndroid.RESULTS.GRANTED
        ) {
          // console.log('permissions granted');
        } else {
          // console.log('All required permissions not granted');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }
    const options = {
      saveToPhotos: true,
      mediaType: 'photo',
      includeBase64: false,
    };
    ImagePicker.launchCamera(options, onImagePicked);
  }, []);

  function daalgavarTsutsalya() {
    uilchilgee(token)
      .post('/daalgavarTsutsalya', {id: medeelel._id})
      .then(({data}) => {
        if (data === 'Amjilttai') {
          onClose();
          goBack();
        }
      })
      .catch(e => aldaaBarigch(e, toast));
  }

  return (
    <Box bg="white" safeArea style={{flex: 1}}>
      <HStack flexDirection="column" alignItems="center">
        <Box alignItems="center" flexDirection="row" w="full" p={2}>
          <IconButton
            colorScheme="blue"
            icon={
              <Icon
                size="lg"
                as={<MaterialIcons name="keyboard-arrow-left" />}
              />
            }
            onPress={() => goBack()}
          />
          <Text color="gray.600" bold textAlign={'center'} w={'5/6'}>
            Даалгавар бүртгэх
          </Text>
        </Box>
        {medeelel && (
          <Box pr={4} flexDirection="row" alignItems={'center'}>
            <Text fontSize={'2xl'} pr="5">
              Дуусах огноо
            </Text>
            <Pressable
              bg="#1877f2"
              flexDirection="column"
              rounded={'2xl'}
              alignItems="center"
              justifyContent="center"
              _pressed={{bg: "#1877f2"}}
              w="16"
              h="16">
              <Text bold color={'white'} fontSize={'lg'}>
                {moment(medeelel.duusakhOgnoo).format('DD')}
              </Text>
              <Text bold fontSize={'xs'} color={'gray.200'}>
                {moment(medeelel.duusakhOgnoo).format('MM')} сар
              </Text>
            </Pressable>
          </Box>
        )}
        {keyboardStatus !== 'shown' && !medeelel && (
          <ScrollView horizontal={true} flexDirection="row" w="full" p={4}>
            {ognooniiJagsaalt.map(udur => {
              const isSelected =
                daalgavar.duusakhOgnoo &&
                moment(udur).format('YYYY-MM-DD') ===
                  moment(daalgavar.duusakhOgnoo).format('YYYY-MM-DD');
              return (
                <Box key={`${moment(udur).format('YYYY-MM-DD')}-udur`} pr={4}>
                  <Pressable
                    alignItems="center"
                    justifyContent="center"
                    bg={isSelected ? "#1877f2" : 'gray.100'}
                    flexDirection="column"
                    rounded={'2xl'}
                    _pressed={{bg: "#1877f2"}}
                    onPress={() => !medeelel && onChange('duusakhOgnoo', udur)}
                    w="16"
                    h="16">
                    <Text
                      bold
                      color={isSelected ? 'white' : 'gray.600'}
                      fontSize={'lg'}>
                      {moment(udur).format('DD')}
                    </Text>
                    <Text
                      bold
                      fontSize={'xs'}
                      color={isSelected ? 'gray.200' : 'gray.600'}>
                      {moment(udur).format('MM')} сар
                    </Text>
                  </Pressable>
                </Box>
              );
            })}
          </ScrollView>
        )}
      </HStack>
      <ScrollView p={5}>
        <Box bg="white" pb={5}>
          {!medeelel && (
            <Box>
              <Text fontSize={'lg'} bold color={'gray.500'}>
                Ажилтан сонгоно уу
              </Text>
            </Box>
          )}
          <Box pt={5}>
            <Pressable
              p={5}
              bg="gray.100"
              rounded={'xl'}
              flexDirection="row"
              _pressed={{bg: 'gray.200'}}
              onPress={() => !medeelel && setShowSheet(true)}
              alignItems={'center'}>
              <Icon size="md" as={<MaterialIcons name="person" />} />
              <Box px="5">
                <Text bold fontSize={'sm'} color="gray.600">
                  Ажилтан
                  {daalgavar?.ajiltniiNer ? `: ${daalgavar?.ajiltniiNer}` : ''}
                </Text>
                <Text fontSize={'xs'} color="gray.500">
                  Та ажилтангаа сонгоно уу
                </Text>
              </Box>
              <Icon
                ml="auto"
                size="md"
                as={<MaterialIcons name="keyboard-arrow-right" />}
              />
            </Pressable>
          </Box>
          <Box pt={5}>
            <Pressable
              p={5}
              bg="gray.100"
              rounded={'xl'}
              flexDirection="row"
              _pressed={{bg: 'gray.200'}}
              onPress={() => !medeelel && setShowImageSheet(true)}
              alignItems={'center'}>
              <Icon size="md" as={<MaterialIcons name="image" />} />
              <Box px="5">
                {!!pickerResponse?.assets ? (
                  <Box flexDirection={'row'}>
                    {pickerResponse?.assets.map(({uri}, i) => (
                      <Box key={`${i}-zurag`} pr="5">
                        <Image
                          alt={`${i}-zurag`}
                          source={{uri}}
                          w={!medeelel ? '10' : '20'}
                          h={!medeelel ? '10' : '20'}
                        />
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Box>
                    <Text bold fontSize={'sm'} color="gray.600">
                      Зураг
                    </Text>
                    <Text fontSize={'xs'} color="gray.500">
                      Та зураг сонгоно уу
                    </Text>
                  </Box>
                )}
              </Box>
              <Icon
                ml="auto"
                size="md"
                as={<MaterialIcons name="keyboard-arrow-right" />}
              />
            </Pressable>
          </Box>
          <Box pt={5}>
            <Recorder
                ref={refRecorder}
                onChange={setVoiceUri}
                externalUrl={voiceUri}
                turul={"burtgeh"}
            />
          </Box>
        </Box>
        {!medeelel && (
          <Box pb={10}>
            <TextArea
              placeholder="Даалгавар"
              value={daalgavar?.tailbar || ''}
              onChangeText={v => onChange('tailbar', v)}
            />
          </Box>
        )}
        {medeelel?.tailbar && (
          <Box p={5} borderWidth={1} borderColor={'gray.200'}>
            <Text>{medeelel?.tailbar}</Text>
          </Box>
        )}
        {setgegdel?.jagsaalt.length > 0 && (
          <Box>
            <Text fontSize={'xl'}>Сэтгэгдэл</Text>
          </Box>
        )}
        <Box pb={10}>
          {setgegdel?.jagsaalt?.map(mur => (
            <React.Fragment key={mur._id}>
              <Box bg="emerald.50" p={2}>
                <Text>{mur.message}</Text>
              </Box>
              <Divider />
            </React.Fragment>
          ))}
        </Box>
      </ScrollView>
      <Box p={5}>
        <Button
            p={2}
            rounded="2xl"
            bg="#1877f2"
            disabled={disableBtn}
            _pressed={{bg: 'blue.600'}}
            onPress={khadgalya}>
          {
            disableBtn ?
                <Spinner size="lg" color="cyan.200" />
                :
                <Text fontSize={'2xl'} color="white">
                  Хадгалах
                </Text>
          }
        </Button>
      </Box>
      <Actionsheet
        isOpen={showImageSheet}
        onClose={() => setShowImageSheet(false)}>
        <Actionsheet.Content>
          <Box flexDirection={'row'} w="full" justifyContent="space-around">
            <Pressable onPress={onImageLibraryPress} alignItems="center">
              <Icon size="md" as={<MaterialIcons name="image" />} />
              <Text>Library</Text>
            </Pressable>
            <Pressable onPress={onCameraPress} alignItems="center">
              <Icon size="md" as={<MaterialIcons name="camera" />} />
              <Text>Camera</Text>
            </Pressable>
          </Box>
        </Actionsheet.Content>
      </Actionsheet>
      <Actionsheet isOpen={showSheet} onClose={() => setShowSheet(false)}>
        <Actionsheet.Content
          h={keyboardStatus !== 'shown' ? undefined : 'full'}>
          <Box w="full" p={2}>
            <Text>Ажилтан сонгоно уу!</Text>
            {/*<Input
              onChangeText={onSearch}
              InputRightElement={
                <IconButton
                  colorScheme="green"
                  icon={
                    <Icon
                      size="sm"
                      as={<MaterialIcons name="search" />}
                      color="#1877f2"
                    />
                  }
                />
              }
            />*/}
          </Box>
          <ScrollView w="full">
            {ajilchdiinGaralt?.jagsaalt?.map(mur => (
                mur.albanTushaal !== 'Захирал' &&
                <Actionsheet.Item
                    key={mur._id}
                    bg={
                      mur._id === daalgavar.ajiltniiId ? 'blue.300' : undefined
                    }
                    onPress={() => {
                      setDaalgavar(d => ({
                        ...d,
                        ajiltniiId: mur._id,
                        ajiltniiNer: mur.ner,
                      }));
                      setShowSheet(false);
                    }}>
                  {mur.ner}
                </Actionsheet.Item>
            ))}
          </ScrollView>
        </Actionsheet.Content>
      </Actionsheet>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        onClose={onClose}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>Даалагвар устгах</AlertDialog.Header>
          <AlertDialog.Body>
            {`Та ${medeelel?.dugaar} дугаартай даалгавар устгахдаа итгэлтэй байна уу`}
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
              <Button colorScheme="danger" onPress={daalgavarTsutsalya}>
                Тийм
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </Box>
  );
}
