import React, { useEffect, useState } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import { Input, Typography, Table } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { TableColumnsType, TableProps } from 'antd';
import Cookies from 'js-cookie';

interface SubscriptionType {
  customerSubscriptionNo?: string;
  start?: string;
  end?: string;
  tcv?: number;
  nextPayment?: string;
  billFrequencyMethod?: string;
  autoRenewal?: string;
  status?: string;
}

type OnChange = NonNullable<TableProps<SubscriptionType>['onChange']>;
type SortOrder = 'ascend' | 'descend' | null;

interface SortState {
  columnKey?: string;
  order?: SortOrder;
}

const Subscriptions: React.FC = () => {
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionType[]>(
    [],
  );
  const [filteredData, setFilteredData] = useState<SubscriptionType[]>([]);
  const [loader, setLoader] = useState<boolean>(true);
  const [input, setInput] = useState<string>('');

  const { Paragraph } = Typography;

  const [sortedInfo, setSortedInfo] = useState<SortState>({});

  const handleOnChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setInput(value);
    const filtered = subscriptionData.filter((subscription) => {
      return subscription.customerSubscriptionNo
        ?.toLowerCase()
        .includes(value.toLowerCase());
    });
    setFilteredData(filtered);
  };

  const handleChange: OnChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter as SortState);
  };

  const fetchSubscriptionData = async () => {
    const jwtToken: string | undefined = Cookies.get('jwtToken');
    const conf: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    try {
      const response = await axios.get(
        'http://localhost:5000/api/v1/subscriptions/',
        conf,
      );

      if (Array.isArray(response.data)) {
        setSubscriptionData(response.data);
        setFilteredData(response.data);
      } else {
        console.error('Expected an array but received:', response.data);
        setSubscriptionData([]);
        setFilteredData([]);
      }
    } catch (error) {
      console.log('error occurred while getting subscriptions data', error);
      setSubscriptionData([]);
      setFilteredData([]);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const columns: TableColumnsType<SubscriptionType> = [
    {
      title: 'Customer/Subscription No.',
      dataIndex: 'customerSubscriptionNo',
      key: 'customerSubscriptionNo',
      sorter: (a, b) => {
        return (
          a.customerSubscriptionNo?.localeCompare(
            b.customerSubscriptionNo || '',
          ) || 0
        );
      },
      sortOrder:
        sortedInfo.columnKey === 'customerSubscriptionNo'
          ? sortedInfo.order
          : null,
      ellipsis: true,
    },
    {
      title: 'Start',
      dataIndex: 'start',
      key: 'start',
      sorter: (a, b) => {
        return a.start?.localeCompare(b.start || '') || 0;
      },
      sortOrder: sortedInfo.columnKey === 'start' ? sortedInfo.order : null,
    },
    {
      title: 'End',
      dataIndex: 'end',
      key: 'end',
      sorter: (a, b) => {
        return a.end?.localeCompare(b.end || '') || 0;
      },
      sortOrder: sortedInfo.columnKey === 'end' ? sortedInfo.order : null,
    },
    {
      title: 'TCV',
      dataIndex: 'tcv',
      key: 'tcv',
      sorter: (a, b) => {
        return (a.tcv || 0) - (b.tcv || 0);
      },
      sortOrder: sortedInfo.columnKey === 'tcv' ? sortedInfo.order : null,
    },
    {
      title: 'Next Payment',
      dataIndex: 'nextPayment',
      key: 'nextPayment',
    },
    {
      title: 'Bill Frequency/Method',
      dataIndex: 'billFrequencyMethod',
      key: 'billFrequencyMethod',
      sorter: (a, b) => {
        return (
          a.billFrequencyMethod?.localeCompare(b.billFrequencyMethod || '') || 0
        );
      },
      sortOrder:
        sortedInfo.columnKey === 'billFrequencyMethod'
          ? sortedInfo.order
          : null,
    },
    {
      title: 'Auto Renewal',
      dataIndex: 'autoRenewal',
      key: 'autoRenewal',
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

export default Subscriptions;
