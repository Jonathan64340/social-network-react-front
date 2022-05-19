import React from 'react';
import ReactDOM from 'react-dom';
import { io } from 'socket.io-client';
import App from './App';
import './sass/main.scss';

import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './reducers/store';
export const store = createStore(rootReducer);
export const socket = io(process.env.REACT_APP_SOCKET_IO || 'http://localhost:5748');

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
