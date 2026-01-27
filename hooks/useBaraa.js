import axios, {aldaaBarigch} from 'lib/uilchilgee';
import useSWR from 'swr';
import {useAuth} from 'components/context/Auth';
import React, {useState, useMemo} from 'react';

const fetcher = (
  url,
  token,
  query,
  {search, jagsaalt, ...khuudaslalt},
  order,
) => {
    return axios(token)
    .post(url, {query,
        order,
        ...khuudaslalt,
    })
    .then(res => res.data)
    .catch(aldaaBarigch);}

export function useBaraaToololt(token, query) {
    const [khuudaslalt, setKhuudaslalt] = useState({
        khuudasniiDugaar: 1,
        khuudasniiKhemjee: 10,
    });
    const {data, mutate} = useSWR(
        !!token
            ? [
                '/baraaniiToololtAvya',
                token,
                query,
                khuudaslalt,
            ]
            : null,
        fetcher,
        {revalidateOnFocus: false},
    );

    return {
        baraaniiToo: data,
        baraaniiTooMutate: mutate,
    };
}
export function useNuutsiinToololt(token, query) {
    const [khuudaslalt, setKhuudaslalt] = useState({
        khuudasniiDugaar: 1,
        khuudasniiKhemjee: 10,
        jagsaalt: [],
    });
    const {data, mutate, isValidating} = useSWR(
        !!token
            ? [
                '/nuutsBagaBaraaniiToo',
                token,
                query,
                khuudaslalt,
            ]
            : null,
        fetcher,
        {revalidateOnFocus: false},
    );
    function nNext(niitMur) {
        // console.log('1111122khuudaslalt',niitMur);
        if (!!data && khuudaslalt.khuudasniiDugaar < (niitMur / khuudaslalt.khuudasniiKhemjee)){
            setKhuudaslalt(a => {
                a.jagsaalt = [...a.jagsaalt, ...(data?.[0].jagsaalt || [])];
                a.khuudasniiDugaar += 1;
                return {...a};
            });
        }
    }
    function nRefresh() {
        setKhuudaslalt(a => {
            a.jagsaalt = [];
            a.khuudasniiDugaar = 1;
            a.khuudasniiKhemjee = 10;
            return {...a};
        });
    }
    const jagsaalt = useMemo(() => {
        return [...(khuudaslalt?.jagsaalt || []), ...(data?.[0].jagsaalt || [])];
    }, [khuudaslalt, data]);

    return {
        nJagsaalt: jagsaalt,
        nuutsiinToo: data,
        nuutsMutate: mutate,
        nValidating: isValidating,
        nNext,
        nRefresh,
    };
}

export function useBaraaTurluur(token, query) {
    const [khuudaslalt, setKhuudaslalt] = useState({
        // sort: query.sort,
        khuudasniiDugaar: 1,
        khuudasniiKhemjee: 10,
        jagsaalt: [],
    });
    const {data, mutate, isValidating} = useSWR(
        !!token
            ? [
                '/baraaTurluurAvay',
                token,
                query,
                khuudaslalt,
            ]
            : null,
        fetcher,
        {revalidateOnFocus: false},
    );
    function next(niitMur) {
        // console.log('1111122khuudaslalt',niitMur);
        // console.log('111data', data);
        if (!!data && khuudaslalt.khuudasniiDugaar < (niitMur / khuudaslalt.khuudasniiKhemjee)){
            // console.log('111next', (niitMur / khuudaslalt.khuudasniiKhemjee));
            setKhuudaslalt(a => {
                a.jagsaalt = [...a.jagsaalt, ...(data?.jagsaalt || [])];
                a.khuudasniiDugaar += 1;
                return {...a};
            });
        }
    }
    function refresh() {
        setKhuudaslalt(a => {
            a.jagsaalt = [];
            a.khuudasniiDugaar = 1;
            a.khuudasniiKhemjee = 10;
            return {...a};
        });
    }
    const baraaniiJagsaalt = useMemo(() => {
        return [...(khuudaslalt?.jagsaalt || []), ...(data?.jagsaalt || [])];
    }, [khuudaslalt, data]);

    return {
        setKhuudaslalt,
        baraaniiJagsaalt,
        baraaniiJagsaaltMutate: mutate,
        next,
        refresh,
        isValidating,
    };
}

function useBaraa(token, query, order) {
  const [khuudaslalt, setBaraaiiKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 10,
    search: '',
    jagsaalt: [],
  });
  // console.log('11111',query);
  const {data, mutate} = useSWR(
    !!token
      ? [
          '/baraaniiJagsaaltAvya',
          token,
          query,
          khuudaslalt,
          order,
        ]
      : null,
    fetcher,
    {revalidateOnFocus: false},
  );
  return {
    setBaraaiiKhuudaslalt,
    baraaniiGaralt: data,
    baraaniiMutate: mutate,
  };
}

export default useBaraa;
