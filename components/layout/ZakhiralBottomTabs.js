import React from 'react';
import {HStack, Center, Pressable, Icon} from 'native-base';
import {useAuth} from 'components/context/Auth';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';
export default function FooterTabsExample(props) {
  const tabs = [
    {
      id: '3',
      icon: 'chart-pie',
    },
    {id: '2', icon: 'tasks'},
    {id: '4', icon: 'user'},
  ];
  const {huudasTuluv, setHuudasTuluv} = useAuth();
  const [ognoo, setOgnoo] = React.useState([new Date(), new Date()]);
  const onTabChanged = id => {
    setHuudasTuluv(id);
    if (id === '2') {
      props.navigation.navigate('jagsaalt');
    } else if (id === '3') {
      props.navigation.navigate('Нүүр', {
        ognoo: [
          moment(ognoo[0]).format('YYYY-MM-DD 00:00:00'),
          moment(ognoo[1]).format('YYYY-MM-DD 23:59:59'),
        ],
      });
    } else if (id === '4') {
      // props.navigation.toggleDrawer();
      props.navigation.navigate('huwiinMedeelel');
    }
  };
  return (
    <HStack bg="white" alignItems="center" shadow={6}>
      {tabs.map((mur, index) => (
        <Pressable
          key={`mur${index}`}
          py={2}
          flex={1}
          onPress={() => onTabChanged(mur.id)}>
          <Center>
            <Icon
              color={huudasTuluv === mur.id ? 'darkBlue.600' : 'gray.500'}
              size="5"
              m={2}
              as={<FontAwesome name={mur.icon} />}
            />
          </Center>
        </Pressable>
      ))}
    </HStack>
  );
}
