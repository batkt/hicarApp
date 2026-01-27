import React, {useState, useMemo} from 'react';
import {Box} from 'native-base';
import {
  Chart,
  Line,
  HorizontalAxis,
  VerticalAxis,
  Tooltip,
} from 'react-native-responsive-linechart';

import {useAuth} from 'components/context/Auth';
import BottomTabs from 'components/layout/ZakhiralBottomTabs';
import useTailan from 'hooks/tailan/useTailan';
import moment from 'moment';
import _ from 'lodash';
import formatNumberNershil from 'tools/function/formatNumberNershil';

function CustomToolTip(props) {
  if (props?.value?.y === 0) return <Tooltip />;
  return (
    <Tooltip
      position={props.position}
      value={props.value}
      theme={{formatter: ({y}) => formatNumberNershil(y), shape: {width: 70}}}
    />
  );
}

function Chart1(props) {
  const {token, salbariinId, setHuudasTuluv, ajiltan, sonorduulga} = useAuth();
  const [ognoo, setOgnoo] = useState([new Date(), new Date()]);
  const [tailan, setTailan] = useState('borluulaltiinTailanKhugatsaagaarAvya');
  const [nariivchlal, setNariivchlal] = useState('day');
  const query = useMemo(() => {
    return {
      salbariinId,
      nariivchlal,
      ekhlekhOgnoo: moment(ognoo[0]).format('2021-MM-01 HH:mm:ss'),
      duusakhOgnoo: moment(ognoo[1]).format('YYYY-MM-DD HH:mm:ss'),
    };
  }, [ognoo, nariivchlal, salbariinId]);
  const {tailanGaralt, tailanMutate} = useTailan(tailan, token, query);

  const chart = useMemo(() => {
    let data = [];
    let max = 0;
    data = tailanGaralt?.datasets?.map(mur => {
      return mur.data.map((a, i) => {
        let y = _.toNumber(a);
        if (max < y) max = y;
        return {x: i, y: _.toNumber(a)};
      });
    });
    return {
      data,
      max,
    };
  }, [tailanGaralt]);

  return (
    <Box flex={1}>
      <Box flex={1} bgColor="white" padding={2}>
        {tailanGaralt && chart?.data?.length > 0 && (
          <Chart
            style={{height: 200, width: '100%'}}
            padding={{left: 80, bottom: 20, right: 20, top: 20}}
            xDomain={{min: 0, max: tailanGaralt?.labels?.length || 20}}
            yDomain={{min: 0, max: chart.max || 20}}
            viewport={{size: {width: 5}}}>
            <VerticalAxis
              tickCount={10}
              theme={{
                labels: {
                  label: {fontSize: 16},
                  formatter: v => formatNumberNershil(v.toFixed(0)),
                },
              }}
            />
            <HorizontalAxis
              tickCount={23}
              theme={{
                labels: {
                  label: {fontSize: 16},
                  formatter: v =>
                    tailanGaralt?.labels && tailanGaralt?.labels[v?.toFixed(0)],
                },
              }}
            />
            {chart?.data?.map((mur, i) => (
              <Line
                key={`test${i}`}
                data={mur}
                theme={{
                  stroke: {
                    color: tailanGaralt?.datasets[i]?.borderColor,
                    width: 5,
                  },
                  scatter: {
                    default: {
                      width: 8,
                      height: 8,
                      rx: 4,
                      color: tailanGaralt?.datasets[i]?.borderColor,
                    },
                    selected: {color: 'black'},
                  },
                }}
                tooltipComponent={<CustomToolTip />}
              />
            ))}
          </Chart>
        )}
      </Box>
      <BottomTabs {...props} />
    </Box>
  );
}

export default Chart1;
