import useSWR from 'swr';
import uilchilgee, {aldaaBarigch} from '../lib/uilchilgee';
import {useEffect, useMemo, useState} from 'react';
function fetcher(
  token,
  url,
  query,
  order,
  select,
  {search = '', jagsaalt, ...khuudaslalt},
  customUrl,
) {
  return uilchilgee(token)
    .get(customUrl || url, {
      params: {
        query,
        order,
        select,
        ...khuudaslalt,
      },
    })
    .then(a => a.data)
    .catch(aldaaBarigch);
}
let timeout;

function useJagsaalt(token, url, query, order, select, customServer) {
  const [khuudaslalt, setKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 15,
    search: '',
    jagsaalt: [],
  });

  const {data, mutate, isValidating} = useSWR(
    url ? [token, url, query, order, select, khuudaslalt, customServer] : null,
    fetcher,
    {
      revalidateOnFocus: false,
    },
  );

  useEffect(() => {
    refresh();
  }, [query]);

  function next() {
    if (!!data && khuudaslalt.khuudasniiDugaar < data.niitKhuudas)
      setKhuudaslalt(a => {
        a.jagsaalt = [...a.jagsaalt, ...(data.jagsaalt || [])];
        a.khuudasniiDugaar += 1;
        return {...a};
      });
  }

  function refresh() {
    setKhuudaslalt(a => {
      a.jagsaalt = [];
      a.khuudasniiDugaar = 1;
      return {...a};
    });
  }

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

  const jagsaalt = useMemo(() => {
    return [...(khuudaslalt?.jagsaalt || []), ...(data?.jagsaalt || [])];
  }, [khuudaslalt, data]);

  return {data, mutate, jagsaalt, next, refresh, onSearch, isValidating};
}

export default useJagsaalt;
