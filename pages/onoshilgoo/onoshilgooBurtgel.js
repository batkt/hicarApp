import React, {useMemo, useState, useEffect} from 'react';
import {
  Box,
  HStack,
  Icon,
  Text,
  IconButton,
  Badge,
  FormControl,
  Input,
  Button,
  Select,
  VStack,
  Popover,
  Pressable,
  AlertDialog,
  KeyboardAvoidingView,
} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useAuth} from 'components/context/Auth';
import {useLogic} from 'components/context/Logic';
import {rightNavigation} from 'components/layout/LeftDrawer';
import NetInfo from '@react-native-community/netinfo';
import {Keyboard, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import uilchilgee from '../../lib/uilchilgee';
import useMashiniiSegment from 'hooks/useMashiniiSegment';
import {Dropdown} from 'react-native-searchable-dropdown-kj';

NetInfo.configure({shouldFetchWiFiSSID: true});
const usguud = [
  'А',
  'Б',
  'В',
  'Г',
  'Д',
  'Е',
  'Ё',
  'Ж',
  'З',
  'И',
  'Й',
  'К',
  'Л',
  'М',
  'Н',
  'О',
  'Ө',
  'П',
  'Р',
  'С',
  'Т',
  'У',
  'Ү',
  'Ф',
  'Х',
  'Ц',
  'Ч',
  'Ш',
  'Щ',
  'Ъ',
  'Ь',
  'Ы',
  'Э',
  'Ю',
  'Я',
];
const styles = StyleSheet.create({
  dropdown: {
    padding: 10,
    height: 46,
    borderColor: '#ABB2B9',
    borderWidth: 1,
    borderRadius: 5,
  },
  placeholderStyle: {
    fontSize: 12,
    color: '#ABB2B9',
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  inputSearchStyle: {
    height: 40,
    color: '#ABB2B9',
    fontSize: 16,
  },
});
const onoshilgooBurtgel = props => {
  const {sonorduulga, token, baiguullaga} = useAuth();

  const [isAlert, setIsAlert] = React.useState(false);
  const [form, setForm] = useState({seri: 'УБА', utasniiDugaar: null});
  const [errors, setErrors] = useState({
    rAxle: false,
    fAxle: false,
    mashiniiDugaar: false,
  });
  const [seri, setSeri] = useState(['У', 'Б', 'А']);
  const {mashiniiSegmentGaralt} = useMashiniiSegment(token);
  const [uildver, setUildver] = useState([]);
  const navigation = useNavigation();
  const cxt = useLogic();

  useEffect(() => {
    setErrors({rAxle: false, fAxle: false, mashiniiDugaar: false});
    setSeri(['У', 'Б', 'А']);
    setForm({seri: 'УБА', utasniiDugaar: ''});
    setUildver([]);
  }, [cxt.onoshilgoo]);

  const butsah = () => {
    cxt.onoshilgooTuluw(true);
    setIsAlert(false);
    props.navigation.goBack();
  };
  function Huvugch(p) {
    const [isOpen, setIsOpen] = useState(false);
    const serIndex = p.i;

    return (
      <Box alignItems="center">
        <Popover
          trigger={triggerProps => {
            return (
              <Button
                mr={1}
                variant="outline"
                {...triggerProps}
                colorScheme="light"
                onPress={() => {
                  Keyboard.dismiss();
                  setIsOpen(true);
                }}>
                {seri[p.i]}
              </Button>
            );
          }}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}>
          <Popover.Content accessibilityLabel="A" style={{top: 30, width: 275}}>
            <Popover.Arrow style={{top: 33}} />
            <Popover.CloseButton />
            <Popover.Body style={{paddingTop: 50}}>
              <HStack style={{flexWrap: 'wrap'}}>
                {usguud.map((a, index) => {
                  return (
                    <Pressable
                      key={index}
                      onPress={() => {
                        let s = seri;
                        s[serIndex] = a;
                        setSeri(s);
                        setForm({...form, seri: `${s[0]}${s[1]}${s[2]}`});
                        setIsOpen(false);
                      }}
                      style={{
                        height: 45,
                        width: 45,
                        padding: 5,
                        margin: 2,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 5,
                        borderWidth: 1,
                        borderColor: '#ccc',
                        backgroundColor: '#eee',
                      }}>
                      <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                        {a}
                      </Text>
                    </Pressable>
                  );
                })}
              </HStack>
            </Popover.Body>
          </Popover.Content>
        </Popover>
      </Box>
    );
  }
  const queryData = useMemo(() => {
    return {
      ownerHandphone: form.utasniiDugaar ? form.utasniiDugaar : '',
      plateNumber: `${form?.mashiniiDugaar}${form?.seri}`,
      rAxle: form?.rAxle,
      fAxle: form?.fAxle,
    };
  }, [form]);

  const validate = () => {
    return !(
      form.rAxle === undefined ||
      form.fAxle === undefined ||
      form.zagvar === undefined ||
      form.uildver === undefined ||
      form.mashiniiDugaar?.length !== 4 ||
      (form.utasniiDugaar?.length !== 8 && form.utasniiDugaar?.length)
    );
  };
  const urgeljluuleh = () => {
    if (validate()) {
      uilchilgee(token).post('/mashin', queryData).then();
      navigation.navigate('Onosh', form);
    } else {
      setErrors({
        rAxle: form.rAxle === undefined,
        fAxle: form.fAxle === undefined,
        zagvar: form.zagvar === undefined,
        uildver: form.uildver === undefined,
        mashiniiDugaar: form.mashiniiDugaar?.length !== 4,
        utasniiDugaar:
          form.utasniiDugaar?.length !== 8 && form.utasniiDugaar?.length,
      });
    }
  };
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
            onPress={() => {
              form.rAxle !== undefined ||
              form.fAxle !== undefined ||
              form.utasniiDugaar > 0 ||
              form.mashiniiDugaar?.length > 0 ||
              form.zagvar !== undefined ||
              form.uildver !== undefined
                ? setIsAlert(true)
                : props.navigation.goBack();
            }}
          />
          <Text color="white" fontSize={16} fontWeight="bold">
            Автомашин бүртгэл
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
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <VStack
          px={3}
          pt={5}
          style={{flex: 1, justifyContent: 'space-between'}}>
          <Box>
            {(baiguullaga.tokhirgoo?.joloochiinUtasNuukh === undefined ||
              !baiguullaga.tokhirgoo?.joloochiinUtasNuukh) && (
              <FormControl isInvalid={errors.utasniiDugaar}>
                <FormControl.Label
                  _text={{
                    bold: true,
                  }}>
                  Утасны дугаар
                </FormControl.Label>
                <Input
                  keyboardType="number-pad"
                  maxLength={8}
                  colorScheme="secondary"
                  placeholder="Дугаар"
                  value={form.utasniiDugaar ? form.utasniiDugaar : ''}
                  onChangeText={value =>
                    setForm({...form, utasniiDugaar: value})
                  }
                />
                <FormControl.ErrorMessage
                  leftIcon={<MaterialIcons color="red" name="error-outline" />}>
                  Утасны дугаар 8-с багагүй оронтой байх.
                </FormControl.ErrorMessage>
              </FormControl>
            )}
            <FormControl isRequired isInvalid={errors.mashiniiDugaar}>
              <FormControl.Label
                _text={{
                  bold: true,
                }}>
                Улсын бүртгэлийн дугаар
              </FormControl.Label>
              <HStack>
                <Input
                  keyboardType="number-pad"
                  maxLength={4}
                  width={'65%'}
                  mr={1}
                  colorScheme="secondary"
                  placeholder="Дугаар"
                  value={form.mashiniiDugaar ? form.mashiniiDugaar : ''}
                  onChangeText={value =>
                    setForm({...form, mashiniiDugaar: value})
                  }
                />
                <HStack alignItems={'center'}>
                  <Huvugch
                    i={0}
                    form={{...form}}
                    setSeri={setSeri}
                    seri={seri}
                    setForm={setForm}
                  />
                  <Huvugch
                    i={1}
                    form={{...form}}
                    setSeri={setSeri}
                    seri={seri}
                    setForm={setForm}
                  />
                  <Huvugch
                    i={2}
                    form={{...form}}
                    setSeri={setSeri}
                    seri={seri}
                    setForm={setForm}
                  />
                </HStack>
              </HStack>
              <FormControl.ErrorMessage
                leftIcon={<MaterialIcons color="red" name="error-outline" />}>
                Улсын бүртгэлийн дугаараа оруулна уу. /4-с багагүй оронтой байх/
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl mt={5} isRequired isInvalid={errors.fAxle}>
              <FormControl.Label>Урд тэнхлэг</FormControl.Label>
              <Select
                minWidth="200"
                accessibilityLabel="Урд тэнхлэг"
                placeholder="Тэнхлэг сонгоно уу"
                mt="1"
                selectedValue={form.fAxle ? form.fAxle : ''}
                onValueChange={value => setForm({...form, fAxle: value})}>
                <Select.Item label="Гартай" value="Гартай" />
                <Select.Item label="Чулактай" value="Чулактай" />
              </Select>
              <FormControl.ErrorMessage
                leftIcon={<MaterialIcons color="red" name="error-outline" />}>
                Урд тэнхлэг сонгоно уу!
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={errors.rAxle}>
              <FormControl.Label isRequired>Хойд тэнхлэг</FormControl.Label>
              <Select
                minWidth="200"
                accessibilityLabel="Хойд тэнхлэг"
                placeholder="Тэнхлэг сонгоно уу"
                mt="1"
                selectedValue={form.rAxle ? form.rAxle : ''}
                onValueChange={value => setForm({...form, rAxle: value})}>
                <Select.Item label="Гартай" value="Гартай" />
                <Select.Item label="Чулактай" value="Чулактай" />
              </Select>
              <FormControl.ErrorMessage
                leftIcon={<MaterialIcons color="red" name="error-outline" />}>
                Хойд тэнхлэг сонгоно уу!
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl mt={5} isRequired isInvalid={errors.uildver}>
              <FormControl.Label>Үйлдвэр</FormControl.Label>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                data={mashiniiSegmentGaralt?.jagsaalt}
                search
                mt="1"
                maxHeight={300}
                keyboardAvoiding={true}
                labelField="ner"
                valueField="ner"
                dropdownPosition="top"
                placeholder="Үйлдвэр сонгоно уу"
                searchPlaceholder="Хайх..."
                value={form.uildver ? form.uildver : ''}
                onChange={item => {
                  var dedTurul = [];
                  item.dedTurul.forEach(element => {
                    dedTurul.push({ner: element});
                  });
                  setUildver(dedTurul);
                  setForm({...form, uildver: item.ner, zagvar: undefined});
                }}
              />
              <FormControl.ErrorMessage
                leftIcon={<MaterialIcons color="red" name="error-outline" />}>
                Үйлдвэр сонгоно уу!
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={errors.zagvar}>
              <FormControl.Label>Загвар</FormControl.Label>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                data={uildver}
                search
                mt="1"
                disable={uildver.length === 0}
                maxHeight={300}
                labelField="ner"
                valueField="ner"
                dropdownPosition="top"
                placeholder={
                  uildver.length === 0
                    ? 'Үйлдвэр сонгосноор загвар сонгох боломжтой'
                    : 'Загвар сонгоно уу'
                }
                searchPlaceholder="Хайх..."
                value={form.zagvar ? form.zagvar : ''}
                onChange={item => {
                  setForm({...form, zagvar: item.ner});
                }}
              />
              <FormControl.ErrorMessage
                leftIcon={<MaterialIcons color="red" name="error-outline" />}>
                Загвар сонгоно уу!
              </FormControl.ErrorMessage>
            </FormControl>
          </Box>
          <AlertDialog isOpen={isAlert} onClose={() => setIsAlert(false)}>
            <AlertDialog.Content>
              <AlertDialog.Body>Гарахдаа итгэлтэй байна уу?</AlertDialog.Body>
              <AlertDialog.Footer>
                <Button.Group space={2}>
                  <Button
                    variant="unstyled"
                    colorScheme="coolGray"
                    onPress={() => setIsAlert(false)}>
                    Үгүй
                  </Button>
                  <Button colorScheme="blue" onPress={() => butsah()}>
                    Тийм
                  </Button>
                </Button.Group>
              </AlertDialog.Footer>
            </AlertDialog.Content>
          </AlertDialog>
        </VStack>
      </TouchableWithoutFeedback>
      <Button
        m={3}
        colorScheme={'blue'}
        size="lg"
        onPress={() => urgeljluuleh()}>
        Үргэлжлүүлэх
      </Button>
    </Box>
  );
};

export default onoshilgooBurtgel;
