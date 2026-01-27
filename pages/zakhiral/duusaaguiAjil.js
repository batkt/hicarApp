import React from 'react';
import {Box, HStack, Icon, Text, IconButton, FlatList} from 'native-base';
import {RefreshControl, Image} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useAuth} from 'components/context/Auth';
import useDuusaaguiZakhialgaAjiltnaar from 'hooks/useDuusaaguiZakhialgaAjiltnaar';

const duusaaguiAjil = props => {
  const {token, sonorduulga} = useAuth();
  const {ognoo} = props.route.params;

  const {ajiltanDuusaaguiAjilGaralt, ajiltanDuusaaguiAjilMutate} =
    useDuusaaguiZakhialgaAjiltnaar(token, ognoo);

  function onRefresh() {
    ajiltanDuusaaguiAjilMutate();
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
            Дуусаагүй ажил
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
        flexDirection="row"
        justifyContent="space-between"
        marginX={2}
        px={5}
        py={2}
        my={2}
        borderRadius={5}
        bg="#1877f2">
        <Text width="10%" style={{color: 'white'}}>
          <Image
            source={require('../../assets/images/ListWhite.png')}
            style={{width: 15, height: 15, resizeMode: 'contain'}}
          />
        </Text>
        <Text width="40%" style={{color: 'white'}}>
          Ажилтан
        </Text>
        <Text width="25%" style={{textAlign: 'center'}}>
          <Image
            source={require('../../assets/images/Pause.png')}
            style={{width: 15, height: 15, resizeMode: 'contain'}}
          />
        </Text>
        <Text width="25%" style={{textAlign: 'center', alignContent: 'center'}}>
          <Image
            source={require('../../assets/images/BusyWhite.png')}
            style={{width: 15, height: 15, resizeMode: 'contain'}}
          />
        </Text>
      </Box>

      <FlatList
        marginX={2}
        refreshControl={
          <RefreshControl
            refreshing={!ajiltanDuusaaguiAjilGaralt}
            onRefresh={onRefresh}
          />
        }
        data={ajiltanDuusaaguiAjilGaralt}
        renderItem={({item, index}) => (
          <Box
            flexDirection="row"
            justifyContent="space-between"
            px={5}
            py={1}
            my={1}
            borderRadius={5}
            bg="white">
            <Text width="10%">{index + 1}</Text>
            <Text width="40%">{item._id}</Text>
            <Text width="25%" style={{textAlign: 'center'}}>
              {item.too?.find(a => a?.tuluv === '2')?.too || 0}
            </Text>
            <Text width="25%" style={{textAlign: 'center'}}>
              {item.too?.find(a => a?.tuluv === '1')?.too || 0}
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
        <Text width="10%" style={{color: 'white'}}></Text>
        <Text width="40%" style={{color: 'white'}}>
          Нийт
        </Text>
        <Text width="25%" style={{textAlign: 'center', color: 'white'}}>
          {ajiltanDuusaaguiAjilGaralt?.reduce(
            (a, b) => a + (b?.too?.find(a => a.tuluv === '2')?.too || 0),
            0,
          )}
        </Text>
        <Text width="25%" style={{textAlign: 'center', color: 'white'}}>
          {ajiltanDuusaaguiAjilGaralt?.reduce(
            (a, b) => a + (b?.too?.find(a => a.tuluv === '1')?.too || 0),
            0,
          )}
        </Text>
      </Box>
    </Box>
  );
};

export default duusaaguiAjil;
