import React, { Component } from "react";
import { Table, Input, Form, Button, Select, Space, Popconfirm, Tooltip, Modal, Tag } from "antd";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { CSSTransition } from 'react-transition-group';
import { Buffer } from 'buffer';
// import moment from "moment";

import StaffListServices from "../../../../../../services/Documents/Personnel_accounting/StaffingTable/StaffList/StaffList.services";
import HelperServices from "../../../../../../services/Helper/helper.services";
import Card from "../../../../../components/MainCard";
import { Notification } from "../../../../../../helpers/notifications";
import '../../../../../../helpers/prototypeFunctions';
// import classes from "./StaffList.module.css";

const { Option } = Select;
const { confirm } = Modal;
let hashData;
let keys = [];
const defaultPagination = {
  current: 1,
  pageSize: 10,
}

class StaffListReceived extends Component {
  filterForm = React.createRef();
  eImzoForm = React.createRef();

  state = {
    data: [],
    StaffListType: [],
    orgSettleAcc: [],
    filterData: {},
    loading: false,
    print: false,
    protocolModalVisible: false,
    pagination: {
      current: 1,
      pageSize: 10,
    },
    tablePopup: {
      visible: false,
      x: 0,
      y: 0
    },
  };

  fetchData = async () => {
    const [orgSettleAcc, StaffList] = await Promise.all([
      HelperServices.getOrganizationsSettlementAccountList(),
      HelperServices.getStaffListType()
    ]);
    this.setState({ orgSettleAcc: orgSettleAcc.data, StaffListType: StaffList.data })
  }

  componentDidMount() {
    window.CAPIWS.apikey([
      'localhost',
      '96D0C1491615C82B9A54D9989779DF825B690748224C2B04F500F370D51827CE2644D8D4A82C18184D73AB8530BB8ED537269603F61DB0D03D2104ABF789970B',
      '127.0.0.1',
      'A7BCFA5D490B351BE0754130DF03A068F855DB4333D43921125B9CF2670EF6A40370C646B90401955E1F7BC9CDBF59CE0B2C5467D820BE189C845D0B79CFC96F',
      'null',
      'E0A205EC4E7B78BBB56AFF83A733A1BB9FD39D562E67978CC5E7D73B0951DB1954595A20672A63332535E13CC6EC1E1FC8857BB09E0855D7E76E411B6FA16E9D',
      'zp.uzasbo.uz',
      'AC26661C8ADFF6AC117D87EE5DFCBCF3AA7B753CE0845B582B10BF26E6A062CC13F0C9A963C245E0B86FE679943837B14FF3C7E52D01B9C04AA40F654DB8280A'
    ], (event, data) => {
      if (data.success) {
        this.loadKeys();
      } else {
        alert(data.reason);
      }
    }, (e) => {
      alert(e);
    });

    this.fetchData().catch(err => {
      Notification("error", err);
    });
    const { pagination } = this.state;
    this.fetch({ pagination }, {});
  }

  componentWillUnmount() {
    this.setState = () => {
      return;
    };
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.fetch({
      sortField: sorter.field,
      sortOrder: sorter.order,
      pagination,
      ...filters,
    },
      this.state.filterData,
    );
  };

  fetch = (params = {}, searchCode, filterFormValues) => {
    let search = filterFormValues?.Search ? filterFormValues?.Search : '';

    this.setState({ loading: true });
    let pageNumber = params.pagination.current,
      pageLimit = params.pagination.pageSize,
      sortColumn = params.sortField,
      orderType = params.sortOrder

    StaffListServices.getReceivedList(pageNumber, pageLimit, sortColumn, orderType, search)
      .then((data) => {
        this.setState({
          loading: false,
          data: data.data.rows,
          pagination: {
            ...params.pagination,
            total: data.data.total,
          },
        });
      })
      .catch((err) => {
        Notification("error", err);
      });
  };

  search = () => {
    const filterValues = this.filterForm.current.getFieldsValue();
    this.setState({ loading: true });
    this.fetch({ pagination: defaultPagination }, filterValues);
  };

