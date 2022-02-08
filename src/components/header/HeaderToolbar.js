import React from 'react';
import { Input, Avatar, Button, Badge } from 'antd';
import i18n from '../../i18n';
import { BellOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';

const HeaderToolbar = ({ user }) => {

    const { Search } = Input;

    return (<div className="header-toolbar-container">
        <div className="search">
            <Search placeholder={i18n.t('toolbar.search.text')} className="search-toolbar-input" onSearch={() => { }} enterButton allowClear />
        </div>
        <div className="header-toolbar-right-container">
            <Button type="text" size="middle">
                <Badge count={3} size="small">
                    <BellOutlined />
                </Badge>
            </Button>
            <div className="user-container">
                <span>{user?.username}</span>
                <Avatar src="https://joeschmoe.io/api/v1/random" size="small" />
            </div>
        </div>

    </div>)
};

const mapStateToProps = ({ user }) => ({ user });
export default connect(mapStateToProps)(HeaderToolbar);