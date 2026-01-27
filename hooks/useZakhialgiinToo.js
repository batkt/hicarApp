import {useEffect} from 'react';
import axios, {socket, aldaaBarigch} from 'lib/uilchilgee';
import useSWR from 'swr';
import moment from 'moment';
import {useAuth} from 'components/context/Auth';

const fetcher = (
  url,
  token,
  baiguullagiinId,
  ekhlekhOgnoo,
  duusakhOgnoo,
  ajiltniiId,
  salbariinId,
) => {
  return axios(token)
    .post(url, {
      salbariinId,
      baiguullagiinId,
      ekhlekhOgnoo: moment(ekhlekhOgnoo).format('YYYY-MM-DD 00:00:00'),
      duusakhOgnoo: moment(duusakhOgnoo).format('YYYY-MM-DD 23:59:59'),
      ajiltniiId,
    })
    .then(res => res.data)
    .catch(aldaaBarigch);
};

function useZakhilgiinToo(
  token,
  baiguullagiinId,
  zakhialgaMutate,
  ekhlekhOgnoo,
  duusakhOgnoo,
  ajiltniiId,
) {
  const {salbariinId} = useAuth();
  const {data, mutate} = useSWR(
    !!token && !!baiguullagiinId && !!salbariinId
      ? [
          '/zakhialgiinTooAvya',
          token,
          baiguullagiinId,
          ekhlekhOgnoo,
          duusakhOgnoo,
          ajiltniiId,
          salbariinId,
        ]
      : null,
    fetcher,
    {revalidateOnFocus: false},
  );

  useEffect(() => {
    if (!!baiguullagiinId) {
      socket().on(`baiguullaga${baiguullagiinId}`, d => {
        mutate(d, false);
        zakhialgaMutate(garalt => ({
          ...garalt,
          jagsaalt: [...garalt.jagsaalt],
        }));
      });
    }
  }, [baiguullagiinId]);

  return {
    khuviarlagdaagui: data?.find(mur => mur._id.tuluv === '0')?.count || 0,
    khuviarlagdsan: data?.find(mur => mur._id.tuluv === '1')?.count || 0,
    ekhlesen: data?.find(mur => mur._id.tuluv === '2')?.count || 0,
    duussan: data?.find(mur => mur._id.tuluv === '3')?.count || 0,
    tsutslagdsan: data?.find(mur => mur._id.tuluv === '-1')?.count || 0,
  };
}

export default useZakhilgiinToo;
