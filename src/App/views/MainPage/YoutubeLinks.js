import React from 'react';
import { useTranslation } from 'react-i18next';
import { YoutubeOutlined } from '@ant-design/icons';

import classes from './MainPage.module.css'
import Card from '../../components/MainCard';

const Youtube = () => {
  const { t } = useTranslation();

  return (
    <Card title={t("videoLinks")}>
      <ul>
        <li>
          <a href='https://www.youtube.com/watch?v=YGL98FZC9IY' target='_blank' className={classes.link}>
            {t('verifyEmps')}&nbsp;<YoutubeOutlined className={classes['video-icon']} />
          </a>
        </li>
        {/* <li>
          <a href='https://www.youtube.com/watch?v=YGL98FZC9IY' target='_blank' className={classes.link}>
            Xodimni verifikatsiyadan o`tkazish&nbsp;<YoutubeOutlined className={classes['video-icon']} />
          </a>
        </li> */}
      </ul>
    </Card>
  );
};

export default Youtube;