import React, { Component } from "react";
import { Table, Input, Form, Button, Select, Space, Popconfirm, Modal, Tag, Tooltip, DatePicker, Radio, Tabs } from "antd";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import moment from "moment";
import { CSSTransition } from 'react-transition-group';
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Buffer } from 'buffer';

import ClassTitleServices from "../../../../../../services/Documents/Personnel_accounting/TariffList/ClassTitle/ClassTitle.services";
import HelperServices from "../../../../../../services/Helper/helper.services";
import Card from "../../../../../components/MainCard";
import classes from "./ClassTitle.module.css";
import TableRightClick from "./TableRightClick";
import ProtocolModal from "./ProtocolModal";
import { Notification } from "../../../../../../helpers/notifications";

// import ProtokolModal from "./ProtokolModal";

const { Option } = Select;
const { confirm } = Modal;
const defaultPagination = {
    current: 1,
    pageSize: 10,
}
let hashData;
let keys = [];

class ClassTitle extends Component {
    filterForm = React.createRef();
    state = {
        data: [],
        filterData: {},
        pagination: {
            current: 1,
            pageSize: 10,
        },
        // visible: false,
        protocolModalVisible: false,
        loading: false,
        filterType: '',
        print: false,
        tablePopup: {
            visible: false,
            x: 0,
            y: 0
        },
    };

    fetchData = async () => {
        try {
        } catch (err) {
            alert(err);
            console.log(err);

        }
    }

    componentDidMount() {
        this.fetchData();
        const { pagination } = this.state;
        this.fetch({ pagination }, {});
    }

    handleTableChange = (pagination, filters, sorter) => {
        this.fetch(
            {
                sortField: sorter.field,
                sortOrder: sorter.order,
                pagination,
                ...filters,
            },
            this.state.filterData,
        );
    };

    fetch = (params = {}, filterFormValues) => {
        console.log(filterFormValues);
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
            StartYear: filterFormValues?.StartYear ? filterFormValues?.StartYear.format("YYYY") : moment().format("YYYY"),
            // EndDate: filterFormValues.EndDate ? filterFormValues.EndDate.format("DD.MM.YYYY") : moment().format("DD.MM.YYYY"),
            // StartDate: filterFormValues.StartDate ? filterFormValues.StartDate.format("DD.MM.YYYY") : moment().subtract(10, "year").format("DD.MM.YYYY"),
        };

