import React, { useEffect, useState } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import { Input, Typography, Table } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { TableColumnsType, TableProps } from 'antd';
import Cookies from 'js-cookie';

interface ProductType {
  name?: string;
  quantity?: number;
  internalName?: string;
  description?: string;
  chargeMethod?: string;
  currency?: string;
  unitPrice?: number;
  status?: string;
  lastActivity?: string;
}

type OnChange = NonNullable<TableProps<ProductType>['onChange']>;
type SortOrder = 'ascend' | 'descend' | null;

interface SortState {
  columnKey?: string;
  order?: SortOrder;
}

const Products: React.FC = () => {
  const [productData, setProductData] = useState<ProductType[]>([]);
  const [filteredData, setFilteredData] = useState<ProductType[]>([]);
  const [loader, setLoader] = useState<boolean>(true);
  const [input, setInput] = useState<string>('');

  const { Paragraph } = Typography;

  const [sortedInfo, setSortedInfo] = useState<SortState>({});

  const handleOnChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setInput(value);
    const filtered = productData.filter((product) => {
      return product.name?.toLowerCase().includes(value.toLowerCase());
    });
    setFilteredData(filtered);
  };

  const handleChange: OnChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter as SortState);
  };

  const fetchProductData = async () => {
    const jwtToken: string | undefined = Cookies.get('jwtToken');
    const conf: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    try {
      const response = await axios.get(
        'http://localhost:5000/api/v1/products/',
        conf,
      );

      if (Array.isArray(response.data)) {
        setProductData(response.data);
        setFilteredData(response.data);
      } else {
        console.error('Expected an array but received:', response.data);
        setProductData([]);
        setFilteredData([]);
      }
    } catch (error) {
      console.log('error occurred while getting products data', error);
      setProductData([]);
      setFilteredData([]);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  const columns: TableColumnsType<ProductType> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => {
        return a.name?.localeCompare(b.name || '') || 0;
      },
      sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Internal Name',
      dataIndex: 'internal_name',
      key: 'internalName',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Charge Method',
      dataIndex: 'charge_method',
      key: 'chargeMethod',
    },
    {
      title: 'Currency',
      dataIndex: 'currency',
      key: 'currency',
    },
    {
      title: 'Unit Price',
      dataIndex: 'unit_price',
      key: 'unitPrice',
      sorter: (a, b) => {
        return (a.unitPrice || 0) - (b.unitPrice || 0);
      },
      sortOrder: sortedInfo.columnKey === 'unitPrice' ? sortedInfo.order : null,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Last Activity',
      dataIndex: 'last_activity',
      key: 'lastActivity',
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

export default Products;
