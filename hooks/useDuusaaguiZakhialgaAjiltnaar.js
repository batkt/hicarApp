import axios, {aldaaBarigch} from 'lib/uilchilgee';
import useSWR from 'swr';
import moment from 'moment'
const fetcher = (
  url,
  token,
  ognoo
) => {
  

  return axios(token)
    .post(url, {
        ekhlekhOgnoo:moment(ognoo[0]),
        duusakhOgnoo:moment(ognoo[1]),
      })
    .then(res => res.data)
    .catch(aldaaBarigch);
};

export default function useDuusaaguiZakhialgaAjiltnaar(
  token,
  ognoo,
) {
  const {data, mutate} = useSWR(
    !!token
      ? [
          '/duusaaguiZakhialgaAjiltnaarAvya',
          token,
          ognoo,
        ]
      : null,
    fetcher,
  );
  
  return {
    ajiltanDuusaaguiAjilGaralt: data,
    ajiltanDuusaaguiAjilMutate: mutate,
  };
}
