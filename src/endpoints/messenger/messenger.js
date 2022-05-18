import { instance as axios } from '../axios/axios_custom';

export async function sendMessage(payload) {
    return axios.post(`${process.env.REACT_APP_HOSTNAME || process.env.REACT_APP_ENDPOINT}/api/v1/messenger/create`, payload)
        .then(({ data }) => data)
        .catch(err => new Error(err))
}

export async function getMessages({ context }) {
    return axios.get(`${process.env.REACT_APP_HOSTNAME || process.env.REACT_APP_ENDPOINT}/api/v1/messenger/get-message?context=${encodeURI(context)}`)
        .then(({ data }) => data)
        .catch(err => new Error(err))
}