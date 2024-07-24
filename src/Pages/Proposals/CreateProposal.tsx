import React, { useState, useEffect } from 'react';
import { Button, Form, Input, DatePicker, Select, Row, Col, Modal } from 'antd';
import { FileTextOutlined, ShareAltOutlined } from '@ant-design/icons';
import './Proposal.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import AddCustomer from '../Customers/AddCustomer';
import SelectedProduct from './SelectedProduct';

const { Option } = Select;
export interface ProductTypes {
  id: number;
  uuid: string;
  name: string;
  quantity: number;
  internal_name: string;
  description: string;
  charge_method: string;
  currency: string;
  unit_price: number;
  status: string;
  last_activity: string;
}

const CreateProposal: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<ProductTypes[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<ProductTypes[]>([]);
  const [totalCost, setTotalCost] = useState<number>(0);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    const jwtToken: string | undefined = Cookies.get('jwtToken');
    const conf = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/v1/customers/',
          conf,
        );
        if (Array.isArray(response.data)) {
          setCustomers(response.data);
        } else {
          console.error('Expected an array but received:', response.data);
        }
      } catch (error) {
        console.log('Error occurred while getting customers data', error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/v1/products/',
          conf,
        );
        console.log('Products response:', response.data);
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          console.error('Expected an array but received:', response.data);
          setProducts([]); // Safeguard to ensure `products` is always an array
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]); // Safeguard to ensure `products` is always an array
      }
    };

    fetchCustomers();
    fetchProducts();
  }, []);

  const handleProductChange = (productId: number) => {
    const productData: ProductTypes | undefined = products.find((each) => {
      return each.id === productId;
    });
    if (productData) {
      setSelectedProducts([...selectedProducts, productData]);
    } else {
      console.log('product not found');
    }
    console.log(selectedProducts);
  };
  const totalOrderValue = (value: number) => {
    setTotalCost((prevValue) => {
      return prevValue + value;
    });
  };

  return (
    <div className="create-proposal-container">
      <div className="fixed-header">
        <FileTextOutlined style={{ fontSize: '24px' }} />
        <Button type="primary" icon={<ShareAltOutlined />}>
          Share
        </Button>
      </div>
      <div className="content">
        <Form layout="vertical">
          <div className="customers-container">
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label="Customer"
                  name="customer"
                  rules={[
                    { required: true, message: 'Please select a customer!' },
                  ]}
                >
                  <Select placeholder="Select a customer">
                    {customers.map((customer) => {
                      return (
                        <Option key={customer.id} value={customer.id}>
                          {customer.name}
                        </Option>
                      );
                    })}
                  </Select>
                  <Button
                    type="primary"
                    onClick={showModal}
                    style={{ marginTop: '10px' }}
                  >
                    Add Customer
                  </Button>
                  <Modal
                    title="Add Customer"
                    visible={isModalVisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={null}
                  >
                    <AddCustomer />
                  </Modal>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Proposal No" name="proposalNo">
                  <Input placeholder="Reference(optional)" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Proposal Expires"
                  name="proposalExpires"
                  rules={[
                    {
                      required: true,
                      message: 'Please select the proposal expiry date!',
                    },
                  ]}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Term"
                  name="term"
                  rules={[{ required: true, message: 'Term is required!' }]}
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <Input type="number" />
                    </Col>
                    <Col span={12}>
                      <Select placeholder="months">
                        <Option value="months">Months</Option>
                        <Option value="quarters">Quarters</Option>
                        <Option value="years">Years</Option>
                      </Select>
                    </Col>
                  </Row>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Effective Total Price" name="totalPrice">
                  <div className="total-order">{totalCost.toFixed(2)}</div>
                </Form.Item>
              </Col>
            </Row>
          </div>
          <div className="products-container">
            <Form.Item label="Products" name="products">
              <Row gutter={16}>
                <Col span={12}>
                  <Select
                    placeholder="Select a product"
                    onChange={handleProductChange}
                  >
                    {products.map((product) => {
                      return (
                        <Option key={product.id} value={product.id}>
                          {product.name}
                        </Option>
                      );
                    })}
                  </Select>
                </Col>
              </Row>
            </Form.Item>
            {selectedProducts.map((product) => {
              return (
                <SelectedProduct
                  key={product.id}
                  name={product.name}
                  unitPrice={product.unit_price}
                  description={product.description}
                  fnTotalCost={totalOrderValue}
                />
              );
            })}
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Create Proposal
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CreateProposal;
