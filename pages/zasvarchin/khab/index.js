import React, {useEffect, useState, useMemo} from 'react';
import {
  Box,
  HStack,
  Icon,
  Text,
  IconButton,
  Button,
  FlatList,
  Image,
  Badge,
  Modal,
  Pressable,
  Radio,
  Input,
  Toast,
} from 'native-base';
import {useAuth} from 'components/context/Auth';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import useKhabTuukh from 'hooks/useKhabTuukh';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import {Appearance, Platform, RefreshControl} from 'react-native';
import {rightNavigation} from 'components/layout/LeftDrawer';
import uilchilgee, {aldaaBarigch} from 'lib/uilchilgee';

function Tile({
  item,
  index,
  selectedIndex,
  setSelectedIndex,
  setKhabAsuult,
  ognoo,
}) {
  function onChange(k, v) {
    setKhabAsuult(khab => {
      khab.zasakhEsekh = true;
      khab.asuulguud[index][k] = v;
      return {...khab};
    });
  }

  if (
    index === selectedIndex &&
    moment(ognoo).format('YYYY-MM-DD') ===
      moment(new Date()).format('YYYY-MM-DD')
  )
    return (
      <Box flexDirection="column" p={2} my={1} borderRadius={5} bg="white">
        <Box flexDirection="row">
          <Text numberOfLines={1} width="8%" style={{textAlign: 'center'}} bold>
            {index + 1}
          </Text>
          <Text width="92%" bold>
            {item.asuulga}
          </Text>
        </Box>
        <Radio.Group
          marginTop={2}
          style={{flexDirection: 'row', justifyContent: 'space-around'}}
          value={item.khariult}
          onChange={v => onChange('khariult', v)}>
          <Radio value={true} mx={1} colorScheme="green">
            Тийм
          </Radio>
          <Radio value={false} mx={1} colorScheme="green">
            Үгүй
          </Radio>
        </Radio.Group>

        {item.khariult === false && (
          <Box flexDirection="row">
            <Text width="8%"> </Text>
            <Input
              width="92%"
              my={2}
              bgColor="white"
              //  fontSize={18}
              textAlign="left"
              placeholder="Шалгаан оруулна уу"
              value={item.tailbar || ''}
              onChangeText={v => onChange('tailbar', v)}
            />
          </Box>
        )}
      </Box>
    );

  return (
    <Box
      flexDirection="row"
      justifyContent="space-between"
      px={2}
      py={3}
      my={1}
      borderRadius={5}
      bg="white">
      <Pressable onPress={() => setSelectedIndex(index)} flexDirection="row">
        <Box width="8%" alignSelf="center">
          <Text numberOfLines={1} style={{textAlign: 'center'}}>
            {index + 1}
          </Text>
        </Box>
        <Box width="50%">
          <Text>{item.asuulga}</Text>
        </Box>
        <Box width="15%" justifyContent="center">
          <Text>
            <Badge colorScheme={item.khariult ? 'green' : 'red'} rounded="md">
              {item.khariult ? 'Тийм' : 'Үгүй'}
            </Badge>
          </Text>
        </Box>
        <Box width="27%" justifyContent="center">
          <Text>{item.tailbar}</Text>
        </Box>
      </Pressable>
    </Box>
  );
}

