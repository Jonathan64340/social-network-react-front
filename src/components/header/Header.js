import { Button } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import React, { useEffect, useState } from 'react';
import { getUser } from '../../endpoints/profile/profile';
import { withRouter } from 'react-router-dom';
import i18n from '../../i18n';

const Header = ({ user, ...props }) => {
  const [_viewUser, setViewUser] = useState(false);

  useEffect(() => {
    if (props?.match?.params?.id) {
      getUser(props?.match?.params?.id)
        .then(data => setViewUser(data))
        .catch(() => setViewUser(false))
      }
      // eslint-disable-next-line
  }, [])

  return <div className="header-container">
    <div className="header-container-background-cover" style={{
      background: "url(https://www.terre.tv/wp-content/uploads/2020/05/plus-belles-plages-cuba-1024x671.jpg)"
    }}>
      <div className="header-container-profile">
        <Avatar src="https://joeschmoe.io/api/v1/random" className="header-container-avatar" />
        <div className="header-container-profile-name">
          <span>{_viewUser?.username || user?.username}</span>
        </div>
        <div className="header-container-btn-group">
          <Button type="primary" size="small">{i18n.t('common.action.message.text')}</Button>
          <Button type="primary" size="small">{i18n.t('common.action.friend_request_send')}</Button>
        </div>
      </div>
    </div>
  </div>
}

export default withRouter(Header);