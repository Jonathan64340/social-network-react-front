import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button } from 'antd';
import i18n from '../i18n';

const NotFound = ({ ...props }) => {

    const back = () => {
        props?.history?.goBack();
    }

    return (<div className="notfound_page_container">
        {i18n.t('not_found.label')}
        <Button size="small" onClick={() => back()}>{i18n.t('not_found.button.label')}</Button>
    </div>)
}

export default withRouter(NotFound);