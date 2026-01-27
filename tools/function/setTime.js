import {Heading} from "native-base";
import React from "react";

export default function setTime(ognoo, hour) {
    hour = hour.split(':');
    ognoo.setHours(Number(hour[0]), Number(hour[1]), 0)
}

export function MinuteToTime(t) {
    let res = '00:00';
    if(t.min!==0&&t.min!==undefined){
        const tsag = t.min / 60;
        const uldMin = t.min % 60;
        const sTsag = parseInt(tsag);
        res = ''+('0'+sTsag).slice(-2)+':'+('0'+uldMin).slice(-2)+'';
    }
    return <Heading size={'xs'} mb={1} color="gray.500">
        {res}
    </Heading>
}

