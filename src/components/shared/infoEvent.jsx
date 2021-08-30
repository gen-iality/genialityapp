import React from 'react';
import { UseEventContext } from '../../Context/eventContext';
import { PageHeader, Space, Typography } from 'antd';
import Moment from 'moment';
import { CalendarOutlined } from '@ant-design/icons';

const InfoEvent = () => {
  let cEvent = UseEventContext();
  const { Paragraph } = Typography;

  return (
    <PageHeader
    style={{paddingBottom:'10px'}}
      footer={
        <Space>
          <CalendarOutlined />
          <time dateTime={cEvent.value.datetime_from}>{Moment(cEvent.value.datetime_from).format('llll')}</time>
          {'-'}
          <time dateTime={cEvent.value.datetime_from}>{Moment(cEvent.value.datetime_from).format('llll')}</time>
        </Space>
      }>
      <Paragraph style={{fontSize:'21px', fontWeight:'bolder', marginBottom:"-10px"}}>{cEvent.value.name}</Paragraph>
    </PageHeader>
  );
};

export default InfoEvent;
