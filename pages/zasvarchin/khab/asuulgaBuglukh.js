import React from 'react';
import {Button, Heading} from 'native-base';
import {
  Box,
  HStack,
  Icon,
  Text,
  IconButton,
  FlatList,
  Badge,
} from 'native-base';

import {useAuth} from 'components/context/Auth';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import useAsuulga from 'hooks/useAsuulga';
import AsuulgaKhariulah from './asuulgaKhariulah';
import {rightNavigation} from 'components/layout/LeftDrawer';

export default function (props) {
  const {ajiltan, token, sonorduulga, salbariinId} = useAuth();
  const {asuultiinGaralt} = useAsuulga(token, ajiltan?.baiguullagiinId);

  const [selectedIndex, setSelectedIndex] = React.useState();

  const [asuulgaJagsaalt, setAsuulgaJagsaalt] = React.useState();

  React.useEffect(() => {
    if (!!asuultiinGaralt?.jagsaalt)
      setAsuulgaJagsaalt(asuultiinGaralt?.jagsaalt);
  }, [asuultiinGaralt]);

  const batalgaajuulakh = () => {
    props.navigation.navigate('gariinUsegBatalgaajuulakh', {
      asuulgaJagsaalt,
      token,
      ajiltan,
      salbariinId,
    });
  };

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
                as={<MaterialIcons name="arrow-back" />}
                color="white"
              />
            }
            onPress={() => props.navigation.goBack()}
          />
          <Text color="white" fontSize={16} fontWeight="bold">
            ХАБЭА-н асуултууд
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
      <Box p={2} bg="white">
        <Box flexDirection="column">
          <Heading fontSize="16px" style={{textAlign: 'center'}}>
            Таньд өдрийн мэнд хүргэе
          </Heading>
        </Box>
        <Text
          style={{textAlign: 'center'}}
          paddingTop={2}
          paddingX={3}
          fontSize="14px">
          Аюулгүй ажилгааны журмыг мөрдөж{' '}
        </Text>
        <Text style={{textAlign: 'center'}} paddingX={3} fontSize="14px">
          доорх асуулгуудыг бөглөнө үү!
        </Text>
      </Box>
      <FlatList
        marginX={2}
        data={asuulgaJagsaalt}
        renderItem={({item, index}) => (
          <AsuulgaKhariulah
            ugugdul={item}
            index={index}
            setAsuulgaJagsaalt={setAsuulgaJagsaalt}
            setSelectedIndex={setSelectedIndex}
            selectedIndex={selectedIndex}
          />
        )}
        keyExtractor={item => item._id}
      />
      <Box
        flexDirection="row"
        justifyContent="space-between"
        p={2}
        borderRadius={5}>
        <Button bg="#1877f2" width="45%" _text={{color: 'white'}}>{`${
          asuulgaJagsaalt?.length || 0
        }/${
          asuulgaJagsaalt?.filter(a => a.khariult !== undefined).length || 0
        }`}</Button>
        <Button
          bg="#1877f2"
          width="45%"
          _text={{color: 'white'}}
          onPress={() => batalgaajuulakh()}>
          Илгээх
        </Button>
      </Box>
    </Box>
  );
}