export default function (props) {
  const colorScheme = Appearance.getColorScheme();
  const {ajiltan, token, sonorduulga, baiguullaga} = useAuth();
  const [show, setShow] = useState(false);
  const [ognoo, setOgnoo] = useState(new Date());
  const date = useMemo(() => [ognoo, ognoo], [ognoo]);
  const {asuultTuukhGaralt, asuultMutate} = useKhabTuukh(token, ajiltan, date);
  const [selectedIndex, setSelectedIndex] = React.useState();
  const [khabAsuult, setKhabAsuult] = useState();

  useEffect(() => {
    if (!!asuultTuukhGaralt)
      setKhabAsuult(
        asuultTuukhGaralt?.jagsaalt?.find(a => a.asuulguud?.length > 0),
      );
  }, [asuultTuukhGaralt]);

  useEffect(() => {
    if (
      asuultTuukhGaralt?.jagsaalt?.length === 0 &&
      moment(ognoo).isBetween(
        moment(moment(new Date()).format('YYYY-MM-DD 00:00:00')),
        moment(moment(new Date()).format('YYYY-MM-DD 23:59:59')),
      ) &&
      baiguullaga?.tokhirgoo?.khabAshiglakhEsekh === true
    )
      props.navigation.navigate('asuulgaBuglukh');
  }, [asuultTuukhGaralt, ognoo, baiguullaga]);

  function onRefresh() {
    asuultMutate();
    setSelectedIndex();
  }

  function khadgalya() {
    uilchilgee(token)
      .post('/khabTuukhKhadgalya', khabAsuult)
      .then(({data}) => {
        if (data === 'Amjilttai') {
          Toast.show({
            title: 'Ажилттай',
            description: 'ХАБЭА амжилттай бүртгэгдлээ',
            status: 'success',
          });
          onRefresh();
        }
      })
      .catch(e => aldaaBarigch(e, Toast));
  }

  return (
    <Box flex={1} style={{backgroundColor: '#f5f5fb'}}>
      <HStack
        bg="#1877f2"
        px={1}
        py={2}
        justifyContent="space-between"
        alignItems="center"
        borderBottomRadius="10px">
        <HStack space={4} alignItems="center">
          <IconButton
            colorScheme="blue"
            icon={
              <Icon
                size="sm"
                as={<MaterialIcons name="menu" />}
                color="white"
              />
            }
            onPress={() => props.navigation.toggleDrawer()}
          />
          <Text color="white" fontSize={16} fontWeight="bold">
            ХАБЭА-н түүх
          </Text>
        </HStack>
        <HStack space={2}>
          {/* <IconButton
            colorScheme="blue"
            icon={
              <Icon
                as={<MaterialIcons name="search" />}
                color="white"
                size="sm"
              />
            }
          /> */}
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
      <Box
        padding={2}
        paddingBottom={0}
        flexDirection="row"
        justifyContent="space-between">
        <Button
          width="100%"
          bg="#1877f2"
          colorScheme="blue"
          _text={{color: 'white'}}
          onPress={() => setShow(true)}>
          {moment(ognoo).format('YYYY-MM-DD')}
        </Button>
      </Box>
      {show && Platform.OS === 'android' && (
        <DateTimePicker
          testID="dateTimePicker"
          mode={'date'}
          display="spinner"
          value={ognoo}
          onChange={(e, d) => {
            setOgnoo(d || ognoo);
            setShow(false);
          }}
          onTouchCancel={() => setShow(false)}
        />
      )}
      <Modal
        size="lg"
        isOpen={show && Platform.OS === 'ios'}
        onClose={() => setShow(false)}>
        <Modal.Content bgColor={colorScheme === 'dark' ? 'gray.800' : '#fff'}>
          <DateTimePicker
            testID="dateTimePicker"
            mode={'date'}
            display="inline"
            value={ognoo}
            onChange={(e, d) => {
              setOgnoo(d || ognoo);
              setShow(false);
            }}
            onTouchCancel={() => setShow(false)}
          />
        </Modal.Content>
      </Modal>
      <Box
        flexDirection="row"
        justifyContent="space-between"
        marginX={2}
        px={4}
        py={3}
        my={2}
        borderRadius={5}
        bg="#1877f2">
        <Box width="8%" alignSelf="center">
          <Image
            alt="dugaar"
            source={require('../../../assets/images/ListWhite.png')}
            style={{width: 15, height: 15, resizeMode: 'contain'}}
          />
        </Box>
        <Text width="50%" style={{color: 'white'}}>
          Асуултууд
        </Text>
        <Text width="20%" style={{color: 'white'}}>
          Хариулт
        </Text>
        <Text width="23%" style={{color: 'white'}}>
          Тайлбар
        </Text>
      </Box>

      <FlatList
        marginX={2}
        refreshControl={
          <RefreshControl
            refreshing={!asuultTuukhGaralt}
            onRefresh={onRefresh}
          />
        }
        data={khabAsuult?.asuulguud || []}
        renderItem={({item, index}) => (
          <Tile
            item={item}
            index={index}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            setKhabAsuult={setKhabAsuult}
            ognoo={ognoo}
          />
        )}
        keyExtractor={item => item._id}
      />
      {khabAsuult?.zasakhEsekh === true && (
        <Button
          mx={2}
          bg="#1877f2"
          _text={{color: 'white'}}
          onPress={khadgalya}>
          Хадгалах
        </Button>
      )}
      <Box
        flexDirection="row"
        justifyContent="space-between"
        marginX={2}
        px={5}
        py={2}
        my={2}
        borderRadius={5}
        bg="#1877f2">
        <Text width="8%" style={{color: 'white'}}></Text>
        <Text width="22%" style={{color: 'white'}}>
          Нийт
        </Text>
        <Text width="20%" style={{textAlign: 'center', color: 'white'}}></Text>
        <Text width="50%" style={{textAlign: 'left', color: 'white'}}>
          {khabAsuult?.asuulguud?.length || 0} /{' '}
          {khabAsuult?.asuulguud?.filter(a => a.khariult === true).length || 0}
        </Text>
      </Box>
    </Box>
  );
}
