import React from 'react';
import {HStack, Center, Pressable, Icon, Text, Badge} from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
//{id,icon}selected
export default function FooterTabsExample({
  tabs = [],
  onTabChanged,
  songogdsonId,
}) {
  return (
    <HStack bg="white" alignItems="center" shadow={6}>
      {tabs.map((mur, index) => (
        <Pressable
          key={`mur${index}`}
          py={2}
          flex={1}
          onPress={() => onTabChanged(mur.id)}
          bg={songogdsonId === mur.id ? 'blue.100' : 'white'}
          borderTopWidth={songogdsonId === mur.id ? 3 : 0}
          borderTopColor={songogdsonId === mur.id ? '#1877f2' : 'white'}>
          <Center>
            <Icon
              color={songogdsonId === mur.id ? '#1877f2' : 'blue.500'}
              size="2xl"
              mb={1}
              as={<FontAwesome name={mur.icon} />}
            />
            <Badge
              bg={'blue.200'}
              rounded="full"
              size={'xs'}
              style={{position: 'absolute', top: -10, right: 15}}>
              <Text>{mur.toololt}</Text>
            </Badge>
          </Center>
        </Pressable>
      ))}
    </HStack>
  );
}
