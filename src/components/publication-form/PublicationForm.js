import React, { useState } from 'react';
import { Input, Form, Button } from 'antd';
import i18n from '../../i18n';
import { createPublication } from '../../endpoints/publication/publication';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';

const { TextArea } = Input;

const PublicationForm = ({ user, onCreate }) => {
    const [isLoading, setIsLoading] = useState(false);

    const [form] = Form.useForm();

    const onSubmit = async (event) => {
        setIsLoading(true);
        const successPublication = await createPublication({
            ownerId: user?._id,
            content: event?.publication
        });

        form.setFieldsValue({
            publication: ''
        });
        setIsLoading(false);

        onCreate({ ...successPublication[0] });

        return toast.success(i18n.t(successPublication?.text), {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

    return <div className="publication-form-container">
        <Form onFinish={onSubmit} form={form}>
            <Form.Item name="publication"
                rules={[{ required: true, message: i18n.t('form.required.text') }]}>
                <TextArea placeholder={i18n.t('form.publication.placeholder')} autoSize={{ minRows: 3, maxRows: 5 }} allowClear showCount />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" {...(isLoading ? { loading: true } : { loading: false })}>{i18n.t('button.publication.label.publication')}</Button>
            </Form.Item>
        </Form>
    </div>
}

const mapStateToProps = ({ user }) => ({ user });
export default connect(mapStateToProps)(PublicationForm);