import { useState } from 'react'
import axios, { aldaaBarigch } from 'lib/uilchilgee'
import useSWR from 'swr';
import { useAuth } from 'components/context/Auth';


const fetcher = (
    url,
    token,
    baiguullagiinId,
    { search, jagsaalt, ...khuudaslalt },
    salbariinId
  ) =>
    axios(token)
      .post(url, {
        query: {
          salbariinId,
          baiguullagiinId,
          $or: [{ ner: { $regex: search, $options: "i" } }, { "baraanuud.id": { $regex: search, $options: "i" } }],
        },
        ...khuudaslalt,
      })
      .then((res) => res.data)
      .catch(aldaaBarigch);

export default function  useUilchilgee(token, baiguullagiinId) {
    const {salbariinId} = useAuth()
    const [khuudaslalt, setUilchilgeeniiKhuudaslalt] = useState({
      khuudasniiDugaar: 1,
      khuudasniiKhemjee: 20,
      search: "",
      jagsaalt: [],
    });
    const { data, mutate } = useSWR(
      !!token && !!baiguullagiinId && !!salbariinId
        ? ["/bukhUilchilgeeniiJagsaaltAvya", token, baiguullagiinId, khuudaslalt,salbariinId]
        : null,
      fetcher,
      { revalidateOnFocus: false }
    );
    return {
      setUilchilgeeniiKhuudaslalt,
      uilchilgeeniiGaralt: data,
      uilchilgeeMutate: mutate,
    };
  }