import axios from 'axios';
import socketIOClient from 'socket.io-client';
// export const url = "http://10.0.2.2:8080";
export const url = 'https://hicar.zevtabs.mn/api';
// export const url = "http://192.168.1.85:8080";
export const socket = () => socketIOClient(url, {transports: ['websocket']});

export const aldaaBarigch = (e, toast) => {
  if (!!e?.response?.data?.aldaa && toast)
    toast.show({
      title: 'Анхаар',
      description: e?.response?.data?.aldaa,
      status: 'warning',
      placement: 'top',
    });
  else console.log(e?.response?.data?.aldaa);
};

export default token => {
  const headers = {
    'Content-type': 'application/json',
  };
  if (!!token) headers['Authorization'] = `bearer ${token}`;
  return axios.create({
    baseURL: url,
    headers,
  });
};
