import { useState } from "react";
import axios, { aldaaBarigch } from "lib/uilchilgee";
import useSWR from "swr";
import { useAuth } from 'components/context/Auth';

const fetcher = (
  url,
  token,
  baiguullagiinId,
  ajiltniiShuult = [],
  { search, ...khuudaslalt },
  queryGaraasUgsun = {}
) => {
  const query = {
    baiguullagiinId,
    tuluv: ["0"],
    $or: [
      { khariltsagchiinNer: { $regex: search, $options: "i" } },
      { khariltsagchiinUtas: { $regex: search } },
      { mashiniiDugaar: { $regex: search } },
    ],
    ...queryGaraasUgsun,
  };
  if (ajiltniiShuult.length > 0) {
    query.ajiltniiId = { $in: ajiltniiShuult.map((x) => x._id) };
  }

  return axios(token)
    .post(url, { order: { createdAt: -1 }, query, ...khuudaslalt })
    .then((res) => res.data)
    .catch(aldaaBarigch);
};

export default function useKhuviarlagdaaguiZakhialga(
  token,
  baiguullagiinId,
  ajiltniiShuult,
  queryGaraasUgsun
) {
  const [
    khuviarlagdaaguiKhuudaslalt,
    setKhuviarlagdaaguiKhuudaslalt,
  ] = useState({ khuudasniiDugaar: 1, khuudasniiKhemjee: 10, search: "" });
  const { data, mutate } = useSWR(
    !!token && !!baiguullagiinId
      ? [
        "/khuviarlagdaaguiZakhialgiinJagsaaltAvya",
        token,
        baiguullagiinId,
        ajiltniiShuult,
        khuviarlagdaaguiKhuudaslalt,
        queryGaraasUgsun,
      ]
      : null,
    fetcher
  );
  return {
    setKhuviarlagdaaguiKhuudaslalt,
    khuviarlagdaaguiZakhialgiinGaralt: data,
    khuviarlagdaaguiZakhialgaMutate: mutate,
  };
}
