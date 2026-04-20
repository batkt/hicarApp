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
  Badge,
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


const zakhialgiinDelgerengui = props => {
  const {ajiltan, token, baiguullaga} = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [temdeglel, setTemdeglel] = useState('Амжилттай');
  const [kmZaalt, setKmZaalt] = useState('0');
  const [mileZaalt, setMileZaalt] = useState('0');
  const [isLoading, setIsLoading] = useState(-1);
  const [errors, setErrors] = useState({
    km: false,
    mile: false,
  });

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const toast = useToast();

  const {_id} = props.route.params;
  const {zakhialgiinGaralt, zakhialgaMutate} = useAjiliinZadargaa(
    token,
    ajiltan?.baiguullagiinId,
    _id,
  );

  const zakhialga = useMemo(() => {
    const list = zakhialgiinGaralt?.jagsaalt || [];
    const item = list[0] || {};
    const bool = item.ajiltniiId === ajiltan._id;
    return {body: item, khariutsagchEsekh: bool};
  }, [zakhialgiinGaralt, ajiltan._id]);

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
    let uri;
    let ilgeekhUtga;
    if (t !== 'zakhialga') {
      uri = '/zakhialgaBaraaniiAjil';
      ilgeekhUtga = q;
    } else {
      uri = '/zakhialgaEkhluulye';
      ilgeekhUtga = zakhialga.body;
    }
    uilchilgee(token)
      .post(uri, ilgeekhUtga)
      .then(res => {
        if (res.data === 'Amjilttai') {
          toast.show({title: 'Амжилттай'});
          zakhialgaMutate();
          setIsLoading(-1);
        }
      })
      .catch(e => aldaaBarigch(e, toast));
  }

  function zakhialgaDuusgaya() {
    if (!!temdeglel) {
      if (
        !!baiguullaga?.tokhirgoo?.kmZaaltZaavalBurtgekh &&
        kmZaalt === '0' &&
        mileZaalt === '0'
      ) {
        setErrors({
          km: true,
          mile: true,
        });
        return null;
      }
      zakhialga.body.temdeglel = temdeglel;
      zakhialga.body.kmZaalt = kmZaalt;
      zakhialga.body.mileZaalt = mileZaalt;
      uilchilgee(token)
        .post('/zakhialgaDuusgaya', zakhialga.body)
        .then(({data}) => {
          if (data === 'Amjilttai') {
            toast.show({title: 'Амжилттай'});
            setTemdeglel('Амжилттай');
            setKmZaalt('0');
            setMileZaalt('0');
            setModalVisible(false);
            zakhialgaMutate();
          }
        })
        .catch(e => aldaaBarigch(e, toast));
    } else toast.show({title: 'Тэмдэглэл болон км заалт оруулна уу'});
  }

  return (
    <Box flex={1} bg="#f5f5fb">
      <HStack
        bg="#1877f2"
        px={2}
        py={4}
        justifyContent="space-between"
        alignItems="center"
        borderBottomRadius="20px"
        shadow={4}>
        <HStack space={2} alignItems="center">
          <IconButton
            icon={
              <Icon
                size="md"
                as={<MaterialIcons name="arrow-back" />}
                color="white"
              />
            }
            onPress={() => props.navigation.goBack()}
          />
          <Text color="white" fontSize={18} fontWeight="bold">
            Захиалга #{zakhialgiinDugaar || ''}
          </Text>
        </HStack>
      </HStack>

      <ScrollView contentContainerStyle={{paddingBottom: 80}}>
        {/* Car and Status Section */}
        <Box m={4} p={4} bg="white" borderRadius="20" shadow={2}>
          <HStack justifyContent="space-between" alignItems="center" mb={4}>
            <VStack>
              <Text color="gray.500" fontSize="xs" bold uppercase>
                Машины дугаар
              </Text>
              <Text fontSize="2xl" fontWeight="black" color="#1877f2">
                {mashiniiDugaar}
              </Text>
            </VStack>
            <Badge
              colorScheme={
                tuluv === '1'
                  ? 'danger'
                  : tuluv === '2'
                  ? 'warning'
                  : tuluv === '3'
                  ? 'success'
                  : 'gray'
              }
              rounded="full"
              px={3}
              py={1}
              _text={{fontSize: 'xs', bold: true}}>
              {tuluv === '1'
                ? 'ЭХЛЭЭГҮЙ'
                : tuluv === '2'
                ? 'ХИЙГДЭЖ БАЙНА'
                : tuluv === '3'
                ? 'ДУУССАН'
                : 'ЦУЦЛАГДСАН'}
            </Badge>
          </HStack>

          {(tuluv === '2' || tuluv === '3') && (
            <Box mb={4} p={3} bg="blue.50" borderRadius="lg">
              <Minute date={ekhelsenTsag} duusakhOgnoo={duussanTsag} />
            </Box>
          )}

          <HStack divider={<Box borderLeftWidth={1} borderColor="gray.200" mx={2} />} justifyContent="space-between">
            <VStack flex={1}>
              <Text color="gray.400" fontSize="xs">Огноо</Text>
              <Text fontSize={13} bold>{moment(ognoo).format('YYYY-MM-DD HH:mm')}</Text>
            </VStack>
            <VStack flex={1} alignItems="flex-end">
              <Text color="gray.400" fontSize="xs">Утас</Text>
              <Text fontSize={13} bold>
                {((baiguullaga.tokhirgoo?.joloochiinUtasNuukh === undefined) || !baiguullaga.tokhirgoo?.joloochiinUtasNuukh) 
                  ? khariltsagchiinUtas : 'Нууцалсан'}
              </Text>
            </VStack>
          </HStack>
        </Box>

        {/* Responsible Persons */}
        {khuvaaltssan?.length > 0 && (
          <Box px={4} mb={2}>
            <Text color="gray.500" fontSize="xs" bold mb={2} px={1}>АЖИЛТНУУД</Text>
            <HStack space={2} flexWrap="wrap">
              {khuvaaltssan.map((a, idx) => (
                <Box key={idx} px={3} py={1} bg="blue.100" borderRadius="full">
                  <Text fontSize={12} color="blue.700" bold>{a.ajiltniiNer}</Text>
                </Box>
              ))}
            </HStack>
          </Box>
        )}

        {/* Services List */}
        <Box px={4} mt={4}>
          <Text color="gray.500" fontSize="xs" bold mb={2} px={1}>ҮЙЛЧИЛГЭЭНИЙ ЖАГСААЛТ</Text>
          {zakhialguud?.map((z, idx) => (
            <Box key={z._id || idx} mb={4} bg="white" borderRadius="20" shadow={1} overflow="hidden">
              <HStack p={4} space={3} alignItems="center">
                <Avatar
                  size="md"
                  bg="blue.100"
                  source={{
                    uri: z.zurgiinNer ? `${url}/zuragAvya/${z.zurgiinNer}` : undefined,
                  }}>
                  <Text color="blue.600" bold>{z.ner ? z.ner.substring(0, 2).toUpperCase() : '??'}</Text>
                </Avatar>
                <VStack flex={1}>
                  <Text fontSize="md" bold color="gray.800">{z.ner}</Text>
                  <HStack space={2}>
                    <Text fontSize="xs" color="gray.500">{z.turul}</Text>
                    <Text fontSize="xs" color="gray.500">•</Text>
                    <Text fontSize="xs" color="blue.500" bold>{z.khugatsaa} мин</Text>
                  </HStack>
                </VStack>
                <Box bg="gray.100" px={2} py={1} borderRadius="md">
                  <Text bold fontSize="xs">{z.tooKhemjee} ш</Text>
                </Box>
              </HStack>

              {/* Sub-items/Parts if any */}
              {z?.baraanuud?.map((baraa, bIdx) => {
                const canInteract = ((zakhialga.khariutsagchEsekh && (baraa?.ajiltniiId === ajiltan._id || !baraa?.ajiltniiId)) || baraa?.ajiltniiId === ajiltan._id);
                if (!canInteract) return null;

                return (
                  <Box key={baraa._id || bIdx} bg="blue.50" m={2} mt={0} p={3} borderRadius="xl" borderLeftWidth={4} borderLeftColor="blue.400">
                    <HStack justifyContent="space-between" alignItems="center">
                      <VStack flex={1}>
                        <Text fontSize="sm" bold noOfLines={1}>{baraa.ner}</Text>
                        <Text fontSize="10" color="gray.500">Цалин: {formatter(baraa.tsalin)}₮</Text>
                      </VStack>
                      <Box flex={1} alignItems="flex-end">
                        {baraa.ajiltniiId === ajiltan._id && ajiltan._id !== zakhialga.body.ajiltniiId && (
                          baraa?.tuluv === undefined ? (
                            <Button
                              size="sm"
                              isLoading={bIdx === isLoading}
                              colorScheme="facebook"
                              onPress={() => {
                                setIsLoading(bIdx);
                                zakhialgaEkhluulye('baraa', {baraaniiId: baraa._id, tuluv: 2, zakhialgiinId: zakhialga.body._id});
                              }}>
                              Эхлүүлэх
                            </Button>
                          ) : baraa.tuluv === 2 ? (
                            <Button
                              size="sm"
                              isLoading={bIdx === isLoading}
                              colorScheme="warning"
                              onPress={() => {
                                setIsLoading(bIdx);
                                zakhialgaEkhluulye('baraa', {baraaniiId: baraa._id, tuluv: 3, zakhialgiinId: zakhialga.body._id});
                              }}>
                              Дуусгах
                            </Button>
                          ) : baraa.tuluv === 3 ? (
                            <HStack alignItems="center" space={1}>
                              <Icon as={<MaterialIcons name="check-circle" />} color="success.500" size="xs" />
                              <Text color="success.600" bold fontSize="xs">Дууссан</Text>
                            </HStack>
                          ) : null
                        )}
                      </Box>
                    </HStack>
                  </Box>
                );
              })}
            </Box>
          ))}
        </Box>
      </ScrollView>

      {/* Action Footer */}
      {zakhialga.khariutsagchEsekh && (
        <Box position="absolute" bottom={0} left={0} right={0} p={4} bg="white" shadow={9} borderTopRadius="20">
          {tuluv === '2' && (
            <Button
              size="lg"
              bg="#1877f2"
              rounded="xl"
              _text={{fontWeight: 'bold'}}
              onPress={() => setModalVisible(true)}>
              ЗАХИАЛГА ДУУСГАХ
            </Button>
          )}
          {tuluv === '1' && (
            <Button
              size="lg"
              colorScheme="secondary"
              rounded="xl"
              _text={{fontWeight: 'bold'}}
              onPress={() => zakhialgaEkhluulye('zakhialga')}>
              ЗАХИАЛГА ЭХЛҮҮЛЭХ
            </Button>
          )}
          {tuluv === '3' && (
             <Button
             isDisabled
             size="lg"
             variant="outline"
             colorScheme="success"
             rounded="xl">
             АЖИЛ ДУУССАН
           </Button>
          )}
        </Box>
      )}

      {/* Completion Modal */}
      <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)} initialFocusRef={initialRef} finalFocusRef={finalRef} size="lg">
        <Modal.Content borderRadius="20">
          <Modal.CloseButton />
          <Modal.Header _text={{bold: true}}>Ажил дуусгах баталгаажуулалт</Modal.Header>
          <Modal.Body>
            <VStack space={4}>
              <Text color="gray.500">Тэмдэглэл болон одоогийн км/миль заалтыг оруулна уу.</Text>
              
              <FormControl>
                <FormControl.Label>Тэмдэглэл</FormControl.Label>
                <Input
                  ref={initialRef}
                  defaultValue={temdeglel}
                  onChangeText={setTemdeglel}
                  placeholder="Жишээ: Амжилттай дууслаа"
                  variant="filled"
                  bg="gray.100"
                />
              </FormControl>

              <HStack space={2}>
                <FormControl flex={1} isInvalid={errors.km}>
                  <FormControl.Label>Км заалт</FormControl.Label>
                  <Input
                    keyboardType="number-pad"
                    value={kmZaalt && formatter(kmZaalt)}
                    onChangeText={v => {
                      setKmZaalt(parser(v));
                      setErrors(e => ({...e, km: false}));
                    }}
                    variant="filled"
                    bg="gray.100"
                  />
                  <FormControl.ErrorMessage>Заалт оруулна уу.</FormControl.ErrorMessage>
                </FormControl>

                <FormControl flex={1} isInvalid={errors.mile}>
                  <FormControl.Label>Миль заалт</FormControl.Label>
                  <Input
                    keyboardType="number-pad"
                    value={mileZaalt && formatter(mileZaalt)}
                    onChangeText={v => {
                      setMileZaalt(parser(v));
                      setErrors(e => ({...e, mile: false}));
                    }}
                    variant="filled"
                    bg="gray.100"
                  />
                  <FormControl.ErrorMessage>Заалт оруулна уу.</FormControl.ErrorMessage>
                </FormControl>
              </HStack>
            </VStack>
          </Modal.Body>
          <Modal.Footer bg="gray.50">
            <Button w="full" bg="#1877f2" rounded="lg" onPress={zakhialgaDuusgaya}>
              ХАДГАЛАХ
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Box>
  );
};

export default zakhialgiinDelgerengui;
