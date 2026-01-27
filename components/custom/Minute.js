import React from 'react'
import { Box, Heading, Center, Icon } from 'native-base'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import moment from 'moment'
import formatNumber from 'tools/function/formatNumber'
var interval = null
const Minute = ({ date, duusakhOgnoo }) => {
    const [minut, setMinut] = React.useState("0")

    React.useEffect(() => {
        function minutOlyo() {
            setMinut(moment.duration(moment(duusakhOgnoo || new Date()).diff(moment(date))).asMinutes())
        }
        if (!!date && !duusakhOgnoo) {
            interval = setInterval(minutOlyo, 1000)
        }
        else
            minutOlyo()
        return () => clearInterval(interval)
    }, [date, duusakhOgnoo])

    return (
        <Box>
            <Center flexDirection='row'>
                <Icon color='#1877f2' as={<MaterialIcons name='watch-later' />} />
                <Heading>{formatNumber(minut)}</Heading>
            </Center>
        </Box>
    )
}

export default React.memo(Minute)