  deleteRowHandler = (id) => {
    this.setState({ loading: true });
    StaffListServices.delete(id)
      .then((res) => {
        if (res.status === 200) {
          const { pagination, filterData } = this.state;
          this.fetch({ pagination }, filterData);
        }
      })
      .catch((err) => Notification("error", err));
  };

  onFilterFinish = (filterFormValues) => {
    this.setState({ loading: true, filterData: filterFormValues });
    this.fetch({ pagination: defaultPagination }, null, filterFormValues);
  };

  // End Filter functions

  // E-imzo fuctions

  getX500Val = (s, f) => {
    var res = s.splitKeep(/,[A-Z]+=/g, true);
    for (var i in res) {
      var n = res[i].search(f + "=");
      if (n !== -1) {
        return res[i].slice(n + f.length + 1);
      }
    }
    return "";
  };

  listCertKeyCertificates = (items, allDisks, diskIndex, callback) => {
    if (parseInt(diskIndex) + 1 > allDisks.length) {
      callback();
      return;
    }
    window.CAPIWS.callFunction({
      plugin: "certkey",
      name: "list_certificates",
      arguments: [allDisks[diskIndex]]
    }, (event, data) => {
      if (data.success) {
        for (var rec in data.certificates) {
          var el = data.certificates[rec];
          var x500name_ex = el.subjectName.toUpperCase();
          x500name_ex = x500name_ex.replace("1.2.860.3.16.1.1=", "INN=");
          x500name_ex = x500name_ex.replace("1.2.860.3.16.1.2=", "PINFL=");
          var vo = {
            disk: el.disk,
            path: el.path,
            name: el.name,
            serialNumber: el.serialNumber,
            subjectName: el.subjectName,
            validFrom: new Date(el.validFrom),
            validTo: new Date(el.validTo),
            issuerName: el.issuerName,
            publicKeyAlgName: el.publicKeyAlgName,
            CN: this.getX500Val(x500name_ex, "CN"),
            TIN: (this.getX500Val(x500name_ex, "INITIALS") ? this.getX500Val(x500name_ex, "INITIALS") : (this.getX500Val(
              x500name_ex, "INN") ? this.getX500Val(x500name_ex, "INN") : this.getX500Val(x500name_ex, "UID"))),
            UID: this.getX500Val(x500name_ex, "UID"),
            O: this.getX500Val(x500name_ex, "O"),
            T: this.getX500Val(x500name_ex, "T"),
            type: 'certkey'
          };
          items.push(vo);
        }
        this.listCertKeyCertificates(items, allDisks, parseInt(diskIndex) + 1, callback);
      } else {
        alert(data.reason);
      }
    }, function (e) {
      alert(e);
    });
  }

  fillCertKeys = (items, callback) => {
    var allDisks = [];
    window.CAPIWS.callFunction({
      plugin: "certkey",
      name: "list_disks"
    }, (event, data) => {
      if (data.success) {
        for (var rec in data.disks) {
          allDisks.push(data.disks[rec]);
          if (parseInt(rec) + 1 >= data.disks.length) {
            this.listCertKeyCertificates(items, allDisks, 0, () => {
              callback();
            });
          }
        }
      } else {
        alert(data.reason);
      }
    }, function (e) {
      alert(e);
    });
  };

