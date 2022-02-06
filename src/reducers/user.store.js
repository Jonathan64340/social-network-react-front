import { SET_USER, SET_LOGOUT_USER } from '../contants/user.contants';

const user = (state = { isLogged: false, isAdmin: false }, action) => {
    switch (action.type) {
        case SET_USER:
            return {
                ...state,
                isLogged: true,
                ...action.payload
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