import * as React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import {
  Box,
  VStack,
  Text,
  Icon,
  Heading,
  Pressable,
  Divider,
  View,
} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useAuth} from 'components/context/Auth';
import {RefreshControl} from 'react-native';
import moment from 'moment';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const {sonorduulga} = useAuth();

  const onClick = mur => {
    sonorduulga.sonorduulgaKharlaa(mur._id);
    if (mur?.usrekhTsonkh === 'daalgavar') {
      props.navigation.navigate('daalgavarUzeh', {medeelel: mur.object, haanaas: 'notification'});
    } else
      props.navigation.navigate('zakhialgiinDelgerengui', mur.object);
  };

  return (
    <DrawerContentScrollView
      {...props}
      safeArea
      refreshControl={
        <RefreshControl
          refreshing={!sonorduulga.sonorduulga}
          onRefresh={sonorduulga.resetSonorduulga}
        />
      }
      onScrollEndDrag={sonorduulga.nextSonorduulga}>
      <VStack space={1} padding={2}>
        <Box py={1} display="flex" flexDirection="row">
          <Box flex={1}>
            <Heading size="md" bold color="darkBlue.600" alignContent="center">
              Мэдэгдэл
            </Heading>
          </Box>
        </Box>
        <Divider />
        {[
          ...(sonorduulga?.sonorduulga?.jagsaalt || []),
          ...(sonorduulga?.jagsaalt || []),
        ].map((mur, index) => (
          <Pressable
            key={`sonorduulga${index}`}
            width="100%"
            opacity={mur.kharsanEsekh ? 0.8 : 1}
            onPress={() => onClick(mur)}>
            <VStack flexDirection="row" width="100%">
              <VStack alignItems="center" justifyContent="center">
                <Box padding={2} bg="#1877f2" rounded="md">
                  <Icon
                    size="md"
                    color="white"
                    as={<MaterialIcons name="notifications" />}
                  />
                  {!mur.kharsanEsekh && (
                    <View
                      bg="red.500"
                      padding={1}
                      position="absolute"
                      rounded="full"></View>
                  )}
                </Box>
              </VStack>
              <VStack maxW={220} pl={4}>
                <Text bold color="gray.700">
                  {mur.object.zakhialgiinDugaar ||
                  mur?.object?.ajiltniiNer}
                </Text>
                <Text bold color="#1877f2" numberOfLines={1}>
                  {mur.object?.khariltsagchiinUtas}
                  {mur?.object?.tailbar}
                </Text>
              </VStack>
              <VStack ml="auto">
                <Heading textAlign="right" size="sm" color="gray.700">
                  {moment(mur.object.ognoo).format('YYYY-MM-DD')}
                </Heading>
                <Text textAlign="right" bold color="green.700">
                  {mur.object.mashiniiDugaar}
                </Text>
              </VStack>
            </VStack>
            <Divider />
          </Pressable>
        ))}
      </VStack>
    </DrawerContentScrollView>
  );
}

function RightDrawer({component}) {
  return (
    <Drawer.Navigator
      drawerPosition="right"
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name="default"
        component={component}
        options={{headerShown: false}}
      />
    </Drawer.Navigator>
  );
}

export default RightDrawer;
