import React, { Component } from "react";
import { Table, Form, Input, Button, DatePicker, Select, Space, Modal, Spin, Tooltip, Tag, InputNumber, Dropdown, Menu } from "antd";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import moment from "moment";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { CSSTransition } from 'react-transition-group';
import { Buffer } from 'buffer';

import RequestReceivingCashServices from "../../../../../services/Documents/EmployeeMovement/RequestReceivingCash/RequestReceivingCash.services";
import HelperServices from "../../../../../services/Helper/helper.services";
import Card from "../../../../components/MainCard";
// import classes from "./RequestReceivingCash.module.css";
import './prototypeFunctions';
import { Notification } from "../../../../../helpers/notifications";
import ProtocolModal from "./ProtocolModal";
import ChangeDateModal from "../../../commonComponents/ChangeDateModal";
import AcceptModal from "./components/AcceptModal";
import ChangeStatusModal from "./components/ChangeStatusModal";
import DocumentChangeLogModal from "../../../../components/DocumentChangeLogModal";

const { Option } = Select;
const { confirm } = Modal;
let hashData;
let keys = [];
const defaultPagination = {
  current: 1,
  pageSize: 10,
}

class RequestReceivingCash extends Component {
  eImzoForm = React.createRef();
  filterForm = React.createRef();
  adminViewRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('ChangeUserEDS');
  docOperationRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('TotalRequestReceivingCash');

  // only for super admin linked via UserID
  superAdminViewRole = JSON.parse(localStorage.getItem('userInfo')).UserID === 22412;

  state = {
    data: [],
    orgSettleAcc: [],
    statusList: [],
    cashList: [],
    filterData: {},
    pagination: {
      current: 1,
      pageSize: 10,
    },
    loading: false,
    mainLoader: false,
    isEimzoModalVisible: false,
    protocolModalVisible: false,
    changeStatusModalVisible: false,
    changeDateModalVisible: false,
    filterType: '',
    hash: '',
    documentId: null,
    historyParams: null,
    historyModal: false,
  };

