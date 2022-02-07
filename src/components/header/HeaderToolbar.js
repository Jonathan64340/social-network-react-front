import React from 'react';
import { Input, Avatar } from 'antd';
import i18n from '../../i18n';
import { connect } from 'react-redux';

const HeaderToolbar = ({ user }) => {

    const { Search } = Input;

    return (<div className="header-toolbar-container">
        <div className="search">
            <Search placeholder={i18n.t('toolbar.search.text')} className="search-toolbar-input" onSearch={() => { }} enterButton allowClear />
        </div>
        <div className="user-container">
            <span>{user?.username}</span>
            <Avatar src="https://joeschmoe.io/api/v1/random" size="small" />
        </div>
    </div>)
};

const mapStateToProps = ({ user }) => ({ user });
export default connect(mapStateToProps)(HeaderToolbar);