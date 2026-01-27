import React, {useState, useMemo} from 'react';
import {
  Box,
  HStack,
  Icon,
  Text,
  IconButton,
  Button,
  Center,
  Modal,
  Badge,
} from 'native-base';
import {Appearance} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAuth} from 'components/context/Auth';
import moment from 'moment';
import {rightNavigation} from 'components/layout/LeftDrawer';
import BottomTabs from 'components/layout/ZakhiralBottomTabs';
import DateTimePicker from '@react-native-community/datetimepicker';

const jagsaalt = props => {
  const {sonorduulga} = useAuth();
  const [ognooniiIndex, setOgnooniiIndex] = useState(0);
  const colorScheme = Appearance.getColorScheme();
  const [ognoo, setOgnoo] = useState([new Date(), new Date()]);
  const [show, setShow] = useState(false);
  const os = useMemo(() => Platform.OS, []);
  const showDatepicker = index => {
    setOgnooniiIndex(index);
    showMode('date');
  };
  const onChange = (event, selectedDate) => {
    ognoo[ognooniiIndex] = selectedDate || ognoo[ognooniiIndex];
    setShow(false);
    setOgnoo([...ognoo]);
  };
  const showMode = () => {
    setShow(true);
  };
  const khabiinBurtgel = () => {
    props.navigation.navigate('khabKhyanalt', {
      ognoo: [
        moment(ognoo[0]).format('YYYY-MM-DD 00:00:00'),
        moment(ognoo[1]).format('YYYY-MM-DD 23:59:59'),
      ],
    });
  };

  const daalgavar = () => {
    props.navigation.navigate('daalgavar', {
      ognoo: [
        moment(ognoo[0]).format('YYYY-MM-DD 00:00:00'),
        moment(ognoo[1]).format('YYYY-MM-DD 23:59:59'),
      ],
    });
  };

  const zakhilginHynalt = () => {
    props.navigation.navigate('zahialgiinHynalt', {
      ognoo: [
        moment(ognoo[0]).format('YYYY-MM-DD 00:00:00'),
        moment(ognoo[1]).format('YYYY-MM-DD 23:59:59'),
      ],
    });
  };

  const aguulgiinHynalt = () => {
    props.navigation.navigate('aguulahiinHynalt', {
      ognoo: [
        moment(ognoo[0]).format('YYYY-MM-DD 00:00:00'),
        moment(ognoo[1]).format('YYYY-MM-DD 23:59:59'),
      ],
    });
  };

  const irtsKhyanaltAvya = () => {
    props.navigation.navigate('IrtsKhyanalt');
  };

  return (
    <Box flex={1} style={{backgroundColor: '#f5f5fb'}}>
      <HStack
        px={8}
        py={3}
        alignItems="center"
        shadow={3}
        justifyContent="space-between"
        borderBottomRadius="10px"
        bgColor="#1877f2">
        <Center>
          <Text fontSize={16} color="white" fontWeight="bold">
            Жагсаалт
          </Text>
        </Center>
        <IconButton
          left={3}
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

      <Box flex={1} paddingY={2} paddingX={8}>
        <Box
          flex={0.1}
          paddingBottom={2}
          flexDirection="row"
          justifyContent="space-between">
          <Button
            width="48%"
            bg="white"
            color="black"
            borderRadius="lg"
            shadow={3}
            _pressed={{backgroundColor: 'darkBlue.300'}}
            onPress={() => showDatepicker(0)}>
            <Text color={'black'}>{moment(ognoo[0]).format('YYYY-MM-DD')}</Text>
          </Button>
          <Button
            width="48%"
            bg="white"
            color="black"
            borderRadius="lg"
            shadow={3}
            _pressed={{backgroundColor: 'darkBlue.300'}}
            onPress={() => showDatepicker(1)}>
            <Text color={'black'}>{moment(ognoo[1]).format('YYYY-MM-DD')}</Text>
          </Button>
        </Box>
        {show && os === 'android' && (
          <DateTimePicker
            testID="dateTimePicker"
            mode={'date'}
            display="spinner"
            value={ognoo[ognooniiIndex]}
            onChange={onChange}
            onTouchCancel={() => setShow(false)}
          />
        )}
        <Modal
          size="lg"
          isOpen={show && os === 'ios'}
          onClose={() => setShow(false)}>
          <Modal.Content bgColor={colorScheme === 'dark' ? 'gray.800' : '#fff'}>
            <DateTimePicker
              testID="dateTimePicker"
              mode={'date'}
              display="inline"
              value={ognoo[ognooniiIndex]}
              onChange={onChange}
              onTouchCancel={() => setShow(false)}
            />
          </Modal.Content>
        </Modal>
        <Box flex={1}>
          <Box paddingBottom={2}>
            <Button
                bgColor="white"
                shadow={3}
                borderRadius="lg"
                _pressed={{backgroundColor: 'indigo.300'}}
                onPress={() => daalgavar()}>
              <Box paddingY={2} flexDirection="row">
                <Box width="1/5" alignItems="center" justifyContent="center">
                  <Icon
                      size="md"
                      color="#1877f2"
                      as={<MaterialCommunityIcons name="clipboard-check-multiple-outline" />}
                  />
                </Box>
                <Box width="3/5" justifyContent="center">
                  <Text bold fontSize={16}>
                    Даалгавар
                  </Text>
                </Box>
                <Box width="1/5" alignItems="center" justifyContent="center">
                  <Icon
                      size="sm"
                      color="#1877f2"
                      borderRadius="full"
                      borderWidth={1}
                      borderColor="#1877f2"
                      as={<MaterialIcons name="chevron-right" />}
                  />
                </Box>
              </Box>
            </Button>
          </Box>
          <Box paddingBottom={2}>
            <Button
              bgColor="white"
              shadow={3}
              borderRadius="lg"
              _pressed={{backgroundColor: 'indigo.300'}}
              onPress={() => zakhilginHynalt()}>
              <Box paddingY={2} flexDirection="row">
                <Box width="1/5" alignItems="center" justifyContent="center">
                  <Icon
                    size="md"
                    color="#1877f2"
                    as={<MaterialIcons name="desktop-windows" />}
                  />
                </Box>
                <Box width="3/5" justifyContent="center">
                  <Text bold fontSize={16}>
                    Захиалгын хяналт
                  </Text>
                </Box>

                <Box width="1/5" alignItems="center" justifyContent="center">
                  <Icon
                    size="sm"
                    color="#1877f2"
                    borderRadius="full"
                    borderWidth={1}
                    borderColor="#1877f2"
                    as={<MaterialIcons name="chevron-right" />}
                  />
                </Box>
              </Box>
            </Button>
          </Box>
          <Box paddingBottom={2}>
            <Button
              bgColor="white"
              shadow={3}
              borderRadius="md"
              _pressed={{backgroundColor: 'indigo.300'}}
              onPress={() => khabiinBurtgel()}>
              <Box paddingY={2} flexDirection="row">
                <Box width="1/5" alignItems="center" justifyContent="center">
                  <Icon
                    size="md"
                    color="#1877f2"
                    as={<MaterialIcons name="list-alt" />}
                  />
                </Box>
                <Box width="3/5" justifyContent="center">
                  <Text fontSize={16} bold>
                    ХАБЭА-н бүртгэл
                  </Text>
                </Box>
                <Box width="1/5" alignItems="center" justifyContent="center">
                  <Icon
                    size="sm"
                    color="#1877f2"
                    borderRadius="full"
                    borderWidth={1}
                    borderColor="#1877f2"
                    as={<MaterialIcons name="chevron-right" />}
                  />
                </Box>
              </Box>
            </Button>
          </Box>
          <Box paddingBottom={2}>
            <Button
              bgColor="white"
              shadow={3}
              borderRadius="lg"
              _pressed={{backgroundColor: 'indigo.300'}}
              onPress={() => aguulgiinHynalt()}>
              <Box paddingY={2} flexDirection="row">
                <Box width="1/5" alignItems="center" justifyContent="center">
                  <Icon
                    size="md"
                    color="#1877f2"
                    as={<MaterialIcons name="inventory" />}
                  />
                </Box>
                <Box width="3/5" justifyContent="center">
                  <Text fontSize={16} bold>
                    Агуулахын хяналт
                  </Text>
                </Box>

                <Box width="1/5" alignItems="center" justifyContent="center">
                  <Icon
                    size="sm"
                    color="#1877f2"
                    borderRadius="full"
                    borderWidth={1}
                    borderColor="#1877f2"
                    as={<MaterialIcons name="chevron-right" />}
                  />
                </Box>
              </Box>
            </Button>
          </Box>
          <Box paddingBottom={2}>
            <Button
              bgColor="white"
              shadow={3}
              borderRadius="lg"
              _pressed={{backgroundColor: 'indigo.300'}}
              onPress={() => irtsKhyanaltAvya()}>
              <Box paddingY={2} flexDirection="row">
                <Box width="1/5" alignItems="center" justifyContent="center">
                  <Icon
                    size="md"
                    color="#1877f2"
                    as={<MaterialIcons name="access-time" />}
                  />
                </Box>
                <Box width="3/5" justifyContent="center">
                  <Text fontSize={16} bold>
                    Ирцийн хяналт
                  </Text>
                </Box>

                <Box width="1/5" alignItems="center" justifyContent="center">
                  <Icon
                    size="sm"
                    color="#1877f2"
                    borderRadius="full"
                    borderWidth={1}
                    borderColor="#1877f2"
                    as={<MaterialIcons name="chevron-right" />}
                  />
                </Box>
              </Box>
            </Button>
          </Box>
        </Box>
      </Box>
      <BottomTabs {...props} />
    </Box>
  );
};

export default jagsaalt;
