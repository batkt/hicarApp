import {useAuth} from 'components/context/Auth';
import {
  HStack,
  IconButton,
  Text,
  Icon,
  Box,
  Input,
  Button,
  useToast,
  Avatar,
  Center,
  ScrollView,
} from 'native-base';
import React, {useState} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import otoFormData from 'tools/function/otoFormData';
import uilchilgee from 'lib/uilchilgee';
import moment from 'moment';

const nuutsUgSolikh = props => {
  const {token, ajiltan} = useAuth();
  const [khereglech, setKhereglech] = useState(ajiltan);
  const toast = useToast();

  function khadgalakh() {
    const {utas, khayag} = khereglech;
    ajiltan.utas = utas;
    ajiltan.khayag = khayag;
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
  }

  return (
    <Box flex={1}>
      <HStack
        bgColor="#1877f2"
        px={1}
        py={3}
        justifyContent="space-between"
        alignItems="center"
        borderBottomRadius="10px">
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
        <Center>
          <Text color="white" fontSize={16} fontWeight="bold">
            Миний мэдээлэл
          </Text>
        </Center>
        <Text color="white" fontSize={16} fontWeight="bold"></Text>
      </HStack>

      <Box flex={1} padding={2}>
        <Box flex={1}>
          <Box
            bgColor="white"
            shadow={3}
            borderRadius="lg"
            flex={1}
            paddingX={6}
            paddingY={2}>
            <Box flex={1}>
              <Center flex={1}>
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
              <Box flex={5}>
                <ScrollView>
                  <Box flexDirection="row" alignItems="center">
                    <Text width="1/3">Овог</Text>
                    <Input
                      variant="underlined"
                      width="2/3"
                      defaultValue={ajiltan?.ovog}
                      onChangeText={v => setKhereglech(a => ({...a, ovog: v}))}
                    />
                  </Box>
                  <Box flexDirection="row" alignItems="center">
                    <Text width="1/3">Нэр</Text>
                    <Input
                      variant="underlined"
                      width="2/3"
                      defaultValue={ajiltan?.ner}
                      onChangeText={v => setKhereglech(a => ({...a, ner: v}))}
                    />
                  </Box>
                  <Box flexDirection="row" alignItems="center">
                    <Text width="1/3">Регистр</Text>
                    <Input
                      isDisabled
                      _disabled={{bgColor: 'white'}}
                      variant="underlined"
                      width="2/3"
                      value={ajiltan?.register}
                    />
                  </Box>
                  <Box flexDirection="row" alignItems="center">
                    <Text width="1/3">Албан тушаал</Text>
                    <Input
                      variant="underlined"
                      width="2/3"
                      isDisabled
                      _disabled={{bgColor: 'white'}}
                      value={ajiltan?.albanTushaal}
                    />
                  </Box>
                  <Box flexDirection="row" alignItems="center">
                    <Text width="1/3">Ажилд орсон огноо</Text>
                    <Input
                      variant="underlined"
                      isDisabled
                      _disabled={{bgColor: 'white'}}
                      width="2/3"
                      value={moment(ajiltan?.ajildOrsonOgnoo).format(
                        'YYYY-MM-DD',
                      )}
                    />
                  </Box>
                  <Box flexDirection="row" alignItems="center">
                    <Text width="1/3">Имэйл хаяг</Text>
                    <Input
                      variant="underlined"
                      width="2/3"
                      defaultValue={ajiltan?.mail}
                      onChangeText={v => setKhereglech(a => ({...a, mail: v}))}
                    />
                  </Box>
                  <Box flexDirection="row" alignItems="center">
                    <Text width="1/3">Утас</Text>
                    <Input
                      variant="underlined"
                      width="2/3"
                      defaultValue={ajiltan?.utas}
                      onChangeText={v => setKhereglech(a => ({...a, utas: v}))}
                    />
                  </Box>
                  <Box flexDirection="row" alignItems="center">
                    <Text width="1/3">Гэрийн хаяг</Text>
                    <Input
                      variant="underlined"
                      width="2/3"
                      defaultValue={ajiltan?.khayag}
                      onChangeText={v =>
                        setKhereglech(a => ({...a, khayag: v}))
                      }
                    />
                  </Box>
                </ScrollView>
              </Box>
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
    </Box>
  );
};

export default nuutsUgSolikh;
