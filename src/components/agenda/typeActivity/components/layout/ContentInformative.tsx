;
import { Typography, Row, Col } from 'antd';
import { useEffect } from 'react';
import { useTypeActivity } from '../../../../../context/typeactivity/hooks/useTypeActivity';

interface propsOptions {
  title: string;
  description?: string;
  image: string;
}

const ContentInformative = ({ title, description, image }: propsOptions) => { 
  
  return (
    <Row justify='center' align='middle'>
      <Col span={8}>
        <Typography.Title level={3}>{title}</Typography.Title>
        <Typography.Paragraph>{description} </Typography.Paragraph>
      </Col>
      <Col span={8} style={{ textAlign: 'right' }}>
        <img src={image} style={{ objectFit: 'contain' }} width='400' />
      </Col>
    </Row>
  );
};

export default ContentInformative;
