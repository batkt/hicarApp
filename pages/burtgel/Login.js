import React, {useEffect, useState} from 'react';
import {
  Box,
  Heading,
  VStack,
  FormControl,
  Input,
  KeyboardAvoidingView,
  Button,
  Checkbox,
  Link,
  Text,
  Image,
  Center,
} from 'native-base';
import SecureStore from '@react-native-async-storage/async-storage';
import {useAuth} from 'components/context/Auth';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Appearance, Keyboard} from 'react-native';

const Login = () => {
  const colorScheme = Appearance.getColorScheme();
  const {signIn} = useAuth();
  const [khereglech, setKhereglech] = useState({});
  const [keyboardStatus, setKeyboardStatus] = useState('hidden');

  useEffect(() => {
    SecureStore.getItem('mail', (e, mail) => {
      if (!!mail) {
        khereglech.mail = mail;
        setKhereglech({...khereglech});
      }
    });
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardStatus('shown');
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardStatus('hidden');
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  function newterya() {
    if (khereglech.namaigSana === true) {
      SecureStore.setItem('mail', khereglech.mail);
    }
    signIn(khereglech);
  }

  return (
    <KeyboardAvoidingView flex={1} bgColor="white">
      <Box flex={1} backgroundColor="darkBlue.600" flexDirection="column">
        <Box
          flex={keyboardStatus === 'shown' ? 0.15 : 0.4}
          width="100%"
          alignItems="center"
          padding={3}
          justifyContent="center">
          <Image
            //  style={{width: 100, height: 100}}
            //  style={styles.stretch}
            size={keyboardStatus === 'shown' ? 'sm' : '2xl'}
            source={require('../../assets/images/NuurZurag.gif')}
          />
        </Box>
        <Box
          flex={keyboardStatus === 'shown' ? 0.85 : 0.6}
          borderTopRadius={30}>
          <Box
            height="100%"
            width="100%"
            bg="white"
            borderTopRadius={30}
            px={10}
            py={keyboardStatus === 'shown' ? 2 : 5}>
            <VStack space={2} mt={keyboardStatus === 'shown' ? 2 : 5}>
              <FormControl>
                <FormControl.Label
                  _text={{
                    color: '#1877f2',
                    fontSize: 'sm',
                    fontWeight: 600,
                  }}>
                  Хэрэглэгчийн нэр
                </FormControl.Label>
                <Input
                  _focus={{borderColor: '#1877f2'}}
                  value={khereglech.mail || ''}
                  onChangeText={v => setKhereglech(a => ({...a, mail: v}))}
                />
              </FormControl>
              <FormControl mb={5}>
                <FormControl.Label
                  _text={{
                    color: '#1877f2',
                    fontSize: 'sm',
                    fontWeight: 600,
                  }}>
                  Нууц үг
                </FormControl.Label>
                <Input
                  type="password"
                  _focus={{borderColor: '#1877f2'}}
                  onChangeText={v => setKhereglech(a => ({...a, nuutsUg: v}))}
                />
                <VStack alignSelf="flex-end" flexDirection="row" marginTop={5}>
                  <Heading size="xs" color={'#1877f2'}>
                    Hэр сануулах
                  </Heading>
                  <Checkbox
                    value="test"
                    accessibilityLabel="This is a dummy checkbox"
                    defaultIsChecked={khereglech.namaigSana}
                    colorScheme="green"
                    onChange={v => setKhereglech(a => ({...a, namaigSana: v}))}
                    ml={2}
                  />
                </VStack>
              </FormControl>
              <VStack space={2}>
                <Button
                  bg="#1877f2"
                  _pressed={{bg: 'darkBlue.300'}}
                  _text={{color: 'white'}}
                  onPress={newterya}>
                  <Box paddingY={2}>
                    <Text color="white">Нэвтрэх</Text>
                  </Box>
                </Button>
              </VStack>
            </VStack>
          </Box>
        </Box>
      </Box>
      {keyboardStatus === 'hidden' && (
        <Box paddingY={5} alignItems="center">
          <Box flexDirection="row">
            Powered by {'   '}
            <Link href="http://zevtabs.mn/">
              <Center>
                <MaterialIcons color="#32bb9f" name="copyright" />
              </Center>
              <Heading size="sm" color="#1877f2">
                {' '}
                ZEVTABS LLC
              </Heading>
            </Link>
          </Box>
        </Box>
      )}
    </KeyboardAvoidingView>
  );
};
//   return (
//     <Box flex={1} bgColor="white">
//       <Box flex={1} p={2} w="90%" mx="auto" justifyContent="center">
//         <Heading size="lg" color="blue.500">
//           Сайн байна уу!
//         </Heading>
//         <Heading color="blue.400" size="xs"></Heading>
//         <VStack space={2} mt={5}>
//           <FormControl>
//             <FormControl.Label
//               _text={{color: '#1877f2', fontSize: 'sm', fontWeight: 600}}>
//               Хэрэглэгчийн нэр
//             </FormControl.Label>
//             <Input
//               color={colorScheme === 'dark' ? 'white' : null}
//               _focus={{borderColor: '#1877f2'}}
//               value={khereglech.mail || ''}
//               onChangeText={v => setKhereglech(a => ({...a, mail: v}))}
//             />
//           </FormControl>
//           <FormControl mb={5}>
//             <FormControl.Label
//               _text={{color: '#1877f2', fontSize: 'sm', fontWeight: 600}}>
//               Нууц үг
//             </FormControl.Label>
//             <Input
//               color={colorScheme === 'dark' ? 'white' : null}
//               type="password"
//               _focus={{borderColor: '#1877f2'}}
//               onChangeText={v => setKhereglech(a => ({...a, nuutsUg: v}))}
//             />
//             <VStack alignSelf="flex-end" flexDirection="row" marginTop={5}>
//               <Heading size="xs" color="#1877f2">
//                 Hэр сануулах
//               </Heading>
//               <Checkbox
//                 value="CMakeLists.txt"
//                 accessibilityLabel="This is a dummy checkbox"
//                 defaultIsChecked={khereglech.namaigSana}
//                 colorScheme="blue"
//                 onChange={v => setKhereglech(a => ({...a, namaigSana: v}))}
//                 ml={2}
//               />
//             </VStack>
//           </FormControl>
//           <VStack space={2}>
//             <Button
//               bgColor="#1877f2"
//               _pressed={{bg: 'darkBlue.500'}}
//               _text={{color: 'white'}}
//               onPress={newterya}>
//               Нэвтрэх
//             </Button>
//           </VStack>
//         </VStack>
//       </Box>
//       <Box alignItems="center">
//         <Box flexDirection="row">
//           Powered by{' '}
//           <Link href="http://zevtabs.mn/">
//             <Heading size="sm" color="#1877f2">
//               ZEVTABS LLC
//             </Heading>
//           </Link>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

export default Login;
