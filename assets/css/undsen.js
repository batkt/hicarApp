import {StyleSheet} from 'react-native';

export const undsen = StyleSheet.create({
  tabText: {
    fontSize: 8,
  },
  w_full: {
    width: '100%',
  },
  h_full: {
    height: '100%',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  flex_1: {
    flex: 1,
  },
  flex_row: {
    flexDirection: 'row',
  },
  justify_center: {
    justifyContent: 'center',
  },
  items_center: {
    alignItems: 'center',
  },
  p_5: {
    padding: 5,
  },
  px_5: {
    paddingHorizontal: 5,
  },
  py_5: {
    paddingVertical: 5,
  },
  px_10: {
    paddingHorizontal: 10,
  },
  py_10: {
    paddingVertical: 10,
  },
  px_20: {
    paddingHorizontal: 20,
  },
  py_20: {
    paddingVertical: 20,
  },
  mt_5: {
    marginTop: 5,
  },
  mt_10: {
    marginTop: 10,
  },
  mt_20: {
    marginTop: 20,
  },
  mt_40: {
    marginTop: 40,
  },
  mt_2: {
    marginTop: 2,
  },
  text_shadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  text_xl: {
    fontSize: 20,
  },
  text_sm: {
    fontSize: 12,
  },
  text_bold: {
    fontWeight: 'bold',
  },
  text_white: {
    color: 'white',
  },
  bg_gray_100: {
    backgroundColor: '#c0c0c0',
  },
  bg_blue_100: {
    backgroundColor: '#2c53d2',
  },
  bg_white: {
    backgroundColor: 'white',
  },
  rounded_full: {
    borderRadius: 99999999,
  },
  border_b: {
    borderBottomColor: '#c0c0c0',
    borderBottomWidth: 0.3,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
