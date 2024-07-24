import React, { useState } from 'react';
import { Layout, Menu, Button, Modal } from 'antd';
import { useNavigate, Outlet } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import './CpqLayout.css';
import Cookies from 'js-cookie';
import AddCustomer from '../Customers/AddCustomer';
import AddProduct from '../Products/AddProduct';

const { Header, Sider, Content } = Layout;

const CpqLayout: React.FC = () => {
  const [headerTitle, setHeaderTitle] = useState<string>('Proposals');
  const [isVisibleCustomer, setIsVisibleCustomer] = useState<boolean>(false);
  const [isVisibleProduct, setIsVisibleProduct] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleLogOut = () => {
    Cookies.remove('jwtToken');
    navigate('/signin');
  };
  const handleMenuClick = (key: string) => {
    switch (key) {
      case 'proposals':
        setHeaderTitle('Proposals');
        navigate('/proposals');
        break;
      case 'subscriptions':
        setHeaderTitle('Subscriptions');
        navigate('/subscriptions');
        break;
      case 'invoices':
        setHeaderTitle('Invoices');
        navigate('/invoices');
        break;
      case 'customers':
        setHeaderTitle('Customers');
        navigate('/customers');
        break;
      case 'products':
        setHeaderTitle('Products');
        navigate('/products');
        break;
      default:
        navigate('/proposals');
        break;
    }
  };

  const handleCreateProposal = () => {
    const newProposalId = uuidv4();
    navigate(`/proposals/${newProposalId}?first=true`);
  };

  const handleAddCustomer = () => {
    setIsVisibleCustomer(true);
  };

  const handleAddCustomerCancel = () => {
    setIsVisibleCustomer(false);
  };

  const handleAddProduct = () => {
    setIsVisibleProduct(true);
  };
  const handleAddProductCancel = () => {
    setIsVisibleProduct(false);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        style={{
          backgroundColor: '#fff',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: '#fff',
          borderBottomColor: 'lightgray',
        }}
      >
        <h2 className="sidebar-logo">CPQ</h2>
        <Menu
          mode="inline"
          defaultSelectedKeys={['proposals']}
          onClick={({ key }) => {
            handleMenuClick(key);
          }}
        >
          <Menu.Item key="proposals">Proposals</Menu.Item>
          <Menu.Item key="subscriptions">Subscriptions</Menu.Item>
          <Menu.Item key="invoices">Invoices</Menu.Item>
          <Menu.Item key="customers">Customers</Menu.Item>
          <Menu.Item key="products">Products</Menu.Item>
        </Menu>
        <Menu
          style={{
            position: 'absolute',
            bottom: '0',
            width: '100%',
            backgroundColor: 'red',
          }}
        >
          <Menu.Item onClick={handleLogOut}>LogOut</Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            background: '#fff',
            paddingLeft: '30px',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: '#fff',
            borderBottomColor: 'lightgray',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h2>{headerTitle}</h2>
          {headerTitle === 'Proposals' && (
            <Button type="primary" onClick={handleCreateProposal}>
              Create Proposal
            </Button>
          )}
          {headerTitle === 'Customers' && (
            <Button type="primary" onClick={handleAddCustomer}>
              Add Customer
            </Button>
          )}
          {headerTitle === 'Products' && (
            <Button type="primary" onClick={handleAddProduct}>
              Add Product
            </Button>
          )}
        </Header>
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <Outlet />
        </Content>
      </Layout>
      <Modal
        title="Add Customer"
        open={isVisibleCustomer}
        onCancel={handleAddCustomerCancel}
        footer={null}
      >
        <AddCustomer />
      </Modal>
      <Modal
        title="Add Product"
        open={isVisibleProduct}
        onCancel={handleAddProductCancel}
        footer={null}
      >
        <AddProduct />
      </Modal>
    </Layout>
  );
};

export default CpqLayout;
