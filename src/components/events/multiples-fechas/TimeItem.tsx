import React from 'react';
import { Col, Row, Space, TimePicker, Typography } from 'antd';
import { DateRangeEvius } from '../hooks/useCustomDateEvent';
import moment from 'moment';

interface Props {
  date: DateRangeEvius;
  handleUpdateTime: (dateKey: string, type: 'start' | 'end', value: moment.Moment | null, dateString: string) => void;
}

const format = 'HH:mm';

export const TimeItem = ({ date, handleUpdateTime }: Props) => {
  return (
    <Row>
      <Col
        span={6}
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
        }}>
        <Typography
          style={{
            textAlign: 'center',
          }}>
          {date.start.getDate()}
        </Typography>
        <Typography
          style={{
            textAlign: 'center',
          }}>
          {date.start.toLocaleString('default', { month: 'long' })}
        </Typography>
      </Col>
      <Col span={18}>
        <Space wrap>
          {/*  <Typography>{new Date(date.start).toLocaleDateString('es-CO')}</Typography> */}
          <TimePicker
            defaultValue={moment(date.start, format)}
            format={format}
            //@ts-ignore
            onChange={(value, dateString) => handleUpdateTime(date.id, 'start', value, dateString)}
            minuteStep={5}
            use12Hours
            allowClear={false}
          />
          <TimePicker
            defaultValue={moment(date.end, format)}
            format={format}
            //@ts-ignore
            onChange={(value, dateString) => handleUpdateTime(date.id, 'end', value, dateString)}
            minuteStep={5}
            use12Hours
            allowClear={false}
          />
        </Space>
      </Col>
    </Row>
  );
};
