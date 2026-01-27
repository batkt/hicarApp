import axios, {aldaaBarigch} from 'lib/uilchilgee';
import useSWR from 'swr';
import moment from 'moment';
import { useAuth } from 'components/context/Auth';

const fetcher = (url, token, ognoo,salbariinId) => {
  const query = {
    ekhlekhOgnoo: moment(ognoo[0]).format('YYYY-MM-DD 00:00:00'),
    duusakhOgnoo: moment(ognoo[1]).format('YYYY-MM-DD 23:59:59'),
    salbariinId:salbariinId,
  };

  return axios(token)
    .post(url, query)
    .then(res => res.data)
    .catch(aldaaBarigch);
};

function useKhabiinToo(token, ognoo) {
  const {salbariinId} = useAuth()
  const {data, mutate} = useSWR(
    !!token 
      ? ['/khabToololtAvya', token, ognoo,salbariinId]
      : null,
    fetcher,
    {revalidateOnFocus: false},
  );
  return {
    khabiinToo: data,

    khabiinTooMutate: mutate,
  };
}

export default useKhabiinToo;
