import { instance as axios } from '../axios/axios_custom';
export function login(data) {
    return axios
        .post(`${process.env.REACT_APP_HOSTNAME || process.env.REACT_APP_ENDPOINT}/api/v1/auth/login`, data, { headers: { 'Content-Type': 'application/json' } })
        .then(({ data }) => data)
        .catch(err => new Error(err))
}

export function register(data) {
    return axios
        .post(`${process.env.REACT_APP_HOSTNAME || process.env.REACT_APP_ENDPOINT}/api/v1/auth/register`, data, { headers: { 'Content-Type': 'application/json' } })
        .then(({ data }) => data)
        .catch(err => new Error(err))
}

export function refreshToken(data) {
    return axios
        .post(`${process.env.REACT_APP_HOSTNAME || process.env.REACT_APP_ENDPOINT}/api/v1/refreshToken`)
        .then(({ data }) => data)
        .catch(err => new Error(err))
}