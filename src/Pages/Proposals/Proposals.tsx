import React, { useEffect, useState } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import { Input, Typography, Table } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { TableColumnsType, TableProps } from 'antd';
import Cookies from 'js-cookie';

interface ProposalType {
  customerOrProposalTitle?: string;
  valueOrTerm?: string;
  lastActivity?: string;
  status?: string;
  signed?: string;
}

type OnChange = NonNullable<TableProps<ProposalType>['onChange']>;
type SortOrder = 'ascend' | 'descend' | null;

interface SortState {
  columnKey?: string;
  order?: SortOrder;
}

const Proposals: React.FC = () => {
  const [proposalData, setProposalData] = useState<ProposalType[]>([]);
  const [filteredData, setFilteredData] = useState<ProposalType[]>([]);
  const [loader, setLoader] = useState<boolean>(true);
  const [input, setInput] = useState<string>('');

  const { Paragraph } = Typography;

  const [sortedInfo, setSortedInfo] = useState<SortState>({});

  const handleOnChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setInput(value);
    const filtered = proposalData.filter((proposal) => {
      return proposal.customerOrProposalTitle
        ?.toLowerCase()
        .includes(value.toLowerCase());
    });
    setFilteredData(filtered);
  };

  const handleChange: OnChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter as SortState);
  };

  const fetchProposalData = async () => {
    const jwtToken: string | undefined = Cookies.get('jwtToken');
    const conf: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    try {
      const response = await axios.get(
        'http://localhost:5000/api/v1/proposals/',
        conf,
      );

      if (Array.isArray(response.data)) {
        setProposalData(response.data);
        setFilteredData(response.data);
      } else {
        console.error('Expected an array but received:', response.data);
        setProposalData([]);
        setFilteredData([]);
      }
    } catch (error) {
      console.log('error occurred while getting proposals data', error);
      setProposalData([]);
      setFilteredData([]);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchProposalData();
  }, []);

  const columns: TableColumnsType<ProposalType> = [
    {
      title: 'Customer/Proposal Title',
      dataIndex: 'customerOrProposalTitle',
      key: 'customerOrProposalTitle',
      sorter: (a, b) => {
        return (
          a.customerOrProposalTitle?.localeCompare(
            b.customerOrProposalTitle || '',
          ) || 0
        );
      },
      sortOrder:
        sortedInfo.columnKey === 'customerOrProposalTitle'
          ? sortedInfo.order
          : null,
      ellipsis: true,
    },
    {
      title: 'Value/Term',
      dataIndex: 'valueOrTerm',
      key: 'valueOrTerm',
      sorter: (a, b) => {
        return a.valueOrTerm?.localeCompare(b.valueOrTerm || '') || 0;
      },
      sortOrder:
        sortedInfo.columnKey === 'valueOrTerm' ? sortedInfo.order : null,
    },
    {
      title: 'Last Activity',
      dataIndex: 'lastActivity',
      key: 'lastActivity',
      sorter: (a, b) => {
        return a.lastActivity?.localeCompare(b.lastActivity || '') || 0;
      },
      sortOrder:
        sortedInfo.columnKey === 'lastActivity' ? sortedInfo.order : null,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => {
        return a.status?.localeCompare(b.status || '') || 0;
      },
      sortOrder: sortedInfo.columnKey === 'status' ? sortedInfo.order : null,
    },
    {
      title: 'Signed',
      dataIndex: 'signed',
      key: 'signed',
      sorter: (a, b) => {
        return a.signed?.localeCompare(b.signed || '') || 0;
      },
      sortOrder: sortedInfo.columnKey === 'signed' ? sortedInfo.order : null,
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

export default Proposals;
