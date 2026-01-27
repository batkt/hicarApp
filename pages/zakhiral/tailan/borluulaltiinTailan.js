import React, {useMemo, useState} from 'react';
import {
  Box,
  HStack,
  Icon,
  Text,
  IconButton,
  View,
  ScrollView,
  Pressable,
  Center,
  Progress,
  VStack,
  Heading,
} from 'native-base';
import {Dimensions} from 'react-native';
import {useAuth} from 'components/context/Auth';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {LineChart} from 'react-native-chart-kit';
import useTailan from 'hooks/tailan/useTailan';
import {rightNavigation} from 'components/layout/LeftDrawer';
import formatNumberNershil from 'tools/function/formatNumberNershil';
import {Text as SVGText, Svg} from 'react-native-svg';

function getColor(string, opacity) {
  var color = string.replace('rgba(', '');
  color = color.replace(' ', '');
  const codes = color.split(',');
  return `rgba(${codes[0]},${codes[1]},${codes[2]},${opacity})`;
}

function string(a) {
  if (a === 'day') return 'Өдөр';
  else if (a === 'month') return 'Сар';
  else a === 'year';
  return 'Жил';
}

const data = {
  labels: ['Swim', 'Bike', 'Run'], // optional
  data: [0.4, 0.6, 0.8],
};

const borluulaltiinTailan = props => {
  const {ognoo} = props.route.params;
  const {token, sonorduulga, salbariinId} = useAuth();
  const [tooltipPos, setTooltipPos] = useState({
    x: 0,
    y: 0,
    visible: false,
    value: 0,
  });

  const [tailan, setTailan] = useState('borluulaltiinTailanKhugatsaagaarAvya');
  const [tailanTurul, setTailanTurul] = useState('line');
  const [nariivchlal, setNariivchlal] = useState('month');

  const query = useMemo(() => {
    return {
      salbariinId,
      nariivchlal,
      ekhlekhOgnoo: ognoo[0],
      duusakhOgnoo: ognoo[1],
    };
  }, [ognoo, nariivchlal, salbariinId]);

  const {tailanGaralt, tailanMutate} = useTailan(tailan, token, query);

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
      legend: selectedData?.datasets?.map(a => a.label) || [],
      datasets: selectedData?.datasets?.map(a => ({
        label: a.label,
        data: [0, ...a.data],
        color: (opacity = 1) => getColor(a.borderColor, opacity),
      })),
    };
    return data;
  };

  return (
    <Box flex={1} style={{backgroundColor: '#f5f5fb'}}>
      <HStack
        bg="#1877f2"
        px={1}
        py={3}
        justifyContent="space-between"
        alignItems="center"
        borderBottomRadius="10px">
        <HStack space={4} alignItems="center">
          <IconButton
            colorScheme="blue"
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
            Тайлан
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
      <Box py={2} flexDirection="row" justifyContent={'space-around'}>
        {['day', 'month', 'year'].map(a => (
          <Pressable
            p={2}
            rounded="md"
            bg={a === nariivchlal ? 'blue.500' : 'white'}
            w={'24'}
            alignItems="center"
            onPress={() => setNariivchlal(a)}>
            <Text>{string(a)}</Text>
          </Pressable>
        ))}
      </Box>
      <ScrollView>
        <Box px={2} alignSelf="center">
          <LineChart
            data={converted(tailanGaralt)}
            width={Dimensions.get('window').width - 40} // from react-native
            height={220}
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(53, 162, 235, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(53, 162, 235, ${opacity})`,
            }}
            formatYLabel={v => {
              return formatNumberNershil(v);
            }}
            formatXLabel={v => {
              return v;
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
            decorator={() => {
              return tooltipPos?.visible ? (
                <View>
                  <Svg>
                    <SVGText
                      x={tooltipPos.x + 5}
                      y={tooltipPos.y + 20}
                      fill="black"
                      fontSize="16"
                      fontWeight="bold"
                      textAnchor="middle">
                      {formatNumberNershil(tooltipPos.value)}
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
        </Box>
        <Center w="100%">
          <Box w="90%" maxW="400">
            <VStack space="md">
              <Box flexDirection={'row'} justifyContent="space-between">
                <Heading style={{fontSize: 28, fontWeight: 'bold'}}>
                  Борлуулалт
                </Heading>
              </Box>
              <VStack space={2}>
                <Box flexDirection={'row'} justifyContent="space-between">
                  <Text style={{color: 'grey'}}>Борлуулалт</Text>
                  <Text style={{color: 'grey'}}>85%</Text>
                </Box>
                <Progress colorScheme="secondary" value={85} shadow={3} />
                <Box
                  marginTop={8}
                  flexDirection={'row'}
                  justifyContent="space-between">
                  <Text style={{color: 'grey'}}>Үйлчилгээний хөлс</Text>
                  <Text style={{color: 'grey'}}>15%</Text>
                </Box>
                <Progress colorScheme="primary" value={15} shadow={3} />
              </VStack>
            </VStack>
          </Box>
        </Center>
        <Center marginTop={8}>
          <HStack space={3}>
            <VStack space={3} alignItems="center">
              <Center w="5" h="5" bg="secondary.500" rounded="10" shadow={3} />
              <Center w="5" h="5" bg="primary.500" rounded="10" shadow={3} />
            </VStack>
            <VStack space={3}>
              <Text style={{color: 'gray'}}>Борлуулалт</Text>
              <Text style={{color: 'gray'}}>Үйлчилгээний хөлс</Text>
            </VStack>
            <VStack space={3}>
              <Text style={{color: 'gray', fontWeight: 'bold'}}>8,500,000</Text>
              <Text style={{color: 'gray', fontWeight: 'bold'}}>1,500,000</Text>
            </VStack>
          </HStack>
        </Center>
      </ScrollView>
    </Box>
  );
};

export default borluulaltiinTailan;
