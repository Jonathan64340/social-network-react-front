import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import HeaderCustom from '../components/header/Header';
import PublicationForm from '../components/publication-form/PublicationForm';
import PublicationDetail from '../components/publication-detail/PublicationDetail';
import { getPublication } from '../endpoints/publication/publication';
import HeaderToolbar from '../components/header/HeaderToolbar';
import Modal from '../components/modal/Modal';
import { withRouter } from 'react-router-dom';
import _ from 'underscore';
import MessengerSidebar from '../components/messenger-sidebar/MessengerSidebar';
import MessengerChat from '../components/messenger-sidebar/MessengerChat';
const { Content, Header, Footer } = Layout;

const Dashboard = ({ user, ...props }) => {
    const [publication, setPublication] = useState([]);
    const [current, setCurrent] = useState(false);
    const [viewUser, setViewUser] = useState(false);
    const [scrollListener, setScrollListener] = useState(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const headerRef = document.querySelector('.toolbar-container');
        const siderMessenger = document.querySelector('.sider-messenger');

        setScrollListener(window.addEventListener('scroll', () => {
            if (window?.scrollY >= 0) {
                headerRef?.classList?.add('sticky');
                siderMessenger?.classList.add('sider-sticky');
            } else {
                headerRef?.classList?.remove('sticky');
            }
            // To destroy listenner on unmount
            return () => {
                scrollListener && scrollListener.removeEventListener();
            }
        }));

    }, [scrollListener])

    useEffect(() => {
        if (props?.match?.params?.id) {
            setViewUser(props?.match?.params?.id);
        }
    }, [props?.match?.params?.id])

    useEffect(() => {

        if ((user?.isLogged && user?._id && viewUser) || (user?.isLogged && user?._id)) {
            getPublication({ _id: viewUser || user?._id })
                .then(result => {
                    setPublication(result);
                })
        }
    }, [user?.isLogged, user?._id, viewUser]);

    const onCloseModal = () => {
        setVisible(false);
    }

    const onDelete = (id) => {
        setPublication(publication.filter(_publication => _publication?._id !== id && _publication))
    }

    const onCreate = async (payload) => {
        if (payload !== {}) {
            setPublication(publication => [...publication, { ...payload }].sort((a, b) => a.createdAt < b.createdAt ? 1 : -1));
        }
    }

    const onEdit = async (payload) => {
        if (payload !== {}) {
            setVisible(true);
            setCurrent({ ...payload });
        }
    }

    const handleEdit = async (payload) => {
        if (payload !== {} || payload?._id) {
            if (payload?.type === 'edit-publication') {
                delete payload?.type;
                const _publication = (publication.length > 1 ? publication.reverse() : publication);
                const index = _publication.findIndex(tmpPub => tmpPub?._id === payload?._id && tmpPub);
                const tmp = _publication;
                tmp[_publication.length > 1 ? index : 0] = { ...tmp[_publication.length > 1 ? index : 0], ...payload };
                setPublication([...tmp.reverse()].sort((a, b) => a.createdAt < b.createdAt ? 1 : -1));
                setCurrent(false);
            } else {
                delete payload?.type;
                const _publication = publication;
                const index = _publication.findIndex(tmpPub => tmpPub?._id === payload?.publicationId && tmpPub); // publication
                const tmp = _publication;

                const indexComment = tmp[publication.length > 1 ? index : 0]?.comments?.data.findIndex(tmpCom => tmpCom?._id === payload?._id && tmpCom); // comment
                tmp[publication.length > 1 ? index : 0].comments.data[indexComment] = { ...tmp[publication.length > 1 ? index : 0].comments.data[indexComment], ...payload }

                setPublication([...tmp.reverse()].sort((a, b) => a.createdAt < b.createdAt ? 1 : -1));
                setCurrent(false);
            }
        }
    }

    const onDeleteComment = async (payload) => {
        if (!payload.publicationId && !payload.commentId) return;

        const _publication = publication;
        const index = _publication.findIndex(tmpPub => tmpPub?._id === payload?.publicationId && tmpPub);
        let tmp = _publication;
        tmp[index] = {
            ...tmp[index],
            comments: {
                ...tmp[index]?.comments,
                data: tmp[index]?.comments.data.filter(comment => comment?._id !== payload?.commentId && comment)
            }
        }
        setPublication([...tmp.reverse()].sort((a, b) => a.createdAt < b.createdAt ? 1 : -1));
    }

    const onCreateComment = (payload) => {

        if (!payload.ownerId && !payload.publicationId) return;

        const _publication = publication;
        const index = _publication.findIndex(tmpPub => tmpPub?._id === payload?.publicationId && tmpPub);
        let tmp = _publication;

        if (tmp[index]?.comments?.data.length) {
            tmp[index] = {
                ...tmp[index],
                comments: {
                    ...tmp[index]?.comments,
                    data: [
                        ...tmp[index]?.comments?.data,
                        {
                            ...payload
                        }
                    ],
                    user: [
                        ...tmp[index]?.comments?.user,
                        {
                            ...payload?.user
                        }
                    ]
                }
            }
        } else {
            tmp[index] = {
                ...tmp[index],
                comments: {
                    ...tmp[index]?.comments,
                    data: [
                        {
                            ...payload
                        }
                    ],
                    user: [
                        { ...payload?.user }
                    ]
                }
            }
        }

        setPublication([...tmp.reverse()].sort((a, b) => a.createdAt < b.createdAt ? 1 : -1));
    }

    return (
        <>
            <Header className="toolbar-container">
                <HeaderToolbar />
            </Header>
            <Layout hasSider className="dashboard-container">
                <Layout.Sider>
                    <MessengerSidebar />
                </Layout.Sider>
                <Content>
                    <HeaderCustom user={user} />
                    <PublicationForm onCreate={onCreate} onEdit={handleEdit} />
                    {publication.map((_publication, index) => (<PublicationDetail
                        content={_publication?.content}
                        time={{ createdAt: _publication?.createdAt, modifiedAt: _publication?.modifiedAt }}
                        id={_publication._id}
                        onDelete={onDelete}
                        onDeleteComment={onDeleteComment}
                        onCreateComment={onCreateComment}
                        onEdit={(rawData) => onEdit({ ...rawData, type: 'edit-publication' })}
                        onEditComment={(rawData) => onEdit({ ...rawData, type: 'edit-comment' })}
                        rawData={_publication}
                        key={index}
                    />))}
                    <Modal visible={visible} onClose={onCloseModal} current={current} onEditPublication={handleEdit} onEditComment={handleEdit} />
                    <MessengerChat />
                </Content>
                <Layout.Sider className='sider-messenger'>
                    <MessengerSidebar display='friend' />
                </Layout.Sider>
            </Layout>
            <Footer></Footer>
        </>
    )
}

const mapStateToProps = ({ user }) => ({ user });
export default _.compose(connect(mapStateToProps), withRouter)(Dashboard);