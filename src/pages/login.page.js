import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { login } from '../endpoints/authentication/authentication';
import { getMe, updateUser } from '../endpoints/profile/profile';
import i18n from '../i18n';
import { persistTokenAndRefreshToken } from '../utils/persist.login';
import { setLogin } from '../actions/user.actions';
import _ from 'underscore';
import { Layout, Form, Input, Button, Checkbox } from 'antd';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';
import { Link, withRouter } from 'react-router-dom';
import { socket } from '../index';

const { Content } = Layout;

const Login = ({ ...props }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [socketIdFilled, setSocketIdFilled] = useState(null);
    const [updateComponentTime, setUpdateComponentTime] = useState(new Date().getTime());

    useEffect(() => {
        const updateComponentTimeInterval = setInterval(() => {
            if (socket.id) {
                setSocketIdFilled(socket.id);
                clearInterval(updateComponentTimeInterval);
            } else {
                setUpdateComponentTime(new Date().getTime());
            }
        }, 1000)
    }, [updateComponentTime])

    const handleSubmit = async (event) => {

        const user = await login({
            email: event.username,
            password: event.password
        });

        setIsLoading(false);
        if (!user?.accessToken) {
            return toast.error(i18n.t(user), {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }

        if (event.remember) {
            persistTokenAndRefreshToken(user?.accessToken, user?.refreshToken);
        }

        await props.dispatch(setLogin({
            accessToken: user?.accessToken,
            refreshToken: user?.refreshToken
        }))

        const me = await getMe();

        await updateUser({ ...me, sid: socketIdFilled, type: 'login', status: 'online' });

        await props.dispatch(setLogin({
            accessToken: user?.accessToken,
            refreshToken: user?.refreshToken,
            ...me
        }))

        props.history.push('/');

    };

    const onFinish = (values) => {
        handleSubmit(values);
    };

    return (
        <Layout>
            <Helmet>
                <title>MYUN-BOOK - {i18n.t('page.login.title_form')}</title>
            </Helmet>
            <Content className="authentication-layout">
                <div className="form-login-content">
                    <div className="logo">
                        <img src={`${process.env.PUBLIC_URL}/images/logo.png`} alt='' />
                    </div>
                    <Form
                        name="basic"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: i18n.t('form.required.text') }]}
                        >
                            <Input placeholder={i18n.t('form.auth.label.email')} />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: i18n.t('form.required.text') }]}
                        >
                            <Input.Password placeholder={i18n.t('form.auth.label.password')}
                            />
                        </Form.Item>

                        <Form.Item name="remember" valuePropName="checked">
                            <Checkbox>{i18n.t('button.auth.label.remember_me')}</Checkbox>
                        </Form.Item>

                        <Form.Item noStyle>
                            <Button type="primary" htmlType="submit" disabled={!socketIdFilled ? true : false} {...(isLoading ? { loading: true } : { loading: false })} ghost>
                                {i18n.t('button.auth.label.login')}
                            </Button>
                            <Link to={'/register'}>{i18n.t('button.auth.label.register')}</Link>
                        </Form.Item>
                    </Form>
                </div>
                <div className="description-container">
                    <header>
                        <h1>Gardez le contact avec vos proches et vos amis</h1>
                    </header>
                </div>
            </Content>
        </Layout>
    );
}

const mapDispatchToProps = dispatch => ({ dispatch });

export default _.compose(connect(mapDispatchToProps), withRouter)(Login);