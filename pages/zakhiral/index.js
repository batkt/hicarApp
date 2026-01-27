import React, {useMemo, useState} from 'react';
import {
  Box,
  HStack,
  Icon,
  Text,
  IconButton,
  View,
  Button,
  Center,
  Divider,
  Stack,
  Heading,
  Modal,
  Badge,
} from 'native-base';
import {Appearance} from 'react-native';

import {useAuth} from 'components/context/Auth';
import useTailan from 'hooks/tailan/useTailan';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {PieChart} from 'react-native-chart-kit';
import {Dimensions} from 'react-native';
import moment from 'moment';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import useBorluulaltiinTailan from 'hooks/useBorluulaltiinTailan';
import _ from 'lodash';
import formatNumber from 'tools/function/formatNumber';
import BottomTabs from 'components/layout/ZakhiralBottomTabs';
import {rightNavigation} from 'components/layout/LeftDrawer';
import LineChart from 'components/custom/LineChart';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';

function getColor(string, opacity) {
  var color = string.replace('rgba(', '');
  color = color.replace(' ', '');
  const codes = color.split(',');
  return `rgba(${codes[0]},${codes[1]},${codes[2]},1)`;
}

const index = props => {
  const screenWidth = Dimensions.get('window').width;
  const colorScheme = Appearance.getColorScheme();
  const {token, salbariinId, setHuudasTuluv, ajiltan, sonorduulga} = useAuth();
  const [tooltipPos, setTooltipPos] = useState({
    x: 0,
    y: 0,
    visible: false,
    value: 0,
    ognoo: 0,
  });
  const [ognoo, setOgnoo] = useState([new Date(), new Date()]);
  const [show, setShow] = useState(false);
  const [chartType, setChartType] = useState('chart');
  const [ognooniiIndex, setOgnooniiIndex] = useState(0);
  const os = useMemo(() => Platform.OS, []);
  const showDatepicker = index => {
    setOgnooniiIndex(index);
    showMode('date');
  };
  const showMode = () => {
    setShow(true);
  };

  const [tailan, setTailan] = useState('borluulaltiinTailanKhugatsaagaarAvya');
  const [nariivchlal, setNariivchlal] = useState('day');
  const {borluulaltiinTailan, borluulaltiinTailanMutate} =
    useBorluulaltiinTailan(token, ajiltan?.baiguullagiinId, ognoo);
  const query = useMemo(() => {
    return {
      salbariinId,
      nariivchlal,
      ekhlekhOgnoo: ognoo[0],
      duusakhOgnoo: ognoo[1],
    };
  }, [ognoo, nariivchlal, salbariinId]);

  console.log('borluulaltiinTailan', borluulaltiinTailan);

  const {tailanGaralt, tailanMutate} = useTailan(tailan, token, query);
  const onChange = (event, selectedDate) => {
    ognoo[ognooniiIndex] = selectedDate || ognoo[ognooniiIndex];
    setShow(false);
    setOgnoo([...ognoo]);
    tailanMutate();
    borluulaltiinTailanMutate();
  };

  const converted = selectedData => {
    if (!selectedData || selectedData?.length === 0)
      return {
        labels: [''],
        datasets: [
          {
            data: ['0'],
            color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
          },
          {
            data: ['1'],
            color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
          },
        ],
      };
    const data = {
      labels: selectedData?.labels || [],
      //  legend: selectedData?.datasets?.map(a => a.label) || [],
      legend: [],
      datasets: selectedData?.datasets?.map(a => ({
        label: a.label,
        data: [0, ...a.data],
        color: () => getColor(a.borderColor, 1),
      })),
    };

    return data;
  };
  const pieChart = useMemo(() => {
    const niitDun = _.get(borluulaltiinTailan, '0.niitDun', 0);
    const uilchilgeeniiKhuls = _.get(
      borluulaltiinTailan,
      '0.uilchilgeeniiKhuls',
      0,
    );
    const niitKhungulult = _.get(borluulaltiinTailan, '0.niitKhungulult', 0);
    const sum = niitDun + uilchilgeeniiKhuls + niitKhungulult;
    return [
      {
        name: 'Борлуулалт',
        population: niitDun,
        color: 'rgba(255,99,132,1)',
        percent: niitDun > 0 ? (niitDun * 100) / sum : 0,
      },
      {
        name: 'Үйлчилгээний хөлс',
        population: uilchilgeeniiKhuls,
        color: 'rgba(5, 117, 230,1)',
        percent: uilchilgeeniiKhuls > 0 ? (uilchilgeeniiKhuls * 100) / sum : 0,
      },
      {
        name: 'Хөнгөлөлт',
        population: niitKhungulult,
        color: 'rgba(56, 239, 125,1)',
        percent: niitKhungulult > 0 ? (niitKhungulult * 100) / sum : 0,
      },
    ];
  }, [borluulaltiinTailan]);

  const darakh = () => {
    props.navigation.navigate('zahialgiinHynalt', {
      ognoo: ognoo,
    });
  };

  return (
    <Box flex={1} backgroundColor="white">
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
            Борлуулалт тайлан
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

      <Box
        flex={0.1}
        paddingTop={2}
        paddingLeft={8}
        paddingRight={8}
        paddingBottom={0}
        flexDirection="row"
        justifyContent="space-between">
        <Button
          width="48%"
          bg="white"
          shadow={3}
          _pressed={{backgroundColor: 'darkBlue.300'}}
          onPress={() => showDatepicker(0)}>
          <Text color={'black'}>{moment(ognoo[0]).format('YYYY-MM-DD')}</Text>
        </Button>
        <Button
          width="48%"
          bg="white"
          shadow={3}
          _pressed={{backgroundColor: 'darkBlue.300'}}
          onPress={() => showDatepicker(1)}>
          <Text color={'black'}>{moment(ognoo[1]).format('YYYY-MM-DD')}</Text>
        </Button>
      </Box>
      <Box
        flex={0.1}
        paddingTop={2}
        paddingLeft={8}
        paddingRight={8}
        paddingBottom={1}
        flexDirection="row"
        justifyContent="space-between">
        <IconButton
          width="48%"
          shadow={3}
          bgColor={chartType === 'chart' ? '#1877f2' : 'white'}
          _pressed={{backgroundColor: 'darkBlue.300'}}
          onPress={() => setChartType('chart')}
          justifyContent="center"
          icon={
            <Center>
              <Icon
                size="sm"
                color={chartType === 'chart' ? 'white' : '#1877f2'}
                as={<FontAwesome name="pie-chart" />}
              />
            </Center>
          }
        />

        <IconButton
          width="48%"
          shadow={3}
          bgColor={chartType === 'line' ? '#1877f2' : 'white'}
          _pressed={{backgroundColor: 'darkBlue.300'}}
          onPress={() => setChartType('line')}
          justifyContent="center"
          icon={
            <Center>
              <Icon
                size="sm"
                color={chartType === 'line' ? 'white' : '#1877f2'}
                as={<FontAwesome name="area-chart" />}
              />
            </Center>
          }
        />
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
      {chartType === 'line' && (
        <Box flex={1}>
          <LineChart tailanGaralt={tailanGaralt} />
          <Box px={8} marginBottom={2}>
            <Pressable onPress={darakh}>
              <Box
                shadow={3}
                bgColor="white"
                rounded="md"
                paddingY={2}
                paddingX={4}
                space={2}>
                <Heading size="xs" color="rgba(255,99,132,1)">
                  Борлуулалт
                </Heading>

                <Stack direction="row">
                  <Center width="1/2">
                    <Text color="gray.500">Захиалгын тоо</Text>
                    <Text bold>
                      {formatNumber(_.get(borluulaltiinTailan, '0.zakhialga'))}
                    </Text>
                  </Center>

                  <Divider orientation="vertical" />

                  <Center width="1/2">
                    <Text color="gray.500">Борлуулалт</Text>
                    <Text bold>
                      {formatNumber(_.get(borluulaltiinTailan, '0.niitDun'))}₮
                    </Text>
                  </Center>
                </Stack>
              </Box>
            </Pressable>
          </Box>
          <Box px={8} marginBottom={2}>
            <Pressable onPress={darakh}>
              <Box
                shadow={3}
                bgColor="white"
                rounded="md"
                paddingY={2}
                paddingX={4}
                space={2}>
                <Heading size="xs" color="rgba(5, 117, 230,1)">
                  Үйлчилгээний хөлс
                </Heading>

                <Stack direction="row">
                  <Center width="1/2">
                    <Text color="gray.500">Үйлчилгээний тоо</Text>
                    <Text bold>
                      {formatNumber(
                        _.get(borluulaltiinTailan, '0.uichilgeeniiToo'),
                      )}
                    </Text>
                  </Center>

                  <Divider orientation="vertical" />

                  <Center width="1/2">
                    <Text color="gray.500"> Үйлчилгээний хөлс</Text>

                    <Text bold>
                      {formatNumber(
                        _.get(borluulaltiinTailan, '0.uilchilgeeniiKhuls'),
                      )}
                      ₮
                    </Text>
                  </Center>
                </Stack>
              </Box>
            </Pressable>
          </Box>
          <Box px={8} marginBottom={2}>
            <Pressable onPress={darakh}>
              <Box
                shadow={3}
                bgColor="white"
                rounded="md"
                paddingY={2}
                paddingX={4}
                space={2}>
                <Heading size="xs" color={'rgba(56, 239, 125,1)'}>
                  Хөнгөлөлт
                </Heading>

                <Stack direction="row">
                  <Center width="1/2">
                    <Text color="gray.500">Хөнгөлсөн захиалга</Text>
                    <Text bold>
                      {formatNumber(
                        _.get(borluulaltiinTailan, '0.niitKhungulultToo'),
                      )}
                    </Text>
                  </Center>

                  <Divider orientation="vertical" />

                  <Center width="1/2">
                    <Text color="gray.500">Нийт хөнгөлөлт</Text>

                    <Text bold>
                      {formatNumber(
                        _.get(borluulaltiinTailan, '0.niitKhungulult'),
                      )}
                      ₮
                    </Text>
                  </Center>
                </Stack>
              </Box>
            </Pressable>
          </Box>
        </Box>
      )}
      {chartType === 'chart' && (
        <Box flex={1}>
          <Box flex={4}>
            <Box flex={1} flexDirection="row">
              <Box flex={5} justifyContent="center">
                <PieChart
                  data={pieChart}
                  width={screenWidth - 0}
                  height={Dimensions.get('window').height / 3}
                  hasLegend={false}
                  chartConfig={{
                    backgroundGradientFrom: '#1E2923',
                    backgroundGradientFromOpacity: 0,
                    backgroundGradientTo: '#08130D',
                    backgroundGradientToOpacity: 0.5,
                    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
                    strokeWidth: 2, // optional, default 3
                    barPercentage: 0.5,
                    useShadowColorFromDataset: false, // optional
                  }}
                  center={[40, 0]}
                  accessor={'population'}
                  backgroundColor={'transparent'}
                  absolute
                />
              </Box>
              <Box flex={2} justifyContent="center">
                {pieChart.map((mur, i) => (
                  <Box
                    key={`label-chart-${i}`}
                    space={2}
                    flexDirection="row"
                    justifyContent="space-between">
                    <View
                      backgroundColor={mur?.color}
                      top={2}
                      left={-10}
                      padding={1}
                      rounded="full"
                      position="absolute"></View>
                    <Text paddingX={3}>{mur?.percent?.toFixed(2)}%</Text>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          <Box px={8} marginBottom={2}>
            <Pressable onPress={darakh}>
              <Box
                shadow={3}
                bgColor="white"
                rounded="md"
                paddingY={4}
                paddingX={4}
                space={2}>
                <Stack direction="row">
                  <Center width="1/2">
                    <Text color="gray.500">Нийт орлого</Text>
                  </Center>
                  <Divider orientation="vertical" />
                  <Center width="1/2">
                    <Text bold color="rgba(255,99,132,1)">
                      {formatNumber(_.get(borluulaltiinTailan, '0.niitDun'))}₮
                    </Text>
                  </Center>
                </Stack>
              </Box>
            </Pressable>
          </Box>
          <Box px={8} marginBottom={2}>
            <Pressable onPress={darakh}>
              <Box
                shadow={3}
                bgColor="white"
                rounded="md"
                paddingY={4}
                paddingX={4}
                space={2}>
                <Stack direction="row">
                  <Center width="1/2">
                    <Text color="gray.500">Ажлын хөлс</Text>
                  </Center>
                  <Divider orientation="vertical" />
                  <Center width="1/2">
                    <Text bold color="rgba(5, 117, 230,1)">
                      {formatNumber(
                        _.get(borluulaltiinTailan, '0.uilchilgeeniiKhuls'),
                      )}
                      ₮
                    </Text>
                  </Center>
                </Stack>
              </Box>
            </Pressable>
          </Box>
          <Box px={8} marginBottom={2}>
            <Pressable onPress={darakh}>
              <Box
                shadow={3}
                bgColor="white"
                rounded="md"
                paddingY={4}
                paddingX={4}
                space={2}>
                <Stack direction="row">
                  <Center width="1/2">
                    <Text color="gray.500">Хөнгөлөлт</Text>
                  </Center>
                  <Divider orientation="vertical" />
                  <Center width="1/2">
                    <Text bold color="#38ef7d">
                      {formatNumber(
                        _.get(borluulaltiinTailan, '0.niitKhungulult'),
                      )}
                      ₮
                    </Text>
                  </Center>
                </Stack>
              </Box>
            </Pressable>
          </Box>
        </Box>
      )}
      <BottomTabs {...props} />
    </Box>
  );
};

export default index;
