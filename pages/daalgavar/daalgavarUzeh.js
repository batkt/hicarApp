import React, {useMemo, useState, useEffect} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
    Box,
    HStack,
    Icon,
    IconButton,
    Image,
    Modal,
    Pressable,
    ScrollView,
    Text,
    useToast,
} from 'native-base';
import moment from 'moment';
import {url} from "../../lib/uilchilgee";
import {useAuth} from "../../components/context/Auth";
import uilchilgee, {aldaaBarigch} from 'lib/uilchilgee';
import Recorder from 'components/recoreder';
import useDaalgavar from "../../hooks/useDaalgavar";
import {useIsFocused} from '@react-navigation/native';


export default function DaalgavarUzeh({title, params, ...props}) {
    const {medeelel, haanaas} = props.route.params || {};

    const [show, setShow] = useState(false);
    const [zuragUri, setZuragUri] = useState('');
    const [voiceUri, setVoiceUri] = useState(null);
    const {token, ajiltan, baiguullaga} = useAuth();
    const toast = useToast();
    let tuluv = medeelel?.tuluv;

    const isFocused = useIsFocused();
    useEffect(() => {
        if (medeelel?.file?.length > 0)
            setVoiceUri(
                `${url}/fileAvya/${ajiltan.baiguullagiinId}/${medeelel.file[0]}`,
            );
        else setVoiceUri(null);
    }, [medeelel]);

    const query = useMemo(() => {
        return {"_id": medeelel._id};
    }, [medeelel, isFocused]);

    if(haanaas === 'notification'){
        const {jagsaalt} =  useDaalgavar(token, baiguullaga._id, query);
        tuluv = jagsaalt[0]?.tuluv;
    }

    const refRecorder = React.useRef(null);

    function daalgavarIlgeeh() {
        const daalgavarUrl = tuluv === 0 ? '/daalgavarKhuleejAvlaa' : '/daalgavarDuusgalaa';
        uilchilgee(token)
            .post(daalgavarUrl, {id: medeelel?._id})
            .then(({data}) => {
                if (data === 'Amjilttai') {
                    toast.show({
                        title: 'Амжилттай',
                        description: tuluv === 0 ? 'Хүлээж авлаа':'Дуусгалаа',
                        status: 'success',
                        placement: 'top',
                    });
                }
            })
            .catch(e => aldaaBarigch(e, toast));
        props.navigation.goBack()
    }

    function daalgavarTsutsalya() {
        uilchilgee(token)
            .post('/daalgavarTsutsalya', {id: medeelel?._id})
            .then(({data}) => {
                if (data === 'Amjilttai') {
                    toast.show({
                        title: 'Амжилттай',
                        description: 'Цуцаллаа',
                        status: 'success',
                        placement: 'top',
                    });
                    props.navigation.goBack()
                }
            })
            .catch(e => aldaaBarigch(e, toast));
    }

    return (
        <Box bg="white" safeArea style={{flex: 1}}>
            <HStack h={120} flexDirection="column" alignItems="center">
                <Box alignItems="center" flexDirection="row" w="full" p={2}>
                    <IconButton
                        colorScheme="blue"
                        icon={
                            <Icon
                                size="lg"
                                as={<MaterialIcons name="keyboard-arrow-left" />}
                            />
                        }
                        onPress={() => {
                            refRecorder.current?.clearAllData();
                            props.navigation.goBack()}/*navigate('Даалгавар')*/}
                    />
                    <Text color="gray.600" bold textAlign={'center'} w={'5/6'}>
                        Даалгавар үзэх
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
            </HStack>
            <ScrollView p={5}>
                <Box bg="white" pb={5}>
                    <HStack justifyContent="space-between">
                        <Text bold fontSize={'sm'}>
                            Үүсгэсэн:
                        </Text>
                        <Text bold fontSize={'sm'} color="light">
                            {medeelel?.uusgesenAjiltniiNer ? ` ${medeelel?.uusgesenAjiltniiNer}` : ''}
                        </Text>
                    </HStack>
                    <HStack pt={2} justifyContent="space-between">
                        <Text bold fontSize={'sm'}>
                            Ажилтан:
                        </Text>
                        <Text bold fontSize={'sm'} color="light">
                            {medeelel?.ajiltniiNer ? ` ${medeelel?.ajiltniiNer}` : ''}
                        </Text>
                    </HStack>
                    {medeelel?.zurguud?.length > 0  && (
                        <Box py="5" flexDirection={'row'}>
                            {medeelel?.zurguud?.map((zurag, i) => (
                                <Pressable
                                    onPress={() => {
                                        setZuragUri(`${url}/zuragAvya/jpg/${medeelel.baiguullagiinId}/${zurag}`);
                                        setShow(true);
                                        // console.log('32432',zuragUri)
                                    }}
                                    key={zurag}
                                >
                                    <Box key={`${i}-zurag`} pr="5">
                                        <Image
                                            alt={`${i}-zurag`}
                                            source={{uri:`${url}/zuragAvya/jpg/${medeelel.baiguullagiinId}/${zurag}`}}
                                            w={20}
                                            h={20}
                                        />
                                    </Box>
                                </Pressable>
                            ))}
                            <Modal
                                size="lg"
                                isOpen={show}
                                onClose={() => setShow(false)}>
                                <Modal.Content>
                                    <Modal.CloseButton />
                                    <Image
                                        alt={`${zuragUri}-zurag`}
                                        source={{uri: zuragUri}}
                                        w="100%"
                                        h="100%"
                                    />
                                </Modal.Content>
                            </Modal>
                        </Box>
                    )}
                    {voiceUri &&
                    <Box pt={5}>
                        <Recorder
                            ref={refRecorder}
                            // onChange={setVoiceUri}
                            externalUrl={voiceUri}
                            turul={"sonsoh"}
                        />
                    </Box>
                    }
                </Box>
                <Box py={2}>
                    <Text bold fontSize={'sm'} color="gray.600">
                        Тайлбар:
                    </Text>
                </Box>
                {medeelel?.tailbar && (
                    <Box p={3} borderWidth={1} borderColor={'gray.200'}>
                        <Text>{medeelel?.tailbar}</Text>
                    </Box>
                )}
                {/*{setgegdel?.jagsaalt.length > 0 && (
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
        </Box>*/}
            </ScrollView>
            <Box p={3} style={{display: tuluv===2 ? 'none' : 'flex'}}>
                {
                    ajiltan.albanTushaal !== "Захирал" ?
                        <Pressable
                            p={3}
                            alignItems="center"
                            borderRadius={5}
                            shadow={'4'}
                            bg={tuluv===0 ? "error.400" : "teal.400"}
                            onPress={() => {
                                daalgavarIlgeeh();
                            }}>
                            <Text color="white" fontSize={'lg'}>
                                {tuluv===0 ? 'Даалгавар хүлээж авах' : 'Даалгавар дуусгах'}
                            </Text>
                        </Pressable>
                        :
                        <Pressable
                            p={3}
                            alignItems="center"
                            borderRadius={5}
                            shadow={'4'}
                            bg={"error.400"}
                            onPress={() => {
                                daalgavarTsutsalya();
                            }}>
                            <Text color="white" fontSize={'lg'}>
                                Даалгавар цуцлах
                            </Text>
                        </Pressable>
                }
            </Box>
        </Box>
    );
}
