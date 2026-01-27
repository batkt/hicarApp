import {useState} from 'react';
import axios, {aldaaBarigch} from 'lib/uilchilgee';
import useSWR from 'swr';
import { useAuth } from 'components/context/Auth';

const fetcher = (
  url,
  token,
  baiguullagiinId,
  {search, jagsaalt, ...khuudaslalt},
  salbariinId
) => {
  const query = {
    baiguullagiinId,
    salbariinId
  };

  return axios(token)
    .post(url, {query, ...khuudaslalt})
    .then(res => res.data)
    .catch(aldaaBarigch);
};

export default function useAsuulga(
  token,
  baiguullagiinId,
) {
  const {salbariinId} = useAuth()
  const [khuudaslalt, setKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 20,
    search: '',
    jagsaalt: [],
  });
  const {data, mutate} = useSWR(
    !!token && !!baiguullagiinId && !!salbariinId
      ? [
          '/asuulgaAvya',
          token,
          baiguullagiinId,
          khuudaslalt,
          salbariinId
        ]
      : null,
    fetcher,
    { revalidateOnFocus: false }
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
  return {
    setKhuudaslalt,
    asuultJagsaalt: khuudaslalt.jagsaalt,
    asuultiinGaralt: data,
    asuultMutate: reset,
    nextAsuult,
  };
}
