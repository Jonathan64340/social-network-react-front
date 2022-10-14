import React, { useState } from 'react';
import { Input, Form, Button, List, Avatar, Dropdown, Menu, Popconfirm, Tooltip, Comment } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined, DislikeFilled, DislikeOutlined, LikeFilled, LikeOutlined } from '@ant-design/icons';
import { addComment, deleteComment } from '../../endpoints/publication/publication';
import i18n from '../../i18n';
import { momentCustom as moment } from '../../_helper/moment_custom';
import { connect } from 'react-redux';
import CustomRenderElement from '../../_helper/customRender';
import { Link, withRouter } from 'react-router-dom';
import _ from 'underscore';

const { TextArea } = Input;

const CommentComponent = ({ rawData, user, onDeleteComment, onCreateComment, onEditComment, onLike, onDislike }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        setIsLoading(true);
        const comment = await addComment({
            publicationId: rawData?._id,
            ownerId: user?._id,
            content: values?.comment
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

    const actions = (item) => [
        <div className="action-comments-container">
            <Tooltip key="comment-basic-like" title={i18n.t('button.tooltip.label.like')}>
                <span onClick={() => onLike({ ...item, type: 'like' })}>
                    {React.createElement(item?.comment?.like?.includes(rawData?.comments?.user?.filter((u) => u?._id === item?.ownerId && u)[0]?._id) === 'liked' ? LikeFilled : LikeOutlined)}
                    <span className="comment-action">{item?.comment?.likes.length || 0}</span>
                </span>
            </Tooltip>
            <Tooltip key="comment-basic-dislike" title={i18n.t('button.tooltip.label.dislike')}>
                <span onClick={() => onDislike({ ...item, type: 'dislike' })}>
                    {React.createElement(item?.comment?.like?.includes(rawData?.comments?.user?.filter((u) => u?._id === item?.ownerId && u)[0]?._id) === 'disliked' ? DislikeFilled : DislikeOutlined)}
                    <span className="comment-action">{item?.comment?.dislike.length || 0}</span>
                </span>
            </Tooltip>
        </div>,
        <Dropdown.Button trigger={['click']} overlay={(user?._id === item?.ownerId || user?._id === rawData?.ownerId) ? menu(item?._id, item?.ownerId, item) : <Menu />} icon={(user?._id === item?.ownerId || user?._id === rawData?.ownerId) ? <MoreOutlined /> : <></>} type="text"></Dropdown.Button>
    ];

    const menu = (id, ownerId, _rawData) =>
    (<Menu>
        {user?._id === ownerId && <Menu.Item key="edit" onClick={() => onEditComment({ ..._rawData })} icon={<EditOutlined />}>
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

    const Editor = ({ submitting }) => (
        <Form form={form} onFinish={onFinish}>
            <Form.Item name="comment" rules={[{ required: true, message: i18n.t('form.required.text') }]}>
                <TextArea placeholder={i18n.t('publication.comment.drop_comment')} allowClear autoSize={{ minRows: 4 }} />
            </Form.Item>
            <Form.Item>
                <Button type="primary" loading={submitting} htmlType="submit" {...(isLoading ? { loading: true } : { loading: false })}>{i18n.t('button.publication.label.publication')}</Button>
            </Form.Item>
        </Form>
    );

    return (<div className="comment-component-container textarea-no-border">
        <List dataSource={rawData?.comments?.data}
            locale={{ emptyText: (<div></div>) }}
            renderItem={(item) => (
                <List>
                    {console.log(item)}
                    <Comment
                        actions={actions(item)}
                        author={<Link to={`/profile/${rawData?.comments?.user?.filter((u) => u?._id === item?.ownerId && u)[0]?._id}`}>{rawData?.comments?.user?.filter((u) => u?._id === item?.ownerId && u)[0]?.username}</Link>}
                        avatar={<Link to={`/profile/${rawData?.comments?.user?.filter((u) => u?._id === item?.ownerId && u)[0]?._id}`}><Avatar src={rawData?.comments?.user?.filter((u) => u?._id === item?.ownerId && u)[0]?.avatar_url} alt={rawData?.comments?.user?.filter((u) => u?._id === item?.ownerId && u)[0]?.username} /></Link>}
                        content={
                            <p style={{ display: 'flex', flexDirection: 'column-reverse', lineHeight: '16px' }}>
                                {<CustomRenderElement string={item?.content} type={'publication'} />}
                            </p>
                        }
                        datetime={
                            <Tooltip title={item?.createdAt === item?.modifiedAt ?
                                moment({ date: item?.createdAt, fromNowDisplay: true, format: 'llll' })
                                : <>{moment({ date: item?.createdAt, fromNowDisplay: true, format: 'llll' })} &bull; {i18n.t('publication.description.modified')}</>}>
                                <span>{item?.createdAt === item?.modifiedAt ?
                                    moment({ date: item?.createdAt, fromNowDisplay: true, format: 'llll' })
                                    : <>{moment({ date: item?.createdAt, fromNowDisplay: true, format: 'llll' })} &bull; {i18n.t('publication.description.modified')}</>}</span>
                            </Tooltip>
                        }
                    />
                </List>
            )}>
        </List>

        <Comment
            avatar={<Avatar src={user?.avatar_url} alt="Han Solo" />}
            content={
                <Editor
                    submitting={isLoading}
                />
            }
        />
    </div>)
}

const mapStateToProps = ({ user }) => ({ user });
export default _.compose(connect(mapStateToProps), withRouter)(CommentComponent);