        ClassTitleServices.getList(pageNumber, pageLimit, sortColumn, orderType, date, filter, filterFormValues)
            .then((data) => {

                this.setState({
                    loading: false,
                    data: data.data.rows,
                    pagination: {
                        ...params.pagination,
                        total: data.data.total,
                        loading: false,
                    },
                });

            })
            .catch((err) => {
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
        const { pagination, filterData } = this.state;
        ClassTitleServices.delete(id)
            .then((res) => {
                if (res.status === 200) {
                    this.fetch({ pagination }, filterData);
                }
            })
            .catch((err) => {
                //console.log(err);
                Notification('error', err);
                this.setState({ loading: false });
            });
    };

    onFinish = (values) => {
        const filterValues = this.filterForm.current.getFieldsValue();
        this.setState({ loading: true, filterData: values });
        this.fetch({ pagination: defaultPagination }, filterValues);
    };

    filterTypeHandler = (type) => {
        this.setState({ filterType: type });
    };

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

                ClassTitleServices.postSignedData(signData)
                    .then(res => {
                        // console.log(res);
                        return res;
                    })
                    .catch(err => Notification("error", err))

                this.setState({ isEimzoModalVisible: false });
                this.eImzoForm.current.resetFields();
                const { pagination } = this.state;
                this.fetch({ pagination }, null, {});
            } else {
                this.setState({ isEimzoModalVisible: false })
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
            content: 'Are you sure to send?',
            onOk: () => {
                this.setState({ mainLoader: true });
                ClassTitleServices.getHash(id)
                    .then(res => {
                        if (res.status === 200) {
                            this.setState({ mainLoader: false, isEimzoModalVisible: true, hash: res.data });
                        }
                    })
                    .catch(err => {
                        // console.log(err);
                        Notification("error", err);
                        this.setState({ mainLoader: false });
                    })
            },
            onCancel() {
                console.log("Cancel");
            }
        });
    };

    eimzoModalOkHandler = () => {
        this.sign(this.state.hash);
    };

    eimzoModalCancelHandler = () => {
        this.setState({ isEimzoModalVisible: false })
    };

    // End E-imzo fuctions

    acceptHandler = (id) => {
        this.setState({ loading: true });
        const { pagination, filterData } = this.state;
        ClassTitleServices.Accept(id)
            .then((res) => {
                if (res.status === 200) {
                    this.fetch({ pagination }, filterData);
                }
            })
            .catch((err) => {
                // console.log(err)
                Notification("error", err);
                this.setState({ loading: false });
            });
    };

    declineHandler = (id) => {
        this.setState({ loading: true });
        const { pagination, filterData } = this.state;
        ClassTitleServices.NotAccept(id)
            .then((res) => {
                if (res.status === 200) {
                    this.fetch({ pagination }, filterData);
                }
            })
            .catch((err) => {
                // console.log(err)
                Notification("error", err);
                this.setState({ loading: false });
            });
    };

    printRow = (id, tableId) => {
        this.setState({ loading: true });
        ClassTitleServices.printRow(id, tableId)
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
                // console.log(err);
                this.setState({ loading: false });
                Notification("error", err);
            })
    }

    printForm = (StartYear) => {
        this.setState({ loading: true });
        ClassTitleServices.printForm(StartYear)
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
                // console.log(err);
                this.setState({ loading: false });
                Notification("error", err);
            })
    }

    printById = (id) => {
        ClassTitleServices.printById(id)
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "classtitle.xlsx");
                document.body.appendChild(link);
                link.click();
            })
            .catch(err => {
                // console.log(err);
                Notification('error', err)
            })
    }

    onTableRow = (record) => {
        return {
            onDoubleClick: () => {
                // this.props.history.push(`${this.props.match.path}/edit/${record.ID}`);
                this.props.history.push(`${this.props.match.path}/view/${record.ID}`);
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

    // End Filter functions

    // Modal ProtokolModal
    // showModal = () => {
    //   this.setState({
    //     visible: true,
    //   });
    // };

    sendHandler = (id) => {
        this.setState({ loading: true });
        const { pagination, filterData } = this.state;
        ClassTitleServices.Send(id)
            .then((res) => {
                if (res.status === 200) {
                    this.fetch({ pagination }, filterData);
                }
            })
            .catch((err) => {
                console.log(err)
                this.setState({ loading: false });
            });
    };


    protokolHandler = (id) => {
        this.setState({ loading: true });
        const { pagination, filterData } = this.state;
        HelperServices.GetStaffListFileLog(id)
            .then((res) => {
                if (res.status === 200) {
                    this.fetch({ pagination }, filterData);
                }
            })
            .catch((err) => {
                console.log(err)
                this.setState({ loading: false });
            });
    };

    render() {
        const { t } = this.props;
        const columns = [
            {
                title: t("id"),
                dataIndex: "ID",
                key: "ID",
                sorter: true,
                width: 100,
                render: (_, record) => {
                    if (record.StatusID === 2) {
                        return record.ID;
                    } else {
                        return <span style={{ color: 'red' }}>{record.ID}</span>
                    }
                }
            },
            {
                title: t("OrganizationName"),
                dataIndex: "OrganizationName",
                key: "OrganizationName",
                sorter: true,
                width: 150,
            },
            {
                title: t("StartYear"),
                dataIndex: "StartYear",
                key: "StartYear",
                sorter: true,
                width: 80,
            },
            {
                title: t("EndYear"),
                dataIndex: "EndYear",
                key: "EndYear",
                sorter: true,
                width: 80,
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
                title: t("Status"),
                dataIndex: "Status",
                key: "Status",
                sorter: true,
                width: 100,
                render: (_, record) => {
                    if (record.StatusID === 13) {
                        return (
                            <Tag color='#87d068'>
                                {record.StatusName}
                            </Tag>
                        );
                    }
                    return (
                        <Tag color='#f50'>
                            {record.StatusName}
                        </Tag>
                    );
                }
            },
            {
                title: t("BLHGType"),
                dataIndex: "BLHGTypeName",
                key: "BLHGTypeName",
                sorter: true,
                width: 200,
                render: record => <div className="ellipsis-2">{record}</div>
            },
            {
                title: t("SpecializedSubjects"),
                dataIndex: "SpecializedSubjectsName",
                key: "SpecializedSubjectsName",
                sorter: true,
                width: 200,
                render: record => <div className="ellipsis-2">{record}</div>
            },
            // {
            //     title: t("Tip"),
            //     dataIndex: "Tip",
            //     key: "Tip",
            //     sorter: true,
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
                            <span onClick={() => this.printById(record.ID)}>
                                <i
                                    className='feather icon-printer action-icon'
                                    aria-hidden="true"
                                />
                            </span>

                            {/* <Tooltip title={t("Protokol")}>
                <span onClick={() => this.protokolHandler(record.ID)}
                // onFocus={() => this.showModal}
                >
                  <i className="fas fa-comment-alt action-icon" />
                </span>
              </Tooltip> */}
                            {/* <Popconfirm
                title="Sure to send?"
                onConfirm={() => this.protokolHandler(record.ID)}
                onClick={() => { setEnrolmentTableModalVisible(true);
                }}
              >
                <span>
                  <i className="fas fa-comment-alt action-icon" />
                </span>
              </Popconfirm> */}
                            {/* <Popconfirm
                title="Sure to send?"
                onConfirm={() => this.sendHandler(record.ID)}
              >
                <span>
                  <i className="fab fa-telegram-plane action-icon" />
                </span>
              </Popconfirm> */}
                            {/* <Popconfirm
                title="Sure to send?"
                onConfirm={() => this.acceptHandler(record.ID)}
              >
                <span>
                  <i className="far fa-check-circle action-icon" />
                </span>
              </Popconfirm>
              <Popconfirm
                title={t('decline')}
                onConfirm={() => this.declineHandler(record.ID)}
              >
                <span>
                  <i className="far fa-times-circle action-icon" />
                </span>
              </Popconfirm> */}
                            {/* <Link
                to={`${this.props.match.path}/edit/${record.ID}`}
              >
                <i
                  className='feather icon-edit action-icon'
                  aria-hidden="true"
                />
              </Link> */}
                            <Tooltip title={t("view")}>
                                <Link
                                    to={`${this.props.match.path}/view/${record.ID}`}
                                >
                                    <i
                                        className='feather icon-eye action-icon'
                                        aria-hidden="true"
                                    />
                                </Link>
                            </Tooltip>
                            {/* <Popconfirm
                                title={t('delete')}
                                onConfirm={() => this.deleteRowHandler(record.ID)}
                                okText={t("yes")}
                                cancelText={t("cancel")}
                            >
                                <span>
                                <i className="feather icon-trash-2 action-icon" aria-hidden="true" />
                                </span>
                            </Popconfirm> */}
                        </Space>
                    );
                },
            },
        ];

        const { data, pagination, loading, protocolModalVisible, rowId, rowTableId } = this.state;

        return (
            <Card title={t("ClassTitle")}>
                <Fade>
                    <div className="">
                        <Form
                            // className={classes.FilterWrapper}
                            ref={this.filterForm}
                            onFinish={this.onFinish}
                            initialValues={{
                                StartYear: moment()
                            }}
                        >
                            {/* <Form.Item>
                <Select
                  style={{ width: 180 }}
                  placeholder={t("Filter Type")}
                  onChange={this.filterTypeHandler}
                >
                  <Option>{t("Filter Type")}</Option>
                  <Option value="ID">{t("id")}</Option>
                </Select>
                            </Form.Item>
                            <Form.Item>
                                <Input.Search
                                className="table-search"
                                placeholder={t("search")}
                                enterButton
                                onSearch={this.search}
                                />
                            </Form.Item> */}
                            <div className={classes.FilterWrapper}>
                                <Form.Item
                                    name="StartYear"
                                    label={t("StartYear")}>
                                    <DatePicker format="YYYY" picker="year" />
                                </Form.Item>

                                <Button type="primary" htmlType="submit">
                                    <i className="feather icon-search" />
                                </Button>
                            </div>

                            <Form.Item name="Status">
                                <Radio.Group defaultValue="0">
                                    <Radio.Button onClick={() => { setTimeout(() => { this.onFinish() }, 0) }} value="0">{t('Все')}</Radio.Button>
                                    <Radio.Button onClick={() => { setTimeout(() => { this.onFinish() }, 0) }} value="9">{t('Доставленные')}</Radio.Button>
                                    <Radio.Button onClick={() => { setTimeout(() => { this.onFinish() }, 0) }} value="13">{t('Принятие отчеты')}</Radio.Button>
                                    <Radio.Button onClick={() => { setTimeout(() => { this.onFinish() }, 0) }} value="10">{t('Не принятые отчеты')}</Radio.Button>
                                </Radio.Group>
                            </Form.Item>

                        </Form>
                        {/* <Link to={`${this.props.match.path}/add`}>
              <Button type="primary">
                {t("add-new")}&nbsp;
                <i className="fa fa-plus" aria-hidden="true" />
              </Button>
            </Link> */}
                    </div>
                </Fade>
                <Fade>
                    <Table
                        columns={columns}
                        bordered
                        dataSource={data}
                        pagination={{
                            ...pagination,
                            showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
                        }}
                        loading={loading}
                        onChange={this.handleTableChange}
                        onRow={(record) => this.onTableRow(record)}
                        rowKey={(record) => record.ID}
                        showSorterTooltip={false}
                        rowClassName="table-row"
                        className="main-table"
                        scroll={{
                            x: "max-content",
                            y: '50vh'
                        }}
                    />
                </Fade>
                <CSSTransition
                    mountOnEnter
                    unmountOnExit
                    in={protocolModalVisible}
                    timeout={300}
                >
                    <ProtocolModal
                        visible={protocolModalVisible}
                        id={rowId}
                        tableId={rowTableId}
                        onCancel={this.closeProtocolModalHandler}
                    />
                </CSSTransition>
                <TableRightClick
                    {...this.state.tablePopup}
                    parentPath={this.props.match.path}
                    openProtocolModal={this.openProtocolModalHandler}
                    printRow={this.printRow}
                    printForm={this.printForm}
                    sendRow={this.showAcceptModal}
                    accept={this.acceptHandler}
                    notAccept={this.declineHandler}
                    deleteRow={this.deleteRowHandler}
                />
            </Card>
        );
    }
}

export default withTranslation()(ClassTitle);