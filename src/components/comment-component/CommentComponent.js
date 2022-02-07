import React from 'react';
import { Input, Form } from 'antd';
import i18n from '../../i18n';

const { TextArea } = Input;

const CommentComponent = () => {
    const [form] = Form.useForm();
    return (<div className="comment-component-container textarea-no-border">
        <Form form={form}>
            <Form.Item rules={[{ required: true, message: i18n.t('form.required.text') }]}>
                <TextArea placeholder={i18n.t('publication.comment.drop_comment')} allowClear />
            </Form.Item>
        </Form>
    </div>)
}

export default CommentComponent;