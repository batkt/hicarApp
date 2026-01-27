import React from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Button, Modal} from 'native-base';
import {useState} from 'react';
const {Platform, Appearance} = require('react-native');

function DatePicker({value, onChange, children, width}) {
  const colorScheme = Appearance.getColorScheme();
  const [show, setShow] = useState(false);
  return (
    <Button
      colorScheme="blue"
      _text={{color: 'white'}}
      onPress={() => setShow(true)}
      width={width}>
      {show && Platform.OS === 'android' && (
        <DateTimePicker
          testID="dateTimePicker"
          mode={'date'}
          display="spinner"
          value={value}
          onChange={(e, v) => {
            onChange(v);
            setShow(false);
          }}
          onTouchCancel={() => setShow(false)}
        />
      )}
      <Modal
        size="lg"
        isOpen={show && Platform.OS === 'ios'}
        onClose={() => setShow(false)}>
        <Modal.Content bgColor={colorScheme === 'dark' ? 'gray.800' : '#fff'}>
          <DateTimePicker
            testID="dateTimePicker"
            mode={'date'}
            display="inline"
            value={value}
            onChange={(e, v) => {
              onChange(v);
              setShow(false);
            }}
            onTouchCancel={() => setShow(false)}
          />
        </Modal.Content>
      </Modal>
      {children}
    </Button>
  );
}

export default DatePicker;
