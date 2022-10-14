import { instance as axios } from '../axios/axios_custom';

export async function uploadFile(data, config) {
    return axios.post(`${process.env.REACT_APP_HOSTNAME || process.env.REACT_APP_ENDPOINT}/api/v1/upload`, data, { headers: config })
        .then(({ data }) => data)
        .catch(err => new Error(err))
}