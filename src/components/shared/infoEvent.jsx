import React from 'react';
import { UseEventContext } from '../../Context/eventContext';
import { Affix, Divider, PageHeader, Space, Typography } from 'antd';
import Moment from 'moment';
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';

const InfoEvent = () => {
  let cEvent = UseEventContext();
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
      }>
      <Paragraph style={{ fontSize: '21px', fontWeight: 'bolder', marginBottom: '-10px' }}>
        {cEvent.value.name}
      </Paragraph>
    </PageHeader>
  );
};

export default InfoEvent;
