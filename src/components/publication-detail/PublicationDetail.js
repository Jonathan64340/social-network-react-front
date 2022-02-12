import React from 'react';
import { MoreOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import i18n from '../../i18n';
import { momentCustom as moment } from '../../_helper/moment_custom';
import { Card, Avatar, Menu, Popconfirm, Dropdown } from 'antd';
import { deletePublication } from '../../endpoints/publication/publication';
import { connect } from 'react-redux';
import CommentComponent from '../comment-component/CommentComponent';
const { Meta } = Card;

const PublicationDetail = ({ content, id, user, onDelete, onDeleteComment, onCreateComment, onEditComment, time, onEdit, rawData }) => {
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
            <Menu.Item key="edit" icon={<EditOutlined />}>
                {i18n.t('button.publication.label.edit')}
            </Menu.Item>
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
        <Card cover={
            <>
                <Meta
                    avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                    title={<div className="meta-container">
                        <span>{rawData?.user?.username}</span>
                        {(user?._id === rawData?.ownerId) && <Dropdown.Button trigger={['click']} overlay={menu} icon={<MoreOutlined />} type="text" />}
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
export default connect(mapStateToProps)(PublicationDetail);