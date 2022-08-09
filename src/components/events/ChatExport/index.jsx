import { useEffect, useState } from 'react';
import { Tag, Button, Modal, Row, Col, Tooltip, Tabs, Badge } from 'antd';
import { ExclamationCircleOutlined, DeleteOutlined, DownloadOutlined, ReloadOutlined } from '@ant-design/icons';
import { utils, writeFileXLSX } from 'xlsx';
import dayjs from 'dayjs';
import { getColumnSearchProps } from '../../../components/speakers/getColumnSearch';
import Table from '../../../antdComponents/Table';
import { handleRequestError } from '../../../helpers/utils';
import { firestoreeviuschat, firestore } from '../../../helpers/firebase';
import AccountCancel from '@2fd/ant-design-icons/lib/AccountCancel';
import Account from '@2fd/ant-design-icons/lib/Account';
import { DispatchMessageService } from '../../../context/MessageService';
import { useHelper } from '@/context/helperContext/hooks/useHelper';
import { UseEventContext } from '@/context/eventContext';

const { TabPane } = Tabs;

function formatAMPM(hours, minutes) {
  // var hours = date.getHours();
  // var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

const ChatExport = ({ eventId, event }) => {
  let [datamsjevent, setdatamsjevent] = useState([]);
  const [loading, setLoading] = useState(true);
  let [columnsData, setColumnsData] = useState({});
  let [listUsersBlocked, setlistUsersBlocked] = useState([]);
  let cEvent = UseEventContext();
  const { eventIsActive } = useHelper();

  const renderMensaje = (text, record) => (
    <Tooltip title={record.text} placement='topLeft'>
      <Tag color='#3895FA'>{record.text}</Tag>
    </Tooltip>
  );
  const renderFecha = (val, item) => <p>{dayjs(val).format('DD/MM/YYYY HH:mm')}</p>;
  const columns = [
    {
      title: 'Usuario',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      sorter: (a, b) => a.name.localeCompare(b.name),
      ...getColumnSearchProps('name', columnsData),
    },

    {
      title: 'Mensaje',
      key: 'text',
      dataIndex: 'text',
      ellipsis: true,
      sorter: (a, b) => a.text.localeCompare(b.text),
      ...getColumnSearchProps('text', columnsData),
      render: renderMensaje,
    },
    {
      title: 'Fecha',
      dataIndex: 'hora',
      key: 'hora',
      width: 150,
      ellipsis: true,
      sorter: (a, b) => a.hora.localeCompare(b.hora),
      ...getColumnSearchProps('hora', columnsData),
      render: renderFecha,
    },
  ];

  const columnsUserBlocked = [
    {
      title: 'Usuario',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      sorter: (a, b) => a.name.localeCompare(b.name),
      ...getColumnSearchProps('name', columnsData),
    },
    {
      title: 'Email',
      key: 'email',
      dataIndex: 'email',
      ellipsis: true,
      sorter: (a, b) => a.email.localeCompare(b.email),
      ...getColumnSearchProps('email', columnsData),
    },
    /* {
      title: 'Estatus',
      key: 'blocked',
      dataIndex: 'blocked',
      ellipsis: true,
      width: 100,
      render(val, item) {
        return (
          <p>Bloqueado</p>
        )
      }
    }, */
  ];

  const exportFile = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    datamsjevent = datamsjevent.filter((item) => item.text.toLowerCase().indexOf('spam') === -1);
    const ws = utils.json_to_sheet(datamsjevent);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Chat');
    writeFileXLSX(wb, `chatEVENTO ${event.name}.xls`);
  };

  useEffect(() => {
    getChat();
    getBlocketdUsers();
  }, []);

  function getChat() {
    let datamessagesthisevent = [];

    firestoreeviuschat
      .collection('messagesevent_' + eventId)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let conversion = dayjs(doc.data().sortByDateAndTime).format('YYYY-MM-DD HH:mm:ss');
          let msjnew = {
            chatId: doc.id,
            name: doc.data().name,
            text: doc.data().text,
            hora: conversion,
            idparticipant: doc.data().idparticipant,
          };
          datamessagesthisevent.push(msjnew);
        });
        setdatamsjevent(datamessagesthisevent);
        setLoading(false);
      })
      .catch();
  }

  function getBlocketdUsers() {
    let list = [];
    let path = cEvent.value._id + '_event_attendees/';

    setLoading(true);
    firestore
      .collection(path)
      .where('blocked', '==', true)
      .get()
      .then((res) => {
        res.forEach((user) => {
          let newUser = {
            name: user.data().user.names,
            email: user.data().user.email,
            idparticipant: user.data()._id,
            blocked: user.data().blocked,
          };
          list.push(newUser);
        });
        setlistUsersBlocked(list);
        setLoading(false);
      }).catch;
  }

  function deleteAllChat() {
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: ' Por favor espere mientras se borra la información...',
      action: 'show',
    });
    Modal.confirm({
      title: `¿Está seguro de eliminar la información?`,
      icon: <ExclamationCircleOutlined />,
      content: 'Una vez eliminado, no lo podrá recuperar',
      okText: 'Borrar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk() {
        const onHandlerRemove = async () => {
          try {
            setLoading(true);
            datamsjevent.forEach(async (item) => {
              await deleteSingleChat(eventId, item.chatId);
            });
            setdatamsjevent([]);
            setLoading(false);
            DispatchMessageService({
              key: 'loading',
              action: 'destroy',
            });
            DispatchMessageService({
              type: 'success',
              msj: 'Se eliminó la información correctamente!',
              action: 'show',
            });
          } catch (e) {
            DispatchMessageService({
              key: 'loading',
              action: 'destroy',
            });
            DispatchMessageService({
              type: 'error',
              msj: handleRequestError(e).message,
              action: 'show',
            });
          }
        };
        onHandlerRemove();
      },
    });
  }

  function deleteSingleChat(eventId, chatId) {
    return new Promise((resolve, reject) => {
      firestoreeviuschat
        .collection('messagesevent_' + eventId)
        .doc(chatId)
        .delete()
        .then(() => {
          resolve('Delete chat', chatId);
        })
        .catch((error) => {
          reject('Error deleting chat: ', error);
        });
    });
  }

  function remove(id) {
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: ' Por favor espere mientras se borra la información...',
      action: 'show',
    });
    Modal.confirm({
      title: `¿Está seguro de eliminar la información?`,
      icon: <ExclamationCircleOutlined />,
      content: 'Una vez eliminado, no lo podrá recuperar',
      okText: 'Borrar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk() {
        const onHandlerRemove = async () => {
          try {
            setLoading(true);
            await deleteSingleChat(eventId, id);
            getChat();
            setLoading(false);
            DispatchMessageService({
              key: 'loading',
              action: 'destroy',
            });
            DispatchMessageService({
              type: 'success',
              msj: 'Se eliminó la información correctamente!',
              action: 'show',
            });
          } catch (e) {
            DispatchMessageService({
              key: 'loading',
              action: 'destroy',
            });
            DispatchMessageService({
              type: 'error',
              msj: handleRequestError(e).message,
              action: 'show',
            });
          }
        };
        onHandlerRemove();
      },
    });
  }

  function blockUser(item) {
    let path = cEvent.value._id + '_event_attendees/' + item.idparticipant;

    let searchDataUser = new Promise((resolve, reject) => {
      firestore
        .doc(path)
        .get()
        .then((res) => {
          resolve({ status: 200, data: res.data().blocked });
        });
    });

    searchDataUser.then((res) => {
      let userBlocked = res.data;
      DispatchMessageService({
        type: 'loading',
        key: 'loading',
        msj: `Por favor espere mientras ${userBlocked ? 'desbloquea' : 'bloquea'} el usuario del chat...`,
        action: 'show',
      });
      Modal.confirm({
        title: `¿Está seguro de ${userBlocked ? 'desbloquear' : 'bloquear'} usuario para el chat?`,
        icon: <ExclamationCircleOutlined />,
        content: `${userBlocked ? 'Una vez desbloqueado puede bloquearlo' : 'Una vez bloqueado puede desbloquearlo'}`,
        okText: `${userBlocked ? 'Desbloquear' : 'Bloquear'}`,
        okType: 'danger',
        cancelText: 'Cancelar',
        onOk() {
          const onHandlerBlock = async () => {
            try {
              setLoading(true);
              //Código de bloqueo
              //let path = cEvent.value._id + '_event_attendees/' + item.idparticipant;
              await firestore
                .doc(path)
                .update({
                  blocked: !userBlocked,
                })
                .then((res) => {
                  DispatchMessageService({
                    key: 'loading',
                    action: 'destroy',
                  });
                  DispatchMessageService({
                    type: 'success',
                    msj: `${userBlocked ? 'Usuario desbloqueado' : 'Usuario bloqueado'}`,
                    action: 'show',
                  });
                });
              getChat();
              getBlocketdUsers();
              setLoading(false);
            } catch (e) {
              DispatchMessageService({
                key: 'loading',
                action: 'destroy',
              });
              DispatchMessageService({
                type: 'error',
                msj: handleRequestError(e).message,
                action: 'show',
              });
            }
          };
          onHandlerBlock();
        },
      });
    });
  }

  return (
    <Tabs defaultActiveKey='1' onChange={(getChat, getBlocketdUsers)}>
      <TabPane tab='Gestión de chats del evento' key='1'>
        {/* <Header title={'Gestión de chats del evento'} /> */}

        <Table
          header={columns}
          list={datamsjevent}
          loading={loading}
          actions
          remove={remove}
          extraFn={blockUser}
          extraFnTitle={'Bloquear usuarios'}
          extraFnType={'ghost'}
          extraFnIcon={<AccountCancel />}
          titleTable={
            <Row gutter={[8, 8]} wrap>
              <Col>
                <Button onClick={getChat} type='primary' icon={<ReloadOutlined />}>
                  Recargar
                </Button>
              </Col>
              <Col>
                {datamsjevent && datamsjevent.length > 0 && (
                  <Button onClick={exportFile} type='primary' icon={<DownloadOutlined />}>
                    Exportar
                  </Button>
                )}
              </Col>
              <Col>
                {datamsjevent && datamsjevent.length > 0 && (
                  <Button
                    onClick={deleteAllChat}
                    type='danger'
                    icon={<DeleteOutlined />}
                    disabled={!eventIsActive && window.location.toString().includes('eventadmin')}>
                    Eliminar Chat
                  </Button>
                )}
              </Col>
            </Row>
          }
          search
          setColumnsData={setColumnsData}
        />
      </TabPane>
      <TabPane
        tab={
          <Badge count={listUsersBlocked.length} offset={[8, 0]}>
            Usuarios bloqueados
          </Badge>
        }
        key='2'>
        <Table
          header={columnsUserBlocked}
          list={listUsersBlocked}
          loading={loading}
          actions
          extraFn={blockUser}
          extraFnTitle={'Desbloquear usuario'}
          extraFnType={'ghost'}
          extraFnIcon={<Account />}
          exportData
          fileName={'Usuarios Bloqueados'}
          titleTable={
            <Row gutter={[8, 8]} wrap>
              <Col>
                <Button onClick={getBlocketdUsers} type='primary' icon={<ReloadOutlined />}>
                  Recargar
                </Button>
              </Col>
            </Row>
          }
          search
          setColumnsData={setColumnsData}
        />
      </TabPane>
    </Tabs>
  );
};

export default ChatExport;
