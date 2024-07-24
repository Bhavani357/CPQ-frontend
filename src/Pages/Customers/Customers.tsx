import React, { useEffect, useState, useCallback } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import { Input, Typography, Table } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { TableColumnsType, TableProps } from 'antd';
import Cookies from 'js-cookie';

interface DataType {
  key: React.Key;
  name: string;
  billing_contact: string;
  city: string;
  country: string;
  created_at: string;
  currency: string;
  email: string;
  id: string;
  location: string;
  postal_code: string;
  state: string;
  updated_at: string;
}

type OnChange = NonNullable<TableProps<DataType>['onChange']>;
type SortOrder = 'ascend' | 'descend' | null;

interface SortState {
  columnKey?: string;
  order?: SortOrder;
}

const Customers: React.FC = () => {
  const [customerData, setCustomerData] = useState<DataType[]>([]);
  const [filteredData, setFilteredData] = useState<DataType[]>([]);
  const [loader, setLoader] = useState<boolean>(true);
  const [input, setInput] = useState<string>('');

  const { Paragraph } = Typography;

  const [sortedInfo, setSortedInfo] = useState<SortState>({});

  const handleOnChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setInput(value);
    const filtered = customerData.filter((customer) => {
      return customer.name.toLowerCase().includes(value.toLowerCase());
    });
    setFilteredData(filtered);
  };

  const handleChange: OnChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter as SortState);
  };

  const fetchCustomerData = useCallback(async () => {
    const jwtToken: string | undefined = Cookies.get('jwtToken');
    // console.log(jwtToken);
    const conf: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    try {
      const response = await axios.get(
        'http://localhost:5000/api/v1/customers/',
        conf,
      );
      if (Array.isArray(response.data)) {
        setCustomerData(response.data);
        setFilteredData(response.data);
      } else {
        // console.error('Expected an array but received:', response.data);
        setCustomerData([]);
        setFilteredData([]);
      }
    } catch (error) {
      console.log('error occurred while getting customers data', error);
      setCustomerData([]);
      setFilteredData([]);
    } finally {
      setLoader(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const columns: TableColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => {
        return a.name.localeCompare(b.name);
      },
      sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: 'Ship to address / Bill to address',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Billing Contact',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Default Currency',
      dataIndex: 'currency',
      key: 'currency',
    },
  ];

  return (
    <div>
      <Paragraph>Search</Paragraph>
      <Input
        placeholder="Search"
        id="search"
        style={{ width: '250px' }}
        prefix={<SearchOutlined />}
        onChange={handleOnChangeInput}
        value={input}
      />
      <Table
        columns={columns}
        style={{ marginTop: '50px' }}
        dataSource={filteredData}
        loading={loader}
        onChange={handleChange}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default Customers;
