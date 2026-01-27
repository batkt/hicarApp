import axios, { aldaaBarigch } from 'lib/uilchilgee'
import useSWR from 'swr'
import _ from 'lodash'

const fetcher = (url, token, baiguullagiinId) => axios(token).post(url, { id: baiguullagiinId }).then(res => res.data).catch(aldaaBarigch)

function useBaiguullaga(token, baiguullagiinId) {
    const { data, mutate } = useSWR(!!token && !!baiguullagiinId ? ['/baiguullagaAvya', token, baiguullagiinId] : null, fetcher, { revalidateOnFocus: false })
    return { baiguullaga: data, baiguullagaMutate: mutate }
}

export default useBaiguullaga