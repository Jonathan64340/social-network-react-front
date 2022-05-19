import { SET_USER, SET_LOGOUT_USER, SET_SOCKET_PROVIDER } from "../contants";

const setLogin = (payload) => ({
    type: SET_USER,
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

export { setLogin, setLogout, setSocketProvider }