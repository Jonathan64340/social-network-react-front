import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Input } from 'antd';
import i18n from '../../i18n';

const ModalCustom = ({ placeholder, type, rawData }) => {

    const [current, setCurrent] = useState(rawData);
    const [form] = Form.useForm();
    const { TextArea } = Input;

    useEffect(() => {
        setCurrent(rawData);

        form.setFieldsValue({
            'textarea': current.text
        });

        // eslint-disable-next-line
    }, [rawData])

    const onFinish = () => {
        if (type === 'edit-publication') {

        }

        if (type === 'edit-comment') {

        }
    }

    return (
        <Modal centered>
            <Form form={form} onFinish={onFinish}>
                <Form.Item name="textarea" rules={[{ required: true, message: i18n.t('form.required.text') }]}>
                    <TextArea placeholder={i18n.t(placeholder)} allowClear autoSize={{ minRows: 1, maxRows: 5 }} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">{i18n.t('button.publication.label.publication')}</Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default ModalCustom;