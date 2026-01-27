import * as React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Box,
  Avatar,
  Pressable,
  VStack,
  Text,
  HStack,
  Icon,
  Divider,
  Select,
  CheckIcon,
} from 'native-base';
import {useAuth} from 'components/context/Auth';
import {url} from 'lib/uilchilgee';
import {useKhuudasnuud} from 'pages/routers';
const Drawer = createDrawerNavigator();

const getIcon = screenName => {
  switch (screenName) {
    case 'Захиалга':
      return 'cart-arrow-right';
    case 'Outbox':
      return 'send';
    case 'Нүүр':
      return 'heart';
    case 'Archive':
      return 'archive';
    case 'Trash':
      return 'trash-can';
    case 'Spam':
      return 'alert-circle';
    case 'ХАБЭА-н бүртгэл':
      return 'shield-check';
    case 'Хувийн мэдээлэл':
      return 'heart';
    case 'Нууц үг солих':
      return 'lock';
    case 'Ирц':
      return 'lock-clock';
    case 'Оношилгоо':
      return 'tools';
    case 'Даалгавар':
      return 'clipboard-check-multiple-outline';
    default:
      return undefined;
  }
};

function CustomDrawerContent(props) {
  return (
    <React.Fragment>
      <DrawerContentScrollView {...props}>
        <VStack space={2} my={1} mx={1}>
          <Box px={4} display="flex" alignItems="center">
            <Avatar
              size="lg"
              source={{
                uri: `${url}/ajiltniiZuragAvya/${props.ajiltan?.baiguullagiinId}/${props.ajiltan?.zurgiinNer}`,
              }}>
              RS
            </Avatar>
            <Text bold color="gray.700" marginTop={2}>
              {props?.ajiltan?.ner}
            </Text>
          </Box>
          {props?.baiguullaga?.salbaruud &&
            (props.ajiltan?.erkh !== 'Zasvarchin' ||
              props.ajiltan?.salbaruud?.length > 1) && (
              <Select
                selectedValue={props?.salbariinId}
                minWidth="200"
                accessibilityLabel="Choose Service"
                placeholder="Choose Service"
                _selectedItem={{
                  bg: 'blue.500',
                  endIcon: <CheckIcon size="5" />,
                }}
                mt={1}
                onValueChange={itemValue => props.salbarSoliyo(itemValue)}>
                {props?.baiguullaga?.salbaruud
                  ?.filter(a => !!props.ajiltan?.salbaruud?.includes(a._id))
                  ?.map(option => (
                    <Select.Item
                      label={option?.ner}
                      value={option?._id}
                      key={option?._id}
                    />
                  ))}
              </Select>
            )}
          <VStack divider={<Divider />} space={4}>
            <VStack space={3}>
              {props.khuudasnuud?.map((khuudas, index) => {
                if (khuudas.hideDrawer !== false)
                  return (
                    <Pressable
                      key={index}
                      px={5}
                      py={3}
                      rounded="md"
                      style={{
                        backgroundColor:
                          index === props.state.index
                            ? '#1877f2'
                            : 'transparent',
                      }}
                      onPress={event => {
                        props.navigation.navigate(khuudas.name);
                      }}>
                      <HStack space={7} alignItems="center">
                        <Icon
                          color={
                            index === props.state.index ? 'white' : 'gray.500'
                          }
                          size={5}
                          as={
                            <MaterialCommunityIcons
                              name={getIcon(khuudas.name)}
                            />
                          }
                        />
                        <Text
                          fontWeight={500}
                          color={
                            index === props.state.index ? 'white' : 'gray.700'
                          }>
                          {khuudas.name}
                        </Text>
                      </HStack>
                    </Pressable>
                  );
                return undefined;
              })}
            </VStack>
          </VStack>
        </VStack>
        <Pressable
          px={5}
          py={3}
          onPress={props.signOut}
          rounded="md"
          m={1}
          bg="red.200">
          <HStack space={7} alignItems="center">
            <Icon
              color="red.500"
              size={5}
              as={<MaterialCommunityIcons name="power" />}
            />
            <Box flex={1}>
              <Text fontWeight={500} color="gray.700">
                Гарах
              </Text>
            </Box>
          </HStack>
        </Pressable>
      </DrawerContentScrollView>
    </React.Fragment>
  );
}

export var rightNavigation = null;

export default function MyDrawer({navigation}) {
  const {ajiltan, token, baiguullaga, signOut, salbariinId, salbarSoliyo} =
    useAuth();
  rightNavigation = navigation;
  const khuudasnuud = useKhuudasnuud(token, ajiltan);
  return (
    <Box safeArea flex={1}>
      <Drawer.Navigator
        edgeWidth={ajiltan.albanTushaal === 'Захирал' ? 0 : 45}
        initialRouteName={khuudasnuud[0].name}
        drawerContent={props => (
          <CustomDrawerContent
            {...props}
            khuudasnuud={khuudasnuud}
            ajiltan={ajiltan}
            baiguullaga={baiguullaga}
            signOut={signOut}
            salbariinId={salbariinId}
            salbarSoliyo={salbarSoliyo}
          />
        )}>
        {khuudasnuud?.map((x, i) => (
          <Drawer.Screen key={i} {...x} />
        ))}
      </Drawer.Navigator>
    </Box>
  );
}
