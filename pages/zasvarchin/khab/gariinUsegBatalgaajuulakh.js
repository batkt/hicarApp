import React from 'react';
import {Button, Box, Text, View, Toast, Image} from 'native-base';
import uilchilgee, {aldaaBarigch, url} from 'lib/uilchilgee';

const gariinUsegBatalgaajuulakh = props => {
  const {asuulgaJagsaalt, token, ajiltan, salbariinId} = props.route.params;
  function khadgalya() {
    if (asuulgaJagsaalt.length > 0 && ajiltan)
      asuulgaJagsaalt.forEach(x => {
        (x.asuulgaId = x._id), (x.asuulga = x.asuult);
      });
    let bugulsun = asuulgaJagsaalt.filter(x => x.khariult == true).length;
    let niitAsuult = asuulgaJagsaalt.length;
    const ugugdul = {
      ajiltniiId: ajiltan._id,
      ajiltniiNer: ajiltan.ner,
      bugulsun: bugulsun,
      niitAsuult: niitAsuult,
      ognoo: new Date(),
      asuulguud: asuulgaJagsaalt,
      salbariinId,
    };

    uilchilgee(token)
      .post('/khabTuukhKhadgalya', ugugdul)
      .then(({data}) => {
        if (data === 'Amjilttai') {
          Toast.show({
            title: 'Ажилттай',
            description: 'ХАБЭА амжилттай бүртгэгдлээ',
            status: 'success',
          });
          props.navigation.reset({index: 0, routes: [{name: 'Захиалга'}]});
        }
      })
      .catch(e => aldaaBarigch(e, Toast));
  }

  const khaKheviinEsekh =
    asuulgaJagsaalt?.filter(
      a => a.khariult !== undefined && a.khariult !== false,
    ).length === asuulgaJagsaalt?.length;

  return (
    <View flex={1} alignItems="center" justifyContent="center">
      <Text bold>Гарын үсгээр баталгаажуулах уу?</Text>
      {khaKheviinEsekh ? (
        <Image
          alt="gariinUseg"
          source={{uri: `${url}/gariinUsegAvya/${ajiltan?._id}`}}
          style={{width: 120, height: 120, resizeMode: 'contain'}}
        />
      ) : (
        <Text>Та аюулгүй байдлын дүрмээ хараарай</Text>
      )}
      <Box
        px={8}
        mt={5}
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          width: '100%',
          justifyContent: 'space-around',
        }}>
        <Button bg="#1877f2" onPress={props.navigation.goBack}>
          Зөвшөөрөхгүй
        </Button>
        <Button onPress={khadgalya} bg="#1877f2">
          {khaKheviinEsekh ? 'Баталгаажуулах' : 'Илгээх'}
        </Button>
      </Box>
    </View>
  );
};

export default gariinUsegBatalgaajuulakh;
