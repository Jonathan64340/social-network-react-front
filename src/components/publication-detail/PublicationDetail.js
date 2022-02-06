import React from 'react';
import { MoreOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import i18n from '../../i18n';
import { momentCustom as moment } from '../../_helper/moment_custom';
import { Card, Avatar, Menu, Popconfirm, Dropdown } from 'antd';
import { deletePublication } from '../../endpoints/publication/publication';
import { toast } from 'react-toastify';
const { Meta } = Card;

const PublicationDetail = ({ content, id, user, onDelete, time }) => {

    const handleMenuClick = (e) => {
        switch (e.key) {
            case 'edit':
                break;

            case 'delete':
                break;

            default: break;
        }
    }

    const confirm = async () => {
        await deletePublication(id)
        onDelete(id);
        return toast.success(i18n.t('publication.notification.delete.success'), {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
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
                        <span>{user}</span>
                        <Dropdown.Button trigger={['click']} overlay={menu} icon={<MoreOutlined />} type="text" />
                    </div>}
                    description={<div className="meta-description">
                        <small>
                            {moment({ date: time?.createAt, fromNowDisplay: true, format: 'llll' })}
                        </small>
                    </div>}
                />
            </>
        }
        >
            {content}
        </Card>
    );
}

export default PublicationDetail;