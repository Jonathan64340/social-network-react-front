import { instance as axios } from '../axios/axios_custom';

export async function sendFriendRequest() {
    return axios.post(`${process.env.REACT_APP_HOSTNAME || process.env.REACT_APP_ENDPOINT}/api/v1/sendFriendRequest`)
        .then(({ data }) => data)
        .catch(err => new Error(err))
}

export async function getFriendRequest({ id }) {
    return axios.get(`${process.env.REACT_APP_HOSTNAME || process.env.REACT_APP_ENDPOINT}/api/v1/getFriendRequest?userId=${id}`)
        .then(({ data }) => data)
        .catch(err => new Error(err))
}

export async function friendRequestAction({ userId, requestUserId }) {
    return axios.post(`${process.env.REACT_APP_HOSTNAME || process.env.REACT_APP_ENDPOINT}/api/v1/friendRequestAction`)
        .then(({ data }) => data)
        .catch(err => new Error(err))
}