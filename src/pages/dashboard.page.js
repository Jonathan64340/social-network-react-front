import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import HeaderCustom from '../components/header/Header';
import PublicationForm from '../components/publication-form/PublicationForm';
import PublicationDetail from '../components/publication-detail/PublicationDetail';
import { getPublication } from '../endpoints/publication/publication';
import HeaderToolbar from '../components/header/HeaderToolbar';
const { Content, Header, Footer } = Layout;

const Dashboard = ({ user }) => {
    const [publication, setPublication] = useState([]);
    const [current, setCurrent] = useState(false);
    const [scrollListener, setScrollListener] = useState(null);

    useEffect(() => {
        const headerRef = document.querySelector('.toolbar-container');
        setScrollListener(window.addEventListener('scroll', () => {
            if (window?.scrollY >= 64) {
                headerRef?.classList?.add('sticky');
            } else {
                headerRef?.classList?.remove('sticky');
            }
        }));

        // To destroy listenner on unmount
        return () => {
            scrollListener && scrollListener.removeEventListener();
        }
    }, [scrollListener])

    useEffect(() => {

        if (user?.isLogged && user?._id) {
            getPublication({ _id: user?._id })
                .then(result => {
                    setPublication(result);
                })
        }

    }, [user?.isLogged, user?._id]);

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
            setCurrent({ ...payload });
        }
    }

    const handleEdit = async (payload) => {
        if (payload !== {} || payload?._id) {
            const _publication = (publication.length > 1 ? publication.reverse() : publication);
            const index = _publication.findIndex(tmpPub => tmpPub?._id !== payload?._id && tmpPub);
            const tmp = _publication.reverse();
            tmp[_publication.length > 1 ? index : 0] = { ...payload };
            setPublication([...tmp.reverse()].sort((a, b) => a.createdAt < b.createdAt ? 1 : -1));
            setCurrent(false);
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
                <Content>
                    <HeaderCustom user={user} />
                    <PublicationForm onCreate={onCreate} current={current} onEdit={handleEdit} />
                    {publication.map((_publication, index) => (<PublicationDetail
                        content={_publication?.content}
                        time={{ createdAt: _publication?.createdAt, modifiedAt: _publication?.modifiedAt }}
                        id={_publication._id}
                        onDelete={onDelete}
                        onDeleteComment={onDeleteComment}
                        onCreateComment={onCreateComment}
                        onEdit={onEdit}
                        rawData={_publication}
                        key={index}
                    />))}
                </Content>
            </Layout>
            <Footer></Footer>
        </>
    )
}

const mapStateToProps = ({ user }) => ({ user });
export default connect(mapStateToProps)(Dashboard);