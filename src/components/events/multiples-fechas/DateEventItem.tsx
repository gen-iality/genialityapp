import { Button, Card, CardProps, Col, Row, Space, TimePicker, Typography } from 'antd';
import { DateRangeEvius } from '../hooks/useCustomDateEvent';
import moment from 'moment';
import * as IconsAntDesing from '@ant-design/icons';

interface Props extends CardProps {
  date: DateRangeEvius;
  handledDelete: (idToDelete: string) => void;
}

const format = 'hh:mm A';

export const DateEventItem = ({ date, onClick, handledDelete, ...cardProps }: Props) => {
  return (
    <Card
      hoverable
      {...cardProps}
      actions={[
        <Button type='text' icon={<IconsAntDesing.EditOutlined />} onClick={onClick} />,
        <Button type='text' icon={<IconsAntDesing.DeleteOutlined />} onClick={() => handledDelete(date.id)} />,
      ]}>
      <Row gutter={[10, 2]}>
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
            <Typography
              style={{
                textAlign: 'center',
              }}>
              {moment(date.start, format).format(format)}
            </Typography>
            <Typography
              style={{
                textAlign: 'center',
              }}>
              {moment(date.end, format).format(format)}
            </Typography>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};
