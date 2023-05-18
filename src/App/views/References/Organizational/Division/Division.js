import React, { useEffect} from 'react'
import { Button, Form, Input, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Fade } from "react-awesome-reveal";
import { Link } from 'react-router-dom';

import MainCard from "../../../../components/MainCard";
import classes from "./Division.module.css";
import { getListStartAction, setListFilter} from './_redux/DivisionSlice';
// import HelperServices from '../../../../../services/Helper/helper.services';
// import { Notification } from '../../../../../helpers/notifications';
import Table from './components/Table';
// import DivisionServices from '../../../../../services/References/Organizational/Division/Division.services';

const Divisions = ({ match }) => {
  const { t } = useTranslation();
  const [filterForm] = Form.useForm();

  const dispatch = useDispatch();
  const DivisionList = useSelector((state) => state.DivisionList);


  let tableData = DivisionList.listSuccessData?.rows;
  let total = DivisionList.listSuccessData?.total;
  let pagination = DivisionList?.paginationData;
  let filter = DivisionList?.filterData;

  useEffect(() => {
    dispatch(
      getListStartAction({
        ...pagination,
        ...filter,
      })
    );
  }, [pagination, filter, dispatch]);

  const getList = (values) => {
    console.log(values);
    dispatch(setListFilter({
      Search: values?.Search,
      ID: values?.ID,
    }));
  }

  const onSearch = () => {
    filterForm.validateFields()
      .then(values => {
        getList(values)
      })
  };

  return (
    <MainCard title={t("Division")}>
      <Fade>
        <Form
          className={classes.FilterForm}
          form={filterForm}
        >
          <div className="main-table-filter-elements">

            <Form.Item
              // label={t("search")}
              name="Search"
            >
              <Input.Search
                enterButton
                placeholder={t('search')}
                onSearch={onSearch}
                className={classes['input-search']}
              />
            </Form.Item>

            <Form.Item>
              <Tooltip title={t("add-new")}>
                <Button type="primary">
                  <Link to={`${match.path}/add`}>
                    <i className="fa fa-plus" aria-hidden="true" />
                  </Link>
                </Button>
              </Tooltip>
            </Form.Item>


          </div>
        </Form>
      </Fade>
      <Fade>
        <Table tableData={tableData} total={total} match={match} />
      </Fade>



    </MainCard>
  )
}

export default Divisions;