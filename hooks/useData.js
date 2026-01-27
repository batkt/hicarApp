import useSWR from 'swr';
import uilchilgee, {aldaaBarigch} from '../lib/uilchilgee';
function fetcher(token, url, params, method) {
  if (method === 'post')
    return uilchilgee(token)
      .post(url, params)
      .then(a => a.data)
      .catch(aldaaBarigch);
  return uilchilgee(token)
    .get(url, params)
    .then(a => a.data)
    .catch(aldaaBarigch);
}

function useData(token, url, params, method) {
  const {data, mutate, isValidating} = useSWR(
    url ? [token, url, params, method] : null,
    fetcher,
    {
      revalidateOnFocus: false,
    },
  );

  return {data, mutate, isValidating};
}

export default useData;
