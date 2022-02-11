import React, { useState } from 'react';
import { Input, Form, Button, List, Avatar, Dropdown, Menu, Popconfirm } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { addComment, deleteComment } from '../../endpoints/publication/publication';
import i18n from '../../i18n';
import { connect } from 'react-redux';

const { TextArea } = Input;

const CommentComponent = ({ rawData, user, onDeleteComment, onCreateComment }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        setIsLoading(true);
        const comment = await addComment({
            publicationId: rawData?._id,
            ownerId: user?._id,
            text: values?.comment
        });

        onCreateComment({ ...comment[0] });
        form.setFieldsValue({
            'comment': ''
        })
        setIsLoading(false);
    };

    const deleteCom = async (id) => {
        await deleteComment(id);

        // check if comment is deleted
        onDeleteComment({ publicationId: rawData?._id, commentId: id });
    }

    const menu = (id, ownerId) =>
    (<Menu>
        {user?._id === ownerId && <Menu.Item key="edit" icon={<EditOutlined />}>
            {i18n.t('button.publication.label.edit')}
        </Menu.Item>}
        <Popconfirm
            title={i18n.t('publication.ask.delete')}
            onConfirm={() => deleteCom(id)}
            onCancel={() => { }}
            okText={i18n.t('common.yes')}
            cancelText={i18n.t('common.no')}
        >
            <Menu.Item key="delete" icon={<DeleteOutlined />}>
                {i18n.t('button.publication.label.delete')}
            </Menu.Item>
        </Popconfirm>
    </Menu>
    );

    return (<div className="comment-component-container textarea-no-border">
        <List dataSource={rawData?.comments?.data}
            renderItem={(item) => (
                <List.Item>
                    <List.Item.Meta
                        avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                        title={<div className="meta-container">
                            <span>{rawData?.comments?.user?.filter((u) => u?._id === item?.ownerId && u)[0]?.username}</span>
                            {(user?._id === item?.ownerId || user?._id === rawData?.ownerId) && <Dropdown.Button trigger={['click']} overlay={menu(item?._id, item?.ownerId)} icon={<MoreOutlined />} type="text" />}
                        </div>}
                        description={<p>{item.text}</p>}
                    />
                </List.Item>
            )}>
        </List>
        <Form form={form} onFinish={onFinish}>
            <Form.Item name="comment" rules={[{ required: true, message: i18n.t('form.required.text') }]}>
                <TextArea placeholder={i18n.t('publication.comment.drop_comment')} allowClear autoSize={{ minRows: 1, maxRows: 5 }} />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" {...(isLoading ? { loading: true } : { loading: false })}>{i18n.t('button.publication.label.publication')}</Button>
            </Form.Item>
        </Form>
    </div>)
}

const mapStateToProps = ({ user }) => ({ user });
export default connect(mapStateToProps)(CommentComponent);