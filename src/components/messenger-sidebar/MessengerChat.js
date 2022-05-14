import { CloseSquareOutlined, MinusOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { EventEmitter } from '../../utils/emitter';

const MessengerChat = () => {
    let viewedConversations = [];
    const [jsxElements, setJsxElements] = useState([]);

    useEffect(() => {
        const openNewConversation = EventEmitter().subscriber('openConversation', (data) => createNewConversationItem(data));
        // To destroy listenner on unmount
        return () => {
            openNewConversation && EventEmitter().unsubscriber();
        }
        // eslint-disable-next-line
    }, [])

    const MessengerChatItem = ({ id, name }) => {
        return (<div className='messenger-chat-item-container'>
            <div className='messenger-chat-item-header'>
                <div className='messenger-chat-item-header-title'>
                    <span>{name}</span>
                </div>
                <div className='messenger-chat-item-header-action'>
                    <div className='messenger-chat-item-header-action-minimize'>
                        <MinusOutlined />
                    </div>
                    <div className='messenger-chat-item-header-action-close' onClick={() => closeConversation({ id })}>
                        <CloseSquareOutlined />
                    </div>
                </div>
            </div>
            <div className='messenger-chat-item-content'></div>
            <div className='messenger-chat-item-footer'>
                <Input type={'text'} size='small' bordered={false} width='100%' placeholder='Ecrire un message...' />
            </div>
        </div>)
    }

    const createNewConversationItem = ({ id, name }) => {
        if (!viewedConversations.includes(id)) {
            viewedConversations.push(id);
            setJsxElements(jsx => [...jsx, { component: () => <MessengerChatItem name={name} id={id} />, id }])
        }
    }

    const closeConversation = ({ id }) => {
        if (viewedConversations.includes(id)) {
            viewedConversations = viewedConversations.filter(j => j !== id);
            setJsxElements(jsx => [...jsx.filter(j => j.id !== id)])
        }
    }

    return <div className='open-conversation-container'>{jsxElements.map((item, index) => (<item.component key={index} />))}</div>
}

export default MessengerChat;