import axios, {aldaaBarigch} from 'lib/uilchilgee';
import useSWR from 'swr';
import { useAuth } from 'components/context/Auth';

const fetcher = (
  url,
  token,
  baiguullagiinId,
  queryGaraasUgsun = {},salbariinId,
) => {
  

  return axios(token)
    .post(url, {query:{salbariinId,baiguullagiinId,...queryGaraasUgsun}})
    .then(res => res.data)
    .catch(aldaaBarigch);
};

export default function useToololtTsutslagdsanZakhialga(
  token,
  baiguullagiinId,
  queryGaraasUgsun,
) {
  const {salbariinId} = useAuth()
  const {data, mutate} = useSWR(
    !!token && !!baiguullagiinId && !!salbariinId
      ? [
          '/tsutslagdsanZakhialgiinDunAvya',
          token,
          baiguullagiinId,
          queryGaraasUgsun,
          salbariinId
        ]
      : null,
    fetcher,
  );
  
  return {
    tsutslagdsanGaralt: data,
    tsutslagdsanMutate: mutate,
  };
}
