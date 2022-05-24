import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { register } from '../endpoints/authentication/authentication';
import { persistTokenAndRefreshToken } from '../utils/persist.login';
import i18n from '../i18n';
import { setLogin } from '../actions/user.actions';
import { Layout, Form, Input, Button, Checkbox } from 'antd';
import { getMe, updateUser } from '../endpoints/profile/profile';
import _ from 'underscore';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';
import { withRouter, Link } from 'react-router-dom';
import { socket } from '../index';

const { Content } = Layout;

const Register = ({ ...props }) => {
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
        const data = event;
        setIsLoading(true);
        // eslint-disable-next-line no-console
        const user = await register({
            email: data['email'].trim(),
            password: data['password'].trim(),
            username: data['username'].trim(),
            firstname: data['firstname'].trim(),
            lastname: data['lastname'].trim(),
            sid: socketIdFilled
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
        if (data['remember']) {
            persistTokenAndRefreshToken(user?.accessToken, user?.refreshToken);
        }


        props.dispatch(setLogin({
            accessToken: user?.accessToken,
            refreshToken: user?.refreshToken
        }))

        const me = await getMe();

        await updateUser({ ...me, sid: socketIdFilled, type: 'login', ...(!me?.status && { status: 'online' }) });

        props.dispatch(setLogin({
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
                <title>MYUN-BOOK - {i18n.t('page.register.title_form')}</title>
            </Helmet>
            <Content className="authentication-layout">
                <div className="form-login-content">
                    <div className="logo">
                        <img src={`${process.env.PUBLIC_URL}/images/logo.png`} alt='' />
                    </div>
                    <Form
                        name="basic-register"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Form.Item
                            name="email"
                            rules={[{ required: true, message: i18n.t('form.required.text') }]}
                        >
                            <Input placeholder={i18n.t('form.auth.label.email')} type="email" />
                        </Form.Item>

                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: i18n.t('form.required.text') }]}
                        >
                            <Input placeholder={i18n.t('form.auth.label.username')} type="text" />
                        </Form.Item>

                        <Form.Item noStyle>
                            <Form.Item
                                name="firstname"
                                rules={[{ required: true, message: i18n.t('form.required.text') }]}
                            >
                                <Input placeholder={i18n.t('form.auth.label.firstname')} type="text" />
                            </Form.Item>

                            <Form.Item
                                name="lastname"
                                rules={[{ required: true, message: i18n.t('form.required.text') }]}
                            >
                                <Input placeholder={i18n.t('form.auth.label.lastname')} type="text" />
                            </Form.Item>
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
                                {i18n.t('button.auth.label.register')}
                            </Button>
                            <Link to={'/login'}>{i18n.t('button.auth.label.login')}</Link>
                        </Form.Item>
                    </Form>
                </div>
            </Content>
        </Layout>
    );
}

const mapDispatchToProps = dispatch => ({ dispatch });

export default _.compose(connect(mapDispatchToProps), withRouter)(Register);