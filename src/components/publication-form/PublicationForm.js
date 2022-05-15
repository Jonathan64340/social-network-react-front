import React, { useState } from 'react';
import { Input, Form, Button } from 'antd';
import i18n from '../../i18n';
import { createPublication } from '../../endpoints/publication/publication';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'underscore';

const { TextArea } = Input;

const PublicationForm = ({ user, onCreate, current, canPostOrComment,  ...props }) => {
    const [isLoading, setIsLoading] = useState(false);

    const [form] = Form.useForm();

    const onSubmit = async (event) => {
        setIsLoading(true);
        const provider = createPublication;
        const onEvent = onCreate;
        const successPublication = await provider({
            ...(current && { _id: current?._id }),
            ownerId: user?._id,
            content: event?.publication,
            wall: props?.match?.params?.id ? { _id: props?.match?.params?.id } : { _id: user?._id }
        });

        form.setFieldsValue({
            publication: ''
        });

        setIsLoading(false);

        onEvent({ ...successPublication[0] });
    }

    return (<>
        {(props?.match?.path === "/" || canPostOrComment) ? <div className="publication-form-container">
            <Form onFinish={onSubmit} form={form}>
                <Form.Item name="publication"
                    rules={[{ required: true, message: i18n.t('form.required.text') }]}>
                    <TextArea className="textarea-no-border" placeholder={i18n.t('form.publication.placeholder')} autoSize={{ minRows: 3, maxRows: 5 }} allowClear />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" {...(isLoading ? { loading: true } : { loading: false })}>{i18n.t('button.publication.label.publication')}</Button>
                </Form.Item>
            </Form>
        </div> : <></>}
    </>)
}

const mapStateToProps = ({ user }) => ({ user });
export default _.compose(connect(mapStateToProps), withRouter)(PublicationForm);