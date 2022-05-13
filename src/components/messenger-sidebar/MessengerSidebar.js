import { Avatar, Input } from 'antd';
import React, { useState } from 'react';
import i18n from '../../i18n';
import { Emitter } from '../../utils/emitter';

const MessengerSidebar = ({ display }) => {
    const [friendList] = useState([{ name: 'Silver', status: 'online' }, { name: 'Spictor', status: 'busy' }]);

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
        Emitter.next({ type: 'openConversation', data: { name, status }});
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

export default MessengerSidebar;