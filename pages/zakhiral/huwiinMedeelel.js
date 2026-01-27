import React, {useState} from 'react';
import {Appearance} from 'react-native';
import {useAuth} from 'components/context/Auth';
import BottomTabs from 'components/layout/ZakhiralBottomTabs';
import {
  Box,
  HStack,
  Icon,
  Text,
  IconButton,
  Button,
  Center,
  Select,
  Input,
  Avatar,
  CheckIcon,
  Badge
} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {rightNavigation} from 'components/layout/LeftDrawer';

const huwiinMedeelel = props => {
  const colorScheme = Appearance.getColorScheme();
  const {
    ajiltan,
    token,
    sonorduulga,
    baiguullaga,
    salbariinId,
    salbarSoliyo,
    signOut,
  } = useAuth();
  const [ognoo, setOgnoo] = useState([new Date(), new Date()]);
  console.log('ajiltan', ajiltan);
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
            Хувийн мэдээлэл
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
      <Box flex={1} padding={2}>
        <Box flex={4} paddingX={6}>
          <Box bgColor="white" shadow={3} borderRadius="lg" flex={1}>
            <Box flex={1} flexDirection="row" paddingY={2}>
              <Center width="1/3">
                <Avatar
                  bg="purple.600"
                  alignSelf="center"
                  size="lg"
                  source={{
                    uri: 'https://images.unsplash.com/photo-1510771463146-e89e6e86560e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80',
                  }}>
                  RB
                </Avatar>
              </Center>
              <Box width="2/3" paddingX={2} alignContent="center">
                <Text paddingBottom={1}>Салбарын жагсаалт</Text>
                {baiguullaga?.salbaruud &&
                  (ajiltan?.erkh !== 'Zasvarchin' ||
                    ajiltan?.salbaruud?.length > 1) && (
                    <Select
                      bgColor="white"
                      borderRadius="lg"
                      selectedValue={salbariinId}
                      // minWidth="200"
                      accessibilityLabel="Choose Service"
                      placeholder="Choose Service"
                      _selectedItem={{
                        bg: 'darkBlue.500',
                        endIcon: <CheckIcon size="5" />,
                      }}
                      onValueChange={itemValue => salbarSoliyo(itemValue)}>
                      {baiguullaga?.salbaruud?.map(option => (
                        <Select.Item label={option?.ner} value={option?._id} />
                      ))}
                    </Select>
                  )}
              </Box>
            </Box>
            <Box flex={3} paddingX={8} paddingY={4}>
              <Box flexDirection="row" alignItems="center">
                <Text width="1/3">Нэр</Text>
                <Input
                  isDisabled
                  variant="underlined"
                  _disabled={{bgColor: 'white'}}
                  width="2/3"
                  value={ajiltan?.ner}
                />
              </Box>
              <Box flexDirection="row" alignItems="center">
                <Text width="1/3">Албан тушаал</Text>
                <Input
                  isDisabled
                  variant="underlined"
                  _disabled={{bgColor: 'white'}}
                  width="2/3"
                  value={ajiltan?.albanTushaal}
                />
              </Box>
              <Box flexDirection="row" alignItems="center">
                <Text width="1/3">Имэйл хаяг</Text>
                <Input
                  isDisabled
                  _disabled={{bgColor: 'white'}}
                  variant="underlined"
                  width="2/3"
                  value={ajiltan?.mail}
                />
              </Box>
              <Box flexDirection="row" alignItems="center">
                <Text width="1/3">Утас</Text>
                <Input
                  isDisabled
                  _disabled={{bgColor: 'white'}}
                  variant="underlined"
                  width="2/3"
                  value={ajiltan?.utas}
                />
              </Box>
            </Box>
          </Box>
        </Box>
        <Box flex={2} paddingX={6} paddingY={2}>
          <Box paddingBottom={2}>
            <Button
              bgColor="white"
              shadow={3}
              borderRadius="lg"
              _pressed={{backgroundColor: 'darkBlue.300'}}
              onPress={() => props.navigation.navigate('Хувийн мэдээлэл')}>
              <Box paddingY={2}>
                <Text>Хувийн мэдээлэл</Text>
              </Box>
            </Button>
          </Box>
          <Box paddingBottom={2}>
            <Button
              bgColor="white"
              shadow={3}
              borderRadius="lg"
              _pressed={{backgroundColor: 'darkBlue.300'}}
              onPress={() => props.navigation.navigate('Нууц үг солих')}>
              <Box paddingY={2}>
                <Text>Нууц үг солих</Text>
              </Box>
            </Button>
          </Box>
          <Box paddingBottom={2}>
            <Button
              bgColor="white"
              shadow={3}
              borderRadius="lg"
              _pressed={{backgroundColor: 'darkBlue.300'}}
              onPress={() => props.navigation.navigate('IrtsTuhuurumjBurtgel')}>
              <Box paddingY={2}>
                <Text>Ирцийн тохиргоо</Text>
              </Box>
            </Button>
          </Box>
        </Box>
      </Box>
      <Box paddingY={2} paddingX={6}>
        <Button
          bgColor="red.400"
          shadow={3}
          borderRadius="lg"
          _pressed={{backgroundColor: 'red.600'}}
          onPress={signOut}>
          <Box paddingY={2}>
            <Text>Гарах</Text>
          </Box>
        </Button>
      </Box>
      <BottomTabs {...props} />
    </Box>
  );
};

export default huwiinMedeelel;
