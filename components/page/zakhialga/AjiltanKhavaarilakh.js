import {useAjiltniiJagsaalt} from 'hooks/useAjiltan';
import {url} from 'lib/uilchilgee';
import {Avatar, Box, ScrollView, Switch, Text} from 'native-base';
import React from 'react';

function Zasvarchin({ugugdul, value, onChange}) {
  return (
    <Box flexDirection={'row'} justifyContent="space-between" p={3}>
      <Box flexDirection={'row'} alignItems="center">
        <Avatar
          size="md"
          source={{
            uri: `${url}/ajiltniiZuragAvya/${ugugdul?.baiguullagiinId}/${ugugdul?.zurgiinNer}`,
          }}>
          RS
        </Avatar>
        <Text marginLeft={5}>{ugugdul?.ner}</Text>
      </Box>
      <Switch
        offTrackColor="blue.100"
        onTrackColor="blue.200"
        onThumbColor="blue.500"
        offThumbColor="blue.50"
        isChecked={value}
        onChange={() => onChange(ugugdul)}
      />
    </Box>
  );
}

function AjiltanKhavaarilakh({ajilchdiinGaralt, value = [], onChange}) {
  function onChangeMur(mur) {
    const index = value.findIndex(a => a._id === mur?._id);
    if (index !== -1) value.splice(index, 1);
    else value.push(mur);
    onChange([...value]);
  }

  return (
    <ScrollView>
      {ajilchdiinGaralt?.jagsaalt?.map((item, index) => {
        return (
          <Zasvarchin
            key={item._id}
            ugugdul={item}
            value={!!value?.find(a => a._id === item._id)}
            onChange={onChangeMur}
            index={index}
          />
        );
      })}
    </ScrollView>
  );
}

export default AjiltanKhavaarilakh;
