import React from 'react';
import ReactDOM from 'react-dom';
import { io } from 'socket.io-client';
import App from './App';
import './sass/main.scss';

import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './reducers/store';
export const store = createStore(rootReducer);
export const socket = io(proccess.env.REACT_APP_SOCKET_IO || 'http://localhost:4000');

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
