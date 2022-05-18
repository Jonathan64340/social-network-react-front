const { io } = require("socket.io-client");
const socket = io();

let socketServiceSubscriber = [];

export const socketIoService = ({ type: type = 'subscribe', channel, ...options }) => {
    const defaultOptions = {
        ...(type === 'subscribe' && {
            subscribe: (callback) => {
                if (socketServiceSubscriber && !socketServiceSubscriber.includes(channel)) {
                    socketServiceSubscriber.push(channel);
                    socket.on(channel, data => callback(data));
                } else {
                    socket.on(channel, data => callback(data));
                }
            },
            unsubscribe: () => {
                if (options.safeSocketSubscriber && socketServiceSubscriber.includes(channel)) {
                    socketServiceSubscriber = [...new Set(socketServiceSubscriber.filter(s => s !== channel))];
                }
                socket.off(channel);
            }
        })
    }

    if (defaultOptions === {}) return;

    return {
        ...defaultOptions,
    }
}