  listPfxCertificates = (items, allDisks, diskIndex, callback) => {
    if (parseInt(diskIndex) + 1 > allDisks.length) {
      callback();
      return;
    }
    window.CAPIWS.callFunction({
      plugin: "pfx",
      name: "list_certificates",
      arguments: [allDisks[diskIndex]]
    }, (event, data) => {
      if (data.success) {
        for (var rec in data.certificates) {
          var el = data.certificates[rec];
          var x500name_ex = el.alias.toUpperCase();
          x500name_ex = x500name_ex.replace("1.2.860.3.16.1.1=", "INN=");
          x500name_ex = x500name_ex.replace("1.2.860.3.16.1.2=", "PINFL=");
          var vo = {
            disk: el.disk,
            path: el.path,
            name: el.name,
            alias: el.alias,
            serialNumber: this.getX500Val(x500name_ex, "SERIALNUMBER"),
            validFrom: new Date(this.getX500Val(x500name_ex, "VALIDFROM").replace(/\./g, "-")),
            validTo: new Date(this.getX500Val(x500name_ex, "VALIDTO").replace(/\./g, "-")),
            CN: this.getX500Val(x500name_ex, "CN"),
            TIN: (this.getX500Val(x500name_ex, "INN") ? this.getX500Val(x500name_ex, "INN") : this.getX500Val(x500name_ex,
              "UID")),
            UID: this.getX500Val(x500name_ex, "UID"),
            O: this.getX500Val(x500name_ex, "O"),
            T: this.getX500Val(x500name_ex, "T"),
            type: 'pfx'
          };
          items.push(vo);
        }
        this.listPfxCertificates(items, allDisks, parseInt(diskIndex) + 1, callback);
      } else {
        alert(data.reason);
      }
    }, function (e) {
      alert(e);
    });
  };

  fillPfxs = (items, callback) => {
    var allDisks = [];
    window.CAPIWS.callFunction({
      plugin: "pfx",
      name: "list_disks"
    }, (event, data) => {
      if (data.success) {
        var disks = data.disks;
        for (var rec in disks) {
          allDisks.push(data.disks[rec]);
          if (parseInt(rec) + 1 >= data.disks.length) {
            this.listPfxCertificates(items, allDisks, 0, () => {
              callback();
            });
          }
        }
      } else {
        alert(data.reason);
      }
    }, function (e) {
      alert(e);
    });
  };

  loadKeys = () => {
    // var combo = document.eimzoForm.key;
    // combo.length = 0;

    var items = [];
    this.fillCertKeys(items, () => {

      this.fillPfxs(items, () => {

        for (var itm in items) {
          var vo = items[itm]
          // var opt = document.createElement('option');
          var date = new Date(vo.validTo);

          var dd = String(date.getDate()).padStart(2, '0');
          var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
          var yyyy = date.getFullYear();

          date = dd + '.' + mm + '.' + yyyy;
          // opt.innerHTML = vo.TIN + " - " + vo.O + " - " + vo.CN + " - Срок до:" + date;
          // opt.value = JSON.stringify(vo);
          keys.push({ tin: vo.TIN, org: vo.O, name: vo.CN, date: date, validTo: vo.validTo, value: JSON.stringify(vo) });
          // combo.appendChild(opt);
        }
      });

    });
  };

  postLoadKey = (id, vo, reload) => {
    let buff = new Buffer(hashData);
    window.CAPIWS.callFunction({
      plugin: "pkcs7",
      name: "create_pkcs7",
      arguments: [buff.toString('base64'), id, 'no']
    }, (event, data) => {
      // console.log(event, data);
      if (data.success) {
        //   document.eimzoForm.pkcs7.value = data.pkcs7_64;
        let signData = {
          ID: this.state.documentId,
          DataHash: this.state.hash,
          SignedData: data.pkcs7_64
        }

        StaffListServices.postSignedData(signData)
          .then(res => {
            if (res.status === 200) {
              this.setState({ mainLoader: false, isEimzoModalVisible: false });
              this.eImzoForm.current.resetFields();
              const { pagination, filterData } = this.state;
              this.fetch({ pagination }, filterData);
            }
          })
          .catch(err => Notification("error", err))
      } else {
        this.setState({ mainLoader: false, isEimzoModalVisible: false });
        this.eImzoForm.current.resetFields();
        if (reload && (data.reason === "Ключ по идентификатору не найден")) {
          reload();
        } else {
          alert(data.reason);
        }
      }
    }, (e) => {
      alert(e);
    });
  };

  loadPfxKey = (vo) => {
    window.CAPIWS.callFunction({
      plugin: "pfx",
      name: "load_key",
      arguments: [vo.disk, vo.path, vo.name, vo.alias]
    }, (event, data) => {
      if (data.success) {
        var id = data.keyId;
        window.sessionStorage.setItem(vo.serialNumber, id);
        this.postLoadKey(id, vo);
      } else {
        alert(data.reason);
      }
    }, (e) => {
      alert(e);
    });
  };

