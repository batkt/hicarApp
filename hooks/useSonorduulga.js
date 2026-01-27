import axios, { socket, aldaaBarigch } from 'lib/uilchilgee'
import useSWR from 'swr'
import { useState, useEffect } from 'react'
import { useAuth } from 'components/context/Auth';

const fetcher = (url, token, ajiltniiId, { jagsaalt, ...khuudaslalt }) => axios(token).post(url, { ...khuudaslalt, query: { ajiltniiId }, order: { ognoo : -1,  kharsanEsekh: 0 } }).then(res => res.data).catch(aldaaBarigch)

function useSonorduulga(token, ajiltniiId) {
    const [khuudaslalt, setKhuudaslalt] = useState({ khuudasniiDugaar: 1, khuudasniiKhemjee: 10, jagsaalt: [] })
    const { data, mutate } = useSWR(!!token && !!ajiltniiId ? ['/sonorduulgaAvya', token, ajiltniiId, khuudaslalt] : null, fetcher, { revalidateOnFocus: false })
    // console.log('990909090', data?.jagsaalt[0].object);
    // console.log('~~~~~~~~~~~', data);
    // console.log('990909090', ajiltniiId);

    useEffect(() => {
        if (ajiltniiId) {
            socket().on(`ajiltan${ajiltniiId}`, sonorduulga => {
                mutate()
            })
        }
    }, [ajiltniiId]);

    function sonorduulgaKharlaa(id) {
        axios(token).post('/sonorduulgaKharlaa', { id })
            .then(({ data, status }) => {
                if (status === 200 && data === 'Amjilttai') {
                    mutate()
                }
            })
    }

    function nextSonorduulga() {
        if (data?.khuudasniiDugaar < data?.niitKhuudas)
            setKhuudaslalt(a => ({ ...a, khuudasniiDugaar: a.khuudasniiDugaar + 1, jagsaalt: [...khuudaslalt.jagsaalt, ...(data?.jagsaalt || [])] }))
    }

    function resetSonorduulga() {
        setKhuudaslalt({ khuudasniiDugaar: 1, khuudasniiKhemjee: 20, search: "", jagsaalt: [] })
        mutate()
    }

    return { setKhuudaslalt, sonorduulga: data, sonorduulgaMutate: mutate, jagsaalt: khuudaslalt.jagsaalt, resetSonorduulga, nextSonorduulga,sonorduulgaKharlaa }
}

export default useSonorduulga