import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {

    return (
        <Route render={props => (
            rest?.isLogged ? <Component {...props} /> : <Redirect to="/login" />
        )} {...rest} />
    )
}

export default PrivateRoute;