import React, { Component } from "react";
import { Table, Space, Input, Popconfirm, Button, Tag } from 'antd';
import { Link } from 'react-router-dom'
import { withTranslation } from 'react-i18next';
// import classes from './Organization.module.css';

// import classes from './Organization.module.css'
import Card from "../../../components/MainCard";

class Organization extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      oblasts: [],
      regions: [], 
      pagination: {
        current: 1,
        pageSize: 10,
      },
      loading: true,
      sortedInfo: null,
      filteredInfo: null,
    };
  }
  componentDidMount() {
    this._isMounted = true;
    const { pagination } = this.state;
    this.fetch({ pagination });
    OrganizationServices.getOblastList()
      .then(response => {
        this.setState({ oblasts: response.data })
      })
      .catch(err => {
        alert(err)
        console.log(err);
      })
  }
  handleOblast = (id) => {
    OrganizationServices.getRegionList(id)
      .then(response => {
        this.setState({ regions: response.data })
      })
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  handleTableChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    this.fetch({
      sortField: sorter.field,
      sortOrder: sorter.order,
      pagination,
      ...filters,
    });
  };
  fetch = (params = {}) => {
    let pageNumber = params.pagination.current,
      pageLimit = params.pagination.pageSize,
      sortColumn = params.sortField,
      orderType = params.sortOrder;
    OrganizationServices.getList(pageNumber, pageLimit, sortColumn, orderType)
      .then(data => {
        if (this._isMounted) {
          this.setState({
            loading: false,
            data: data.data.rows,
            pagination: {
              ...params.pagination,
              total: data.data.total,
            },
          });
        }
      })
      .catch(err => {
        window.alert(`Something happened with server error:${err}`)
      })
  };

  search = value => {
    this.setState({ loading: true });
    OrganizationServices.searchList(value)
      .then(data => {
        this.setState({
          loading: false,
          data: data.data.rows,
        })
      })
  }

  handleDelete = (id) => {
    const { pagination } = this.state;
    OrganizationServices.delete(id)
      .then(data => {
        console.log(data);
        this.setState({ loading: true });
        this.fetch({ pagination });
      })
  };

  render() {
    const { t } = this.props;
    const columns = [
      {
        title: t('id'),
        dataIndex: 'id',
        key: 'id',
        align: 'center',
        sorter: true,
        ellipsis: true,
        width: '10%',
      },
      {
        title: t('inn'),
        dataIndex: 'inn',
        key: 'inn',
        sorter: (a, b) => a.code - b.code,
      },
      {
        title: t('shortname'),
        dataIndex: 'shortname',
        key: 'shortname',
        sorter: true,
        render: name => {
          return `${name}`
        },
      },
      {
        title: t('fullname'),
        dataIndex: 'fullname',
        key: 'fullname',
        sorter: true,
        render: name => {
          return `${name}`
        },
      },
      {
        title: t('status'),
        dataIndex: 'stateid',
        key: 'stateid',
        width: '10%',
        sorter: true,
        render: (stateid) => {
          if (stateid === 1) {
            return (<Tag color="#87d068" key={stateid}>{t('active')}</Tag>)
          } else if (stateid === 2) {
            return (<Tag color="#f50" key={stateid}>{t('passive')}</Tag>)
          }
        }


      },
      {
        title: t('actions'),
        key: 'action',
        width: '10%',
        align: 'center',
        render: (record) => {
          return (
            <Space size="middle">
              <Link
                data-id={record.id}
                to={`/organization/edit/${record.id}`}>
                <i className="feather icon-edit" aria-hidden="true"></i>
              </Link>
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => this.handleDelete(record.id)}>
                <span style={{ color: "#1890FF", cursor: 'pointer' }}><i className="feather icon-trash-2" aria-hidden="true"></i></span>
              </Popconfirm>
            </Space>
          )
        },
      },
    ];
    const { data, pagination, loading } = this.state;
    return (
      <Card title={t('Organization')}>
        <div className='table-top'>
          <Input.Search
            style={{ margin: "0 10px 10px 0", width: "auto" }}
            placeholder={t('search')}
            enterButton
            onSearch={this.search} />
          <Link
            to='/organization/add'>
            <Button type="primary">
              {t('add-new')}&nbsp;
                    <i className="fa fa-plus" aria-hidden="true" />
            </Button>
          </Link>
        </div>
        <Table
          columns={columns}
          bordered
          dataSource={data}
          loading={loading}
          onChange={this.handleTableChange}
          rowKey={record => record.id}
          pagination={{
            ...pagination,
            showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
          }}
          onRow={(record, rowIndex) => {
            return {
              onDoubleClick: () => {
                this.props.history.push(`/organization/edit/${record.id}`);
              }
            };
          }}
        />
      </Card>
    );
  }
}

export default withTranslation()(Organization);
