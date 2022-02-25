import React, { useContext } from 'react';
import { UseEventContext } from '../../Context/eventContext';
import { Affix, Button, Divider, PageHeader, Space, Typography } from 'antd';
import Moment from 'moment';
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { HelperContext } from '../../Context/HelperContext';
import { UseUserEvent } from '../../Context/eventUserContext';
import { UseCurrentUser } from '../../Context/userContext';

const InfoEvent = () => {
  let cEvent = UseEventContext();
  let { handleChangeTypeModal } = useContext(HelperContext);
  const cEventUser = UseUserEvent();
  const cUser = UseCurrentUser();
  console.log('%c🆗 - Mensaje', 'color: #00A6ED;', cUser);
  const { Paragraph } = Typography;
  return (
    <PageHeader
      style={{
        paddingLeft: '30px',
        paddingRight: '30px',
        paddingTop: '10px',
        paddingBottom: '20px',
        margin: '20px',
        borderTop: `5px solid ${cEvent.value.styles.toolbarDefaultBg}`,
        borderRadius: '20px',
        backgroundColor: 'white',
      }}
      title={cEvent.value.name}
      extra={
        cUser?.value !== null &&
        cEventUser?.value === null && (
          <Button onClick={() => handleChangeTypeModal('registerForTheEvent')} type='primary' size='large'>
            Inscribirme al evento
          </Button>
        )
      }
      footer={
        <Space>
          <Space wrap>
            <Space>
              <CalendarOutlined />
              <time>{Moment(cEvent.value.datetime_from).format('ll')}</time>
            </Space>
            <Space>
              <ClockCircleOutlined />
              <time>{Moment(cEvent.value.datetime_from).format('LT')}</time>
            </Space>
          </Space>
          <Divider type='vertical'></Divider>
          <Space wrap>
            <Space>
              <CalendarOutlined />
              <time>{Moment(cEvent.value.datetime_to).format('ll')}</time>
            </Space>
            <Space>
              <ClockCircleOutlined />
              <time>{Moment(cEvent.value.datetime_to).format('LT')}</time>
            </Space>
          </Space>
        </Space>
      }></PageHeader>
  );
};

export default InfoEvent;
