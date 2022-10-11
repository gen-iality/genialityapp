import HCOActividad from '@/components/events/AgendaActividadDetalle/HOC_Actividad';
import { UseEventContext } from '@/context/eventContext';
import { getCorrectColor, randomColor } from '@/helpers/utils';
import { Avatar, Badge, Card, Col, Image, Row, Space, Tag, Typography } from 'antd';
import ReactPlayer from 'react-player';
import { orderedDemonstratedBallots } from '../functions';
import { BallotHistoryInterface } from '../interfaces/bingo';

const { Title } = Typography;

const BallotHistory = ({ demonstratedBallots = [], mediaUrl, renderingInCms }: BallotHistoryInterface) => {
  console.log('🚀 ~ file: BallotHistory.tsx ~ line 12 ~ BallotHistory ~ demonstratedBallots', demonstratedBallots);
  const cEvent = UseEventContext();

  const ballotsAnnounced = (numberBallots: number): string | number => {
    if (numberBallots === 1) {
      return `${numberBallots} balota`;
    } else if (numberBallots > 1) {
      return `${numberBallots} balotas`;
    } else {
      return 0;
    }
  };

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
    </Card>
  );
};

export default BallotHistory;
