import React, { Component } from "react";
import { Table, Space, Input, Button } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

import UserServices from '../../../services/user/user.services';
import Card from "../../components/MainCard";
// import { openWarningNotification } from '../../../../helpers/notifications';

class Users extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      pagination: {
        current: 1,
        pageSize: 20,
        showSizeChanger: true,
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
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.fetch({
      sortField: sorter.field,
      sortOrder: sorter.order,
      pagination,
      ...filters,
    });
  };

  fetch = (params = {}, searchCode) => {
    let pageNumber = params.pagination.current,
      pageLimit = params.pagination.pageSize,
      sortColumn = params.sortField,
      orderType = params.sortOrder,
      search = searchCode;

    UserServices.getList(pageNumber, pageLimit, sortColumn, orderType, search)
      .then(response => {
        if (this._isMounted) {
          this.setState({
            loading: false,
            data: response.data.rows,
            pagination: {
              ...params.pagination,
              total: response.data.total,
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
    const { pagination } = this.state;
    this.fetch({ pagination }, value);
  }

  // handleDelete = (id) => {
  //   console.log(id);
  //   const { pagination } = this.state;
  //   ContractorServices.delete(id)
  //     .then(response => {
  //       this.setState({ loading: true });
  //       this.fetch({ pagination });
  //       return response;
  //     })
  //     .catch(err => console.log(err))
  // };

  render() {
    const { t } = this.props;
    const columns = [
      {
        title: t('id'),
        dataIndex: 'id',
        key: 'id',
        align: 'center',
        sorter: true,
        width: '8%',
        render: (_, record) => {
          if (record.StatusID === 2) {
            return record.ID;
          } else {
            return <span style={{ color: 'red' }}>{record.ID}</span>
          }
        }
      },
      {
        title: t('username'),
        dataIndex: 'username',
        key: 'username',
        sorter: (a, b) => a.username - b.username,
      },
      {
        title: t('organization'),
        dataIndex: 'orgname',
        key: 'orgname',
        sorter: true,
        render: orgname => {
          return `${orgname}`
        },
      },
      {
        title: t('inn'),
        dataIndex: 'inn',
        key: 'inn',
        sorter: true,
        ellipsis: true,
      },
      {
        title: t('role'),
        dataIndex: 'roles',
        key: 'roles',
        sorter: true,
        ellipsis: true,
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
                to={`${this.props.match.path}/edit/${record.id}`}>
                <i className="feather icon-edit" aria-hidden="true" />
              </Link>
              {/* <Popconfirm
                title={t('delete')}
                onConfirm={() => {
                  this.handleDelete(record.id)
                  openWarningNotification('warning', t('deleted'))
                }}
                okText={t('yes')}
                cancelText={t('cancel')}
              >
                <span style={{ color: '#1890ff', cursor: 'pointer' }}>
                  <i className="fa fa-trash-alt" />
                </span>
              </Popconfirm> */}
            </Space>
          )
        },
      },
    ];

    const { data, pagination, loading } = this.state;
    // let { sortedInfo, filteredInfo } = this.state;
    // sortedInfo = sortedInfo || {};
    // filteredInfo = filteredInfo || {};
    return (
      <>
        <Card title={t('users')}>
          <div className='table-top'>
            <Input.Search
              // style={{ margin: "0 10px 10px 0", width: "auto" }}
              className='table-search'
              placeholder={t('search')}
              enterButton
              onSearch={this.search} />
            <Link
              to={`${this.props.match.path}/add`}>
              <Button type="primary">
                {t('add-new')}&nbsp;<i className="fa fa-plus" aria-hidden="true" />
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
            onRow={(record) => {
              return {
                onDoubleClick: () => {
                  this.props.history.push(`/users/edit/${record.id}`);
                }
              };
            }}
          />
        </Card>
      </>
    );
  }
}

export default withTranslation()(withRouter(Users));