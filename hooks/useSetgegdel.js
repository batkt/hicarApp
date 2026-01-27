import {useState, useMemo, useEffect} from 'react';
import {useAuth} from 'components/context/Auth';
import axios, {aldaaBarigch, socket} from 'lib/uilchilgee';
import useSWR from 'swr';

const fetcher = (
  url,
  token,
  baiguullagiinId,
  {search, jagsaalt, ...khuudaslalt},
  barilgiinId,
  query = {},
  order,
) =>
  axios(token)
    .get(url, {
      params: {
        ...khuudaslalt,
        query: {
          $or: [
            {tailbar: {$regex: search, $options: 'i'}},
            {ajiltniiNer: {$regex: search, $options: 'i'}},
          ],
          ...query,
        },
        order: {...order},
      },
    })
    .then(res => res.data)
    .catch(aldaaBarigch);

var timeout = null;

function useSetgegdel(token, baiguullagiinId, query, order) {
  const {barilgiinId, baiguullaga} = useAuth();
  const [khuudaslalt, setDaalgavarKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 20,
    search: '',
    jagsaalt: [],
  });
  const {data, mutate} = useSWR(
    !!token && !!baiguullagiinId
      ? [
          '/setgegdel',
          token,
          baiguullagiinId,
          khuudaslalt,
          barilgiinId,
          query,
          order,
        ]
      : null,
    fetcher,
    {revalidateOnFocus: false},
  );

  useEffect(() => {
    if (baiguullaga?._id) {
      socket().on(`baiguullaga${baiguullaga?._id}`, sonorduulga => {
        if (sonorduulga.turul === 'setgegdel') mutate();
      });
    }
    return () => {
      socket().off(`baiguullaga${baiguullaga?._id}`);
    };
  }, [baiguullaga]);

  function next() {
    if (!!data)
      setDaalgavarKhuudaslalt(a => {
        a.jagsaalt = [...a.jagsaalt, ...(data?.jagsaalt || [])];
        a.khuudasniiDugaar += 1;
        return {...a};
      });
  }

  function refresh() {
    setDaalgavarKhuudaslalt(a => {
      a.khuudasniiDugaar = 1;
      a.khuudasniiKhemjee = 20;
      a.search = '';
      a.jagsaalt = [];
      return {...a};
    });
  }

  function onSearch(search) {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      setDaalgavarKhuudaslalt(a => {
        a.search = search;
        a.jagsaalt = [];
        a.khuudasniiDugaar = 1;
        return {
          ...a,
        };
      });
    }, 300);
  }

  const jagsaalt = useMemo(() => {
    return [...(khuudaslalt?.jagsaalt || []), ...(data?.jagsaalt || [])];
  }, [khuudaslalt, data]);

  return {
    setDaalgavarKhuudaslalt,
    daalgavarGaralt: data,
    daalgavarMutate: mutate,
    jagsaalt,
    next,
    refresh,
    onSearch,
  };
}

export default useSetgegdel;
