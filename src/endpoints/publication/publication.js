import { instance as axios } from '../axios/axios_custom';

export function createPublication(data) {
    return axios
        .post(`${process.env.REACT_APP_HOSTNAME || process.env.REACT_APP_ENDPOINT}/api/v1/publication`, data, { validateStatus: false })
        .then(({ data }) => data)
        .catch(err => new Error(err))
}

export function editPublication(data) {
    return axios
        .patch(`${process.env.REACT_APP_HOSTNAME || process.env.REACT_APP_ENDPOINT}/api/v1/publication/edit/${data._id}`, data, { validateStatus: false })
        .then(({ data }) => data)
        .catch(err => new Error(err))
}

export function getPublication(data) {
    return axios
        .get(`${process.env.REACT_APP_HOSTNAME || process.env.REACT_APP_ENDPOINT}/api/v1/publication?ownerId=${data._id}`)
        .then(({ data }) => data)
        .catch(err => new Error(err))
}

export function deletePublication(id) {
    return axios
        .delete(`${process.env.REACT_APP_HOSTNAME || process.env.REACT_APP_ENDPOINT}/api/v1/publication?id=${id}`)
        .then(({ data }) => data)
        .catch(err => new Error(err))
}

export function addComment(data) {
    return axios
        .post(`${process.env.REACT_APP_HOSTNAME || process.env.REACT_APP_ENDPOINT}/api/v1/publication/comment/new`, data)
        .then(({ data }) => data)
        .catch(err => new Error(err))
}

export function editComment(data) {
    return axios
        .patch(`${process.env.REACT_APP_HOSTNAME || process.env.REACT_APP_ENDPOINT}/api/v1/publication/comment?action=edit`, data)
        .then(({ data }) => data)
        .catch(err => new Error(err))
}

export function deleteComment(id) {
    return axios
        .delete(`${process.env.REACT_APP_HOSTNAME || process.env.REACT_APP_ENDPOINT}/api/v1/publication/comment/delete?id=${id}`)
        .then(({ data }) => data)
        .catch(err => new Error(err))
}