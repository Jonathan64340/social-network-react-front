import { Avatar, Input } from 'antd';
import React, { useState, memo, useEffect } from 'react';
import { getFriends } from '../../endpoints/friend/friend';
import i18n from '../../i18n';
import { EventEmitter } from '../../utils/emitter';
import { connect } from 'react-redux';
import { socket } from '../../index';

const MessengerSidebar = ({ display, user }) => {
    const [friendList, setFriendList] = useState([]);

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
                    
                        if (friendListTmp[i]['friends_data']?.sid) {
                            friendListTmp[i]['friends_data'].sid = friends?.sid
                        } else {
                            friendListTmp[i]['friends_data'] = { ...friendListTmp[i]['friends_data'], sid: friends?.sid }
                        }
                    }
                    if ((i + 1 === friendListTmp.length)) {
                        setFriendList(friendListTmp);
                    }
                }
            }
        })

        return () => {
            socket.off('update_friends_list')
        }
        // eslint-disable-next-line
    }, [user?._id])

    const renderFriendsItem = () => {
        return (
            <div className='friend-list'>
                {friendList.map(({ friends_data }, index) => (
                    <div className='friend-item' key={index} onClick={() => openConversation(friends_data)}>
                        {friends_data?.status === 'online' && <span className='online-tick'></span>}
                        {friends_data?.status === 'busy' && <span className='busy-tick'></span>}
                        <Avatar src="https://joeschmoe.io/api/v1/random" size="small" className='friend-item-avatar' />
                        <span>{friends_data?.username}</span>
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