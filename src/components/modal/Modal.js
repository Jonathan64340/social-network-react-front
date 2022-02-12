import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Input } from 'antd';
import i18n from '../../i18n';
import { editPublication, editComment } from '../../endpoints/publication/publication';
import { connect } from 'react-redux';


const ModalCustom = ({ placeholder, current, visible, onClose, onEditPublication, onEditComment, user }) => {
    const [isLoading, setIsLoading] = useState(false);

    const [form] = Form.useForm();
    const { TextArea } = Input;

    useEffect(() => {

        if (visible) {
            form.setFieldsValue({
                'publication': current?.content || current?.text
            });
        }

        // eslint-disable-next-line
    }, [visible])

    const onFinish = async (event) => {
        setIsLoading(true);
        const provider = (current?.type === 'edit-publication' ? editPublication : editComment);
        const onEvent = (current?.type === 'edit-publication' ? onEditPublication : onEditComment);

        const successPublication = await provider({
            ...(current?.type === 'edit-publication' ? { _id: current?._id } : { ...current }),
            ownerId: user?._id,
            content: event?.publication
        });

        form.setFieldsValue({
            publication: ''
        });

        setIsLoading(false);

        onEvent({ ...successPublication[0], type: current?.type });
  
        onClose();
    }

    return (
        <Modal centered visible={visible} footer={false} onCancel={onClose} closable={false} closeIcon={false} maskClosable={false}>
            <Form form={form} onFinish={onFinish}>
                <Form.Item name="publication" rules={[{ required: true, message: i18n.t('form.required.text') }]}>
                    <TextArea placeholder={i18n.t(placeholder)} allowClear autoSize={{ minRows: 1, maxRows: 5 }} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" {...(isLoading ? { loading: true } : { loading: false })}>{i18n.t('button.publication.label.publication')}</Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

const mapStateToProps = ({ user }) => ({ user });
export default connect(mapStateToProps)(ModalCustom);