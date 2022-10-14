import React from 'react';
import { MoreOutlined, EditOutlined, DeleteOutlined, DislikeFilled, DislikeOutlined, LikeOutlined, LikeFilled, ShareAltOutlined } from '@ant-design/icons';
import i18n from '../../i18n';
import { momentCustom as moment } from '../../_helper/moment_custom';
import { Card, Avatar, Menu, Popconfirm, Dropdown, Tooltip } from 'antd';
import { deletePublication } from '../../endpoints/publication/publication';
import { connect } from 'react-redux';
import CommentComponent from '../comment-component/CommentComponent';
import { withRouter } from 'react-router-dom';
import _ from 'underscore';
import CustomRenderElement from '../../_helper/customRender';
const { Meta } = Card;

const PublicationDetail = ({ content, id, user, onDelete, onDeleteComment, onCreateComment, onEditComment, onLike, onDislike, time, onEdit, rawData, canPostOrComment, ...props }) => {
    const handleMenuClick = (e) => {
        switch (e.key) {
            case 'edit':
                onEdit({ ...rawData, type: 'edit-publication' });
                break;

            case 'delete':
                break;

            default: break;
        }
    }

    const confirm = async () => {
        await deletePublication(id)
        onDelete(id);
    }

    const menu = (
        <Menu onClick={handleMenuClick}>
            {user?._id === rawData?.ownerId && <Menu.Item key="edit" icon={<EditOutlined />}>
                {i18n.t('button.publication.label.edit')}
            </Menu.Item>}
            <Popconfirm
                title={i18n.t('publication.ask.delete')}
                onConfirm={confirm}
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

    return (
        <Card className="meta-card" cover={
            <>
                <Meta
                    avatar={<Avatar src={user?.avatar_url} />}
                    title={<div className="meta-container">
                        <span>{rawData?.user?.username}</span>
                        <Dropdown.Button trigger={['click']} overlay={(props?.match?.path === '/' || user?._id === rawData?.ownerId) ? menu : <Menu />} icon={(props?.match?.path === '/' || user?._id === rawData?.ownerId) ? <MoreOutlined /> : <></>} type="text">
                            <Tooltip key="comment-basic-like" title={i18n.t('button.tooltip.label.like')}>
                                <span onClick={() => onLike({ ...rawData, type: 'like' })} style={{ marginRight: 10 }}>
                                    {React.createElement(rawData?.comment?.like?.includes(rawData?.comments?.user?.filter((u) => u?._id === rawData?.ownerId && u)[0]?._id) === 'liked' ? LikeFilled : LikeOutlined)}
                                    <span className="comment-action">{rawData?.comment?.likes.length || 0}</span>
                                </span>
                            </Tooltip>
                            <Tooltip key="comment-basic-dislike" title={i18n.t('button.tooltip.label.dislike')}>
                                <span onClick={() => onDislike({ ...rawData, type: 'dislike' })}>
                                    {React.createElement(rawData?.comment?.like?.includes(rawData?.comments?.user?.filter((u) => u?._id === rawData?.ownerId && u)[0]?._id) === 'disliked' ? DislikeFilled : DislikeOutlined)}
                                    <span className="comment-action">{rawData?.comment?.dislike.length || 0}</span>
                                </span>
                            </Tooltip>
                            <Tooltip title={i18n.t('button.tooltip.label.share')}>
                                <ShareAltOutlined />
                            </Tooltip>
                        </Dropdown.Button>
                    </div>}
                    description={<div className="meta-description">
                        <small>
                            {time?.createdAt === time?.modifiedAt ?
                                moment({ date: time?.createdAt, fromNowDisplay: true, format: 'llll' })
                                : <>{moment({ date: time?.createdAt, fromNowDisplay: true, format: 'llll' })} &bull; {i18n.t('publication.description.modified')}</>}
                        </small>
                    </div>}
                />
            </>
        }
        >
            <div style={{ display: 'flex', flexDirection: 'column-reverse', lineHeight: '16px' }}>{<CustomRenderElement string={content} type={'publication'} />}</div>
            {(props?.match?.path === "/" || canPostOrComment) && <CommentComponent rawData={rawData} onDeleteComment={onDeleteComment} onLike={onLike} onDislike={onDislike} onCreateComment={onCreateComment} onEditComment={onEditComment} />}
        </Card>
    );
}

const mapStateToProps = ({ user }) => ({ user });
export default _.compose(connect(mapStateToProps), withRouter)(PublicationDetail);