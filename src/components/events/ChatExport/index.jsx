import React, { useEffect, useState } from 'react';
import { Tag, Spin, Popconfirm, Button, message, Modal, Row, Col, Tooltip } from 'antd';
import { QuestionCircleOutlined, ExclamationCircleOutlined, DeleteOutlined, DownloadOutlined, ReloadOutlined } from '@ant-design/icons';
import XLSX from 'xlsx';
import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/database';
import moment from 'moment';
import { getColumnSearchProps } from 'components/speakers/getColumnSearch';
import Header from 'antdComponents/Header';
import Table from 'antdComponents/Table';
import { handleRequestError } from '../../../helpers/utils';

var chatFirebase = app.initializeApp(
  {
    apiKey: 'AIzaSyD4_AiJFGf1nIvn9BY_rZeoITinzxfkl70',
    authDomain: 'chatevius.firebaseapp.com',
    databaseURL: 'https://chatevius.firebaseio.com',
    projectId: 'chatevius',
    storageBucket: 'chatevius.appspot.com',
    messagingSenderId: '114050756597',
    appId: '1:114050756597:web:53eada24e6a5ae43fffabc',
    measurementId: 'G-5V3L65YQKP',
  },
  'nameOfOtherApp'
);

const firestore = chatFirebase.firestore();

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
  function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Deciembre',
    ];
    var year = a.getYear() - 69;
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var time = date + ' ' + month + ' ' + year + ' ' + formatAMPM(hour, min);

    return time;
  }

  let [datamsjevent, setdatamsjevent] = useState([]);
  const [loading, setLoading] = useState(true);
  let [columnsData, setColumnsData] = useState({});

  const renderMensaje = (text, record) => (
    <Tooltip title={record.text} placement='topLeft'>
      <Tag color='#3895FA'>{record.text}</Tag>
    </Tooltip>
  );
  const renderFecha = (val, item) => <p>{moment(val).format('DD/MM/YYYY HH:mm')}</p>;
  const columns = [
    {
      title: 'usuario',
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
      ellipsis: true,
      sorter: (a, b) => a.hora.localeCompare(b.hora),
      ...getColumnSearchProps('hora', columnsData),
      render: renderFecha,
    },
  ];

  const exportFile = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    datamsjevent = datamsjevent.filter((item) => item.text.toLowerCase().indexOf('spam') === -1);
    const ws = XLSX.utils.json_to_sheet(datamsjevent);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Chat');
    XLSX.writeFile(wb, `chatEVENTO ${event.name}.xls`);
  };

  useEffect(() => {
    getChat();
  }, []);

  function getChat() {
    let datamessagesthisevent = [];

    firestore
      .collection('messagesevent_' + eventId)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let conversion = moment(doc.data().sortByDateAndTime).format('YYYY-MM-DD HH:mm:ss');

          let msjnew = {
            chatId: doc.id,
            name: doc.data().name,
            text: doc.data().text,
            hora: conversion,
          };
          datamessagesthisevent.push(msjnew);
        });
        setdatamsjevent(datamessagesthisevent);
        setLoading(false);
        // console.log("CHAT=>>",datamessagesthisevent)
      })
      .catch();
  }

  function deleteAllChat() {
    const loading = message.open({
      key: 'loading',
      type: 'loading',
      content: <> Por favor espere miestras borra la información..</>,
    });
    const eventID = eventId;
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
              await deleteSingleChat(eventID, item.chatId);
            });
            setdatamsjevent([]);
            setLoading(false);
          } catch (e) {
            message.destroy(loading.key);
            message.open({
              type: 'error',
              content: handleRequestError(e).message,
            });
          }
        };
        onHandlerRemove();
      },
    });
  }

  function deleteSingleChat(eventId, chatId) {
    return new Promise((resolve, reject) => {
      firestore
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
    const loading = message.open({
      key: 'loading',
      type: 'loading',
      content: <> Por favor espere miestras borra la información..</>,
    });
    const eventID = eventId;
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
            await deleteSingleChat(eventID, id);
            getChat();
            setLoading(false);
          } catch (e) {
            message.destroy(loading.key);
            message.open({
              type: 'error',
              content: handleRequestError(e).message,
            });
          }
        };
        onHandlerRemove();
      },
    });
  }

  return (
    <>
      <Header title={'Gestión de chats del evento'} />

      <Table
        header={columns}
        list={datamsjevent}
        loading={loading}
        /* exportData
        fileName={'ReportChats'} */
        actions
        remove={remove}
        titleTable={
          <>
            {datamsjevent && datamsjevent.length > 0 && (
              <Row gutter={[8, 8]} wrap>
                <Col>
                  <Button onClick={getChat} type='primary' icon={<ReloadOutlined />}>
                    Recargar
                  </Button>
                </Col>
                <Col>
                  <Button onClick={exportFile} type='primary' icon={<DownloadOutlined />}>
                    Exportar
                  </Button>
                </Col>
                <Col>
                  <Button onClick={deleteAllChat} type='danger' icon={<DeleteOutlined />}>
                    Eliminar Chat
                  </Button>
                </Col>
              </Row>
            )}
          </>
        }
        search
        setColumnsData={setColumnsData}
      />
      {/* <div className='column is-narrow has-text-centered export button-c is-centered'>
        <button onClick={(e) => exportFile(e)} className='button is-primary' style={{ marginRight: 80 }}>
          <span className='icon'>
            <i className='fas fa-download' />
          </span>
          <span className='text-button'>Exportar</span>
        </button>
        <Popconfirm
          title='¿Está seguro que desea eliminar el chat de forma permanente?'
          onConfirm={deleteAllChat}
          okText='Si'
          cancelText='No'
          style={{ width: '170px' }}
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}>
          <Button danger>
            <span className='icon'>
              <i className='fas fa-trash' />
            </span>
            <span className='text-button'>Eliminar Chat</span>
          </Button>
        </Popconfirm>
      </div>
      {loading ? <Spin /> : <TableA columns={columns} dataSource={datamsjevent} />} */}
    </>
  );
};

export default ChatExport;