  fetchData = async () => {
    try {
      const orgSettleAcc = await HelperServices.getOrganizationsSettlementAccountList();
      const stsList = await HelperServices.getStatusList();
      const cashList = await HelperServices.getRequestReceivingCashList();
      this.setState({ orgSettleAcc: orgSettleAcc.data, statusList: stsList.data, cashList: cashList.data });
    } catch (err) {
      Notification('error', err);
    }
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
    })

    this.fetchData();
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

  fetch = (params = {}, filterFormValues) => {
    let filter = {};

    if (this.state.filterType) {
      filter[this.state.filterType] = filterFormValues.Search ? filterFormValues.Search : '';
    }

    this.setState({ loading: true });
    let pageNumber = params.pagination.current,
      pageLimit = params.pagination.pageSize,
      sortColumn = params.sortField,
      orderType = params.sortOrder

    const date = {
      EndDate: filterFormValues.EndDate ? filterFormValues.EndDate.format("DD.MM.YYYY") : moment().add(30, "days").format("DD.MM.YYYY"),
      StartDate: filterFormValues.StartDate ? filterFormValues.StartDate.format("DD.MM.YYYY") : moment().subtract(30, "days").format("DD.MM.YYYY"),
    };

    RequestReceivingCashServices.getList(pageNumber, pageLimit, sortColumn, orderType, date, filter, filterFormValues)
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
        // console.log(err);
        Notification('error', err);
      });
  };

  search = () => {
    const filterValues = this.filterForm.current.getFieldsValue();
    this.setState({ loading: true });
    this.fetch({ pagination: defaultPagination }, filterValues);
  };

  deleteRowHandler = (id) => {
    this.setState({ loading: true });
    RequestReceivingCashServices.delete(id)
      .then((res) => {
        if (res.status === 200) {
          const { pagination, filterData } = this.state;
          this.fetch({ pagination }, filterData);
        }
      })
      .catch((err) => Notification('error', err));
  };

  acceptHandler = (id) => {
    this.setState({ loading: true });
    RequestReceivingCashServices.Accept(id)
      .then((res) => {
        if (res.status === 200) {
          const { pagination, filterData } = this.state;
          this.fetch({ pagination }, filterData);
          Notification('success', this.props.t('accepted'));
        }
      })
      .catch((err) => {
        // console.log(err)
        Notification('error', err)
        this.setState({ loading: false });
      });
  };

  declineHandler = (id) => {
    this.setState({ loading: true });
    RequestReceivingCashServices.NotAccept(id)
      .then((res) => {
        if (res.status === 200) {
          const { pagination, filterData } = this.state;
          this.fetch({ pagination }, filterData);
          Notification('success', this.props.t('notAccepted'))
        }
      })
      .catch((err) => {
        // console.log(err)
        Notification('error', err);
        this.setState({ loading: false });
      });
  };

  onFinish = (values) => {
    this.setState({ loading: true, filterData: values });
    this.fetch({ pagination: defaultPagination }, values);
  };

  filterTypeHandler = (type) => {
    this.setState({ filterType: type, pagination: { current: 1, pageSize: 10 } });
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

        RequestReceivingCashServices.postSignedData(signData)
          .then(res => {
            if (res.status === 200) {
              this.setState({ mainLoader: false, isEimzoModalVisible: false });
              this.eImzoForm.current.resetFields();
              const { pagination, filterData } = this.state;
              this.fetch({ pagination }, filterData);
            }
          })
          .catch(err => {
            Notification('error', err);
          })
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
        RequestReceivingCashServices.getHash(id)
          .then(res => {
            if (res.status === 200) {
              this.setState({ loading: false, isEimzoModalVisible: true, hash: res.data });
            }
            // setLoader(true)
          })
          .catch(err => {
            Notification('error', err);
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

  openProtocolModalHandler = (id) => {
    this.setState({ protocolModalVisible: true, rowId: id });
  }

  closeProtocolModalHandler = () => {
    this.setState({ protocolModalVisible: false });
  }

  openChangeDateModalHandler = (id) => {
    this.setState({ changeDateModalVisible: true, rowId: id });
  }

  closeChangeDateModalHandler = (values) => {
    values.ID = this.state.rowId;
    this.setState({ changeDateModalVisible: false });
    if (values.Date) {
      RequestReceivingCashServices.changeDate(values)
        .then(res => {
          if (res.status === 200) {
            Notification('success', this.props.t('edited'));
            const { pagination, filterData } = this.state;
            this.fetch({ pagination }, filterData);
          }
        })
        .catch((err) => {
          Notification('error', err);
          this.setState({ loading: false });
        });
    }
  }

  // change status modal
  openChangeStatusModalHandler = (values) => {
    this.setState({ changeStatusModalVisible: true, rowId: values.id, statusID: values.status });
  }

  closeChangeStatusModalHandler = (values) => {
    this.setState({ changeStatusModalVisible: false });
  }

  closeChangeStatusModalOkHandler = (values) => {
    this.setState({ changeStatusModalVisible: false });
    const { pagination, filterData } = this.state;
    setTimeout(() => {
      this.fetch({ pagination }, filterData);
    }, 50);
  }
  // change status modal

  printByType = (e, id) => {
    this.setState({ loading: true });
    RequestReceivingCashServices.printType(id, e.key)
      .then(res => {
        console.log(res);
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `ReqRecCash.${e.key === '1' ? 'pdf' : 'xlsx'}`);
        document.body.appendChild(link);
        link.click();
        this.setState({ loading: false });
      })
      .catch(err => {
        // console.log(err);
        Notification('error', err)
        this.setState({ loading: false });
      })

  };

  openHistoryModal = (params) => {
    // setHistoryParams(params);
    // setHistoryModal(true);
    this.setState({ historyParams: params, historyModal: true });
  };
  
  sendToUzasbo2Handler = (id) => {
    this.setState({ loading: true });
    RequestReceivingCashServices.sendToUzasbo2(id)
      .then((res) => {
          const { pagination, filterData } = this.state;
          this.fetch({ pagination }, filterData);
          Notification('success', this.props.t('sendToSuccess'))
      })
      .catch((err) => {
        Notification('error', err);
        this.setState({ loading: false });
      });
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
          if (record.StatusID === 2 || record.StatusID === 9) {
            return record.ID;
          } else {
            return <span style={{ color: 'red' }}>{record.ID}</span>
          }
        }
      },
      {
        title: t("number"),
        dataIndex: "Number",
        key: "Number",
        sorter: true,
        width: 80
      },
      {
        title: t("Date"),
        dataIndex: "Date",
        key: "Date",
        sorter: true,
      },
      {
        title: t("Month"),
        dataIndex: "Month",
        key: "Month",
        sorter: true,
      },
      {
        title: t("LimitType"),
        dataIndex: "typName",
        key: "typName",
        sorter: true,
        width: 120
      },
      {
        title: t("SettleCode"),
        dataIndex: "SettleCode",
        key: "SettleCode",
        sorter: true,
        width: 150
      },
      {
        title: t("OrgFullName"),
        dataIndex: "OrgFullName",
        key: "OrgFullName",
        sorter: true,
        width: 160,
        render: record => <div className="ellipsis-2">{record}</div>
      },
      {
        title: t("inn"),
        dataIndex: "INN",
        key: "INN",
        sorter: true,
        width: 100
      },
      {
        title: t("Status"),
        dataIndex: "Status",
        key: "Status",
        sorter: true,
        render: (_, record) => {
          if (record.StatusID === 2 || record.StatusID === 9) {
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
      {
        title: t("TreasStatus"),
        dataIndex: "TreasStatus",
        key: "TreasStatus",
        sorter: true,
        width: 120,
      },
      {
        title: t("Comment"),
        dataIndex: "Comment",
        key: "Comment",
        sorter: true,
        width: 150,
        render: record => <div className="ellipsis-2">{record}</div>
      },
      {
        title: t("OblastName"),
        dataIndex: "OblastName",
        key: "OblastName",
        sorter: true,
      },
      {
        title: t("DateOfCreated"),
        dataIndex: "DateOfCreated",
        key: "DateOfCreated",
        sorter: true,
      },
      {
        title: t("DateOfModified"),
        dataIndex: "DateOfModified",
        key: "DateOfModified",
        sorter: true,
      },
      {
        title: t("actions"),
        key: "action",
        align: "center",
        fixed: 'right',
        width: 100,
        render: (record, fullRecord) => {
          return (
            <Space size="middle">
              {this.adminViewRole &&
                <Tooltip title={t('changeStatus')}>
                  <span onClick={() => this.openChangeStatusModalHandler({
                    id: record.ID,
                    status: record.StatusID,
                  })}>
                    <i className="feather icon-check-square action-icon"></i>
                  </span>
                </Tooltip>
              }
              {this.adminViewRole &&
                <Tooltip title={t('changeDate')}>
                  <span onClick={() => this.openChangeDateModalHandler(record.ID)}>
                    <i className="far fa-clock action-icon"></i>
                  </span>
                </Tooltip>
              }

              {/* <Tooltip title={t("Delete")}>
                <Popconfirm
                  title={t('delete')}
                  onConfirm={() => this.deleteRowHandler(record.ID)}
                  okText={t('yes')}
                  cancelText={t('cancel')}
                >
                  <span>
                    <i className="feather icon-trash-2 action-icon" aria-hidden="true" />
                  </span>
                </Popconfirm>
              </Tooltip> */}
              <Dropdown
                placement="bottom"
                overlay={<Menu onClick={(e) => this.printByType(e, record.ID)}
                >
                  <Menu.Item key="1">
                    {t('printAplication')}
                  </Menu.Item>
                  <Menu.Item key="2">
                    {t('printAplicationXlsx')}
                  </Menu.Item>
                </Menu>}
              >
                <i className='feather icon-printer action-icon' aria-hidden="true" />
              </Dropdown>
              <Dropdown
                placement="bottom"
                overlay={
                  <Menu>
                    <Menu.Item key="edit">
                      <Link to={`${this.props.match.path}/edit/${record.ID}`}>
                        <i className='feather icon-edit action-icon' aria-hidden="true" />&nbsp;
                        {t('Edit')}
                      </Link>
                    </Menu.Item>
                    {this.docOperationRole &&
                      <>
                        <Menu.Item key="accept">
                          <span onClick={() => this.acceptHandler(record.ID)}>
                            <i className="far fa-check-circle action-icon" />&nbsp;
                            {t("Accept")}
                          </span>
                        </Menu.Item>
                        <Menu.Item key="notAccept">
                          <span onClick={() => this.declineHandler(record.ID)}>
                            <i className="far fa-check-circle action-icon" />&nbsp;
                            {t("NotAccept")}
                          </span>
                        </Menu.Item>
                      </>
                    }
                    <Menu.Item key="send">
                      <span onClick={() => this.showAcceptModal(record.ID)}>
                        <i className="far fa-paper-plane action-icon" />&nbsp;
                        {t("send")}
                      </span>
                    </Menu.Item>
                    <Menu.Item key="protocol">
                      <span onClick={() => this.openProtocolModalHandler(record.ID)}>
                        <i className="far fa-comment action-icon" />&nbsp;
                        {t("protocol")}
                      </span>
                    </Menu.Item>

                    <Menu.Item key="DocumentChangeLog">
                      <span onClick={() => this.openHistoryModal({
                        id: fullRecord.ID,
                        TableID: 231, //children
                        // ColumnName: 'Name',
                      })}>
                        <i className="feather icon-file-text action-icon" />&nbsp;
                        {t("DocumentChangeLog")}
                      </span>
                    </Menu.Item>
                    
                    <Menu.Item key="sendToUzasbo2">
                      <span onClick={() => this.sendToUzasbo2Handler(fullRecord.ID)}>
                        <i className="far fa-share-square action-icon"></i>&nbsp;
                        {t("send") + ' (Uzasbo2)'}
                      </span>
                    </Menu.Item>
                  </Menu>}
              >
                <i className='feather icon-list action-icon' aria-hidden="true" />
              </Dropdown>
            </Space>
          );
        },
      },
    ];

    const { data, pagination, loading, protocolModalVisible, rowId, changeDateModalVisible,
      changeStatusModalVisible, statusID, historyModal, historyParams
    } = this.state;

    return (
      <Spin size='large' spinning={this.state.mainLoader}>
        <Card title={t("RequestReceivingCash")}>
          <Fade>
            <Form
              layout='vertical'
              ref={this.filterForm}
              onFinish={this.onFinish}
              className='table-filter-form'
              initialValues={{
                EndDate: moment().add(30, "days"),
                StartDate: moment().subtract(30, "days"),
              }}
            >
              <div className="main-table-filter-wrapper">
                <Form.Item
                  name="FilterType"
                  label={t("filterType")}
                >
                  <Select
                    style={{ width: 180 }}
                    placeholder={t("Filter Type")}
                    onChange={this.filterTypeHandler}
                    allowClear
                  >
                    <Option value="ID">{t('id')}</Option>
                    <Option value="Number">{t('number')}</Option>
                  </Select>
                </Form.Item>

                {this.adminViewRole &&
                  <Form.Item
                    label={t("orgId")}
                    name="OrgID"
                  >
                    <InputNumber placeholder={t("orgId")} />
                  </Form.Item>
                }

                <Form.Item
                  label={t("search")}
                  name="Search"
                >
                  <Input.Search
                    placeholder={t("search")}
                    enterButton
                    onSearch={this.search}
                  />
                </Form.Item>

                <Form.Item
                  name="StartDate"
                  label={t("startDate")}
                >
                  <DatePicker format="DD.MM.YYYY" className="datepicker" />
                </Form.Item>

                <Form.Item
                  name="EndDate"
                  label={t("endDate")}
                >
                  <DatePicker format="DD.MM.YYYY" className="datepicker" />
                </Form.Item>

                <Form.Item
                  name="Type"
                  label={t("Type")}>
                  <Select
                    allowClear
                    showSearch
                    placeholder={t("Type")}
                    style={{ width: 170 }}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {this.state.cashList.map(item => <Option key={item.ID} value={item.ID}>{item.DisplayName}</Option>)}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="SettleCode"
                  label={t("SettleCode")}
                >
                  <Select
                    allowClear
                    showSearch
                    placeholder={t("SettleCode")}
                    style={{ width: 230 }}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {this.state.orgSettleAcc.map(item => <Option key={item.ID} value={item.ID}>{item.Code}</Option>)}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="Status"
                  label={t("Status")}>
                  <Select
                    allowClear
                    showSearch
                    placeholder={t("Status")}
                    style={{ width: 200 }}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }>
                    {this.state.statusList.map(item => <Option key={item.ID} value={item.ID}>{item.DisplayName}</Option>)}
                  </Select>
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    <i className="feather icon-refresh-ccw" />
                  </Button>
                </Form.Item>

                <Form.Item>
                  <Tooltip title={t("add-new")}>
                    <Button type="primary" disabled={!this.docOperationRole}>
                      <Link to={`${this.props.match.path}/add`}>
                        <i className="fa fa-plus" aria-hidden="true" />
                      </Link>
                    </Button>
                  </Tooltip>
                </Form.Item>
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
              onChange={this.handleTableChange}
              rowKey={(record) => record.ID}
              showSorterTooltip={false}
              rowClassName="table-row"
              className="main-table"
              pagination={{
                ...pagination,
                showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
              }}
              scroll={{
                x: "max-content",
                y: '50vh'
              }}
              onRow={(record) => {
                return {
                  onDoubleClick: () => {
                    this.props.history.push(`${this.props.match.path}/edit/${record.ID}`);
                  },
                };
              }}
            />
            <Modal
              title={t("send")}
              visible={this.state.isEimzoModalVisible}
              onOk={this.eimzoModalOkHandler}
              onCancel={this.eimzoModalCancelHandler}
              forceRender
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
            <CSSTransition
              mountOnEnter
              unmountOnExit
              in={protocolModalVisible}
              timeout={300}
            >
              <ProtocolModal
                visible={protocolModalVisible}
                id={rowId}
                onCancel={this.closeProtocolModalHandler}
              />
            </CSSTransition>
            <CSSTransition
              mountOnEnter
              unmountOnExit
              in={changeDateModalVisible}
              timeout={300}
            >
              <ChangeDateModal
                visible={changeDateModalVisible}
                id={rowId}
                onCancel={this.closeChangeDateModalHandler}
              />
            </CSSTransition>
            {/* <AcceptModal /> */}

            {/* change status modal added here */}
            <CSSTransition
              mountOnEnter
              unmountOnExit
              in={changeStatusModalVisible}
              timeout={300}
            >
              <ChangeStatusModal
                visible={changeStatusModalVisible}
                id={rowId}
                statusID={statusID}
                onCancel={this.closeChangeStatusModalHandler}
                onOk={this.closeChangeStatusModalOkHandler}
              />
            </CSSTransition>

            <CSSTransition
              mountOnEnter
              unmountOnExit
              in={historyModal}
              timeout={300}
            >
              <DocumentChangeLogModal
                visible={historyModal}
                params={historyParams}
                onCancel={() => {
                  this.setState({ historyModal: false });
                }}
              />
            </CSSTransition>
          </Fade>
        </Card>
      </Spin>
    );
  }
}

export default withTranslation()(RequestReceivingCash);
