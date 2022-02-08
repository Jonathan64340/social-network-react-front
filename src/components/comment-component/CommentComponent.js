import React from 'react';
import { Input, Form } from 'antd';
import i18n from '../../i18n';

const { TextArea } = Input;

const CommentComponent = ({ rawData }) => {
    const [form] = Form.useForm();

    const onFinish = () => {
        
    };

    return (<div className="comment-component-container textarea-no-border">
        <Form form={form} onFinish={onFinish}>
            <Form.Item rules={[{ required: true, message: i18n.t('form.required.text') }]}>
                <TextArea placeholder={i18n.t('publication.comment.drop_comment')} allowClear />
            </Form.Item>
        </Form>
    </div>)
}

export default CommentComponent;