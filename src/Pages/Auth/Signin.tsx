import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import type { FormProps } from 'antd';
import { Button, Form, Input, Typography } from 'antd';
import '../../index.css';
import BASE_URL from '../../Services/APIs';

type FieldType = {
  email: string;
  password: string;
};
const Signin: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loginErrMessage, setLoginErrMessage] = useState<string>('');

  const { Paragraph, Title } = Typography;
  const navigate = useNavigate();
  const jwtToken = Cookies.get('jwtToken');
  useEffect(() => {
    if (jwtToken) {
      navigate('/proposals');
    }
  }, []);

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/users/login`,
        values,
      );
      console.log(response);
      const { token } = response.data;
      if (token) {
        Cookies.set('jwtToken', token, { expires: 7 });
        navigate('/proposals');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log('loginErrmsg', err);
        setLoginErrMessage(err.response?.data.message);
        // if (err.response) {
        //   setLoginErrMessage(err.response.data);
        // }
      }
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div className="signin-page">
      <div className="left-side">
        <div className="logo">
          <h1>CPQ</h1>
        </div>
      </div>
      <div className="login-container">
        <div className="cpq-heading-logo">
          <h1>CPQ</h1>
        </div>
        <div className="login-form">
          <Title level={2} className="heading">
            SIGNIN
          </Title>

          <Form
            layout="vertical"
            name="login"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item<FieldType>
              layout="vertical"
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'please enter your email' },
                { type: 'email', message: 'The email is not a valid email!' },
              ]}
            >
              <Input
                placeholder="email"
                value={email}
                onChange={handleEmailChange}
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item<FieldType>
              layout="vertical"
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'please enter your password' },
              ]}
            >
              <Input.Password
                placeholder="enter your password"
                value={password}
                onChange={handlePasswordChange}
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item>
              <div className="button-div">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="green-button"
                >
                  SIGN IN
                </Button>
              </div>
            </Form.Item>
            {loginErrMessage && (
              <Form.Item>
                <Paragraph className="login-message">
                  {loginErrMessage}
                </Paragraph>
              </Form.Item>
            )}
          </Form>
          <div className="signup-link">
            Don&apos;t have an account?
            <a href="/signup">Signup</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
