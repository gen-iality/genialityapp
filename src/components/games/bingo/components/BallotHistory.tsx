import HCOActividad from '@/components/events/AgendaActividadDetalle/HOC_Actividad';
import { UseEventContext } from '@/context/eventContext';
import { getCorrectColor } from '@/helpers/utils';
import { Avatar, Badge, Card, Col, Image, List, Row, Space, Tag, Typography } from 'antd';
import ReactPlayer from 'react-player';
import { ballotsAnnounced, orderedDemonstratedBallots } from '../functions';
import { BallotHistoryInterface } from '../interfaces/bingo';

const { Title } = Typography;

const BallotHistory = ({ demonstratedBallots = [], mediaUrl, renderingInCms }: BallotHistoryInterface) => {
  const cEvent = UseEventContext();



  /* console.log(
    'orderedDemonstratedBallots({ demonstratedBallots })',
    orderedDemonstratedBallots({ demonstratedBallots })
  ); */

  return (
    <Card
      bordered={renderingInCms}
      hoverable={renderingInCms}
      extra={
        <Badge
          style={{
            backgroundColor: cEvent.value?.styles?.toolbarDefaultBg,
            color: getCorrectColor(cEvent.value?.styles?.toolbarDefaultBg),
          }}
          count={ballotsAnnounced(demonstratedBallots.length)}></Badge>
      }
      title={
        renderingInCms ? (
          <Title level={5} type='secondary'>
            Balotas anunciadas
          </Title>
        ) : null
      }
      headStyle={{ border: 'none' }}
      bodyStyle={{
        width: '100%',
        height: renderingInCms ? '250px' : '200px',
        overflowY: 'auto',
        padding: renderingInCms ? '' : '5px',
      }}>
      {demonstratedBallots.length > 0 ? (
        <Space split={'-'} wrap>
          {orderedDemonstratedBallots({ demonstratedBallots }).map((item: any) =>
            item?.value?.toString().length <= 2 ? (
              <Avatar
                style={{
                  boxShadow: 'inset 0px 0px 20px rgba(0, 0, 0, 0.25)',
                  backgroundColor: cEvent.value?.styles?.toolbarDefaultBg,
                }}>
                <Typography.Text
                  strong
                  style={{
                    color: getCorrectColor(cEvent.value?.styles?.toolbarDefaultBg),
                  }}>
                  {item?.value}
                </Typography.Text>
              </Avatar>
            ) : (
              <>
                {item?.type === 'image' && (
                  <Image
                    preview={{ mask: 'Ver', maskClassName: 'borderRadius' }}
                    style={{ borderRadius: '10px', objectFit: 'cover' }}
                    width={50}
                    height={50}
                    src={item?.value}
                    alt={item?.value}
                  />
                )}
                {item.type !== 'image' && <Tag>{item?.value}</Tag>}
              </>
            )
          )}
          {/* Aqui agregamos el listado de balotas que ya se mostraron*/}
        </Space>
      ) : (
        <Row style={{ height: '100%' }} justify='center' align='top'>
          <Typography.Text style={{ width: '60%', textAlign: 'center' }}>
            Aquí encontraras un listado con las balotas que ya fueron anunciadas para que puedas verificar en tu cartón,
            sin embargo, ¡No te preocupes que tendrás realimentación permanente!
          </Typography.Text>
        </Row>
      )}

      {/*  <List
        dataSource={orderedDemonstratedBallots({ demonstratedBallots })}
        renderItem={(item: any, i) => (
          <List.Item>
            {item?.value?.toString().length <= 2 ? (
              <Avatar
                key={`${i}-demostratedballots`}
                style={{
                  boxShadow: 'inset 0px 0px 20px rgba(0, 0, 0, 0.25)',
                  backgroundColor: cEvent.value?.styles?.toolbarDefaultBg,
                }}>
                <Typography.Text
                  strong
                  style={{
                    color: getCorrectColor(cEvent.value?.styles?.toolbarDefaultBg),
                  }}>
                  {item?.value}
                </Typography.Text>
              </Avatar>
            ) : (
              <>
                {item?.type === 'image' && (
                  <Image
                    key={`${i}-demostratedballots`}
                    preview={{ mask: 'Ver', maskClassName: 'borderRadius' }}
                    style={{ borderRadius: '10px', objectFit: 'cover' }}
                    width={50}
                    height={50}
                    src={item?.value}
                    alt={item?.value}
                  />
                )}
                {item.type !== 'image' && <Tag>{item?.value}</Tag>}
              </>
            )}
          </List.Item>
        )}
      /> */}
    </Card>
  );
};

export default BallotHistory;
