import React from 'react';
import {Avatar, Box, Center, Heading, Pressable} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from 'components/context/Auth';
import {url} from 'lib/uilchilgee';

const IrtsAmjilttai = props => {
  const {title, content} = props?.route?.params || {};
  const {ajiltan} = useAuth();
  const navigation = useNavigation();
  return (
    <Box flex={1} style={{backgroundColor: '#f5f5fb'}} justifyContent="center">
      <Center>
        <Avatar
          size={'2xl'}
          source={{
            uri: `${url}/ajiltniiZuragAvya/${ajiltan?.baiguullagiinId}/${ajiltan?.zurgiinNer}`,
          }}
        />
        <Heading size={'md'}>{title}</Heading>
        <Heading color={'blue.500'}>{content}</Heading>
        <Pressable
          mt={5}
          w={'80%'}
          bg="blue.500"
          rounded={'full'}
          p={2}
          onPress={() => navigation.goBack()}>
          <Center>
            <Heading color="white">Хаах</Heading>
          </Center>
        </Pressable>
      </Center>
    </Box>
  );
};

export default IrtsAmjilttai;
