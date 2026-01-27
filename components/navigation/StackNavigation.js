import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();
export default function Snavigation({khuudasnuud ,...busad}) {
    return (
        <Stack.Navigator {...busad}>
            {khuudasnuud.map((x,i)=><Stack.Screen key={i} {...x}/>)}
        </Stack.Navigator>
    )
}
