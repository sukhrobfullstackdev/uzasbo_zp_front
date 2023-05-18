import { notification } from 'antd';

const openSuccessNotification = (type, msg) => {
  notification[type]({
    message: msg,
  });
};

const openWarningNotification = (type, msg) => {
  notification[type]({
    message: msg,
  });
};

const Notification = (type, msg) => {
  notification[type]({
    message: msg.toString(),
  });
};

export { openSuccessNotification, openWarningNotification, Notification }