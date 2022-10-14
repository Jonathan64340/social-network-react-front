import { SET_USER, SET_LOGOUT_USER, SET_SOCKET_PROVIDER, SET_UPDATE_PROFILE } from "../contants";

const setLogin = (payload) => ({
    type: SET_USER,
    payload
})

const setUpdateProfile = (payload) => ({
    type: SET_UPDATE_PROFILE,
    payload
})

const setSocketProvider = (payload) => ({
    type: SET_SOCKET_PROVIDER,
    payload
})

const setLogout = (payload) => ({
    type: SET_LOGOUT_USER,
    payload
})

export { setLogin, setLogout, setSocketProvider, setUpdateProfile }