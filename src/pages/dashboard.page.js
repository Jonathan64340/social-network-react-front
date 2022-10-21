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
import { Blocks } from 'react-loader-spinner'
const { Content, Header, Footer } = Layout;

const Dashboard = ({ user, ...props }) => {
    const [publication, setPublication] = useState([]);
    const [current, setCurrent] = useState(false);
    const [viewUser, setViewUser] = useState(user?._id);
    const [visible, setVisible] = useState(false);
    const [canPostOrComment, setCanPostOrComment] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (props?.match?.params?.id) {
            setViewUser(props?.match?.params?.id);
        } else {
            setViewUser(user?._id);
        }
        // eslint-disable-next-line
    }, [props?.match?.params?.id, props?.match?.path])

    useEffect(() => {

        if ((user?.isLogged && user?._id && viewUser) || (user?.isLogged && user?._id)) {
            setLoading(true);
            getPublication({ _id: viewUser || user?._id })
                .then(result => {
                    setPublication(result);
                    setLoading(false);
                })
        }
        // eslint-disable-next-line
    }, [user?._id, viewUser]);

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

    const onLike = async (payload) => {
        if (payload !== {}) {
            console.log(payload)
            setCurrent({ ...payload });
        }
    }

    const onDislike = async (payload) => {
        if (payload !== {}) {
            setCurrent({ ...payload });
        }
    }

    const handleEdit = async (payload) => {
        if (payload !== {} || payload?._id) {
            if ((payload?.type === 'like') || (payload?.type === 'dislike')) {
                return alert('ok')
            }
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
            {
                !user?.accessToken
                    ? <div className='loader-full'>
                        <Blocks
                            visible={true}
                            height="200"
                            width="200"
                            ariaLabel="blocks-loading"
                            wrapperStyle={{}}
                            wrapperClass="blocks-wrapper"
                        />
                    </div> : <>
                        <Header className="toolbar-container sticky">
                            <HeaderToolbar />
                        </Header>
                        <Layout hasSider className="dashboard-container sticky">
                            <Layout.Sider>
                                <MessengerSidebar display='default' />
                            </Layout.Sider>
                            <Content>
                                {
                                    loading ? <div className='loader-full-inside'>
                                        <Blocks
                                            visible={true}
                                            height="200"
                                            width="200"
                                            ariaLabel="blocks-loading"
                                            wrapperStyle={{}}
                                            wrapperClass="blocks-wrapper"
                                        />
                                    </div> : <>
                                        <HeaderCustom user={user} onReplyFriend={setCanPostOrComment} />
                                        <PublicationForm onCreate={onCreate} onEdit={handleEdit} canPostOrComment={canPostOrComment} />
                                        {publication.map((_publication, index) => (<PublicationDetail
                                            content={_publication?.content}
                                            time={{ createdAt: _publication?.createdAt, modifiedAt: _publication?.modifiedAt }}
                                            id={_publication._id}
                                            onDelete={onDelete}
                                            onDeleteComment={onDeleteComment}
                                            onCreateComment={onCreateComment}
                                            onEdit={(rawData) => onEdit({ ...rawData, type: 'edit-publication' })}
                                            onEditComment={(rawData) => onEdit({ ...rawData, type: 'edit-comment' })}
                                            onLike={(rawData) => onLike({ ...rawData, type: 'edit-comment' })}
                                            onDislike={(rawData) => onDislike({ ...rawData, type: 'edit-comment' })}
                                            rawData={_publication}
                                            canPostOrComment={canPostOrComment}
                                            key={index}
                                        />))}
                                    </>
                                }
                                <Modal visible={visible} onClose={onCloseModal} current={current} onEditPublication={handleEdit} onEditComment={handleEdit} />
                                <MessengerChat />
                            </Content>
                            <Layout.Sider className='sider-messenger sticky'>
                                <MessengerSidebar display='friend' />
                            </Layout.Sider>
                        </Layout>
                        <Footer></Footer>
                    </>
            }
        </>
    )
}

const mapStateToProps = ({ user }) => ({ user });
export default _.compose(connect(mapStateToProps), withRouter)(Dashboard);