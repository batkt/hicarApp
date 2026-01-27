import React from 'react';
import {Box, HStack, Icon, Text, IconButton, FlatList} from 'native-base';
import {RefreshControl, Image} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import {useAuth} from 'components/context/Auth';
import useZakhialga from 'hooks/useZakhialga';
import formatNumber from 'tools/function/formatNumber';
import useToololtTsutslagdsanZakhialga from 'hooks/useToololtTsutslagdsanZakhialga';

const tsutslagdsan = props => {
  const {token, ajiltan, sonorduulga} = useAuth();
  const {ognoo} = props.route.params;

  const query = React.useMemo(
    () => ({
      ognoo: {
        $gte: moment(ognoo[0]).format('YYYY-MM-DD 00:00:00'),
        $lte: moment(ognoo[1]).format('YYYY-MM-DD 23:59:59'),
      },
      tuluv: '-1',
    }),
    [ognoo],
  );

  const {tsutslagdsanGaralt, tsutslagdsanMutate} =
    useToololtTsutslagdsanZakhialga(token, ajiltan?.baiguullagiinId, query);
  const {
    zakhialgiinGaralt,
    zakhialgiinJagsaalt,
    nextZakhialguud,
    zakhialgaMutate,
  } = useZakhialga(token, ajiltan?.baiguullagiinId, undefined, query);

  function onRefresh() {
    zakhialgaMutate();
    tsutslagdsanMutate();
  }

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
            Цуцлагдсан ажил
          </Text>
        </HStack>
        <HStack space={2}>
          <IconButton
            colorScheme="blue"
            icon={
              <Icon
                as={<MaterialIcons name="search" />}
                color="white"
                size="sm"
              />
            }
          />
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
        flexDirection="row"
        justifyContent="space-between"
        marginX={2}
        px={4}
        py={2}
        my={2}
        borderRadius={5}
        bg="#1877f2">
        <Text width="8%" style={{color: 'white'}}>
          <Image
            source={require('../../assets/images/ListWhite.png')}
            style={{width: 15, height: 15, resizeMode: 'contain'}}
          />
        </Text>
        <Text width="22%" style={{color: 'white'}}>
          Огноо
        </Text>
        <Text width="10%" style={{textAlign: 'center', color: 'white'}}>
          Сагс
        </Text>
        <Text width="30%" style={{textAlign: 'center', color: 'white'}}>
          Үнэ
        </Text>
        <Text width="30%" style={{textAlign: 'center', color: 'white'}}>
          Тайлбар
        </Text>
      </Box>

      <FlatList
        marginX={2}
        refreshControl={
          <RefreshControl
            refreshing={!zakhialgiinGaralt}
            onRefresh={onRefresh}
          />
        }
        onScrollEndDrag={nextZakhialguud}
        data={[...zakhialgiinJagsaalt, ...(zakhialgiinGaralt?.jagsaalt || [])]}
        renderItem={({item, index}) => (
          <Box
            flexDirection="row"
            justifyContent="space-between"
            px={2}
            py={1}
            my={1}
            borderRadius={5}
            bg="white">
            <Text numberOfLines={1} width="8%" style={{textAlign: 'center'}}>
              {index + 1}
            </Text>
            <Text width="22%">{moment(item.ognoo).format('YYYY-MM-DD')}</Text>
            <Text width="10%" style={{textAlign: 'center'}}>
              {item.zakhialguud?.length}
            </Text>
            <Text width="30%" style={{textAlign: 'center'}} bold>
              {formatNumber(item.niitDun)}₮
            </Text>
            <Text width="30%" style={{textAlign: 'left', marginLeft: 5}}>
              {item.tutsalsanShaltgaan}
            </Text>
          </Box>
        )}
        keyExtractor={item => item._id}
      />
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
        <Text width="20%" style={{textAlign: 'center', color: 'white'}}>
          {formatNumber(
            tsutslagdsanGaralt &&
              tsutslagdsanGaralt[0]?.niitShirkheg?.reduce((a, b) => a + b),
          )}
        </Text>
        <Text width="50%" style={{textAlign: 'left', color: 'white'}}>
          {formatNumber(tsutslagdsanGaralt && tsutslagdsanGaralt[0]?.niitDun)}₮
        </Text>
      </Box>
    </Box>
  );
};

export default tsutslagdsan;
