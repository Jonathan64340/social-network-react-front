import { SET_USER, SET_LOGOUT_USER } from "../contants";

const setLogin = (payload) => ({
    type: SET_USER,
    payload
})

const setLogout = (payload) => ({
    type: SET_LOGOUT_USER,
    payload
})

export { setLogin, setLogout }