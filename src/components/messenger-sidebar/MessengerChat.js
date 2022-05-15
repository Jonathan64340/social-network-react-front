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
            openNewConversation && openNewConversation.unsubscribe();
        }
        // eslint-disable-next-line
    }, [])

    const MessengerChatItem = ({ id, name }) => {
        return (<div className='messenger-chat-item-container' id={`conversation-item-${id}`} collapsed={"opened"}>
            <div className='messenger-chat-item-header'>
                <div className='messenger-chat-item-header-title'>
                    <span>{name}</span>
                </div>
                <div className='messenger-chat-item-header-action'>
                    <div className='messenger-chat-item-header-action-minimize'>
                        <MinusOutlined onClick={(element) => legateCurrentStatusOpener(element)} />
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

    const minimizeConversation = ({ id }, element = null) => {
        if (viewedConversations.includes(id)) {
            const conversationItem = document.getElementById(`conversation-item-${id}`);
            conversationItem.style.position = 'relative';
            conversationItem.style.bottom = '0';
            conversationItem.style.height = '30px';
            if (element) {
                element.setAttribute('collapsed', 'closed')
            }
        }
    }

    const maximizeConversation = ({ id }, element = null) => {
        if (viewedConversations.includes(id)) {
            const conversationItem = document.getElementById(`conversation-item-${id}`);
            conversationItem.style.height = '300px';
            conversationItem.style.bottom = 0;
            if (element) {
                element.setAttribute('collapsed', 'opened')
            }
        }
    }

    const legateCurrentStatusOpener = ({ target }) => {
        const conversationItemElement = target.parentNode.parentNode.parentNode.parentNode.parentNode;
        const element = document.getElementById(conversationItemElement.id);
        if (element) {
            const collapsed = element.getAttribute('collapsed');
            const id = conversationItemElement.id.split('-').reverse();
            const func = () =>
            (collapsed && collapsed === 'opened') ?
                    minimizeConversation({ id: parseInt(id[0]) }, element) :
                    maximizeConversation({ id: parseInt(id[0]) }, element)
            func();
        }
    }

    return <div className='open-conversation-container'>{jsxElements.map((item, index) => (<item.component key={index} />))}</div>
}

export default MessengerChat;