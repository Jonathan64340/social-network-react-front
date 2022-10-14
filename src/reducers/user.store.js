import { SET_USER, SET_LOGOUT_USER, SET_SOCKET_PROVIDER, SET_UPDATE_PROFILE } from '../contants/user.contants';

const user = (state = { isLogged: false, isAdmin: false }, action) => {
    switch (action.type) {
        case SET_USER:
            return {
                ...state,
                isLogged: true,
                ...action.payload
            }

        case SET_UPDATE_PROFILE:
            return {
                ...state,
                ...action.payload
            }

        case SET_SOCKET_PROVIDER:
            return {
                ...state,
                socketProvider: { ...action.payload }
            }

        case SET_LOGOUT_USER:
            return {
                isLogged: false
            }

        default:
            return state
    }
}

export { user }