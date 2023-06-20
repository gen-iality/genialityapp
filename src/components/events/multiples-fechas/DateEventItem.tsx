import { Button, Card, CardProps, Col, Row, Space, TimePicker, Typography } from 'antd';
import { DateRangeEvius } from '../hooks/useCustomDateEvent';
import moment from 'moment';
import * as IconsAntDesing from '@ant-design/icons';
import useDateFormat from '@/components/networking/hooks/useDateFormat';
import ClockTimeFourOutlineIcon from '@2fd/ant-design-icons/lib/ClockTimeFourOutline';

interface Props extends CardProps {
  date: DateRangeEvius;
  handledDelete: (idToDelete: string) => void;
}

const format = 'hh:mm A';

export const DateEventItem = ({ date, onClick, handledDelete, ...cardProps }: Props) => {
  const { dateFormat } = useDateFormat();
  return (
    <Card
      hoverable
      style={{borderRadius: 10/* , border: 'none' */}}
      {...cardProps}
      /* actions={[
        <Button type='text' icon={<IconsAntDesing.EditOutlined />} onClick={onClick} />,
        <Button type='text' icon={<IconsAntDesing.DeleteOutlined />} onClick={() => handledDelete(date.id)} />,
      ]} */
    >
      <Row gutter={[8, 8]}>
        <Card.Meta 
          avatar={
            <Space 
              size={0} 
              direction='vertical' 
              align='center'
            >
              <Typography.Text strong style={{textTransform: 'capitalize'}}>
                {dateFormat(date.start, 'MMM')}
              </Typography.Text>
              <Typography.Text strong style={{fontSize: 25}}>
                {dateFormat(date.start, 'DD')}
              </Typography.Text>
            </Space>
          }
          title={
            <Space size={4} wrap style={{paddingTop: 16}}>
              <ClockTimeFourOutlineIcon />
              <Typography.Text>{dateFormat(date.start, format)}</Typography.Text>
              <Typography.Text>-</Typography.Text>
              <Typography.Text>{dateFormat(date.end, format)}</Typography.Text>
            </Space>
          }
        />
        <Space wrap style={{paddingLeft: 45}}>
          <Button type='default' icon={<IconsAntDesing.EditOutlined />} onClick={onClick} />
          <Button danger type='default' icon={<IconsAntDesing.DeleteOutlined />} onClick={() => handledDelete(date.id)} />
        </Space>
        {/* <Col
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
        </Col> */}
      </Row>
    </Card>
  );
};
