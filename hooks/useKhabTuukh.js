import {useState, useMemo} from 'react';
import axios, {aldaaBarigch} from 'lib/uilchilgee';
import useSWR from 'swr';
import moment from 'moment';

const fetcher = (
  url,
  token,
  ajiltan,
  {search, jagsaalt, ...khuudaslalt},
  ognoo,
) => {
  const query = {
    baiguullagiinId: ajiltan?.baiguullagiinId,
  };
  if (ajiltan?.erkh === 'Zasvarchin') query.ajiltniiId = ajiltan?._id;
  if (!!ognoo)
    query.ognoo = {
      $gte: moment(ognoo[0]).format('YYYY-MM-DD 00:00:00'),
      $lte: moment(ognoo[1]).format('YYYY-MM-DD 23:59:59'),
    };

  return axios(token)
    .post(url, {query, ...khuudaslalt})
    .then(res => res.data)
    .catch(aldaaBarigch);
};

export default function useKhabTuukh(token, ajiltan, ognoo) {
  const [khuudaslalt, setKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 20,
    search: '',
    jagsaalt: [],
  });
  const {data, mutate} = useSWR(
    !!token && !!ajiltan
      ? ['/khabTuukhAvya', token, ajiltan, khuudaslalt, ognoo]
      : null,
    fetcher,
    {revalidateOnFocus: false},
  );
  function nextAsuult() {
    if (data?.khuudasniiDugaar < data?.niitKhuudas)
      setKhuudaslalt(a => ({
        ...a,
        khuudasniiDugaar: a.khuudasniiDugaar + 1,
        jagsaalt: [...khuudaslalt.jagsaalt, ...(data?.jagsaalt || [])],
      }));
  }

  function reset() {
    setKhuudaslalt({
      khuudasniiDugaar: 1,
      khuudasniiKhemjee: 20,
      search: '',
      jagsaalt: [],
    });
    mutate();
  }

  const jagsaalt = useMemo(() => {
    return [...(khuudaslalt?.jagsaalt || []), ...(data?.jagsaalt || [])];
  }, [khuudaslalt, data]);

  return {
    setKhuudaslalt,
    asuultTuukhJagsaalt: jagsaalt,
    asuultTuukhGaralt: data,
    asuultMutate: reset,
    nextAsuult,
  };
}
