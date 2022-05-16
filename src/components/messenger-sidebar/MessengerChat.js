import { CloseSquareOutlined, MinusOutlined } from '@ant-design/icons';
import { Avatar, Input, Tooltip } from 'antd';
import React, { useMemo, useState } from 'react';
import { EventEmitter } from '../../utils/emitter';
import { connect } from 'react-redux';
import CustomRenderElement from '../../_helper/customRender';
import { store } from '../../index';
import { uniqueId } from 'underscore';

const MessengerChat = ({ user }) => {
    let viewedConversations = [];
    const [jsxElements, setJsxElements] = useState([]);

    useMemo(() => {
        const openNewConversation = EventEmitter().subscriber('openConversation', (data) => createNewConversationItem(data));
        // To destroy listenner on unmount
        return () => {
            openNewConversation && openNewConversation.unsubscribe();
        }
        // eslint-disable-next-line
    }, [])

    const MessengerChatItem = ({ id, name }) => {
        const [tchat, setTchat] = useState([]);
        const [initialValue, setInitialValue] = useState('');
        const { _id, username } = store.getState()?.user;

        const handleChange = event => {
            event?.persist();
            setInitialValue(event?.currentTarget?.value);
        }

        const sendMessage = event => {
            event?.persist();
            if (event?.keyCode === 13) {
                setTchat(_chat => ([..._chat, {
                    id: uniqueId('id_'),
                    senderId: _id,
                    receiverId: id,
                    username,
                    type: 'string',
                    content: {
                        message: initialValue
                    }
                }]))
                setInitialValue('');
            }
        }

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
            <div className='messenger-chat-item-content'>
                {tchat.map((el, index) => (<div key={uniqueId('item_content_')} className="content-item-tchat">
                    <div className={`item-message ${user?._id === el?.senderId ? 'sender' : 'receiver'}`} >
                        {(el?.senderId && user?._id !== el?.senderId) && (
                            <>
                                {(tchat[index]?.senderId !== tchat[index + 1]?.senderId) &&
                                    <div className="content-avatar">
                                        <Avatar size="small" src={""}>
                                            {el?.username.length > 1 ? el?.username.substring(0, el?.username.length - (el?.username.length - 1)) : el?.username}
                                        </Avatar>
                                    </div>
                                }
                            </>)}
                        {el?.type === 'string' ? <Tooltip>
                            <div className={`content-box-message ${tchat[index]?.senderId === tchat[index + 1]?.senderId ? 'continue' : 'stop'} 
                                ${tchat[index - 1]?.senderId === tchat[index + 1]?.senderId ? 'continue-normalize' : 'stop-normalize'}`}>
                                <p><CustomRenderElement string={el?.content?.message} /></p>
                            </div>
                        </Tooltip> : <></>
                        }
                    </div>
                </div>))}
            </div>
            <div className='messenger-chat-item-footer'>
                <Input type={'text'} value={initialValue} onChange={handleChange} size='small' bordered={false} width='100%' onKeyUp={sendMessage} placeholder='Ecrire un message...' />
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

    return <div className='open-conversation-container'>{jsxElements.map(item => (<item.component key={uniqueId('container_')} />))}</div>
}

const mapStateToProps = ({ user }) => ({ user })
export default connect(mapStateToProps)(MessengerChat);