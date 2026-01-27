import { useState } from "react";
import axios, { aldaaBarigch } from "lib/uilchilgee";
import useSWR from "swr";
import { useAuth } from 'components/context/Auth';

const fetcherJagsaalt = (
  url,
  token,
  baiguullagiinId,
  { search, jagsaalt, ...khuudaslalt },
  query={},
  salbariinId
) =>
  axios(token)
    .post(url, {
      query: {
        salbaruud:salbariinId,
        baiguullagiinId,
        $or: [{ ner: { $regex: search, $options: "i" } }],
        ...query
      },
      ...khuudaslalt,
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

export function useAjiltniiJagsaalt(token, baiguullagiinId,query) {
  const {salbariinId} = useAuth()
  const [khuudaslalt, setAjiltniiKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 20,
    search: "",
    jagsaalt: [],
  });
  const { data, mutate } = useSWR(
    !!token && !!baiguullagiinId && !!salbariinId
      ? ["/ajilchdiinJagsaaltAvya", token, baiguullagiinId, khuudaslalt,query,salbariinId]
      : null,
    fetcherJagsaalt
  );
  return {
    ajilchdiinGaralt: data,
    ajiltniiJagsaaltMutate: mutate,
    setAjiltniiKhuudaslalt,
  };
}

const fetcher = (url, token) =>
  axios(token)
    .post(url)
    .then((res) => res.data)
    .catch(aldaaBarigch);

export default function useAjiltan(token) {
  const { data, error, mutate } = useSWR(
    !!token ? ["/tokenoorAjiltanAvya", token] : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return { ajiltan: data, error, isLoading: !data, ajiltanMutate: mutate };
}
