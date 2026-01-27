import axios, {aldaaBarigch} from 'lib/uilchilgee';
import useSWR from 'swr';
import moment from 'moment';
import { useAuth } from 'components/context/Auth';

const fetcher = (url, token, baiguullagiinId, ognoo, salbariinId) => {
  const query = {
    baiguullagiinId,
    ekhlekhOgnoo: moment(ognoo[0]).format('YYYY-MM-DD 00:00:00'),
    duusakhOgnoo: moment(ognoo[1]).format('YYYY-MM-DD 23:59:59'),
    salbariinId
  };

  return axios(token)
    .post(url, query)
    .then(res => res.data)
    .catch(aldaaBarigch);
};

function useBorluulaltiinTailan(token, baiguullagiinId, ognoo) {
  const {salbariinId} = useAuth();
  const {data, mutate} = useSWR(
    !!token && !!baiguullagiinId && !!salbariinId
      ? ['/borluulaltiinTailanAvya', token, baiguullagiinId, ognoo,   salbariinId]
      : null,
    fetcher,
    {revalidateOnFocus: false},
  );
  return {borluulaltiinTailan: data, borluulaltiinTailanMutate: mutate};
}

export default useBorluulaltiinTailan;
