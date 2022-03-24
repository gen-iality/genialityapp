;
import { Typography, Row, Col } from 'antd';
import { useEffect, useState } from 'react';
import { useTypeActivity } from '../../../../../context/typeactivity/hooks/useTypeActivity';

interface propsOptions {
  title: string;
  description?: string;
  image: string;
}

const ContentInformative = ({ title, description, image }: propsOptions) => {
  const [loading, setloading] = useState(true)

  return (
    <Row justify='space-around' align='middle' style={{ margin: '0px 40px 0px 40px' }}>
      <Col span={12}>
        <Typography.Title level={4}>{title}</Typography.Title>
        <Typography.Paragraph>{description} </Typography.Paragraph>
      </Col>
      <Col span={12} style={{ textAlign: 'right' }}>
        <img onLoad={() => setloading(false)} src={image} style={{ objectFit: 'contain', backgroundColor: loading ? '#F2F2F2' : 'transparent' }} width='400' />
      </Col>
    </Row>
  );
};

export default ContentInformative;
