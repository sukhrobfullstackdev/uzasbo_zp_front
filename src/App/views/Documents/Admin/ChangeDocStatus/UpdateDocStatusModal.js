import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Input, Modal, Row, Select, Spin } from 'antd'
import { useTranslation } from 'react-i18next';

import { Notification } from '../../../../../helpers/notifications';
import ChangeDocStatusServices from '../../../../../services/Documents/Admin/ChangeDocStatus/ChangeDocStatus.services';
import { documetType } from "./components/documentConstants";
import classes from "./ChangeDocStatus.module.css"
import { DownloadOutlined, FilePdfOutlined, UploadOutlined } from '@ant-design/icons';
import CommonServices from "./../../../../../services/common/common.services";

const { Option } = Select;

const layout = {
    labelCol: {
        span: 24,
    },
    wrapperCol: {
        span: 24,
    },
};

const UpdateDocStatusModal = (props) => {
    // console.log(props.data);
    const { ID } = props.data;

    const { t } = useTranslation();
    const [mainForm] = Form.useForm();

    const [loader, setLoader] = useState(true);
    const [docStatus, setDocStatus] = useState({});
    const [filelist, setFileList] = useState([]);
    const [tableID, setTableID] = useState(null);

    let currentFile = filelist[0] || null;

    useEffect(() => {
        const fetchData = async () => {
            const [docStatus] = await Promise.all([
                ChangeDocStatusServices.getDocument(ID),
            ]);
            setDocStatus(docStatus.data);

            if (docStatus.data.ID !== 0) {
                mainForm.setFieldsValue({
                    ...docStatus.data,
                });
                setTableID(docStatus.data.TableID);
            }
            setLoader(false);
        };

        fetchData().catch(err => {
            Notification('error', err);
            setLoader(false);
        });
    }, [ID, mainForm]);

    const onMainFormFinish = (values) => {
        // console.log({ ...docStatus, ...values, });
        const data = { ...docStatus, ...values, };
        const formData = new FormData();
        let currentFile = filelist[0];

        for (const key in data) {
            if (key === 'file' || key === 'FileName') {
                continue;
            }
            formData.append(key, data[key]);
        };
        if (tableID === 205 && currentFile) {
            formData.append('FileName', currentFile?.name);
            formData.append('file', currentFile, currentFile?.name);
        };
        // for (var pair of formData.entries()) {
        //     console.log(pair[0] + ', ' + pair[1]);
        // }  

        ChangeDocStatusServices.updateDocument(formData)
            .then((res) => {
                // console.log(res.data);
                Notification('success', t('edited'));
                props.onCancel();
                props.fetch();
            }).catch((err) => {
                Notification('error', err)
            })
    };

    const tableIDHandler = (e) => {
        setTableID(e);
    };

    const selectFile = (e) => {
        const isLt1M = e.target.files[0]?.size / 1024 / 1024 > 1;
        if (isLt1M) {
            Notification('error', t('fileSizeAlert'));
        } else {
            setFileList(e.target.files);
        };
    };

    const deleteFileHandler = () => {
        setLoader(true);
        CommonServices.deleteFile(ID, 246, 'changedocumentstatus')
            .then(res => {
                if (res.status === 200) {
                    Notification('success', t('deleteded'));
                    setLoader(false);
                }
            })
            .catch(err => {
                Notification('error', err);
                setLoader(false);
            })
    }

    const donwloadFileHandler = () => {
        setLoader(true);
        CommonServices.downloadFile(ID, 246, 'changedocumentstatus')
            .then(res => {
                if (res.status === 200) {
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", "DocStatus.pdf");
                    document.body.appendChild(link);
                    link.click();
                    setLoader(false);
                }
            })
            .catch(err => {
                setLoader(false);
                Notification('error', t('fileNotFound'));
            })
    }

    return (
        <Modal
            width={768}
            title={t("changeDocumentStatus")}
            visible={props.visible}
            onCancel={props.onCancel}
            footer={[
                <Button key="back" onClick={props.onCancel}>
                    {t("close")}
                </Button>,
                <Button
                    type="primary"
                    form='mainForm'
                    htmlType="submit"
                // onClick={selectRow}
                >
                    {t("save")}
                </Button>,
            ]}
        >
            <Spin size='large' spinning={loader}>
                <Form
                    {...layout}
                    form={mainForm}
                    id="mainForm"
                    onFinish={onMainFormFinish}
                    initialValues={{
                    }}
                >
                    <Row gutter={[15, 0]}>
                        <Col span={12} md={6}>
                            <Form.Item
                                label={t("OrganizationID")}
                                name="OrganizationID"
                                rules={[
                                    {
                                        required: true,
                                        message: 'This field is required!',
                                    },
                                ]}
                            >
                                <Input placeholder={t("OrganizationID")} />
                            </Form.Item>
                        </Col>
                        <Col span={12} md={6}>
                            <Form.Item
                                label={t("OrgINN")}
                                name="OrganizationINN"
                                rules={[
                                    {
                                        required: true,
                                        message: 'This field is required!',
                                    },
                                ]}
                            >
                                <Input placeholder={t("OrgINN")} />
                            </Form.Item>
                        </Col>
                        <Col span={24} md={12}>
                            <Form.Item
                                label={t("Document")}
                                name="TableID"
                                rules={[
                                    {
                                        required: true,
                                        message: 'This field is required!',
                                    },
                                ]}
                            >
                                <Select
                                    allowClear
                                    placeholder={t("docType")}
                                    onChange={tableIDHandler}
                                >
                                    {documetType.map((type) => {
                                        return (
                                            <Option
                                                key={type.value} value={type.value}
                                            >
                                                {type.content}
                                            </Option>
                                        )
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={24} md={12}>
                            <Form.Item
                                label={t("DocumentID")}
                                name="DocumentID"
                                rules={[
                                    {
                                        required: true,
                                        message: 'This field is required!',
                                    },
                                ]}
                            >
                                <Input placeholder={t("DocumentID")} />
                            </Form.Item>
                        </Col>
                        <Col span={24} md={12}>
                            <Form.Item
                                label={t("reason")}
                                name="Comment"
                                rules={[
                                    {
                                        required: true,
                                        message: 'This field is required!',
                                    },
                                ]}
                            >
                                <Input placeholder={t("reason")} />
                            </Form.Item>
                        </Col>
                        {(tableID === 205 || docStatus.FileName !== null) && (
                            <Col span={24} md={24}>
                                <div style={{ display: 'flex', alignItems: 'center', }}>
                                    <Form.Item
                                        label={<div style={{ display: 'flex', alignItems: 'center' }}>
                                            <UploadOutlined style={{ fontSize: 16, marginRight: 8 }} />
                                            {t("fileInput")}
                                        </div>}
                                        // label={t("file")}
                                        name="file"
                                        className={classes.fileInput}
                                        // rules={[
                                        //     {
                                        //         required: false,
                                        //         message: 'This field is required!',
                                        //     },
                                        // ]}
                                    >
                                        <Input
                                            className={classes.file}
                                            accept='application/pdf'
                                            type="file" onChange={selectFile}
                                            placeholder={t("OrgINN")}
                                        />
                                    </Form.Item>
                                    {ID !== 0 &&
                                        <div style={{ display: 'flex', paddingBottom: 8 }}>
                                            <Button
                                                type="primary"
                                                icon={<DownloadOutlined />}
                                                onClick={donwloadFileHandler}
                                            >
                                                &nbsp;{t('download')}
                                            </Button>
                                            <Button
                                                type="danger"
                                                icon={<i className="feather icon-trash-2" aria-hidden="true" />}
                                                onClick={deleteFileHandler}
                                            >
                                                &nbsp;{t('Delete')}
                                            </Button>
                                        </div>
                                    }
                                </div>
                                {currentFile && (
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <FilePdfOutlined style={{ fontSize: 16, marginRight: 8, color: 'tomato' }} />
                                        {currentFile.name}
                                    </div>
                                )}
                            </Col>
                        )}
                    </Row>
                </Form>
            </Spin>
        </Modal>
    )
}

export default React.memo(UpdateDocStatusModal);