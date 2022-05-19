import { instance as axios } from '../axios/axios_custom';

export async function getMe() {
    return axios.get(`${process.env.REACT_APP_HOSTNAME || process.env.REACT_APP_ENDPOINT}/api/v1/user/me`)
        .then(({ data }) => data)
        .catch(err => new Error(err))
}

export async function getUserList(query) {
    return axios.get(`${process.env.REACT_APP_HOSTNAME || process.env.REACT_APP_ENDPOINT}/api/v1/user-list?query=${query}`)
        .then(({ data }) => data)
        .catch(err => new Error(err))
}

export async function getUser(id) {
    return axios.get(`${process.env.REACT_APP_HOSTNAME || process.env.REACT_APP_ENDPOINT}/api/v1/user?id=${id}`)
        .then(({ data }) => data)
        .catch(err => new Error(err))
}

export async function updateUser(payload) {
    return axios.post(`${process.env.REACT_APP_HOSTNAME || process.env.REACT_APP_ENDPOINT}/api/v1/user/edit`, payload)
        .then(({ data }) => data)
        .catch(err => new Error(err))
}