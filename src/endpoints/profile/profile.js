import { instance as axios } from '../axios/axios_custom';

export async function getMe() {
    return axios.get(`${process.env.REACT_APP_HOSTNAME || process.env.REACT_APP_ENDPOINT}/api/v1/user/me`)
        .then(({ data }) => data)
        .catch(err => new Error(err))
}