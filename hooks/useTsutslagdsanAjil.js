import axios, {aldaaBarigch} from 'lib/uilchilgee';
import useSWR from 'swr';
import {useState} from 'react';
import moment from 'moment';
import { useAuth } from 'components/context/Auth';

const fetcher = (url, token, ognoo, khuudaslalt, baiguullagiinId, salbariinId) => {
  const query = {
    ognoo: {
      $gte: moment(ognoo[0]).format('YYYY-MM-DD 00:00:00'),
      $lte: moment(ognoo[1]).format('YYYY-MM-DD 23:59:59'),
    },
    tuluv: '-1',
    baiguullagiinId: baiguullagiinId,
    salbariinId,
  };

  return axios(token)
    .post(url, {query, ...khuudaslalt})
    .then(res => res.data)
    .catch(aldaaBarigch);
};

function useTsutslagdsanAjluud(token, ognoo, baiguullagiinId) {
  const {salbariinId} = useAuth();
  const [khuudaslalt, setKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 10,
  });
  const {data, mutate} = useSWR(
    !!token && !!salbariinId
      ? ['/zakhalgiinJagsaaltAvya', token, ognoo, khuudaslalt, baiguullagiinId , salbariinId]
      : null,
    fetcher,
    {revalidateOnFocus: false},
  );
  return {
    setKhuudaslalt,
    tsutslagdsanAjluud: data,
    tsutslagdsanAjluudMutate: mutate,
  };
}

export default useTsutslagdsanAjluud;
