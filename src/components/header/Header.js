import { Button } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import React, { useEffect, useState } from 'react';
import { getUser } from '../../endpoints/profile/profile';
import { withRouter } from 'react-router-dom';
import i18n from '../../i18n';
import { socket } from '../../index';
import { getFriendRequest, sendFriendRequest, replyFriendRequest } from '../../endpoints/friend/friend';
import { EventEmitter } from '../../utils/emitter';
import UploadFile from '../upload/Upload';

const Header = ({ user, onReplyFriend, ...props }) => {
  const [_viewUser, setViewUser] = useState({});

  useEffect(() => {
    setViewUser({})
  }, [])

  useEffect(() => {
    if (props?.match?.params?.id && user?._id) {
      setViewUser({});
      onReplyFriend(false);

      getFriendRequest({ id: props?.match?.params?.id, to: user?._id })
        .then(res => {
          if (res.status === 'pending' || res.status === 'decline') {
            onReplyFriend(false);
          }
          if (res.status === 'accept') {
            onReplyFriend(true);
          }
          setViewUser(u => ({ ...u, ...res, requestId: res?._id }))
        })

      getUser(props?.match?.params?.id)
        .then(data => setViewUser(u => ({ ...u, ...data })))
        .catch(() => {
          props?.history?.push('/not_found');
          setViewUser({})
        })
    } else {

      if (user?._id) {
        getUser(user?._id)
          .then(data => setViewUser(u => ({ ...u, ...data })))
          .catch(() => {
            props?.history?.push('/not_found');
            setViewUser({})
          })
      }
    }

    const friendStatusUpdate = EventEmitter().subscriber('friendStatusUpdate', ({ id }) => {
      if (props?.match?.params?.id === id) {
        onReplyFriend(true);
        setViewUser(viewUser => ({ ...viewUser, status: 'accept' }));
      }
    })

    socket.on('update_friend', (data) => {
      if (((data?.senderId === props?.match?.params?.id) && (data?.status === 'pending'))
        || ((data?.senderId === props?.match?.params?.id) && (data?.status === 'decline'))
      ) {
        onReplyFriend(false);
        setViewUser(u => ({ ...u, ...data }));
      }
    })

    return () => {
      friendStatusUpdate.unsubscribe();
      socket.off('update_friend');
    }

    // eslint-disable-next-line
  }, [props?.match?.params?.id, user])

  const sendFriendRequestAction = () => {
    sendFriendRequest({
      senderId: user?._id,
      receiverId: props?.match?.params?.id,
      status: 'pending'
    }).then(async (data) => {
      setViewUser(u => ({ ...u, ...data, requestId: data?._id }))
      socket.emit('update_friend', { ..._viewUser, ...data, requestId: data?._id })
    })
  }

  const replyFriendRequestAction = (status = 'accept') => {
    replyFriendRequest({
      id: _viewUser?.requestId,
      senderId: user?._id,
      receiverId: props?.match?.params?.id,
      status: status,
      ...((_viewUser?.senderId === user?._id) && { status: 'decline' })
    }).then((data) => {
      if (data?.status === 'accept') {
        EventEmitter().emit('friendsListSubscriber', { sid: _viewUser?._user?.sid, username: _viewUser?._user?.username, status: _viewUser?._user?.status, _id: _viewUser?._user?._id })
        onReplyFriend(true);
      } else {
        socket.emit('update_friend', { ..._viewUser, ...data, requestId: data?._id })
        onReplyFriend(false);
      }
      setViewUser(u => ({ ...u, ...data }))
    })
  }

  const openConversation = () => {
    EventEmitter().emit('openConversation', { id: props?.match?.params?.id, username: _viewUser?.username, sid: _viewUser?.sid });
  }

  const uploadProps = {
    name: 'file',
    action: '',
    headers: {
      authorization: 'authorization-text',
    },

    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }

      if (info.file.status === 'done') {
      } else if (info.file.status === 'error') {
      }
    },
  }

  return <div className="header-container">
    <div className="header-container-background-cover" style={{
      background: "url(https://www.terre.tv/wp-content/uploads/2020/05/plus-belles-plages-cuba-1024x671.jpg)"
    }}>
      {!props?.match?.params?.id && <UploadFile type={"picture"} className={"profile-cover-upload"} title={i18n.t('button.file.picture.cover.change')} placement={'left'} uploadProps={uploadProps} />}
      <div className="header-container-profile">
        <Avatar src="https://joeschmoe.io/api/v1/random" className="header-container-avatar" />
        <div className="profile-picture-container">
          {!props?.match?.params?.id && <UploadFile type={"picture"} className={"profile-picture-upload"} title={i18n.t('button.file.picture.profile.change')} placement={'right'} uploadProps={uploadProps} />}
        </div>
        <div className="header-container-profile-name">
          <span>{_viewUser?.username || user?.username}</span>
        </div>
        <div className="header-container-btn-group">
          {props?.match?.params?.id && (<>
            <Button type="primary" size="small" onClick={() => openConversation()}>{i18n.t('common.action.message.text')}</Button>
            {(_viewUser?.status === 'pending' && _viewUser?.senderId === user?._id)
              && <Button type="danger" size="small" onClick={() => replyFriendRequestAction()}>{i18n.t('common.action.friend_request_pending_sender')}</Button>}
            {(_viewUser?.status === 'pending' && _viewUser?.senderId !== user?._id) && <Button type="secondary" size="small" onClick={() => replyFriendRequestAction('accept')}>{i18n.t('common.action.friend_request_pending_receiver_accept')}</Button>}
            {(_viewUser?.status === 'pending' && _viewUser?.senderId !== user?._id) && <Button type="danger" size="small" onClick={() => replyFriendRequestAction('decline')}>{i18n.t('common.action.friend_request_pending_receiver_decline')}</Button>}
            {(_viewUser?.status === 'decline') && <Button type="primary" size="small" onClick={() => sendFriendRequestAction()}>{i18n.t('common.action.friend_request_send')}</Button>}
            {(_viewUser?.status === 'accept') && <Button type="primary" size="small">{i18n.t('common.action.friend_is_friend')}</Button>}
            {(!_viewUser?.hasOwnProperty('status')) && <Button type="primary" size="small" onClick={() => sendFriendRequestAction()}>{i18n.t('common.action.friend_request_send')}</Button>}
          </>)}
        </div>
      </div>
    </div>
  </div>
}

export default withRouter(Header);