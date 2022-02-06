import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import HeaderCustom from '../components/header/Header';
import PublicationForm from '../components/publication-form/PublicationForm';
import PublicationDetail from '../components/publication-detail/PublicationDetail';
import { getPublication } from '../endpoints/publication/publication';
const { Content, Header, Footer } = Layout;

const Dashboard = ({ user }) => {
    const [publication, setPublication] = useState([]);

    useEffect(() => {

        if (user?._id) {
            getPublication({ _id: user?._id })
                .then(result => {
                    console.log(result);
                    setPublication(result);
                })
        }

    }, [user?._id]);

    const onDelete = (id) => {
        setPublication(publication.filter(_publication => _publication?._id !== id && _publication))
    }

    const onCreate = async (payload) => {
        if (payload !== {}) {
            setPublication(publication => [...publication.reverse(), { ...payload }].sort((a, b) => a.createAt > b.createAt ? 1 : -1));
        }
    }

    return (
        <>
            <Header></Header>
            <Layout hasSider className="dashboard-container">
                <Content>
                    <HeaderCustom user={user} />
                    <PublicationForm onCreate={onCreate} />
                    {publication.map((_publication, index) => (<PublicationDetail content={_publication?.content} time={{ createAt: _publication?.createdAt, modifiedAt: _publication?.modifiedAt }} id={_publication._id} user={_publication?.user?.username} onDelete={onDelete} key={index} />))}
                </Content>
            </Layout>
            <Footer></Footer>
        </>
    )
}

const mapStateToProps = ({ user }) => ({ user });
export default connect(mapStateToProps)(Dashboard);