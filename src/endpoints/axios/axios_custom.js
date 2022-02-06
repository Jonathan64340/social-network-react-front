import axios from "axios";
import { getTokenAndRefreshToken, persistTokenAndRefreshToken } from "../../utils/persist.login";
import { refreshToken } from "../authentication/authentication";
const instance = axios.create({
    baseURL: `${process.env.REACT_APP_HOSTNAME || process.env.REACT_APP_ENDPOINT}`,
    headers: {
        "Content-Type": "application/json",
    },
});

instance.interceptors.request.use(
    (config) => {
        let token = '';
        if (config.url.match('/refreshToken')) {
            token = getTokenAndRefreshToken()['refreshToken'];
        } else {
            token = getTokenAndRefreshToken()['accessToken'];
        }
        if (token) {
            config.headers["authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    async (res) => {
        if (res.data) {
            // Access Token was expired
            if (res.status === 401) {
                const originalConfig = res.config;
                originalConfig._retry = true;
                const token = getTokenAndRefreshToken()['refreshToken'];
                const rs = await refreshToken({ token });
                persistTokenAndRefreshToken(rs.accessToken)
                instance.defaults.headers.common['authorization'] = `Bearer ${rs.accessToken}`;
                return instance(originalConfig);
            }
        }

        return res;
    }, async (error) => {
        if (error.response.status === 401) {
            const originalConfig = error.config;
            originalConfig._retry = true;
            const token = getTokenAndRefreshToken()['refreshToken'];
            const rs = await refreshToken({ token });
            persistTokenAndRefreshToken(rs.accessToken)
            instance.defaults.headers.common['authorization'] = `Bearer ${rs.accessToken}`;
            return instance(originalConfig);
        }

    }
);

export { instance };