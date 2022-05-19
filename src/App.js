import React, { useEffect, useState } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

import { socket } from './index';
import { connect } from 'react-redux';
import LoginPage from './pages/login.page';
import RegisterPage from './pages/register.page';
import { getTokenAndRefreshToken } from './utils/persist.login';
import { setLogin } from './actions/user.actions';
import Dashboard from './pages/dashboard.page';
import NotFound from './pages/not_found.page';
import { getMe, updateUser } from './endpoints/profile/profile';
import PrivateRoute from './components/privateRoute/PrivateRoute';
import _ from 'underscore';
import 'antd/dist/antd.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';


const App = ({ ...props }) => {

    const [isLogged, setIsLogged] = useState(true);

    useEffect(() => {
        getAuth();
        // eslint-disable-next-line
    }, []);

    // Use this like this to persist loggin when user become on dashboard with accessToken on localstorage
    useEffect(() => {
        props?.user?.isLogged && setIsLogged(props?.user?.isLogged);
    }, [props?.user?.isLogged])

    const routes = [
        {
            path: '/login',
            component: LoginPage
        },
        {
            path: '/register',
            component: RegisterPage
        },
        {
            path: '*',
            component: NotFound
        }
    ];

    const privateRoutes = [
        {
            path: ['/', '/profile/:id', '/publication/:id'],
            component: Dashboard
        }
    ]

    const getAuth = async () => {
        if (getTokenAndRefreshToken()['accessToken'] && getTokenAndRefreshToken()['refreshToken']) {
            let me = await getMe();
            let sidChecker = setInterval(async () => {
                if (socket.id) {
                    await updateUser({ ...me, sid: socket.id, type: 'login', ...(!me.status && { status: 'online' }) });
                    me = await getMe();
                    setIsLogged(true);
                    props.dispatch(setLogin({ accessToken: getTokenAndRefreshToken()['accessToken'], refreshToken: getTokenAndRefreshToken()['refreshToken'], ...me }));
                    clearInterval(sidChecker)
                }
            }, 500)

        } else {
            setIsLogged(false);
        }
    }

    return (
        <>
            <ToastContainer />
            <Router>
                <Switch>
                    {privateRoutes.map((route, index) => (<PrivateRoute component={route.component} key={index * 10 / 5} isLogged={isLogged} path={route.path} exact />))}
                    {routes.map((route, index) => (<Route path={route.path} key={index} component={route.component} exact />))}
                </Switch>
            </Router>
        </>

    )
}

const mapStateToProps = ({ user }) => ({ user });
const mapDispatchToProps = dispatch => ({ dispatch });
export default _.compose(connect(mapStateToProps, mapDispatchToProps))(App);