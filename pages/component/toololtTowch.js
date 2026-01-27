import React from "react";
import { StyleSheet, TouchableOpacity, Text, Image , View, Box} from "react-native";

export default function ({ title, url, onPress ,toololt}) {
  return (
    <TouchableOpacity style={css.button} onPress={onPress}>
      <View  style={{flex:  2, alignItems:"center", alignSelf:"center"}}>
          <Image style={{flex: 1, width: 30, height: 30, resizeMode: 'contain' }} source={url} />
      </View> 
      <View style={{ flex:4, alignItems:"center", alignSelf:"center"}}>
        <Text style={css.text}>{title}</Text>
        <Text   style={{color: '#1877f2',  fontSize: 24, fontWeight:"bold"}}>
              {toololt}
         </Text>
      </View>
    </TouchableOpacity>
  );
}

const css = StyleSheet.create({
    button: {
        padding:6,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        width: '48%',
        height:'90%',
        backgroundColor: 'white',
        shadowColor: '#0098E8',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
      },
      text:{color: "#1877f2",textAlign: "center", fontWeight:"bold"}
});
