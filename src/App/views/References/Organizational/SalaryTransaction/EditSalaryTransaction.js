import React, { useState, useEffect } from "react";
import { Row, Col, Form, Input, Button, Spin, Table, Popconfirm, Space, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Fade } from "react-awesome-reveal";

import MainCard from "../../../../components/MainCard";
import classes from "./SalaryTransaction.module.css";
import { Notification } from "../../../../../helpers/notifications";
import HelperServices from "../../../../../services/Helper/helper.services";
import salaryTransaction from "../../../../../services/References/Organizational/SalaryTransaction/SalaryTransaction.services";
import AddSalaryModal from "./AddSalaryModal.js";
import EditSalaryModal from "./EditSalaryModal";

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

const EditSalaryTransaction = (props) => {
  const [organizationSettlement, setOrganizationSettlement] = useState([]);
  const [tableDataModal, setTableData] = useState([]);
  const [addSalaryModalVisible, setAddSalaryModalVisible] = useState(false);
  const [editSalaryModalVisible, setEditSalaryModalVisible] = useState(false);
  const [backendTableData, setBackendTableData] = useState([]);
  const [tableRowId, setTableRowId] = useState(null);
  const [loader, setLoader] = useState(true);
  //const [currentDocId, setCurrentDocId] = useState(props.match.params.id)

  const { t } = useTranslation();
  const history = useHistory();
  const [form] = Form.useForm();

  useEffect(() => {
    async function fetchData() {
      try {
        const salaryTrData = await salaryTransaction.getById(props.match.params.id);
        const organizationSettlement = await HelperServices.getOrganizationsSettlementAccountList();

        setTableData(salaryTrData.data.Tables)
        // setCurrentDocId(salaryTrData.data.Tables[0].OwnerID)
        setOrganizationSettlement(organizationSettlement.data);
        setLoader(false);
        // console.log(salaryTrData);
        form.setFieldsValue({
          ...salaryTrData.data,
        })
      } catch (err) {
        Notification('error', err);
        setLoader(false);
        // console.log(err);
      }
    }
    fetchData();
  }, [props.match.params.id, form]);

  const onFinishFailed = (errorInfo) => {
    Notification('error', errorInfo);

  };

  const createSalaryDataHandler = ((values) => {
    setTableData((prevState) => [values, ...prevState])
    setAddSalaryModalVisible(false);
  })

  const editSalaryDataHandler = (values) => {
    setTableData(values)
    setEditSalaryModalVisible(false);
  }

  const tableDataDeleteHandler = (deleteKey) => {
    tableDataModal.forEach(item => {
      if (item.ID === 0 && item.key === deleteKey) {
        item.Status = 3
      } else if (item.ID !== 0 && item.ID === deleteKey) {
        item.Status = 3
      }
    })
    const filteredFrontData = tableDataModal.filter(item => {
      return (item.Status !== 3)
    })
    const filteredBackendData = tableDataModal.filter(item => {
      return (item.Status === 3)
    })
    setBackendTableData((prevState) => [...prevState, ...filteredBackendData]);
    setTableData(filteredFrontData);
  }

  const saveAllHandler = () => {
    form.validateFields()
      .then(() => {
        let allData = { ...form.getFieldsValue() };
        allData.ID= props.match.params.id;
        allData.Tables = [...tableDataModal];
        allData.Tables = [...tableDataModal, ...backendTableData]
        setLoader(true);
        salaryTransaction.postData(allData)
          .then(res => {
            setLoader(false);
            history.push('/salaryTransaction');
          })
          .catch(err => {
            // console.log(err);
            Notification('error', err);
            setLoader(false);
          })
      })
      .catch(err => {
        // console.log(err);
        Notification('error', err);
      })
  }

  const columns = [
    {
      title: t("OrganizationsSettlementAccount"),
      dataIndex: "OrganizationsSettlementAccountName",
      width: "15%",
      editable: true,
    },
    {
      title: t("Allowed Transaction"),
      dataIndex: "AllowedTransactionName",
      width: "35%",
      editable: true
    },
    {
      title: t("SubAccDbName"),
      dataIndex: "SubAccDbName",
      width: "10%",
      editable: true
    },
    {
      title: t("SubCountDb1ValueName"),
      dataIndex: "SubCountDb1ValueName",
      width: "15%",
      editable: true
    },
    {
      title: t("SubAccCrName"),
      dataIndex: "SubAccCrName",
      width: "10%",
      editable: true
    },
    {
      title: t("SubCountCr1Name"),
      dataIndex: "SubCountCr1ValueName",
      width: "15%",
      editable: true
    },
    {
      title: t("actions"),
      dataIndex: "actions",
      render: (_, record) => {
        return (
          <Space size="middle">

            <Tooltip title={t('Edit')}>
            <span
              onClick={() => {
                setEditSalaryModalVisible(true);
                setTableRowId(record.ID===0 ? record.key : record.ID);
              }}
              style={{ cursor: 'pointer', color: '#1890ff' }}
            >
              <i
                className='feather icon-edit action-icon'
                aria-hidden="true"
              />
            </span>
              </Tooltip>
            <Popconfirm
              title={t("delete")}
              onConfirm={() => {
                tableDataDeleteHandler(record.ID === 0 ? record.key : record.ID);
              }}
              okText={t("yes")}
              cancelText={t("cancel")}>
                 <Tooltip title={t('Delete')}>
              <span style={{ color: '#1890ff', cursor: 'pointer' }}>
                <i className="feather icon-trash-2 action-icon" />
              </span>
              </Tooltip>
            </Popconfirm>
          </Space>
        )
      },
    }
  ];

  return (
    <Fade >
      <MainCard title={t("Salary Transaction")}>
        <Spin spinning={loader} size='large'>
        <Form
          {...layout}
          onFinishFailed={onFinishFailed}
          className={classes.FilterForm}
          form={form}
         // initialValues={salaryTransactionData}
          // record={console.log(salaryTransactionData.Name)}
          >
          <Row gutter={[16, 16]}>
            <Col xl={8} lg={4}>
              <Form.Item
                label={t("name")}
                name="Name"
                rules={[
                  {
                    required: true,
                    message: `Please edit name!`,
                  },
                ]}
              >
                <Input placeholder={t("name")} disabled={{ color: 'black' }} />
              </Form.Item>
            </Col>
            <Col xl={8} lg={12}>
              <Form.Item
                label={t("CalculationTypeName")}
                name="CalculationTypeName"
                rules={[
                  {
                    required: true,
                    message: `Please edit name!`,
                  },
                ]}
                >
                <Input placeholder={t("CalculationTypeName")} disabled={{ color: 'black' }}  />
              </Form.Item>
              <Button
               type="primary"
                className={classes.salaryButton}
                onClick={() => {
                 setAddSalaryModalVisible(true);
               }}
                >
              {t("add-new")}
             </Button>
            </Col>
          </Row>


          <AddSalaryModal
            visible={addSalaryModalVisible}
            onCancel={() => setAddSalaryModalVisible(false)}
            tableData={tableDataModal}
            organizationSettlement={organizationSettlement}
            onCreate={(values) => createSalaryDataHandler(values)}
          />

          {editSalaryModalVisible &&
            <EditSalaryModal
              visible={editSalaryModalVisible}
              onCancel={() => setEditSalaryModalVisible(false)}
              tableData={tableDataModal}
              organizationSettlement={organizationSettlement}
              onCreate={editSalaryDataHandler}
              rowId={tableRowId}

            />
          }

          <Table
            bordered
            columns={columns}
            rowClassName="table-row"
            className='main-table'
            showSorterTooltip={false}
            dataSource={[...tableDataModal]}
            pagination={false}
            rowKey={record => record.key ? record.key : record.ID}
            onRow={(record, rowIndex) => {
              return {
                onDoubleClick: () => {
                  setEditSalaryModalVisible(true);
                  setTableRowId(record.ID===0 ? record.key : record.ID);
                },
              };
            }}
          />

        <Col xl={24} lg={12}>
          <div className={classes.Buttons}>
            <Button
              type="danger"
              onClick={() => {
                history.goBack();

              }}
            >
              {t("back")}
            </Button>
            <Button type="primary" htmlType="submit"
              onClick={saveAllHandler} >
              {t("save")}
            </Button>
          </div>
        </Col>
        </Form>
        </Spin>
      </MainCard>
    </Fade>
  );
};

export default EditSalaryTransaction;
