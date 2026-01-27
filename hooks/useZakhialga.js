import {useState, useMemo} from 'react';
import axios, {aldaaBarigch} from 'lib/uilchilgee';
import useSWR from 'swr';
import {useAuth} from 'components/context/Auth';

const fetcher = (
  url,
  token,
  baiguullagiinId,
  ajiltniiShuult = [],
  {search, jagsaalt, ...khuudaslalt},
  queryGaraasUgsun = {},
  salbariinId,
) => {
  const query = {
    salbariinId,
    baiguullagiinId,
    tuluv: {$nin: ['-1']},
    $or: [
      {khariltsagchiinNer: {$regex: search, $options: 'i'}},
      {khariltsagchiinUtas: {$regex: search}},
      {mashiniiDugaar: {$regex: search}},
    ],
    ...queryGaraasUgsun,
  };
  if (ajiltniiShuult.length > 0) {
    query.ajiltniiId = {$in: ajiltniiShuult.map(x => x._id)};
  }

  return axios(token)
    .post(url, {order: {createdAt: -1}, query, ...khuudaslalt})
    .then(res => res.data)
    .catch(aldaaBarigch);
};

export default function useZakhialga(
  token,
  baiguullagiinId,
  ajiltniiShuult,
  queryGaraasUgsun,
) {
  const {salbariinId} = useAuth();
  const [khuudaslalt, setKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 20,
    search: '',
    jagsaalt: [],
  });
  const {data, mutate} = useSWR(
    !!token && !!baiguullagiinId && !!salbariinId
      ? [
          '/zakhialgiinJagsaaltAvya',
          token,
          baiguullagiinId,
          ajiltniiShuult,
          khuudaslalt,
          queryGaraasUgsun,
          salbariinId,
        ]
      : null,
    fetcher,
  );
  function nextZakhialguud() {
    if (!!data && khuudaslalt.khuudasniiDugaar < data.niitKhuudas)
      setKhuudaslalt(a => {
        a.jagsaalt = [...a.jagsaalt, ...(data?.jagsaalt || [])];
        a.khuudasniiDugaar += 1;
        return {...a};
      });
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

  var timeout = null;
  function onSearch(search) {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      setKhuudaslalt(a => {
        a.search = search;
        a.jagsaalt = [];
        a.khuudasniiDugaar = 1;
        return {
          ...a,
        };
      });
    }, 300);
  }
  return {
    setKhuudaslalt,
    zakhialgiinJagsaalt: khuudaslalt.jagsaalt,
    zakhialgiinJagsaaltMixed: jagsaalt,
    zakhialgiinGaralt: data,
    zakhialgaMutate: reset,
    nextZakhialguud,
    onSearch,
  };
}
