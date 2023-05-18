import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import config from '../../../../config';
import mainNavigation from '../../../../menu-items/main-menu-items';

const demo = '#!';

const Breadcrumb = () => {
  const { t } = useTranslation();

  const [main, setMain] = useState([]);
  const [item, setItem] = useState([]);

  const getCollapse = useCallback((item) => {
    if (item.children) {
      (item.children).filter(collapse => {
        if (collapse.type && collapse.type === 'collapse') {
          getCollapse(collapse,);
        } else if (collapse.type && collapse.type === 'item') {
          if (document.location.pathname === config.basename + collapse.url) {
            setItem(collapse);
            setMain(item);
          }
        }
        return false;
      });
    }
  }, [])

  useEffect(() => {
    (mainNavigation.items).map((item, index) => {
      if (item.type && item.type === 'group') {
        getCollapse(item, index);
      }
      return false;
    });
  }, [getCollapse])

  let mainBr, itemBr;
  let breadcrumb = '';
  let title = 'Welcome';

  if (main && main.type === 'collapse') {
    mainBr = (
      <li className="breadcrumb-item">
        <a href={demo}>{t(main.title)}</a>
      </li>
    );
  }

  if (item && item.type === 'item') {
    title = item.title;
    itemBr = (
      <li className="breadcrumb-item">
        <a href={demo}>{t(title)}</a>
      </li>
    );

    if (item.breadcrumbs !== false) {
      breadcrumb = (
        <div className="page-header">
          <div className="page-block">
            <div className="row align-items-center">
              <div className="col-md-12">
                <div className="page-header-title">
                  {/* <h5 className="m-b-10">{title}</h5> */}
                </div>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/"><i className="feather icon-home" /></Link>
                  </li>
                  {mainBr}
                  {itemBr}
                </ul>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <>
      {breadcrumb}
    </>
  );
};

export default Breadcrumb;