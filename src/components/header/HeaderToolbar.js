import React, { useState, useCallback } from 'react';
import { Avatar, Button, Badge, AutoComplete, List } from 'antd';
import i18n from '../../i18n';
import { BellOutlined } from '@ant-design/icons';
import { getUserList } from '../../endpoints/profile/profile';
import { withRouter } from 'react-router-dom';
import _ from 'underscore';
import { connect } from 'react-redux';

const HeaderToolbar = ({ user, ...props }) => {
    const [listUser, setListUser] = useState([]);

    const _getUserList = query => {
        if (!listUser.length) setListUser([]);
        if (query.length >= 3) {
            getUserList(query).then(res => {
                setListUser(res.filter(listUser => listUser?._id !== user?._id && listUser));
            })
                .catch(err => console.log(err))
        }
    }

    // eslint-disable-next-line
    const onSearch = useCallback(_.debounce(_getUserList, 800), [])

    const goToUserProfile = (id) => {
        setListUser([]);
        props.history.push(`/profile/${id}`);
    }

    return (
        <>
            <div className="header-toolbar-container">
                <div className="search">
                    <AutoComplete placeholder={i18n.t('toolbar.search.text')} className="search-toolbar-input" onSearch={onSearch} enterButton allowClear />
                    {listUser.length ? <List dataSource={listUser}
                        className="list-friend"
                        renderItem={(item) => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar src="https://joeschmoe.io/api/v1/random" size="small" />}
                                    title={<div className="meta-container" onClick={() => goToUserProfile(item?._id)}>
                                        <span>{item?.username}</span>
                                    </div>}
                                />
                            </List.Item>
                        )}>
                    </List> : ''}
                </div>
                <div className="header-toolbar-right-container">
                    <Button type="text" size="middle">
                        <Badge count={3} size="small">
                            <BellOutlined />
                        </Badge>
                    </Button>
                    <div className="user-container" onClick={() => props?.history?.push('/')}>
                        <span>{user?.username}</span>
                        <Avatar src="https://joeschmoe.io/api/v1/random" size="small" />
                    </div>
                </div>
            </div>
        </>
    )
};

const mapStateToProps = ({ user }) => ({ user });
export default _.compose(connect(mapStateToProps), withRouter)(HeaderToolbar);