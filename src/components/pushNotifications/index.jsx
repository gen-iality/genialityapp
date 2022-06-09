import { useState, useEffect } from 'react';
import Header from '../../antdComponents/Header';
import Table from '../../antdComponents/Table';
import { Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { UsersApi } from '../../helpers/request';
import { getColumnSearchProps } from '../speakers/getColumnSearch';
import ModalNotifications from './modalNotificacions';

function pushNotification(props) {
  const { _id: eventId, name: eventName } = props.event;
  let [columnsData, setColumnsData] = useState({});
  let [isLoading, setIstloading] = useState(true);
  const [listUsersWithNotifications, setListUsersWithNotifications] = useState([]);
  const [modalSendNotificationVisible, setModalSendNotificationVisible] = useState(false);
  const [userToNotify, setUserToNotify] = useState(false);

  async function usersWithNotificationsEnabled() {
    let { data } = await UsersApi.getAll(eventId);
    if (data) {
      const list = [];
      data.forEach(function(data) {
        list.push({ ...data.properties, _id: data._id });
      });
      const fiteredList = list.filter((userList) => userList.token);
      setListUsersWithNotifications(fiteredList);
      setIstloading(false);
    }
  }

  useEffect(() => {
    usersWithNotificationsEnabled();
  }, []);

  const notifyEveryoneButton = (
    <Button
      type='primary'
      onClick={() => {
        setUserToNotify();
        setModalSendNotificationVisible(true);
      }}
      icon={<SendOutlined />}>
      Notificación masiva
    </Button>
  );

  function extraField(params) {
    setUserToNotify(params);
    setModalSendNotificationVisible(true);
  }

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      ...getColumnSearchProps('name', columnsData),
    },
    {
      title: 'Correo',
      dataIndex: 'email',
      ...getColumnSearchProps('email', columnsData),
    },
  ];

  return (
    <>
      {modalSendNotificationVisible && (
        <ModalNotifications
          modalSendNotificationVisible={modalSendNotificationVisible}
          setModalSendNotificationVisible={setModalSendNotificationVisible}
          data={userToNotify || listUsersWithNotifications}
          eventName={eventName}
        />
      )}
      <Header
        title={'Push notifications'}
        titleTooltip={'Envíe notificaciones push a dispositivos móviles que tenga instalada la app de evius'}
        description={'Se listan solo los usuarios con la app de evius o truni instalada en su dispositivo móvil'}
        extra={notifyEveryoneButton}
      />
      <Table
        key='index'
        list={listUsersWithNotifications}
        header={columns}
        setColumnsData={setColumnsData}
        loading={isLoading}
        search
        actions
        extraFn={extraField}
        extraFnIcon={<SendOutlined />}
        extraFnTitle='Enviar notificación a este usuario'
      />
    </>
  );
}

export default pushNotification;
