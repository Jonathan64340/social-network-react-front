import { store } from '../index';
 
export const persistTokenAndRefreshToken = (accessToken, refreshToken) => {
    if (accessToken && refreshToken) {
        window.localStorage.setItem('accessToken', accessToken);
        window.localStorage.setItem('refreshToken', refreshToken);
    } 

    if (accessToken && !refreshToken) {
        window.localStorage.setItem('accessToken', accessToken);
    }
}

export const getTokenAndRefreshToken = () => {
    const credentials = {
        accessToken: window.localStorage.getItem('accessToken') ? window.localStorage.getItem('accessToken') : store?.getState()?.user?.accessToken,
        refreshToken: window.localStorage.getItem('refreshToken') ? window.localStorage.getItem('refreshToken') : store?.getState()?.user?.refreshToken,
    }

    return credentials;
}