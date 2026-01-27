import React, {useMemo} from 'react';
import {Box} from 'native-base';
import {
  Chart,
  Line,
  HorizontalAxis,
  VerticalAxis,
  Tooltip,
} from 'react-native-responsive-linechart';

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

function LineChart({tailanGaralt}) {
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
    <Box w={'full'} bgColor="white" padding={2}>
      <Chart
        style={{height: 200, width: '100%'}}
        padding={{left: 70, bottom: 20, right: 20, top: 20}}
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
    </Box>
  );
}

export default LineChart;
