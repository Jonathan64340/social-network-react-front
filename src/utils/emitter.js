import { Subject } from 'rxjs';

const Emitter = new Subject();

export const EventEmitter = () => ({
    subscriber: (channel, callback) => {
        console.log(`Emitter subscribed : ${channel}`)
        return Emitter.subscribe(obs => {
            if (channel === obs.channel) return callback(obs);
        })
    },
    unsubscriber: () => {
        console.log(`Emitter unsubscribed`)
        return Emitter.unsubscribe();
    },
    emit: (channel, data) => {
        console.log(`Emitter next : ${channel}`)
        if (!channel) return;
        return Emitter.next({ channel, ...{ ...data, channel }});
    }
})