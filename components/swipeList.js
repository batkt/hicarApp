import React, {useState} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Box, HStack, Icon, Pressable, Text, VStack, AlertDialog, Button} from 'native-base';
import moment from 'moment';
import {RefreshControl} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';

export default function ({
                           data,
                           navigation,
                           daalgavarTsutsalya,
                           tsutslakhEsekh,
                           isRefreshing,
                           onRefresh,
                           next,
                           ajiltanEsekh,
                           // daalgavarHuleejAvah,
                         }) {
  const [listData, setListData] = useState([]);
  React.useEffect(() => {
    setListData(data);
  }, [data]);

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = (rowMap, rowKey) => {
    const prevIndex = listData.findIndex(item => item._id === rowKey);
    if (!!daalgavarTsutsalya) {
      daalgavarTsutsalya({...listData[prevIndex]});
      return;
    }
    closeRow(rowMap, rowKey);
    const newData = [...listData];
    newData.splice(prevIndex, 1);
    setListData(newData);
  };
// navigation.navigate('daalgavarBurtgekh', {medeelel: item})
  const onRowDidOpen = rowKey => {
    console.log('This row opened', rowKey);
  };
  const clickHandler = (item) => {
      navigation.navigate('daalgavarUzeh', {medeelel: item, haahaas: 'jagsaalt'});
      // daalgavarHuleejAvah(item);
  };

  const renderItem = ({item, index}) => (
      <Box
          key={`task${item?._id}`}
          w="full"
          justifyContent={'space-between'}
          pb="1"
          px="5"
          flexDirection={'row'}>
        <Pressable
            borderWidth={1}
            borderColor="gray.300"
            flexDirection={'row'}
            alignItems="center"
            w={'full'}
            rounded="xl"
            background="white"
            onPress={() => item.tuluv!==-1 &&
                clickHandler(item)
            }
            p={2}
            _pressed={{bg: 'blue.400', shadow: '3'}}
            _hover={{bg: 'blue.400'}}>
          <Box pr={4} py={4}>
            <Box
                bgColor={
                  item?.tuluv === 2
                      ? 'success.400'
                      : item?.tuluv === 1
                      ? 'warning.400'
                      : item?.tuluv === 0
                          ? 'error.400'
                          : 'muted.400'
                }
                rounded="full"
                padding={1}>
              <Text
                  color={'white'}
                  w="6"
                  h="6"
                  justifyContent={'center'}
                  textAlign={'center'}
                  fontSize="md">
                {item?.dugaar}
              </Text>
            </Box>
          </Box>
          <Box flex={1}>
            <Box flexDirection="row" justifyContent="space-between">
              <Text fontSize={'md'} bold color={'gray.500'}>
                {item?.ajiltniiNer}
              </Text>
              <Text fontSize={'md'} color={'gray.500'}>
                {moment(item?.duusakhOgnoo).format('YYYY-MM-DD')}
              </Text>
            </Box>
            <Box flexDirection={'row'} justifyContent="space-between">
              <Text
                  fontSize={'sm'}
                  bold
                  color={'gray.400'}
                  numberOfLines={1}
                  w="1/2">
                {item?.tailbar}
              </Text>
              <Text
                  fontSize={'sm'}
                  bold
                  color={
                    item?.tuluv === 2
                        ? 'success.400'
                        : item?.tuluv === 1
                        ? 'warning.400'
                        : item?.tuluv === 0
                            ? 'error.400'
                            : 'muted.400'
                  }
                  numberOfLines={1}>
                {item?.tuluv === 2
                    ? 'Хийгдэж дууссан'
                    : item?.tuluv === 1
                        ? 'Хийгдэж байна'
                        : item?.tuluv === 0
                            ? 'Хүлээж аваагүй'
                            : 'Цуцалсан'}
              </Text>
            </Box>
            <Box flexDirection={'row'} justifyContent="space-between">
              {item?.khuleejAvsanOgnoo && (
                  <Text>
                    {moment(item?.khuleejAvsanOgnoo).format('YYYY-MM-DD HH:mm')}
                  </Text>
              )}
              {item?.khuleejAvsanOgnoo && (
                  <Text>
                    {`${moment(item.shiidsenOgnoo).diff(
                        moment(item?.khuleejAvsanOgnoo),
                        'hour',
                    )} минут`}
                  </Text>
              )}
            </Box>
            {!item.shiidsenOgnoo &&
            moment().diff(moment(item?.duusakhOgnoo), 'day') > 0 && (
                <Text fontSize={'xs'} color="red.500">
                  Төлөвлөгөөт хугацаанаас хэтэрсэн байна
                </Text>
            )}
          </Box>
        </Pressable>
      </Box>
  );

  const renderHiddenItem = (data, rowMap) => (
      <HStack flex="1" p="2" pr="5">
        <Pressable
            pl="5"
            bg="red.500"
            ml="auto"
            w="24"
            roundedRight={'xl'}
            justifyContent="center"
            onPress={() => deleteRow(rowMap, data.item._id)}
            _pressed={{
              opacity: 0.5,
            }}>
          <VStack alignItems="center" space={2}>
            <Icon as={<MaterialIcons name="delete" />} color="white" size="xs" />
            <Text color="white" fontSize="xs" fontWeight="medium">
              Цуцлах
            </Text>
          </VStack>
        </Pressable>
      </HStack>
  );

  return (
      <SwipeListView
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
          onEndReached={next}
          data={listData}
          renderItem={renderItem}
          renderHiddenItem={tsutslakhEsekh && renderHiddenItem}
          rightOpenValue={-80}
          previewRowKey={'0'}
          previewOpenValue={-40}
          previewOpenDelay={3000}
          onRowDidOpen={onRowDidOpen}
          keyExtractor={item => item?._id}
      />
  );
}
