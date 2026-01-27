import {useMemo, useState} from 'react';
import axios, {aldaaBarigch} from 'lib/uilchilgee';
import useSWR from 'swr';

const fetcher = (
  url,
  token,
  {search, jagsaalt, ...khuudaslalt},
  query,
  order,
) =>
  axios(token)
    .get(url, {
      params: {
        query: {
          $or: [{ner: {$regex: search, $options: 'i'}}],
          ...query,
        },
        order,
        ...khuudaslalt,
      },
    })
    .then(res => res.data)
    .catch(aldaaBarigch);

function useMashiniiSegment(token, query, order, khuudasniiKhemjee) {
  const [khuudaslalt, setMashiniiSegmentKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: khuudasniiKhemjee || 100,
    search: '',
    jagsaalt: [],
  });
  const {data, mutate} = useSWR(
    !!token ? ['/mashiniiSegmentAvya', token, khuudaslalt, query, order] : null,
    fetcher,
    {revalidateOnFocus: false},
  );
  function next() {
    if (!!data)
      if (khuudaslalt?.khuudasniiDugaar < data?.niitKhuudas) {
        setMashiniiSegmentKhuudaslalt(a => {
          a.jagsaalt = [...a.jagsaalt, ...(data?.jagsaalt || [])];
          a.khuudasniiDugaar += 1;
          return {...a};
        });
      }
  }
  const jagsaalt = useMemo(() => {
    return [...(khuudaslalt?.jagsaalt || []), ...(data?.jagsaalt || [])];
  }, [khuudaslalt, data]);
  return {
    jagsaalt,
    next,
    setMashiniiSegmentKhuudaslalt,
    mashiniiSegmentGaralt: data,
    mashiniiSegmentMutate: mutate,
  };
}

export default useMashiniiSegment;
