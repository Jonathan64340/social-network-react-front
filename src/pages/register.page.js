import React, { useState } from 'react';
import { connect } from 'react-redux';
import { register } from '../endpoints/authentication/authentication';
import { persistTokenAndRefreshToken } from '../utils/persist.login';
import i18n from '../i18n';
import { setLogin } from '../actions/user.actions';
import { Layout, Form, Input, Button, Checkbox } from 'antd';
import { getMe } from '../endpoints/profile/profile';
import _ from 'underscore';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';
import { withRouter } from 'react-router-dom';

const { Content } = Layout;

const Register = ({ ...props }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event) => {
        const data = event;
        setIsLoading(true);
        // eslint-disable-next-line no-console
        const user = await register({
            email: data['email'],
            password: data['password'],
            username: data['username']
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
                <title>{i18n.t('page.register.title_form')}</title>
            </Helmet>
            <Content className="authentication-layout">
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
                        <Input placeholder={i18n.t('form.auth.label.email')} />
                    </Form.Item>

                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: i18n.t('form.required.text') }]}
                    >
                        <Input placeholder={i18n.t('form.auth.label.username')} />
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


                    <Form.Item>
                        <Button type="primary" htmlType="submit" {...(isLoading ? { loading: true } : { loading: false })}>
                            {i18n.t('button.auth.label.login')}
                        </Button>
                    </Form.Item>
                </Form>
            </Content>
        </Layout>
    );
}

const mapDispatchToProps = dispatch => ({ dispatch });

export default _.compose(connect(mapDispatchToProps), withRouter)(Register);