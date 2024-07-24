import React, { useEffect, useState } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import { Input, Typography, Table } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { TableColumnsType, TableProps } from 'antd';
import Cookies from 'js-cookie';

interface InvoiceType {
  invoiceNo?: string;
  customer?: string;
  amount?: number;
  balance?: number;
  invoiceDate?: string;
  dueDate?: string;
  linkedStatus?: string;
  status?: string;
}

type OnChange = NonNullable<TableProps<InvoiceType>['onChange']>;
type SortOrder = 'ascend' | 'descend' | null;

interface SortState {
  columnKey?: string;
  order?: SortOrder;
}

const Invoices: React.FC = () => {
  const [invoiceData, setInvoiceData] = useState<InvoiceType[]>([]);
  const [filteredData, setFilteredData] = useState<InvoiceType[]>([]);
  const [loader, setLoader] = useState<boolean>(true);
  const [input, setInput] = useState<string>('');

  const { Paragraph } = Typography;

  const [sortedInfo, setSortedInfo] = useState<SortState>({});

  const handleOnChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setInput(value);
    const filtered = invoiceData.filter((invoice) => {
      return invoice.invoiceNo?.toLowerCase().includes(value.toLowerCase());
    });
    setFilteredData(filtered);
  };

  const handleChange: OnChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter as SortState);
  };

  const fetchInvoiceData = async () => {
    const jwtToken: string | undefined = Cookies.get('jwtToken');
    const conf: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    try {
      const response = await axios.get(
        'http://localhost:5000/api/v1/invoices/',
        conf,
      );

      if (Array.isArray(response.data)) {
        setInvoiceData(response.data);
        setFilteredData(response.data);
      } else {
        console.error('Expected an array but received:', response.data);
        setInvoiceData([]);
        setFilteredData([]);
      }
    } catch (error) {
      console.log('error occurred while getting invoices data', error);
      setInvoiceData([]);
      setFilteredData([]);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchInvoiceData();
  }, []);

  const columns: TableColumnsType<InvoiceType> = [
    {
      title: 'Invoice No',
      dataIndex: 'invoiceNo',
      key: 'invoiceNo',
      sorter: (a, b) => {
        return a.invoiceNo?.localeCompare(b.invoiceNo || '') || 0;
      },
      sortOrder: sortedInfo.columnKey === 'invoiceNo' ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
      sorter: (a, b) => {
        return a.customer?.localeCompare(b.customer || '') || 0;
      },
      sortOrder: sortedInfo.columnKey === 'customer' ? sortedInfo.order : null,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      sorter: (a, b) => {
        return (a.amount || 0) - (b.amount || 0);
      },
      sortOrder: sortedInfo.columnKey === 'amount' ? sortedInfo.order : null,
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      sorter: (a, b) => {
        return (a.balance || 0) - (b.balance || 0);
      },
      sortOrder: sortedInfo.columnKey === 'balance' ? sortedInfo.order : null,
    },
    {
      title: 'Invoice Date',
      dataIndex: 'invoiceDate',
      key: 'invoiceDate',
      sorter: (a, b) => {
        return a.invoiceDate?.localeCompare(b.invoiceDate || '') || 0;
      },
      sortOrder:
        sortedInfo.columnKey === 'invoiceDate' ? sortedInfo.order : null,
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      sorter: (a, b) => {
        return a.dueDate?.localeCompare(b.dueDate || '') || 0;
      },
      sortOrder: sortedInfo.columnKey === 'dueDate' ? sortedInfo.order : null,
    },
    {
      title: 'Linked Status',
      dataIndex: 'linkedStatus',
      key: 'linkedStatus',
      sorter: (a, b) => {
        return a.linkedStatus?.localeCompare(b.linkedStatus || '') || 0;
      },
      sortOrder:
        sortedInfo.columnKey === 'linkedStatus' ? sortedInfo.order : null,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
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

export default Invoices;
