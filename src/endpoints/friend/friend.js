import { instance as axios } from '../axios/axios_custom';

export async function sendFriendRequest({ senderId, receiverId, status }) {
    return axios.post(`${process.env.REACT_APP_HOSTNAME || process.env.REACT_APP_ENDPOINT}/api/v1/sendFriendRequest`, { senderId, receiverId, status })
        .then(({ data }) => data)
        .catch(err => new Error(err))
}

export async function getFriendRequest({ id, to }) {
    return axios.get(`${process.env.REACT_APP_HOSTNAME || process.env.REACT_APP_ENDPOINT}/api/v1/getFriendRequest?userId=${id}&to=${to}`)
        .then(({ data }) => data)
        .catch(err => new Error(err))
}

export async function replyFriendRequest({ id, senderId, receiverId, status }) {
    return axios.patch(`${process.env.REACT_APP_HOSTNAME || process.env.REACT_APP_ENDPOINT}/api/v1/replyFriendRequest`, { id, senderId, receiverId, status })
        .then(({ data }) => data)
        .catch(err => new Error(err))
}