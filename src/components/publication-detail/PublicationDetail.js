import React from 'react';
import { MoreOutlined, EditOutlined, DeleteOutlined, HeartFilled, ShareAltOutlined } from '@ant-design/icons';
import i18n from '../../i18n';
import { momentCustom as moment } from '../../_helper/moment_custom';
import { Card, Avatar, Menu, Popconfirm, Dropdown, Tooltip } from 'antd';
import { deletePublication } from '../../endpoints/publication/publication';
import { connect } from 'react-redux';
import CommentComponent from '../comment-component/CommentComponent';
import { withRouter } from 'react-router-dom';
import _ from 'underscore';
const { Meta } = Card;

const PublicationDetail = ({ content, id, user, onDelete, onDeleteComment, onCreateComment, onEditComment, time, onEdit, rawData, ...props }) => {
    console.log(props?.match)
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
                    avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                    title={<div className="meta-container">
                        <span>{rawData?.user?.username}</span>
                        <Dropdown.Button trigger={['click']} overlay={(props?.match?.path === '/' || user?._id === rawData?.ownerId) ? menu : <Menu />} icon={(props?.match?.path === '/' || user?._id === rawData?.ownerId) ? <MoreOutlined /> : <></>} type="text"><Tooltip title={i18n.t('button.tooltip.label.like')}><HeartFilled /></Tooltip><Tooltip title={i18n.t('button.tooltip.label.share')}><ShareAltOutlined /></Tooltip></Dropdown.Button>
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
            <p>{content}</p>
            <CommentComponent rawData={rawData} onDeleteComment={onDeleteComment} onCreateComment={onCreateComment} onEditComment={onEditComment} />
        </Card>
    );
}

const mapStateToProps = ({ user }) => ({ user });
export default _.compose(connect(mapStateToProps), withRouter)(PublicationDetail);