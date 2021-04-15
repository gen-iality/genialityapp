/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';
import API from '../../helpers/request';

function InvitationsList(props) {
  const { match, eventId } = props;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async function() {
      setLoading(true);
      const data = await fetchData();
      setData(data);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    {
      title: '',
      key: 'action',
      render: (item) => (
        <Link
          to={{
            pathname: `${match.url}/detail`,
            state: { item: item, users: item.message_users },
          }}>
          <FaEye />
        </Link>
      ),
    },
    {
      title: 'Asunto',
      dataIndex: 'subject',
      key: 'subject',
      render: (text) => <span>{text}</span>,
    },
    {
      title: '# Correos',
      dataIndex: 'number_of_recipients',
      key: 'recipients',
      render: (text) => <div style={{ textAlign: 'center' }}>{text}</div>,
    },
    {
      title: 'Entregados',
      dataIndex: 'total_delivered',
      key: 'sent',
      render: (text) => <div style={{ textAlign: 'center' }}>{text}</div>,
    },
    {
      title: 'Rebotados',
      dataIndex: 'total_bounced',
      key: 'bounced',
      render: (text) => <div style={{ textAlign: 'center' }}>{text}</div>,
    },
    {
      title: 'Abiertos',
      dataIndex: 'total_opened',
      key: 'opened',
      render: (text) => <div style={{ textAlign: 'center' }}>{text}</div>,
    },
    {
      title: 'Clicked',
      dataIndex: 'total_clicked',
      key: 'clicked',
      render: (text) => <div style={{ textAlign: 'center' }}>{text}</div>,
    },
  ];
  function fetchData() {
    return new Promise((resolve, reject) => {
      API.get(`/api/events/${eventId}/messages`)
        .then(({ data }) => {
          resolve(data.data);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  return (
    <>
      <Table loading={loading} columns={columns} dataSource={data} />
    </>
  );
}

export default withRouter(InvitationsList);