  sign = (hash) => {
    hashData = hash;
    // var itm = document.eimzoForm.key.value;
    var itm = this.eImzoForm.current.getFieldValue('eImzoKey');
    if (itm) {
      var vo = JSON.parse(itm);
      // console.log(vo);

      if (vo.type === "certkey") {
        window.CAPIWS.callFunction({
          plugin: "certkey",
          name: "load_key",
          arguments: [vo.disk, vo.path, vo.name, vo.serialNumber]
        }, (event, data) => {
          if (data.success) {
            var id = data.keyId;
            this.postLoadKey(id, vo);
          } else {
            alert(data.reason);
          }
        }, (e) => {
          alert(e);
        });
      } else if (vo.type === "pfx") {
        var id = window.sessionStorage.getItem(vo.serialNumber);
        if (id) {
          this.postLoadKey(id, vo, function () {
            this.loadPfxKey(vo);
          });
        } else {
          this.loadPfxKey(vo);
        }
      }
    }
  };

  showAcceptModal = (id) => {
    this.setState({ documentId: id })
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: this.props.t('Are you sure to send?'),
      okText: this.props.t('yes'),
      cancelText: this.props.t('cancel'),
      onOk: () => {
        this.setState({ loading: true });
        StaffListServices.getHash(id)
          .then(res => {
            if (res.status === 200) {
              this.setState({ loading: false, isEimzoModalVisible: true, hash: res.data });
            }
          })
          .catch(err => {
            Notification("error", err);
            this.setState({ loading: false });
          })
      },
      onCancel() {
        // console.log("Cancel");
      }
    });
  };

  eimzoModalOkHandler = () => {
    this.eImzoForm.current.validateFields()
      .then(values => {
        this.sign(this.state.hash);
        this.setState({ mainLoader: true, isEimzoModalVisible: false });
        return values;
      })
      .catch(err => err);
  };

  eimzoModalCancelHandler = () => {
    this.setState({ loading: false, isEimzoModalVisible: false });
  };

  // End E-imzo fuctions

  acceptHandler = (id) => {
    this.setState({ loading: true });
    StaffListServices.ReceivedRegistery(id, 274)
      .then((res) => {
        if (res.status === 200) {
          const { pagination, filterData } = this.state;
          this.fetch({ pagination }, filterData);
        }
      })
      .catch((err) => {
        Notification("error", err);
        this.setState({ loading: false });
      });
  };

  declineHandler = (id) => {
    this.setState({ loading: true });
    StaffListServices.CancelReceivedRegistery(id, 274)
      .then((res) => {
        if (res.status === 200) {
          const { pagination, filterData } = this.state;
          this.fetch({ pagination }, filterData);
        }
      })
      .catch((err) => {
        Notification("error", err);
        this.setState({ loading: false });
      });
  };

  printRow = (id, tableId) => {
    this.setState({ loading: true });
    StaffListServices.printRow(id, tableId)
      .then(response => {
        this.setState({ loading: false });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "StaffList.xlsx");
        document.body.appendChild(link);
        link.click();
      })
      .catch(err => {
        this.setState({ loading: false });
        Notification("error", err);
      })
  }

  printForm = (id) => {
    this.setState({ loading: true });
    StaffListServices.printForm(id)
      .then(response => {
        this.setState({ loading: false });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "StaffList.xlsx");
        document.body.appendChild(link);
        link.click();
      })
      .catch(err => {
        this.setState({ loading: false });
        Notification("error", err);
      })
  }

  onTableRow = (record) => {
    return {
      onDoubleClick: () => {
        this.props.history.push(`${this.props.match.path}/edit/${record.ID}`);
      },
      onContextMenu: event => {
        event.preventDefault()
        if (!this.state.tablePopup.visible) {
          const that = this
          document.addEventListener(`click`, function onClickOutside() {
            that.setState({ tablePopup: { visible: false } })
            document.removeEventListener(`click`, onClickOutside);
          });

          document.querySelector('.ant-table-body').addEventListener(`scroll`, function onClickOutside() {
            that.setState({ tablePopup: { visible: false } })
            document.querySelector('.ant-table-body').removeEventListener(`scroll`, onClickOutside);
          })
        }
        this.setState({
          tablePopup: {
            record,
            visible: true,
            x: event.clientX,
            y: event.clientY
          }
        })
      }
    };
  }

  openProtocolModalHandler = (id, tableId) => {
    this.setState({ protocolModalVisible: true, rowId: id, rowTableId: tableId });
  }

  closeProtocolModalHandler = () => {
    this.setState({ protocolModalVisible: false });
  }

  render() {
    const { t } = this.props;
    const columns = [
      {
        title: t("id"),
        dataIndex: "ID",
        key: "ID",
        sorter: true,
        render: (_, record) => {
          if (record.StatusID === 2) {
            return record.ID;
          } else {
            return <span style={{ color: 'red' }}>{record.ID}</span>
          }
        }
      },
      {
        title: t("OrgName"),
        dataIndex: "OrgName",
        key: "OrgName",
        sorter: true,
        width: 350,
        render: record => <div className="ellipsis-2">{record}</div>
      },
      {
        title: t("inn"),
        dataIndex: "INN",
        key: "INN",
        sorter: true,
      },
      {
        title: t("Year"),
        dataIndex: "Year",
        key: "Year",
        sorter: true,
      },
      {
        title: t("Date"),
        dataIndex: "Date",
        key: "Date",
        sorter: true,
      },
      {
        title: t("Status"),
        dataIndex: "Status",
        key: "Status",
        sorter: true,
        render: (_, record) => {
          if (record.StatusID === 2 || record.StatusID === 8) {
            return (
              <Tag color='#87d068'>
                {record.Status}
              </Tag>
            );
          }
          return (
            <Tag color='#f50'>
              {record.Status}
            </Tag>
          );
        }
      },
      // {
      //   title: t("StaffListGroup"),
      //   dataIndex: "StaffListGroup",
      //   key: "StaffListGroup",
      //   // align: "right",
      //   sorter: true,
      //   width: 120
      // },
      {
        title: t("TotalSum"),
        dataIndex: "TotalSum",
        key: "TotalSum",
        align: "right",
        sorter: true,
        render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
      },
      {
        title: t("SettlementAccount"),
        dataIndex: "SettlementAccount",
        key: "SettlementAccount",
        sorter: true,
      },
      {
        title: t("StaffListType"),
        dataIndex: "StaffListType",
        key: "StaffListType",
        sorter: true,
        width: 150
      },
      // {
      //   title: t("HeaderStaff"),
      //   dataIndex: "HeaderStaff",
      //   key: "HeaderStaff",
      //   sorter: true,
      //   width: 150
      // },
      // {
      //   title: t("HeaderStaff2"),
      //   dataIndex: "HeaderStaff2",
      //   key: "HeaderStaff2",
      //   sorter: true,
      //   width: 150,
      //   render: record => <div className="ellipsis-2">{record}</div>
      // },
      {
        title: t("actions"),
        key: "action",
        align: "center",
        fixed: 'right',
        width: 80,
        render: (record) => {
          return (
            <Space size="middle">
              {/* <Tooltip title={t('send')}>
                <span onClick={() => this.showAcceptModal(record.ID)}>
                  <i className="far fa-paper-plane action-icon" />
                </span>
              </Tooltip> */}
              {/* <Tooltip title={t("Accept")}>
                <span onClick={() => this.acceptHandler(record.ID)}>
                  <i className="far fa-check-circle action-icon" />
                </span>
              </Tooltip>
              <Tooltip title={t("NotAccept")}>
                <span onClick={() => this.declineHandler(record.ID)}>
                  <i className="far fa-times-circle action-icon" />
                </span>
              </Tooltip> */}
              <Tooltip title={t("Print")}>
                <span onClick={() => this.printRow(record.ID, record.TableID)}>
                  <i className="feather icon-printer action-icon" />
                </span>
              </Tooltip>
              {/* <Tooltip title={t("Delete")}>
                <Popconfirm
                  title={t('delete')}
                  onConfirm={() => this.deleteRowHandler(record.ID)}
                  okText={t("yes")}
                  cancelText={t("cancel")}
                >
                  <span>
                    <i className="feather icon-trash-2 action-icon" aria-hidden="true" />
                  </span>
                </Popconfirm>
              </Tooltip> */}
            </Space>
          );
        },
      },
    ];

    const { data, pagination, loading } = this.state;
    return (
      <Card title={t("StaffListReceived")} >
        <Fade>
          <Form
            layout='vertical'
            ref={this.filterForm}
            className="main-table-filter-elements"
            onFinish={this.onFilterFinish}
          >
            <div className="main-table-filter-wrapper">
              <Form.Item
                name="Search"
                label={t("search")}
              >
                <Input
                  enterButton
                  placeholder={t("search")}
                  onSearch={this.search}
                />
              </Form.Item>

              <Form.Item
                label={t("SettlementAccount")}
              >
                <Select
                  allowClear
                  placeholder={t("SettlementAccount")}
                  style={{ width: 270 }}
                  showSearch
                  optionFilterProp="children"
                  onChange={(id) => this.setState({ orgSettleAccId: id })}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this.state.orgSettleAcc.map(item => <Option key={item.ID} value={item.ID}>{item.Code}</Option>)}
                </Select>
              </Form.Item>

              <Form.Item
                label={t("StaffListType")}
              >
                <Select
                  allowClear
                  placeholder={t("StaffListType")}
                  style={{ width: 270 }}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  onChange={(id) => this.setState({ staffListTypeID: id })}
                >
                  {this.state.StaffListType.map(item => <Option key={item.ID} value={item.ID}>{item.DisplayName}</Option>)}
                </Select>
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                className="main-table-filter-element"
              // onClick={() => this.setState({ print: false })}
              >
                <i className="feather icon-refresh-ccw" />
              </Button>
            </div>
          </Form>
        </Fade>
        <Fade>
          <Table
            bordered
            size="middle"
            columns={columns}
            dataSource={data}
            loading={loading}
            rowKey={(record) => record.ID}
            onChange={this.handleTableChange}
            // onRow={(record) => this.onTableRow(record)}
            showSorterTooltip={false}
            rowClassName="table-row"
            className="main-table"
            scroll={{
              x: "max-content",
              y: '50vh'
            }}
            pagination={{
              ...pagination,
              showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
            }}
          />
        </Fade>
        <CSSTransition
          mountOnEnter
          unmountOnExit
          in={this.state.isEimzoModalVisible}
          timeout={300}
        >
          <Modal
            title={t("send")}
            visible={this.state.isEimzoModalVisible}
            onOk={this.eimzoModalOkHandler}
            onCancel={this.eimzoModalCancelHandler}
          >
            <Form
              ref={this.eImzoForm}
              layout='vertical'
            >
              <Form.Item
                label={t('eImzoKey')}
                name="eImzoKey"
                rules={[
                  {
                    required: true,
                    message: t('Please input your eImzoKey!'),
                  },
                ]}
              >
                <Select
                  allowClear
                  showSearch
                  placeholder={t('eImzoKey')}
                  optionFilterProp="children"
                  filterOption={(input, option) => option.children[0].props.children[0].toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {keys.map((item, index) => {
                    return (
                      <Option key={+item.tin + index} value={item.value} className='e-imzo-keys'>
                        <span>{item.tin}&nbsp;-&nbsp;</span>
                        <span>{item.org}&nbsp;-&nbsp;</span>
                        <span>{item.name}&nbsp;-&nbsp;</span>
                        {new Date().getTime() < new Date(item.validTo).getTime() ?
                          <span>{item.date}</span> :
                          <span style={{ color: 'red' }}>{item.date}</span>
                        }
                      </Option>
                    )
                  }
                  )}
                </Select>
              </Form.Item>
            </Form>
          </Modal>
        </CSSTransition>
      </Card>
    );
  }
}

export default withTranslation()(StaffListReceived);
