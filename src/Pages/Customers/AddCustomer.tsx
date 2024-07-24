import React, { useState } from 'react';
import { Form, Input, Select, Button, Divider, Row, Col } from 'antd';
import './customers.css';
import axios from 'axios';
import Cookies from 'js-cookie';

const { Option } = Select;

const countryStateMap: { [key: string]: string[] } = {
  india: [
    'Maharashtra',
    'Karnataka',
    'Tamil Nadu',
    'Delhi',
    'Telangana',
    'AndhraPradesh',
  ],
  usa: ['California', 'Texas', 'Florida', 'New York'],
  england: [
    'Greater London',
    'West Midlands',
    'Greater Manchester',
    'Merseyside',
  ],
};

const AddCustomer: React.FC = () => {
  const [form] = Form.useForm();
  const [states, setStates] = useState<string[]>(countryStateMap.india);
  const [responseMessage, setResponseMessage] = useState<string>('');

  const onFinish = async (values: any) => {
    const jwtToken = Cookies.get('jwtToken');
    const apiEndPoint = 'http://localhost:5000/api/v1/customers/create';

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
      console.log('Success:', response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('Error response:', error.response.data);
          setResponseMessage(
            `Error: ${error.response.data.message || 'Unknown server error'}`,
          );
        } else if (error.request) {
          console.error('Error request:', error.request);
          setResponseMessage('No response from server. Please try again.');
        } else {
          console.error('Error message:', error.message);
          setResponseMessage('Error creating customer. Please try again.');
        }
      } else {
        console.error('Unexpected error:', error);
        setResponseMessage('Unexpected error occurred. Please try again.');
      }
    }
  };

  const onCancel = () => {
    form.resetFields();
    setResponseMessage('');
  };

  const handleCountryChange = (value: string) => {
    setStates(countryStateMap[value]);
    form.setFieldsValue({ state: undefined });
  };

  return (
    <div className="customer">
      <Form
        form={form}
        layout="vertical"
        name="addCustomerForm"
        onFinish={onFinish}
      >
        <Form.Item
          label="Legal Company Name"
          name="name"
          rules={[
            { required: true, message: 'Please input the company name!' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please input the email!' }]}
        >
          <Input />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Default Customer Currency"
              name="currency"
              rules={[
                {
                  required: true,
                  message: 'Please select the customer currency!',
                },
              ]}
            >
              <Select defaultValue="USD">
                <Option value="USD">USD</Option>
                <Option value="INR">India Rupee</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Billing Contact"
              name="billingContact"
              rules={[
                {
                  required: true,
                  message: 'Please input the billing contact!',
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <div>Ship to</div>

        <Form.Item
          label="Address"
          name="location"
          rules={[{ required: true, message: 'Please input the address!' }]}
        >
          <Input />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="City"
              name="city"
              rules={[{ required: true, message: 'Please input the city!' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Zip/Postal Code"
              name="postalCode"
              rules={[
                { required: true, message: 'Please input the postal code!' },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Country"
              name="country"
              rules={[
                { required: true, message: 'Please select the country!' },
              ]}
            >
              <Select defaultValue="india" onChange={handleCountryChange}>
                <Option value="india">India</Option>
                <Option value="usa">USA</Option>
                <Option value="england">England</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="State/Province"
              name="state"
              rules={[
                {
                  required: true,
                  message: 'Please select the state/province!',
                },
              ]}
            >
              <Select>
                {states.map((state) => {
                  return (
                    <Option key={state} value={state}>
                      {state}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>

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
            Create
          </Button>
        </Form.Item>

        {responseMessage && <div>{responseMessage}</div>}
      </Form>
    </div>
  );
};

export default AddCustomer;
