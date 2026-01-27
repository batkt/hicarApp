import React from 'react';
import {
  Box,
  HStack,
  Icon,
  Text,
  IconButton,
  FlatList,
  Badge,
  PresenceTransition,
} from 'native-base';
import {RefreshControl, Image, Pressable} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useAuth} from 'components/context/Auth';
import moment from 'moment';
import useKhabTuukh from 'hooks/useKhabTuukh';
import {rightNavigation} from 'components/layout/LeftDrawer';
import CardList from 'components/custom/CardList';

export function Tile({ugugdul, index, setSelectedIndex, selectedIndex}) {
  return (
    <Box
      flexDirection="column"
      justifyContent="space-between"
      px={5}
      py={4}
      my={1}
      borderRadius={5}
      bg={'white'}>
      <Pressable
        borderBottomWidth={selectedIndex === index ? 1 : undefined}
        borderStyle={selectedIndex === index ? 'solid' : undefined}
        borderColor={selectedIndex === index ? 'gray.500' : undefined}
        onPress={() =>
          setSelectedIndex(selectedIndex === index ? undefined : index)
        }
        flexDirection="row">
        <Box width="10%">
          <Text fontWeight={selectedIndex === index ? 'bold' : undefined}>
            {index + 1}
          </Text>
        </Box>
        <Text
          width="60%"
          fontWeight={selectedIndex === index ? 'bold' : undefined}>
          {ugugdul.ajiltniiNer}
        </Text>
        <Text
          width="15%"
          fontWeight={selectedIndex === index ? 'bold' : undefined}>
          {moment(ugugdul.ognoo).format('MM/DD')}
        </Text>
        <Text
          width="15%"
          fontWeight={selectedIndex === index ? 'bold' : undefined}
          style={{textAlign: 'center'}}>
          {ugugdul.asuulguud?.filter(a => a.khariult === true).length || 0} /{' '}
          {ugugdul.asuulguud.length || 0}
        </Text>
      </Pressable>
      <PresenceTransition
        visible={selectedIndex === index}
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
          transition: {
            duration: 250,
          },
        }}>
        {selectedIndex === index &&
          ugugdul?.asuulguud?.map((a, i) => (
            <Box key={i + a.asuulga} py={1}>
              <Box flexDirection="row">
                <Text width="10%" alignSelf="center">
                  {' '}
                  *{' '}
                </Text>
                <Box width="75%">
                  <Text style={{textAlign: 'justify'}}>{a.asuulga}</Text>
                  {a.khariult === false && (
                    <Box flexDirection="row">
                      <Box flexDirection={'row'}>
                        <Icon
                          size="sm"
                          as={<MaterialIcons name="message" />}
                          color="blue.500"
                        />{' '}
                        : {''}
                      </Box>
                      <Text style={{textAlign: 'justify'}}>{a.tailbar}</Text>
                    </Box>
                  )}
                </Box>
                <Text
                  width="15%"
                  style={{textAlign: 'center'}}
                  alignSelf="center">
                  <Badge
                    rounded="full"
                    colorScheme={a.khariult ? 'green' : 'red'}>
                    {a.khariult ? (
                      <Icon
                        size="sm"
                        as={<MaterialIcons name="check" />}
                        color="white"
                      />
                    ) : (
                      <Icon
                        size="sm"
                        as={<MaterialIcons name="close" />}
                        color="white"
                      />
                    )}
                  </Badge>
                </Text>
              </Box>
            </Box>
          ))}
      </PresenceTransition>
    </Box>
  );
}

const khabiinKhyanalt = props => {
  const {token, sonorduulga, ajiltan} = useAuth();
  const {ognoo} = props.route.params;
  const {asuultTuukhJagsaalt, asuultTuukhGaralt, asuultMutate, nextAsuult} =
    useKhabTuukh(token, ajiltan, ognoo);
  const [selectedIndex, setSelectedIndex] = React.useState();

  function onRefresh() {
    asuultMutate();
    setSelectedIndex(undefined);
  }

  return (
    <Box flex={1} style={{backgroundColor: '#f5f5fb'}}>
      <HStack
        bg="#1877f2"
        px={1}
        py={2}
        justifyContent="space-between"
        alignItems="center"
        borderBottomRadius={10}>
        <HStack paddingY={2} space={4} alignItems="center">
          <IconButton
            colorScheme="blue"
            icon={
              <Icon
                size="sm"
                as={<MaterialIcons name="arrow-back" />}
                color="white"
              />
            }
            onPress={() => {
              onRefresh();
              props.navigation.goBack();
            }}
          />
          <Text color="white" fontSize={16} fontWeight="bold">
            ХАБЭА хяналт
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
      <Box
        flexDirection="row"
        justifyContent="space-between"
        marginX={2}
        px={5}
        py={4}
        my={2}
        borderRadius={5}
        bg="#1877f2">
        <Text width="10%" style={{color: 'white'}}>
          <Icon
            size="sm"
            as={<MaterialIcons name="format-list-bulleted" />}
            color="white"
          />
        </Text>
        <Text width="60%" style={{color: 'white'}}>
          Ажилтан
        </Text>
        <Box width="15%">
          <Icon
            size="sm"
            as={<MaterialIcons name="calendar-today" />}
            color="white"
          />
        </Box>
        <Box width="15%" style={{alignItems: 'center'}}>
          <Icon
            size="sm"
            as={<MaterialIcons name="add-task" />}
            color="white"
          />
        </Box>
      </Box>
      <CardList
        marginX={2}
        loading={!asuultTuukhGaralt}
        next={nextAsuult}
        onRefresh={asuultMutate}
        jagsaalt={asuultTuukhJagsaalt}
        renderItem={({item, index}) => (
          <Tile
            ugugdul={item}
            index={index}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
          />
        )}
        keyExtractor={item => item._id}
      />
      <Box
        flexDirection="row"
        justifyContent="space-between"
        marginX={2}
        px={5}
        py={4}
        my={2}
        borderRadius={5}
        bg="#1877f2">
        <Text width="10%" style={{color: 'white'}}></Text>
        <Text width="60%" style={{color: 'white'}}>
          Нийт
        </Text>
        <Text width="15%" style={{textAlign: 'center', color: 'white'}}>
          {asuultTuukhJagsaalt?.length}
        </Text>
        <Text width="15%" style={{textAlign: 'center', color: 'white'}}>
          {asuultTuukhGaralt?.niitMur}
        </Text>
      </Box>
    </Box>
  );
};

export default khabiinKhyanalt;
