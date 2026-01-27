import axios, { aldaaBarigch } from 'lib/uilchilgee'
import zakhialgiinTsaguudOlyo from 'tools/function/zakhialgiinTsaguudOlyo'
import useSWR from 'swr'
import { useAuth } from 'components/context/Auth';

const fetcher = (url, token, salbariinId) => axios(token).post(url, { query: { salbariinId } }).then(res => res.data).catch(aldaaBarigch)

export default function useZakhialgiinTsag(token, baiguullaga, ognoo) {
    const {salbariinId} = useAuth()
    const { data, mutate } = useSWR(!!token && !!salbariinId ? ['/zakhialgiinTsagiinKhuvaariAvya', token, baiguullaga._id] : null, fetcher)
    if (!baiguullaga)
        return { tsagiinJagsaalt: [] }
    return {
        tsagiinJagsaalt: zakhialgiinTsaguudOlyo(
            ognoo,
            baiguullaga?.salbaruud.find(a=>a._id === salbariinId),
            data
        ),
        tsagMutate: mutate
    }
}
