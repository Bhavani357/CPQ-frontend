import React, { useState } from 'react';
import { Form, Input, Button, Divider } from 'antd';
import './products.css';
import axios from 'axios';
import Cookies from 'js-cookie';

const AddProduct: React.FC = () => {
  const [form] = Form.useForm();
  const [responseMessage, setResponseMessage] = useState<string>('');

  const onFinish = async (values: any) => {
    const jwtToken = Cookies.get('jwtToken');
    const apiEndPoint = 'http://localhost:5000/api/v1/products/create';

    if (!jwtToken) {
      setResponseMessage('JWT token is missing. Please log in again.');
      return;
    }

    try {
      const response = await axios.post(apiEndPoint, values, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      setResponseMessage(response.data.message);
      // console.log('Success:', response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // console.error('Error response:', error.response.data);
          setResponseMessage(
            `Error: ${error.response.data.message || 'Unknown server error'}`,
          );
        } else if (error.request) {
          // console.error('Error request:', error.request);
          setResponseMessage('No response from server. Please try again.');
        } else {
          // console.error('Error message:', error.message);
          setResponseMessage('Error adding Product. Please try again.');
        }
      } else {
        // console.error('Unexpected error:', error);
        setResponseMessage('Unexpected error occurred. Please try again.');
      }
    }
  };

  const onCancel = () => {
    form.resetFields();
    setResponseMessage('');
  };

  return (
    <div className="customer">
      <Form
        form={form}
        layout="vertical"
        name="addProductForm"
        onFinish={onFinish}
      >
        <Form.Item
          label="ProductName"
          name="name"
          rules={[
            { required: true, message: 'Please input the Product name!' },
          ]}
        >
          <Input />
        </Form.Item>
        <Divider />

        <Form.Item>
          <Button type="default" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginLeft: '8px' }}
          >
            Submit
          </Button>
        </Form.Item>
        {responseMessage && <div>{responseMessage}</div>}
      </Form>
    </div>
  );
};

export default AddProduct;
