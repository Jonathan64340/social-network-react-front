import { setSocketProvider } from "../../actions/user.actions";
const { io } = require("socket.io-client");
let socket = undefined;

export const socketIoService = async ({ type: type = 'subscribe', channel, ...options }) => {
    const { store } = require("../../index");
    if (!await store.getState()?.user?.socketProvider) {
        const socketIoInit = () => {
            return new Promise(resolve => {
                socket = io('http://localhost:4000');
    
                let intervalSocketInitializer = setInterval(() => {
                    if (socket.connected) {
                        clearInterval(intervalSocketInitializer);
                        resolve(socket);
                    }
                }, 300)
            })
        }
        await store.dispatch(setSocketProvider({ ...await socketIoInit() }))
    } else {
        socket = await store.getState()?.user?.socketProvider;
    }

    let socketServiceSubscriber = [];
    const defaultOptions = {
        ...(type === 'subscribe' && {
            subscribe: (callback) => {
                if (socket) {
                    if (options?.safeSocketSubscriber && !socketServiceSubscriber.includes(channel)) {
                        socketServiceSubscriber.push(channel);
                        socket.io.on(channel, data => callback(data));
                    } else {
                        socket.io.on(channel, data => callback(data));
                    }
                }
            },
            unsubscribe: () => {
                if (socket) {
                    if (options?.safeSocketSubscriber && socketServiceSubscriber.includes(channel)) {
                        socketServiceSubscriber = [...new Set(socketServiceSubscriber.filter(s => s !== channel))];
                    }
                    socket.io.off(channel);
                }
            }
        })
    }

    if (defaultOptions === {}) return;

    return {
        ...defaultOptions,
        ...(options?.emit && {
            emit: (payload) => {
                if (socket) {
                    socket.io.emit(channel, payload);
                }
            },
            emitBroadcast: (payload) => {
                if (socket) {
                    socket.io.broadcast.emit(channel, payload);
                }
            }
        }),
        ...(options?.emitTo && {
            /**
             * 
             * @param {*} payload 
             * emit to in the payload : { payload.socket.id }
             */
            emitTo: (payload) => {
                if (socket) {
                    socket.io.emit(channel, payload);
                }
            },
        })
    }
}