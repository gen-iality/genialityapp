import React, { useEffect, useState } from 'react';
import { Table, Tag, Spin } from 'antd';
import XLSX from 'xlsx';
import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/database';
import { data } from 'jquery';

var otherApp = app.initializeApp(
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

const firestore = otherApp.firestore();

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
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + formatAMPM(hour, min);

    return time;
  }

  let [datamsjevent, setdatamsjevent] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: 'usuario',
      dataIndex: 'name',
      key: 'name',
    },

    {
      title: 'Mensaje',
      key: 'text',
      dataIndex: 'text',
      render: (text, record) => <Tag color='#3895FA'>{record.text}</Tag>,
    },
    {
      title: 'Fecha',
      dataIndex: 'hora',
      key: 'hora',
      render: (text) => <a>{text}</a>,
    },
  ];

  const exportFile = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // const attendees = [...this.state.users].sort((a, b) => b.created_at - a.created_at);

    // const data = await parseData2Excel(datamsjevent);
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
          let newtime = timeConverter(doc.data().timestamp);
          let msjnew = {
            chatId: doc.id,
            name: doc.data().name,
            text: doc.data().text,
            hora: newtime,
          };
          datamessagesthisevent.push(msjnew);
        });
        setdatamsjevent(datamessagesthisevent);
      })
      .catch((err) => {
        console.log('error firebase', err);
      });
  }

  function deleteAllChat() {
    datamsjevent.forEach(async (item) => {
      await deleteSingleChat(eventId, item.chatId);
    });
    setdatamsjevent([]);
    setLoading(false);
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

  return (
    <>
      <div className='column is-narrow has-text-centered export button-c is-centered'>
        <button
          onClick={() => {
            setLoading(true);
            deleteAllChat();
          }}
          className='button is-primary'
          style={{ marginRight: 80 }}>
          <span className='icon'>
            <i className='fas fa-trash' />
          </span>
          <span className='text-button'>Eliminar Chat</span>
        </button>
        <button onClick={(e) => exportFile(e)} className='button is-primary'>
          <span className='icon'>
            <i className='fas fa-download' />
          </span>
          <span className='text-button'>Exportar</span>
        </button>
      </div>
      {loading ? <Spin /> : <Table columns={columns} dataSource={datamsjevent} />}
    </>
  );
};

export default ChatExport;
