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
  Spacer,
  Divider,
  Stack,
  Heading,
  Modal,
  Badge,
} from 'native-base';
import {ScrollView, Appearance} from 'react-native';

import {useAuth} from 'components/context/Auth';
import useTailan from 'hooks/tailan/useTailan';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {LineChart, PieChart} from 'react-native-chart-kit';
import {Dimensions} from 'react-native';
import formatNumberNershil from 'tools/function/formatNumberNershil';
import {Text as SVGText, Svg, Polygon} from 'react-native-svg';
import moment from 'moment';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import useBorluulaltiinTailan from 'hooks/useBorluulaltiinTailan';
import _ from 'lodash';
import formatNumber from 'tools/function/formatNumber';
import BottomTabs from 'components/layout/ZakhiralBottomTabs';

function getColor(string, opacity) {
  var color = string.replace('rgba(', '');
  color = color.replace(' ', '');
  const codes = color.split(',');
  return `rgba(${codes[0]},${codes[1]},${codes[2]},1)`;
}

const tailan = props => {
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
        color: 'rgba(53,162,235,1)',
        percent: uilchilgeeniiKhuls > 0 ? (uilchilgeeniiKhuls * 100) / sum : 0,
      },
      {
        name: 'Хөнгөлөлт',
        population: niitKhungulult,
        color: 'rgba(0,255,0,1)',
        percent: niitKhungulult > 0 ? (niitKhungulult * 100) / sum : 0,
      },
    ];
  }, [borluulaltiinTailan]);

  return (
    <Box flex={1} backgroundColor="white">
      <HStack
        px={1}
        py={3}
        alignItems="center"
        shadow={3}
        justifyContent="space-between"
        borderBottomRadius="10px"
        bgColor="darkBlue.600">
        <Box></Box>
        <Center px={1} py={3}>
          <Text fontSize={16} color="white" fontWeight="bold">
            Борлуулалт тайлан
          </Text>
        </Center>
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
          color="black"
          shadow={3}
          _pressed={{backgroundColor: 'indigo.300'}}
          onPress={() => showDatepicker(0)}>
          {moment(ognoo[0]).format('YYYY-MM-DD')}
        </Button>
        <Button
          width="48%"
          bg="white"
          color="black"
          shadow={3}
          _pressed={{backgroundColor: 'indigo.300'}}
          onPress={() => showDatepicker(1)}>
          {moment(ognoo[1]).format('YYYY-MM-DD')}
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
          shadow={chartType === 'chart' ? 3 : undefined}
          bgColor={'white'}
          _pressed={{backgroundColor: 'darkBlue.300'}}
          onPress={() => setChartType('chart')}
          icon={
            <Center>
              <Icon
                size="5"
                color="darkBlue.600"
                as={<FontAwesome name="pie-chart" />}
              />
            </Center>
          }
        />

        <IconButton
          width="48%"
          shadow={chartType === 'line' ? 3 : undefined}
          bgColor={'white'}
          _pressed={{backgroundColor: 'darkBlue.300'}}
          onPress={() => setChartType('line')}
          icon={
            <Center>
              <Icon
                size="5"
                color="darkBlue.600"
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
          <ScrollView horizontal={true}>
            <LineChart
              verticalLabelRotation="0"
              data={converted(tailanGaralt)}
              width={
                tailanGaralt && tailanGaralt?.labels?.length > 12
                  ? (tailanGaralt?.labels?.length *
                      Dimensions.get('window').width) /
                    5
                  : Dimensions.get('window').width - 40
              }
              height={Dimensions.get('window').height / 4}
              yAxisInterval={1} // bosoo shugam tseg hed bhiig todorhoilokh
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 2, // orongiin nariivchlal
                color: (opacity = 1) => `rgba(53, 162, 235, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                strokeWidth: 2, // chart zuraas buduun nariin
                useShadowColorFromDataset: true, // zuraasnii suuder

                propsForBackgroundLines: {
                  stroke: 'gray', // tsaana bga husnegtiin ongo
                  strokeDasharray: '',
                  strokeWidth: '0.5',
                },
                propsForDots: {
                  r: '4', // tsegnii hemjee
                  strokeWidth: '1',
                },
              }}
              formatYLabel={v => {
                return formatNumberNershil(v);
              }}
              formatXLabel={v => {
                return v;
              }}
              bezier
              decorator={() => {
                return tooltipPos?.visible ? (
                  <View>
                    <Svg>
                      <Polygon
                        points={`
                    ${tooltipPos.x + 35},${tooltipPos.y + 25} 
                    ${tooltipPos.x - 30},${tooltipPos.y + 25} 
                    ${tooltipPos.x - 30},${tooltipPos.y + 5} 
                    ${tooltipPos.x + 35},${tooltipPos.y + 5}`}
                        stroke="black"
                        strokeWidth={1}
                        fill="gray"></Polygon>
                      <SVGText
                        x={tooltipPos.x + 5}
                        y={tooltipPos.y + 20}
                        fill="black"
                        fontSize="12"
                        fontWeight="bold"
                        textAnchor="middle">
                        {formatNumber(tooltipPos.value)}
                      </SVGText>
                    </Svg>
                  </View>
                ) : null;
              }}
              onDataPointClick={data => {
                let isSamePoint =
                  tooltipPos.x === data.x && tooltipPos.y === data.y;

                isSamePoint
                  ? setTooltipPos(previousState => {
                      return {
                        ...previousState,
                        value: data.value,
                        visible: !previousState.visible,
                      };
                    })
                  : setTooltipPos({
                      x: data.x,
                      value: data.value,
                      y: data.y,
                      visible: true,
                    });
              }}
            />
          </ScrollView>

          <Box px={4} marginBottom={2}>
            <Box
              shadow={3}
              bgColor="white"
              rounded="md"
              paddingY={2}
              paddingX={4}
              space={2}>
              <Heading size="xs" color={'red.300'}>
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
          </Box>
          <Box px={4} marginBottom={2}>
            <Box
              shadow={3}
              bgColor="white"
              rounded="md"
              paddingY={2}
              paddingX={4}
              space={2}>
              <Heading size="xs" color={'blue.300'}>
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
          </Box>
          <Box px={4} marginBottom={2}>
            <Box
              shadow={3}
              bgColor="white"
              rounded="md"
              paddingY={2}
              paddingX={4}
              space={2}>
              <Heading size="xs" color={'green.300'}>
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
          </Box>
        </Box>
      )}
      {chartType === 'chart' && (
        <Box flex={1}>
          <Box flex={4}>
            <Box flex={1} flexDirection="row">
              <Box
                flex={5}
                paddingLeft={16}
                //  alignItems={'center'}
                justifyContent="center">
                <PieChart
                  data={pieChart}
                  width={screenWidth - 50}
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
                      padding={1}
                      rounded="full"
                      position="absolute"></View>
                    <Text paddingX={3}>{mur?.percent?.toFixed(0)}%</Text>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          <Box px={8} marginBottom={2}>
            <Box
              shadow={3}
              bgColor="white"
              rounded="md"
              paddingY={2}
              paddingX={4}
              space={2}>
              <Stack direction="row">
                <Center width="1/2">
                  <Text color="gray.500">Нийт орлого</Text>
                </Center>
                <Divider orientation="vertical" />
                <Center width="1/2">
                  <Text bold>
                    {formatNumber(_.get(borluulaltiinTailan, '0.niitDun'))}₮
                  </Text>
                </Center>
              </Stack>
            </Box>
          </Box>
          <Box px={8} marginBottom={2}>
            <Box
              shadow={3}
              bgColor="white"
              rounded="md"
              paddingY={2}
              paddingX={4}
              space={2}>
              <Stack direction="row">
                <Center width="1/2">
                  <Text color="gray.500">Ажлын хөлс</Text>
                </Center>
                <Divider orientation="vertical" />
                <Center width="1/2">
                  <Text bold>
                    {formatNumber(
                      _.get(borluulaltiinTailan, '0.uilchilgeeniiKhuls'),
                    )}
                    ₮
                  </Text>
                </Center>
              </Stack>
            </Box>
          </Box>
          <Box px={8} marginBottom={2}>
            <Box
              shadow={3}
              bgColor="white"
              rounded="md"
              paddingY={2}
              paddingX={4}
              space={2}>
              <Stack direction="row">
                <Center width="1/2">
                  <Text color="gray.500">Хөнгөлөлт</Text>
                </Center>
                <Divider orientation="vertical" />
                <Center width="1/2">
                  <Text bold>
                    {formatNumber(
                      _.get(borluulaltiinTailan, '0.niitKhungulult'),
                    )}
                    ₮
                  </Text>
                </Center>
              </Stack>
            </Box>
          </Box>
        </Box>
      )}
      <BottomTabs {...props} />
    </Box>
  );
};

export default tailan;
