import {useMemo, useState} from 'react';
import axios, {aldaaBarigch} from 'lib/uilchilgee';
import useSWR from 'swr';

const fetcher = (
  url,
  token,
  khuudaslalt,
  query,
  order,
) => {
  const { search, jagsaalt: _, ...rest } = khuudaslalt;
  const params = {
    query: JSON.stringify({
      $or: [{ ner: { $regex: search || "", $options: "i" } }],
      ...query,
    }),
    ...rest,
  };
  if (order) params.order = JSON.stringify(order);

  // Build URL manually to avoid double-encoding
  const queryString = Object.entries(params)
    .map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
    .join('&');

  return axios(token)
    .get(`${url}?${queryString}`)
    .then(res => res.data)
    .catch(e => {
      console.log("Fetch error data:", e.response?.data);
      console.log("Fetch error message:", e.message);
      throw e;
    });
};

function useMashiniiSegment(token, query, order, khuudasniiKhemjee) {
  const [khuudaslalt, setMashiniiSegmentKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: khuudasniiKhemjee || 100,
    search: '',
    jagsaalt: [],
  });
  const {data, mutate, error} = useSWR(
    !!token ? ['/mashiniiSegmentAvya', token, khuudaslalt, query, order] : null,
    fetcher,
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
    error,
  };
}

export default useMashiniiSegment;
