import React, { useState, useEffect, useCallback } from 'react'
import { Table, Tag, Space, Tooltip, Popconfirm, Dropdown, Menu, Form, Modal, Select } from 'antd';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useHistory } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Buffer } from 'buffer';
import { CSSTransition } from 'react-transition-group';

import { setListPagination, getListStartAction, setMainLoader } from '../_redux/getListSlice';
import PlasticCardSheetForMilitaryServices from "../../../../../services/Military/PlasticCardSheetForMilitary.services";
import { Notification } from '../../../../../helpers/notifications';
import '../../../../../helpers/prototypeFunctions'
import { fillCertKeys, fillPfxs, apiKey } from '../../../../../helpers/eimzo'
import ProtocolModal from './ProtocolModal';
// import classes from "../PlasticCardSheetForMilitary.module.css";

const { confirm } = Modal;
const { Option } = Select;
let keys = [];

const GetListTable = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const [eimzoForm] = Form.useForm();
  const tableList = useSelector((state) => state.plasticCardSheetForMilitaryGetList);
  const filterData = tableList?.filterData;
  const paginationData = tableList?.paginationData;
  const storeLoading = tableList.listBegin;
  const userListPagination = tableList.paginationData;
  const tableData = tableList.listSuccessData?.rows;
  const total = tableList.listSuccessData?.total;

  const [loading, setLoading] = useState(false);
  const [hash, setHash] = useState('');
  const [eimzoModalVisible, setEimzoModalVisible] = useState(false);
  const [protocolModalVisible, setProtocolModalVisible] = useState(false);
  const [rowId, setRowId] = useState(null);
  const [docId, setDocId] = useState(null);
  // const [tableContextMenu, setTableContextMenu] = useState({
  //   visible: false,
  //   x: 0,
  //   y: 0
  // });

  const deleteRowHandler = id => {
    setLoading(true);
    PlasticCardSheetForMilitaryServices.delete(id)
      .then(res => {
        if (res.status === 200) {
          dispatch(getListStartAction({
            ...filterData,
            ...paginationData,
          }));
          setLoading(false);
        }
      })
      .catch(err => {
        setLoading(false);
        Notification('error', err);
      })
  }

  const acceptHandler = (id) => {
    setLoading(true);
    PlasticCardSheetForMilitaryServices.Accept(id)
      .then((res) => {
        if (res.status === 200) {
          Notification('success', t('accepted'));
          dispatch(getListStartAction({
            ...filterData,
            ...paginationData,
          }));
          setLoading(false);
        }
      })
      .catch((err) => {
        Notification('error', err);
        setLoading(false);
      });
  };

  const declineHandler = (id) => {
    setLoading(true);
    PlasticCardSheetForMilitaryServices.NotAccept(id)
      .then((res) => {
        if (res.status === 200) {
          Notification('success', t('accepted'));
          dispatch(getListStartAction({
            ...filterData,
            ...paginationData,
          }));
          setLoading(false);
        }
      })
      .catch((err) => {
        Notification('error', err);
        setLoading(false);
      });
  };

  // E-imzo
  const loadKeys = useCallback(() => {
    var items = [];
    fillCertKeys(items, () => {
      fillPfxs(items, () => {
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
        }
      });
    });
  }, [])

  useEffect(() => {
    window.CAPIWS.apikey(apiKey, (event, data) => {
      if (data.success) {
        loadKeys();
      } else {
        alert(data.reason);
      }
    }, (e) => {
      alert(e);
    })
  }, [loadKeys])

  function postLoadKey(id, vo, reload) {
    let buff = new Buffer(hash);
    window.CAPIWS.callFunction({
      plugin: "pkcs7",
      name: "create_pkcs7",
      arguments: [buff.toString('base64'), id, 'no']
    }, (event, data) => {
      // console.log(event, data);
      if (data.success) {
        //   document.eimzoForm.pkcs7.value = data.pkcs7_64;
        let signData = {
          ID: docId,
          DataHash: hash,
          SignedData: data.pkcs7_64
        }

        PlasticCardSheetForMilitaryServices.postSignedData(signData)
          .then(res => {
            if (res.status === 200) {
              dispatch(setMainLoader(false));
              setEimzoModalVisible(false);
              // this.setState({ mainLoader: false, isEimzoModalVisible: false });
              // this.eImzoForm.current.resetFields();
              dispatch(getListStartAction({
                ...filterData,
                ...paginationData,
              }));
            }
          })
          .catch(err => {
            Notification('error', err);
          })
      } else {
        dispatch(setMainLoader(false));
        setEimzoModalVisible(false);
        // this.setState({ mainLoader: false, isEimzoModalVisible: false });
        // this.eImzoForm.current.resetFields();
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

  function loadPfxKey(vo) {
    window.CAPIWS.callFunction({
      plugin: "pfx",
      name: "load_key",
      arguments: [vo.disk, vo.path, vo.name, vo.alias]
    }, (event, data) => {
      if (data.success) {
        var id = data.keyId;
        window.sessionStorage.setItem(vo.serialNumber, id);
        postLoadKey(id, vo);
      } else {
        alert(data.reason);
      }
    }, (e) => {
      alert(e);
    });
  };

  function sign(hash) {
    // hashData = hash;
    // var itm = document.eimzoForm.key.value;
    var itm = eimzoForm.getFieldValue('eImzoKey');
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
            postLoadKey(id, vo);
          } else {
            alert(data.reason);
          }
        }, (e) => {
          alert(e);
        });
      } else if (vo.type === "pfx") {
        var id = window.sessionStorage.getItem(vo.serialNumber);
        if (id) {
          postLoadKey(id, vo, function () {
            loadPfxKey(vo);
          });
        } else {
          loadPfxKey(vo);
        }
      }
    }
  };

  const showAcceptModal = (id) => {
    setDocId(id);
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: t('Are you sure to send?'),
      okText: t('yes'),
      cancelText: t('cancel'),
      onOk: () => {
        setLoading(true);
        PlasticCardSheetForMilitaryServices.getHash(id)
          .then(res => {
            if (res.status === 200) {
              setLoading(false);
              setEimzoModalVisible(true);
              setHash(res.data);
            }
          })
          .catch(err => {
            Notification('error', err);
            setLoading(false);
          })
      },
    });
  };

  const eimzoModalOkHandler = () => {
    eimzoForm.validateFields()
      .then(values => {
        sign(hash);
        setEimzoModalVisible(false);
        dispatch(setMainLoader(true));
        // props.setMainLoader(true);
      })
      .catch(err => err);
  };

  const eimzoModalCancelHandler = () => {
    setLoading(false);
    setEimzoModalVisible(false);
  };

  // E-imzo end
  
  const openProtocolModalHandler = (id) => {
    setProtocolModalVisible(true);
    setRowId(id);
  }

  const columns = [
    {
      title: t("id"),
      dataIndex: "ID",
      key: "ID",
      sorter: true,
      width: 80,
      render: (_, record) => {
        if (record.StatusID === 2 || record.StatusID === 8) {
          return record.ID;
        }
        return <span style={{ color: 'red' }}>{record.ID}</span>
      }
    },
    {
      title: t("BankCode"),
      dataIndex: "BankCode",
      key: "BankCode",
      sorter: true,
      width: 100
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
      width: 100
    },
    {
      title: t("Month"),
      dataIndex: "Month",
      key: "Month",
      sorter: true,
      width: 80,
      // className: classes.SubcName,
      // render: record => <div className="ellipsis-2">{record}</div>
    },
    {
      title: t("Sum"),
      dataIndex: "Sum",
      key: "Sum",
      sorter: true,
      width: 100,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t("paymentOrderDate"),
      dataIndex: "PaymentOrderDate",
      key: "PaymentOrderDate",
      sorter: true,
      width: 200
    },
    {
      title: t("SettleCode"),
      dataIndex: "SettleCode",
      key: "SettleCode",
      sorter: true,
      width: 100
    },
    {
      title: t("PlasticCardType"),
      dataIndex: "PlasticCardTypeName",
      key: "PlasticCardTypeName",
      sorter: true,
      width: 150
    },
    {
      title: t("paymentType"),
      dataIndex: "PaymentType",
      sorter: true,
      width: 150,
      render: (record) => record === 1 ? t('pension') : t('aliment')
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
      title: t("Comment"),
      dataIndex: "Comment",
      key: "Comment",
      sorter: true,
      width: 200,
      render: record => <div className="ellipsis-2">{record}</div>
    },
    {
      title: t("actions"),
      key: "action",
      fixed: 'right',
      align: 'center',
      width: 70,
      render: (record) => {
        return (
          <Space size="middle">
            {/* <Tooltip title={t("Edit")}>
              <span onClick={() => {
                history.push(`${location.pathname}/edit/${record.ID}`);
              }}>
                <i className="feather icon-edit action-icon" />
              </span>
            </Tooltip> */}
            <Dropdown
              overlay={<Menu items={[
  
                {
                  key: 'Edit',
                  label: (
                    <span onClick={() => {
                      history.push(`${location.pathname}/edit/${record.ID}`);
                    }}>
                      <i className="feather icon-edit action-icon" />&nbsp;
                      {t("Edit")}
                    </span>
                  ),
                },
                {
                  key: 'send',
                  label: (
                    <span onClick={() => showAcceptModal(record.ID)}>
                      <i className="far fa-check-circle action-icon" />&nbsp;
                      {t("send")}
                    </span>
                  ),
                },
                {
                  key: 'accept',
                  label: (
                    <span onClick={() => acceptHandler(record.ID)}>
                      <i className="far fa-check-circle action-icon" />&nbsp;
                      {t("Accept")}
                    </span>
                  ),
                },
                {
                  key: 'notAccept',
                  label: (
                    <span onClick={() => declineHandler(record.ID)}>
                      <i className="far fa-check-circle action-icon" />&nbsp;
                      {t("NotAccept")}
                    </span>
                  ),
                },
                {
                  key: 'protocol',
                  label: (
                    <span onClick={() => openProtocolModalHandler(record.ID)}>
                  <i className="far fa-comment action-icon" />&nbsp;
                  {t("protocol")}
                </span>
                  
                  ),
                },
                {
                  key: 'delete',
                  label: (
                    <span onClick={() => deleteRowHandler(record.ID)}>
                      <i className="feather icon-trash-2 action-icon" aria-hidden="true" />&nbsp;
                      {t("Delete")}
                    </span>
                  ),
                },
                // {
                //   key: 'Print',
                //   label: (
                //     <span onClick={() => printHandler(record.ID)}>
                //       <i className="feather icon-printer action-icon" aria-hidden="true" />&nbsp;
                //       {t("Print")}
                //     </span>
                //   ),
                // },
              ]} />}
            >
              <i className='feather icon-list action-icon' aria-hidden="true" />
            </Dropdown>
          </Space>
        );
      },
    },
  
  ];
 

  const handleTableChange = (pagination, filters, sorter, extra) => {
    const { field, order } = sorter;
    dispatch(
      setListPagination({
        OrderType: order?.slice(0, -3),
        SortColumn: field,
        PageNumber: pagination.current,
        PageLimit: pagination.pageSize,
      })
    );
  }

  const onTableRow = (record) => {
    return {
      onDoubleClick: () => {
        history.push(`${location.pathname}/edit/${record.ID}`);
      },
      // onContextMenu: event => {
      //   event.preventDefault();
      //   if (!tableContextMenu.visible) {
      //     document.addEventListener(`click`, function onClickOutside() {
      //       setTableContextMenu({
      //         ...tableContextMenu,
      //         visible: false
      //       });
      //       document.removeEventListener(`click`, onClickOutside);
      //     });

      //     document.querySelector('.ant-table-body').addEventListener(`scroll`, function onClickOutside() {
      //       setTableContextMenu({
      //         ...tableContextMenu,
      //         visible: false
      //       });
      //       document.querySelector('.ant-table-body').removeEventListener(`scroll`, onClickOutside);
      //     })
      //   }
      //   setTableContextMenu({
      //     record,
      //     visible: true,
      //     x: event.clientX,
      //     y: event.clientY
      //   });
      // }
    };
  }

  return (
    <>
      <Table
        bordered
        size="middle"
        rowClassName="table-row"
        className="main-table"
        columns={columns}
        dataSource={tableData}
        loading={storeLoading || loading}
        onChange={handleTableChange}
        rowKey={(record) => record.ID}
        showSorterTooltip={false}
        onRow={(record) => onTableRow(record)}
        scroll={{
          x: "max-content",
          y: '50vh'
        }}
        pagination={{
          pageSize: Math.ceil(tableData?.length / 10) * 10,
          total: total,
          current: userListPagination.PageNumber,
          showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
        }}
      />

      <CSSTransition
        mountOnEnter
        unmountOnExit
        in={eimzoModalVisible}
        timeout={300}
      >
        <Modal
          title={t("send")}
          visible={eimzoModalVisible}
          onOk={eimzoModalOkHandler}
          onCancel={eimzoModalCancelHandler}
        >
          <Form
            form={eimzoForm}
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

      <CSSTransition
        mountOnEnter
        unmountOnExit
        in={protocolModalVisible}
        timeout={300}
      >
        <ProtocolModal
          visible={protocolModalVisible}
          id={rowId}
          onCancel={() => setProtocolModalVisible(false)}
        />
      </CSSTransition>
    </>
  )
}

export default React.memo(GetListTable);