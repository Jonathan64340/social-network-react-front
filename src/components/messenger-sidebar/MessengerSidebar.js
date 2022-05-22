import { Avatar, Input } from 'antd';
import React, { useState, memo, useEffect } from 'react';
import { getFriends } from '../../endpoints/friend/friend';
import i18n from '../../i18n';
import { EventEmitter } from '../../utils/emitter';
import { connect } from 'react-redux';
import { socket } from '../../index';
import { momentCustom as moment } from '../../_helper/moment_custom';

const MessengerSidebar = ({ display, user }) => {
    const [friendList, setFriendList] = useState([]);
    const [socketUpdater, setSocketUpdater] = useState({});

    let friendListTmp = [];

    useEffect(() => {
        if (display === 'friend' && user?._id) {
            getFriends({ id: user?._id })
                .then(friends => {
                    setFriendList(friends)
                    // eslint-disable-next-line
                    friendListTmp = friends;
                    const user_to_update = {
                        username: user?.username,
                        sid: socket.id,
                        status: user?.status,
                        _id: user?._id
                    }
                    socket.emit('update_friends_list', { ...user_to_update, friends });
                })
                .catch(() => setFriendList(f => ([...f])))
        }

        socket.on('update_friends_list', friends => {
            if (friendListTmp.length > 0) {
                for (let i = 0; i < friendListTmp.length; i++) {
                    if (friendListTmp[i]['friends_data']['_id'] === friends?._id) {

                        if (friendListTmp[i]['friends_data'].sid) {
                            friendListTmp[i]['friends_data'].sid = friends?.sid
                        } else {
                            friendListTmp[i]['friends_data'] = { ...friendListTmp[i]['friends_data'], sid: friends?.sid }
                        }
                    }
                    if ((i + 1 === friendListTmp.length)) {
                        EventEmitter().emit('messengerUpdateInformationUser', { id: friends?._id, username: friends?.username, sid: friends?.sid, status: friends?.status });
                        EventEmitter().emit('friendStatusUpdate', { id: friends?._id, username: friends?.username, sid: friends?.sid, status: friends?.status });
                        setSocketUpdater(friends?.status);
                        setFriendList(friendListTmp);
                    }
                }
            } else {
                EventEmitter().emit('messengerUpdateInformationUser', { id: friends?._id, username: friends?.username, sid: friends?.sid, status: friends?.status });
                EventEmitter().emit('friendStatusUpdate', { id: friends?._id, username: friends?.username, sid: friends?.sid, status: friends?.status });
                setSocketUpdater(friends?.status);
                setFriendList(f => [...friendListTmp, { ...friends }]);
            }
        });

        const friendsEventEmitter = EventEmitter().subscriber('friendsListSubscriber', ({ sid, username, status, _id }) => {
            getFriends({ id: _id || user?._id })
                .then(friends => {
                    setFriendList(friends)
                    // eslint-disable-next-line
                    friendListTmp = friends;
                    const user_to_update = {
                        username: user?.username,
                        sid: socket.id,
                        status: user?.status,
                        _id: user?._id
                    }
                    const user_friend_to_update = {
                        username: username,
                        sid: sid,
                        status: status,
                        _id: _id
                    };
                    // Emitter for me
                    socket.emit('update_friends_list', { ...user_to_update, friends });

                    // Emitter for friends request accept
                    socket.emit('update_friends_list', { ...user_friend_to_update, friends });
                })
                .catch(() => setFriendList(f => ([...f])))
        })

        return () => {
            socket.off('update_friends_list');
            friendsEventEmitter.unsubscribe();
        }
        // eslint-disable-next-line
    }, [user?._id, socket.id, socketUpdater])

    const renderFriendsItem = () => {
        return (
            <div className='friend-list'>
                {friendList.map(({ friends_data }, index) => (
                    <div className='friend-item' key={index} onClick={() => openConversation(friends_data)}>
                        {friends_data?.status === 'online' && <span className='online-tick'></span>}
                        {friends_data?.status === 'busy' && <span className='busy-tick'></span>}
                        <Avatar src="https://joeschmoe.io/api/v1/random" size="small" className='friend-item-avatar' />
                        <div className="friend-item-container-siderbar">
                            <span>{friends_data?.username}</span>
                            {((friends_data?.last_login + 24 * 60 * 60 * 1000) > new Date().getTime() && friends_data?.status !== 'online') ? 
                            <small>{i18n.t('time.connection.last_friend_login')} {moment({ date: friends_data?.last_login, fromNowDisplay: true })}</small>
                            : <small>{i18n.t('time.connection.last_friend_login')}</small>
                        }
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    const openConversation = ({ _id, username, sid, status }) => {
        EventEmitter().emit('openConversation', { id: _id, username, sid, status });
    }

    const render = () => {
        if (display === 'friend') {
            return (
                <div className='messenger-sidebar siderbar'>
                    {renderFriendsItem()}
                    <div className='messenger-sidebar-friend-search'>
                        <Input bordered={false} className='messenger-sidebar-friend-search-input' type={'text'} size={'small'} placeholder={i18n.t('form.messenger.input.search_friend')}></Input>
                    </div>
                    <div className='messenger-sidebar-friend-btn'>
                        <span className='online-tick'></span><span>{i18n.t('toolbar.friends_online')}</span>
                    </div>
                </div>
            )
        }
        return (<div className='siderbar'></div>)
    }

    return render();
};

const memoAffect = (prev, next) => {
    if (prev.display === next.display) {
        return false;
    }
}

const mapStateToProps = ({ user }) => ({ user })
export default connect(mapStateToProps)(memo(MessengerSidebar, memoAffect));