import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Table, Space, Input, Popconfirm, Button } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
// import { connect } from 'react-redux';

import Card from "../../components/MainCard";
import RoleServices from '../../../services/role/role.services';
import { openWarningNotification } from '../../../helpers/notifications';

class Roles extends Component {
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

    RoleServices.getList(pageNumber, pageLimit, sortColumn, orderType, search)
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
        // if (err.response.status === 401) {
        //   const { history } = this.props
        //   history.push('/auth')
        //   localStorage.removeItem('token');
        // }

      })
  };

  search = value => {
    this.setState({ loading: true });
    const { pagination } = this.state;
    this.fetch({ pagination }, value);
  }

  handleDelete = (id) => {
    const { pagination } = this.state;
    RoleServices.delete(id)
      .then(response => {
        this.setState({ loading: true });
        this.fetch({ pagination });
        return response;
      })
      .catch(err => console.log(err))
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
        title: t('shortname'),
        dataIndex: 'shortname',
        align: 'center',
        key: 'shortname',
        sorter: (a, b) => a.shortname - b.shortname,
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
                to={`/roles/edit/${record.id}`}>
                <i className="feather icon-edit" aria-hidden="true" />
              </Link>
              <Popconfirm
                title={t('delete')}
                onConfirm={() => {
                  this.handleDelete(record.id)
                  openWarningNotification('warning', t('deleted'))
                }}
                okText={t('yes')}
                cancelText={t('cancel')}
              >
                <span style={{ color: '#1890ff', cursor: 'pointer' }}>
                  <i className="feather icon-trash-2" aria-hidden="true" />
                </span>
              </Popconfirm>
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
        <Row>
          <Col>
            <Card title={t('role')}>
              <div className='table-top'>
                <Input.Search
                  style={{ margin: "0 10px 10px 0", width: "auto" }}
                  placeholder={t('search')}
                  enterButton
                  onSearch={this.search} />
                <Link
                  to='/roles/add'>
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
                      this.props.history.push(`/roles/edit/${record.id}`);
                    }
                  };
                }}
              />
            </Card>
          </Col>
        </Row>
      </>
    );
  }
}

// const mapStateToProps = state => {
//   return {
//     tablePageLimit: state.tablePageLimit,
//   };
// };

// const mapDispatchToProps = dispatch => {
//   return {
//     changeTablePageLimit: (limit) => dispatch({ type: 'CHANGE_TABLE_PAGE_LIMIT', tablePageLimit: limit }),
//   }
// }

// export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(withRouter(Roles)));
export default withTranslation()(withRouter(Roles));