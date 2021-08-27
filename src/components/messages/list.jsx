/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';
import API from '../../helpers/request';
import { Button, Row, Space, Typography } from 'antd';
import { ExclamationCircleOutlined, LineChartOutlined, ReloadOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router';

const { Text } = Typography;

function InvitationsList(props) {
  const { match, eventId } = props;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  useEffect(() => {
    (async function() {
      await getData();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    {
      title: '',
      key: '_id',
      render: (item) => (
        <Link
          to={{
            pathname: `${match.url}/detail/${item._id}`,
            state: { item: item},
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
          console.log("DATA GNAL==>",data)
          resolve(data.data);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  async function getData() {
    setLoading(true);
    const data = await fetchData();
    setData(data);
    setLoading(false);
  }

  return (
    <>
      <Row justify='space-between' style={{ paddingBottom: '20px' }}>
        <Space>
          <ExclamationCircleOutlined style={{ color: '#faad14' }} />
          <Text type='secondary'>La información en la tabla puede demorar un tiempo en reflejarse.</Text>
        </Space>
        <Space>
          <Button
            onClick={() => {
              history.push(`/event/${eventId}/dashboard`);
            }}
            shape='round'
            size='middle'
            type='ghost'
            icon={<LineChartOutlined style={{ fontSize: '16px' }} />}>
            Ver estadísticas
          </Button>
          <Button onClick={getData} shape='round' size='middle' type='primary' icon={<ReloadOutlined />}>
            Actualizar tabla
          </Button>
        </Space>
      </Row>
      <Table loading={loading} columns={columns} dataSource={data} />
    </>
  );
}

export default withRouter(InvitationsList);
