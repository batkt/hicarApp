import { HStack, IconButton, Text, ScrollView, Icon, Box, Divider, Heading } from 'native-base'
import React from 'react'
import { Pressable } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

const Mur = ({ icon, label,onPress }) => <React.Fragment>
    <Pressable width={'100%'} onPress={onPress}>
        <HStack px={1} py={3} width={'100%'}>
            <HStack space={4} width={'100%'} >
                <Box bg='#1877f2' rounded='sm' padding={1}>
                    <Icon size="sm" as={<MaterialIcons name={icon} />} color='white' />
                </Box>
                <Text fontWeight='bold'>{label}</Text>
                <Icon style={{ marginLeft: 'auto' }} size="sm" as={<MaterialIcons name='arrow-forward' color='white' />} />
            </HStack>
        </HStack>
    </Pressable>
    <Divider />
</React.Fragment>

const menu = [
    { name: 'undsenMedeelelZasakh', label: 'Хувийн мэдээлэл засах', icon: 'verified-user' },
    { name: 'nuutsUgSolikh', label: 'Нууц үг солих', icon: 'lock' }
]

const tokhirgoo = (props) => {
    return (
        <Box flex={1} >
            <HStack bg='#1877f2' px={1} py={3} alignItems='center'>
                <HStack space={4} alignItems='center'>
                    <IconButton colorScheme='blue' icon={<Icon size="sm" as={<MaterialIcons name='arrow-back' />} color="white" />} onPress={() => props.navigation.goBack()} />
                    <Text color="white" fontSize={20} fontWeight='bold'>Тохиргоо</Text>
                </HStack>
            </HStack>
            <ScrollView padding={1}>
               
                <Divider/>
                {
                    menu.map((a, i) => <Mur key={i + 'gg'} {...a} onPress={()=>props.navigation.navigate(a.name)}/>)
                }
            </ScrollView>
        </Box>
    )
}

export default tokhirgoo
