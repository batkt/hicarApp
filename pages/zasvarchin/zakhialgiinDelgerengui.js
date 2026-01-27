import React, {useMemo, useState} from 'react';
import {
  Box,
  HStack,
  Icon,
  Text,
  IconButton,
  Button,
  Avatar,
  useToast,
  Modal,
  Input,
  VStack,
  Switch,
  Center,
  ScrollView, FormControl
} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import uilchilgee, {aldaaBarigch, url} from 'lib/uilchilgee';
import {useAuth} from 'components/context/Auth';
import useAjiliinZadargaa from 'hooks/useAjiliinZadargaa';
import Minute from 'components/custom/Minute';
import {formatter, parser} from 'tools/function/inputFormatter';
import AjiltanKhavaarilakh from 'components/page/zakhialga/AjiltanKhavaarilakh';
import {useAjiltniiJagsaalt} from 'hooks/useAjiltan';
import {log} from "react-native-reanimated";

const zakhialgiinDelgerengui = props => {
  const {ajiltan, token, baiguullaga} = useAuth();
  //#region khadalakh medeelel
  const [modalVisible, setModalVisible] = useState(false);
  const [temdeglel, setTemdeglel] = useState('Амжилттай');
  const [kmZaalt, setKmZaalt] = useState('0');
  const [mileZaalt, setMileZaalt] = useState('0');
  const [isLoading, setIsLoading] = useState(-1);
  const [errors, setErrors] = useState({
    km: false,
    mile: false,
  });

  // const [ajiltKhuvaakh, setAjiltKhuvaakh] = React.useState({show: false});
  // const [songogdsonAjiltan, setSongogdsonAjiltan] = React.useState([]);
  //#endregion
  // console.log('231231', baiguullaga.tokhirgoo.kmZaaltZaavalBurtgekh);

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const initialShareRef = React.useRef(null);
  const finalShareRef = React.useRef(null);

  const toast = useToast();

  const {_id} = props.route.params;
  const {zakhialgiinGaralt, zakhialgaMutate} = useAjiliinZadargaa(
    token,
    ajiltan?.baiguullagiinId,
    _id,
  );

  /*const query = React.useMemo(() => {
    return {erkh: {$eq: 'Zasvarchin'}, _id: {$ne: ajiltan?._id}};
  }, [ajiltan]);

  const {ajilchdiinGaralt} = useAjiltniiJagsaalt(
    ajiltKhuvaakh?.ajiltanSongokhEsekh && token,
    ajiltan?.baiguullagiinId,
    query,
  );*/

  const zakhialga = useMemo(() => {
    const bool = zakhialgiinGaralt?.jagsaalt[0].ajiltniiId === ajiltan._id;
    return {body: zakhialgiinGaralt?.jagsaalt[0] || {},khariutsagchEsekh: bool};
  }, [zakhialgiinGaralt]);

  const {
    zakhialgiinDugaar,
    mashiniiDugaar,
    khariltsagchiinUtas,
    ognoo,
    zakhialguud,
    tuluv,
    ekhelsenTsag,
    duussanTsag,
    khuvaaltssan,
  } = zakhialga.body;

  function zakhialgaEkhluulye(t, q) {
      // console.log('-----qa--=-=-', q);
    let uri;
    let ilgeekhUtga;
    if(t!=="zakhialga"){
        uri = '/zakhialgaBaraaniiAjil';
        ilgeekhUtga = q
    } else {
        uri = '/zakhialgaEkhluulye';
        ilgeekhUtga = zakhialga.body;
    }
    uilchilgee(token)
      .post(uri, ilgeekhUtga)
      .then((res) => {
        // console.log('-------=-=-', res);
        if (res.data === 'Amjilttai') {
          toast.show({title: 'Амжилттай'});
          zakhialgaMutate();
          setIsLoading(-1);
        }
      })
      .catch(e => aldaaBarigch(e, toast));
  }

  /*function ajilKhuvaaya() {
    setModalVisible(false);
    onChangeShare('show', true);
  }*/

  function zakhialgaDuusgaya(duusgakhEsekh) {
    if (!duusgakhEsekh) {
      if (!!temdeglel) {
        if(!!baiguullaga?.tokhirgoo?.kmZaaltZaavalBurtgekh && kmZaalt === '0' && mileZaalt === '0'){
            setErrors({
              km: true,
              mile: true,
            });
          return null;
        }
        zakhialga.body.temdeglel = temdeglel;
        zakhialga.body.kmZaalt = kmZaalt;
        zakhialga.body.mileZaalt = mileZaalt;
        /*zakhialga.body.khuvaaltssan = songogdsonAjiltan.map(a => ({
          ajiltniiId: a?._id,
          ajiltniiNer: a?.ner,
        }));*/
        uilchilgee(token)
          .post('/zakhialgaDuusgaya', zakhialga.body)
          .then(({data}) => {
            if (data === 'Amjilttai') {
              toast.show({title: 'Амжилттай'});
              setTemdeglel('Амжилттай');
              setKmZaalt('0');
              setMileZaalt('0');
              setModalVisible(false);
              // setAjiltKhuvaakh({...{show: false}});
              // setSongogdsonAjiltan([...[]]);
              zakhialgaMutate();
            }
          });
      } else toast.show({title: 'Тэмдэглэл болон км заалт оруулна уу'});
    } /*else ajilKhuvaaya()*/
  }
  /*function onChangeShare(key, v) {
    setAjiltKhuvaakh(a => {
      a[key] = v;
      return {...a};
    });
  }*/
  return (
    <Box flex={1}>
      <HStack
        bg="#1877f2"
        px={1}
        py={3}
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
            Захиалгын дэлгэрэнгүй
          </Text>
        </HStack>
      </HStack>
      <Box flex={1} margin={2} background="white" borderRadius="10">
        {(tuluv === '2' || tuluv === '3') && (
          <Box paddingTop={2}>
            <Minute date={ekhelsenTsag} duusakhOgnoo={duussanTsag} />
          </Box>
        )}
        {khuvaaltssan?.length > 0 && (
          <Box px={4} pt={5}>
            <Box flexDirection={'row'}>
              {khuvaaltssan
                .map(a => a.ajiltniiNer)
                .map(a => (
                  <Text p={1} bg={'blue.200'} rounded={'md'} mr={2} key={a}>
                    {a}
                  </Text>
                ))}
            </Box>
          </Box>
        )}
        <Box
          flexDirection="row"
          justifyContent="space-between"
          padding={4}
          borderBottomWidth="1"
          borderColor="#ccc">
          <Box>
            <Text>{moment(ognoo).format('YYYY-MM-DD HH:MM')}</Text>
            <Text>{zakhialgiinDugaar}</Text>
          </Box>
          <Box>
            <Text>{mashiniiDugaar}</Text>
            {((baiguullaga.tokhirgoo?.joloochiinUtasNuukh === undefined) || !baiguullaga.tokhirgoo?.joloochiinUtasNuukh) &&
            <Text>{khariltsagchiinUtas}</Text>}
          </Box>
        </Box>
        <ScrollView>
          {
            zakhialguud?.map((z)=>(
                <Box
                    flexDirection="row"
                    marginBottom={2}
                    key={z._id}
                    borderBottomWidth={1}
                    borderBottomColor="#ccc">
                  <VStack margin={2}>
                    <HStack>
                      <Box width="20%" justifyContent="center">
                        <Avatar
                            source={{
                              uri: z.zurgiinNer
                                  ? `${url}/zuragAvya/${z.zurgiinNer}`
                                  : undefined,
                            }}>
                          {z.ner.substring(0, 2)}
                          <Avatar.Badge bg={'red.200'} />
                        </Avatar>
                      </Box>
                      <Box width="70%">
                        <Text fontSize={14} bold>
                          {z.ner}{' '}
                        </Text>
                        <Text>{z.turul} </Text>
                        <Text fontSize={14} color="#1877f2">
                          {z.khugatsaa} минут
                        </Text>
                      </Box>
                      <Box justifyContent="center" width="10%">
                        <Text fontSize="14" bold>
                          {z.tooKhemjee} ш
                        </Text>
                      </Box>
                    </HStack>
                    {
                      z?.baraanuud.map((baraa, index)=>(
                         ((zakhialga.khariutsagchEsekh && (baraa?.ajiltniiId === ajiltan._id || !baraa?.ajiltniiId)) || baraa?.ajiltniiId === ajiltan._id)  &&
                          <HStack
                              bg={'blue.100'}
                              p={3}
                              key={baraa._id}
                              mt={3}>
                            <Box width="50%">{/*{console.log('-------======', baraa.tuluv)}*/}
                              <HStack width="80%">
                                <Text>Бараа: </Text>
                                <Text numberOfLines={1} fontSize="14" bold>
                                  {baraa.ner}
                                </Text>
                              </HStack>
                              <HStack>
                                <Text>Цалин: </Text>
                                <Text fontSize="14" bold>
                                  {formatter(baraa.tsalin)}
                                </Text>
                              </HStack>
                            </Box>
                            <Center width="50%">
                              {baraa.ajiltniiId===ajiltan._id&&ajiltan._id!==zakhialga.body.ajiltniiId &&
                              (
                                  baraa?.tuluv === undefined ?
                                      <Button
                                          isLoading={ index === isLoading}
                                          width="100%"
                                          colorScheme="secondary"
                                          onPress={()=>{setIsLoading(index);zakhialgaEkhluulye("baraa", {baraaniiId: baraa._id, tuluv: 2, zakhialgiinId: zakhialga.body._id})}}>
                                          Эхлүүлэх
                                      </Button>
                                      :
                                      baraa.tuluv === 2 ?
                                          <Button
                                              isLoading={index === isLoading}
                                              bg="#1877f2"
                                              width="100%"
                                              _text={{color: 'white'}}
                                              onPress={()=>{setIsLoading(index);zakhialgaEkhluulye("baraa", {baraaniiId: baraa._id, tuluv: 3, zakhialgiinId: zakhialga.body._id})}}>
                                              Дуусгах
                                          </Button>
                                          : baraa.tuluv === 3 ?
                                          <Button
                                              isDisabled
                                              width="100%"
                                              colorScheme="green">
                                              Дууссан
                                          </Button> : <></>
                              )}
                            </Center>
                          </HStack>
                      ))
                    }
                  </VStack>
                  <VStack >
                  </VStack>
                </Box>
            ))
          }
        </ScrollView>
      </Box>
      <Modal
        isOpen={modalVisible}
        onClose={setModalVisible}
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Захиалга дуусгах уу?</Modal.Header>
          <Modal.Body>
            Та захиалга дуусгахдаа тэмдэглэл болон км эсвэл миль заалтаа оруулна
            уу!
            <Input
              mt={4}
              ref={initialRef}
              defaultValue={temdeglel}
              onChangeText={setTemdeglel}
              placeholder="Тэмдэглэл"
            />
            <Box flexDirection="column" mt={4}>
              <FormControl isInvalid={errors.km}>
                <Box  justifyContent="space-between" flexDirection="row" alignItems="center">
                  <FormControl.Label
                      _text={{
                        bold: true,
                      }}>
                    Км:
                  </FormControl.Label>
                  <Input
                      keyboardType="number-pad"
                      width="70%"
                      type="number"
                      value={kmZaalt && formatter(kmZaalt)}
                      onChangeText={v => setKmZaalt(parser(v))}
                      placeholder="км заалт"
                  />
                </Box>
                <FormControl.ErrorMessage
                    leftIcon={<MaterialIcons color="red" name="error-outline" />}>
                  ODO метрийн заалт оруулна уу.
                </FormControl.ErrorMessage>
              </FormControl>
              <FormControl mt={4} isInvalid={errors.mile}>
                <Box  justifyContent="space-between" flexDirection="row" alignItems="center">
                  <FormControl.Label
                      _text={{
                        bold: true,
                      }}>
                    Миль:
                  </FormControl.Label>
                  <Input
                      keyboardType="number-pad"
                      width="70%"
                      type="number"
                      value={mileZaalt && formatter(mileZaalt)}
                      onChangeText={v => setMileZaalt(parser(v))}
                      placeholder="миль заалт"
                  />
                </Box>
                <FormControl.ErrorMessage
                    leftIcon={<MaterialIcons color="red" name="error-outline" />}>
                  ODO метрийн заалт оруулна уу.
                </FormControl.ErrorMessage>
              </FormControl>
            </Box>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group variant="ghost" space={2}>
              <Button bg={'#1877f2'} colorScheme={'blue'} _text={{color: 'white'}}
                onPress={() =>
                  zakhialgaDuusgaya(
                    /*baiguullaga?.tokhirgoo?.ajilKhuvaakhEsekh || */false,
                  )
                }>
                Хадгалах
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      {/*<Modal
        isOpen={ajiltKhuvaakh?.show}
        onClose={() => onChangeShare('show', false)}
        initialFocusRef={initialShareRef}
        finalFocusRef={finalShareRef}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Ажил бусадтай хуваах уу?</Modal.Header>
          <Modal.Body>
            <Box
              flexDirection="row"
              justifyContent={'space-between'}
              alignItems="center"
              px={2}>
              <Text>Ажил бусадтай хуваах уу?</Text>
              <Switch
                size="lg"
                offTrackColor="blue.100"
                onTrackColor="blue.200"
                onThumbColor="blue.500"
                offThumbColor="blue.50"
                isChecked={ajiltKhuvaakh?.ajiltanSongokhEsekh}
                onChange={() =>
                  onChangeShare(
                    'ajiltanSongokhEsekh',
                    !ajiltKhuvaakh?.ajiltanSongokhEsekh,
                  )
                }
              />
            </Box>
          </Modal.Body>
          <Modal.Body>
            {ajiltKhuvaakh?.ajiltanSongokhEsekh && (
              <AjiltanKhavaarilakh
                token={token}
                ajiltan={ajiltan}
                value={songogdsonAjiltan}
                ajilchdiinGaralt={ajilchdiinGaralt}
                onChange={setSongogdsonAjiltan}
              />
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button.Group variant="ghost" space={2}>
              <Button onPress={() => zakhialgaDuusgaya(false)}>Хадгалах</Button>
              <Button
                onPress={() => onChangeShare('show', false)}
                colorScheme="secondary">
                Хаах
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>*/}
      {
        zakhialga.khariutsagchEsekh &&
        <HStack
            alignItems="center"
            justifyContent="center"
            marginX={2}
            marginBottom={2}>
          {tuluv === '2' && (
              <Button
                  bg="#1877f2"
                  width="100%"
                  _text={{color: 'white'}}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}>
                Дуусгах
              </Button>
          )}
          {tuluv === '1' && (
              <Button
                  width="100%"
                  colorScheme="secondary"
                  rounded="none"
                  onPress={()=>{zakhialgaEkhluulye("zakhialga")}}>
                Эхлүүлэх
              </Button>
          )}
        </HStack>
      }
    </Box>
  );
};

export default zakhialgiinDelgerengui;
