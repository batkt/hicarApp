import {useAuth} from 'components/context/Auth';
import {
  HStack,
  IconButton,
  Text,
  Icon,
  Box,
  VStack,
  FormControl,
  Input,
  Button,
  View,
  useToast,
} from 'native-base';
import React, {useState} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import otoFormData from 'tools/function/otoFormData';
import uilchilgee from 'lib/uilchilgee';

const nuutsUgSolikh = props => {
  const {token, ajiltan} = useAuth();
  const [khereglech, setKhereglech] = useState({});
  const toast = useToast();

  function khadgalakh() {
    const {odoogiinNuutsUg, shineNuutsUg, shineNuutsUgDavtan} = khereglech;
    if (
      odoogiinNuutsUg === ajiltan.nuutsUg &&
      !!shineNuutsUg &&
      shineNuutsUg === shineNuutsUgDavtan
    ) {
      ajiltan.nuutsUg = shineNuutsUg;
      ajiltan.zasakhEsekh = true;
      const ajiltanFrom = otoFormData(ajiltan);
      uilchilgee(token)
        .post('/ajiltanBurtgekh', ajiltanFrom)
        .then(({data, status}) => {
          if (status === 200 && 'Amjilttai' === data) {
            toast.show({title: 'Амжилттай заслаа', status: 'success'});
            props.navigation.goBack();
          }
        });
    } else
      toast.show({title: 'Мэдээлэл буруу оруулсан байна', status: 'warning'});
  }

  return (
    <Box flex={1} bg="#f5f5fb">
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
            Нууц үг солих
          </Text>
        </HStack>
      </HStack>

      <Box flex={1} padding={2}>
        <Box
          bgColor="white"
          shadow={3}
          borderRadius="lg"
          flex={1}
          paddingX={6}
          paddingY={2}>
          <Box flex={1}>
            <FormControl>
              <FormControl.Label>Одоо ашиглаж байгаа нууц үг</FormControl.Label>
              <Input
                type="password"
                onChangeText={v =>
                  setKhereglech(a => ({...a, odoogiinNuutsUg: v}))
                }
              />
              <FormControl.Label marginTop="5">Шинэ нууц үг</FormControl.Label>
              <Input
                type="password"
                onChangeText={v =>
                  setKhereglech(a => ({...a, shineNuutsUg: v}))
                }
              />
              <FormControl.Label marginTop="5">
                Шинэ нууц үгээ давтана уу
              </FormControl.Label>
              <Input
                type="password"
                onChangeText={v =>
                  setKhereglech(a => ({...a, shineNuutsUgDavtan: v}))
                }
              />
            </FormControl>
          </Box>
          <Button
            bgColor="#1877f2"
            shadow={3}
            borderRadius="lg"
            _pressed={{backgroundColor: 'darkBlue.300'}}
            _text={{color: 'white'}}
            onPress={khadgalakh}>
            <Box paddingY={2}>
              <Text color="white">Хадгалах</Text>
            </Box>
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default nuutsUgSolikh;
