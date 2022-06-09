import { withRouter } from 'react-router-dom';
import { MessageApi } from '../../helpers/request';
import { Button, Row, Col, Space, Typography } from 'antd';
import { ExclamationCircleOutlined, LineChartOutlined, BarsOutlined, ReloadOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router';
import CMS from '../newComponent/CMS';

const { Text } = Typography;

function InvitationsList(props) {
  const { match, eventId } = props;

  const history = useHistory();

  const columns = [
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
    {
      title: 'Enviado',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => <span>{text} </span>,
    },
  ];

  return (
    <>
      <CMS 
        API={MessageApi}
        eventId={props.eventId}
        title={'Comunicaciones enviadas'}
        description={(
          <Space>
            <ExclamationCircleOutlined style={{ color: '#faad14' }} />
            <Text type='secondary'>La información en la tabla puede demorar un tiempo en reflejarse.</Text>
          </Space>
        )}
        columns={columns}
        actions
        noRemove
        extraPath={`${match.url}/detail`}
        extraPathIcon={<BarsOutlined />}
        extraPathTitle={'Detalle'}
        extraPathUpdate={<ReloadOutlined />}
        extraPathUpdateTitle={'Actualizar métricas'}
        exportData
        fileName={'ComunicacionesEnviadas'}
        titleTable={(
          <Row gutter={[8, 8]} wrap>
            <Col>
              <Button
                onClick={() => {
                  history.push(`/eventadmin/${eventId}/dashboard`);
                }}
                type='ghost'
                icon={<LineChartOutlined />}>
                Ver estadísticas
              </Button>
            </Col>
          </Row>
        )}
      />
    </>
  );
}

export default withRouter(InvitationsList);
