import { CloseSquareOutlined, MinusOutlined } from '@ant-design/icons';
import { Avatar, Input, Tooltip, Form } from 'antd';
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { EventEmitter } from '../../utils/emitter';
import { connect } from 'react-redux';
import CustomRenderElement from '../../_helper/customRender';
import { getMessages, sendMessage as _sendMessage } from '../../endpoints/messenger/messenger';
import { store, socket } from '../../index';
import i18n from '../../i18n';

const MessengerChat = () => {
    let viewedConversations = [];
    const [jsxElements, setJsxElements] = useState([]);

    const messagesEndRef = useRef();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useMemo(() => {
        const openNewConversation = EventEmitter().subscriber('openConversation', (data) => createNewConversationItem(data));
        // To destroy listenner on unmount
        return () => {
            openNewConversation && openNewConversation.unsubscribe();
        }
        // eslint-disable-next-line
    }, [])

    const MessengerChatItem = ({ id, sid, name }) => {
        const [tchat, setTchat] = useState([]);
        const user = store.getState()?.user;
        const [_sid, setSid] = useState(sid);
        const [form] = Form.useForm();

        useEffect(() => {
            scrollToBottom()
        }, [tchat]);

        useEffect(() => {
            getMessages({ context: [id, user?._id] })
                .then(messages => setTchat(messages.sort((a, b) => a?.createdAt > b?.createdAt ? 1 : -1)))
                .catch((err) => console.log(err))

            socket.on('messenger', data => {
                if ((data?.from === _sid) || (data?.receiverId === id) || (data?.senderId === id)) {
                    setTchat(messages => [...messages, { ...data }].sort((a, b) => a?.createdAt > b?.createdAt ? 1 : -1))
                }
            })

            const messengerUpdateInformationUser = EventEmitter().subscriber('messengerUpdateInformationUser', ({ sid }) => {
                setSid(sid)
            })

            socket.on('update_friends_list', friends => {
                if (friends?._id === id) {
                    setSid(friends.sid)
                }
            })

            return () => {
                socket.off('messenger');
                socket.off('update_friends_list');
                messengerUpdateInformationUser.unsubscribe();
            }
            // eslint-disable-next-line
        }, [id])

        /**
         * 
         * @param {*} event 
         * context, senderId, receiverId, type, content
         */
        const sendMessage = async event => {

            const payload = {
                context: [id, user?._id],
                senderId: user?._id,
                receiverId: id,
                type: 'string',
                content: {
                    message: event?.input
                }
            };

            _sendMessage(payload)
                .then(message => {
                    setTchat(_chat => ([..._chat, { ...message }]));
                    form.setFieldsValue({
                        'input': ''
                    });

                    if (typeof _sid !== 'undefined') {
                        socket.emit('messenger', { ...message, to: _sid, from: socket.id });
                    }
                })
                .catch((e) => console.log(e))
        }

        // eslint-disable-next-line
        const RenderChat = useMemo(() => {

            return <>
                {
                    tchat.map((el, index) => (
                        <div key={index} className="content-item-tchat">
                            <div className={`item-message ${(user?._id === el?.senderId) ? 'sender' : 'receiver'}`} >
                                {((el?.senderId && user?._id) !== el?.senderId) && (
                                    <>
                                        {(tchat[index]?.senderId !== tchat[index + 1]?.senderId) &&
                                            <div className="content-avatar">
                                                <Avatar size="small" src={""}>
                                                    {name.length > 1 ? name.substring(0, name.length - (name.length - 1)) : name}
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
                        </div>
                    ))
                }
            </>
        })

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
                {RenderChat}
                <div ref={messagesEndRef} />
            </div>
            <div className='messenger-chat-item-footer'>
                <Form form={form} onFinish={sendMessage}>
                    <Form.Item name="input" initialValue={''} rules={[{ required: true, message: i18n.t('form.required.text') }]}>
                        <Input type={'text'} size='small' bordered={false} width='100%' placeholder='Ecrire un message...' />
                    </Form.Item>
                </Form>
            </div>
        </div>)
    }

    const createNewConversationItem = ({ id, username, sid }) => {
        if (!viewedConversations.includes(id)) {
            viewedConversations.push(id);
            setJsxElements(jsx => [...jsx, <MessengerChatItem name={username} sid={sid} id={id} />])
        }
    }

    const closeConversation = ({ id }) => {
        if (viewedConversations.includes(id)) {
            viewedConversations = viewedConversations.filter(j => j !== id);
            const conversationItem = document.getElementById(`conversation-item-${id}`);
            if (conversationItem) {
                conversationItem.remove();
            }
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
            conversationItem.style.height = '450px';
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
                    minimizeConversation({ id: id[0] }, element) :
                    maximizeConversation({ id: id[0] }, element)
            func();
        }
    }
    return <div className='open-conversation-container'>{jsxElements}</div>
}

const mapStateToProps = ({ user }) => ({ user })
export default connect(mapStateToProps)(MessengerChat);