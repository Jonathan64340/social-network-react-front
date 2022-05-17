import { Avatar, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { getFriends } from '../../endpoints/friend/friend';
import i18n from '../../i18n';
import { EventEmitter } from '../../utils/emitter';
import { connect } from 'react-redux';

const MessengerSidebar = ({ display, user }) => {
    const [friendList] = useState([{ id: 1, name: 'Silver', status: 'online' }, { id: 2, name: 'Spictor', status: 'busy' }]);

    useEffect(() => {
        if (display === 'friend' && user?._id) {
            getFriends({ id: user?._id })
                .then(friends => console.log(friends))
        }
    }, [display, user?._id])

    const renderFriendsItem = () => {
        return (
            <div className='friend-list'>
                {friendList.map((friend, index) => (
                    <div className='friend-item' key={index} onClick={() => openConversation(friend)}>
                        {friend?.status === 'online' && <span className='online-tick'></span>}
                        {friend?.status === 'busy' && <span className='busy-tick'></span>}
                        <Avatar src="https://joeschmoe.io/api/v1/random" size="small" className='friend-item-avatar' />
                        <span>{friend?.name}</span>
                    </div>
                ))}
            </div>
        )
    }

    const openConversation = ({ id, name, status }) => {
        EventEmitter().emit('openConversation', { id, name, status });
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
                        <span className='online-tick'></span><span>Amis connectés</span>
                    </div>
                </div>
            )
        }
        return (<div className='siderbar'></div>)
    }

    return render();
};

const mapStateToProps = ({ user }) => ({ user })
export default connect(mapStateToProps)(MessengerSidebar);