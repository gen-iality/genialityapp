import { CalendarOutlined, ClockCircleOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { Button, PageHeader, Space, Typography } from 'antd';
import Moment from 'moment';
import { UseEventContext } from '../../context/eventContext';
import EventAccessActionContainer from './eventAccessAction/EventAccessActionContainer';

const InfoEvent = ({ paddingOff, preview }) => {
  let isPreview = preview ? true : false;
  let cEvent = UseEventContext();
  let cEventValues = cEvent.value;

  const bgColor = cEventValues?.styles?.toolbarDefaultBg;
  const textColor = cEventValues?.styles?.textMenu;

  return (
    <PageHeader
      style={{
        paddingLeft: paddingOff ? '' : '30px',
        paddingRight: paddingOff ? '' : '30px',
        paddingTop: '10px',
        paddingBottom: '20px',
        margin: paddingOff ? '' : '20px',
        borderRadius: '20px',
        backgroundColor: bgColor,
      }}
      title={
        <Typography.Title level={4} style={{ color: textColor }}>
          {cEventValues?.name}
        </Typography.Title>
      }
      extra={
        !isPreview ? (
          <EventAccessActionContainer />
        ) : (
          <Button type='primary' size='large'>
            Incribirme al evento
          </Button>
        )
      }
      footer={
        <Space wrap size={'large'} style={{ color: textColor }}>
          <Space wrap>
            <Space>
              <CalendarOutlined />
              <time>{Moment(cEventValues?.datetime_from).format('ll')}</time>
            </Space>
            <Space>
              <ClockCircleOutlined />
              <time>{Moment(cEventValues?.datetime_from).format('LT')}</time>
            </Space>
          </Space>

          <Space wrap>
            <Space>
              <CalendarOutlined />
              <time>{Moment(cEventValues?.datetime_to).format('ll')}</time>
            </Space>
            <Space>
              <ClockCircleOutlined />
              <time>{Moment(cEventValues?.datetime_to).format('LT')}</time>
            </Space>
          </Space>
          {cEventValues?.type_event !== 'onlineEvent' && (
            <Space>
              <EnvironmentOutlined />
              <Space wrap split='/'>
                <Typography.Text style={{ color: textColor }}>{cEventValues?.address}</Typography.Text>
                <Typography.Text style={{ color: textColor }} italic>
                  {cEventValues?.venue}
                </Typography.Text>
              </Space>
            </Space>
          )}
        </Space>
      }></PageHeader>
  );
};

export default InfoEvent;
