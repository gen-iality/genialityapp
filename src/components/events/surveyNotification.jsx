import { useState } from 'react';
import { Button, notification, Drawer } from 'antd';

let surveyNotification = () => {
  let [drawerVisible, setDrawerVisible] = useState(false);

  // función que abre el drawer
  function clearStates(visible) {
    setDrawerVisible(visible);
  }

  // función que cierra el notificación
  const close = () => {};

  function surveyVisible(key, visible) {
    notification.close(key);
    clearStates(visible);
  }

  // Esta funcion construye la notificación.

  const openNotification = () => {
    const key = `open${Date.now()}`;
    const btn = (
      <Button type='primary' size='small' onClick={() => surveyVisible(key, true)}>
        Contestar
      </Button>
    );
    notification.open({
      message: 'Encuesta en vivo',
      description: 'Se encuentra activa la encuesta',
      btn,
      key,
      duration: 0,
      onClose: close,
    });
  };

  return (
    <>
      <Button type='primary' onClick={openNotification}>
        Open Notification
      </Button>

      <Drawer
        zIndex={1000}
        title='Basic Drawer'
        placement='right'
        closable={true}
        onClose={() => clearStates()}
        visible={drawerVisible}></Drawer>
    </>
  );
};

export default surveyNotification;
