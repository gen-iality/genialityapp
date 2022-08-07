import * as React from 'react';
import { useState, useEffect } from 'react';

import {
  Row,
  Col,
  Typography,
} from 'antd';

import { FormStructure } from '@context/activityType/types/activityType';

const {
  Title,
  Paragraph,
} = Typography;

export interface FullActivityTypeInfoLayoutProps {
  form: FormStructure,
  onLoaded: () => void,
};

function FullActivityTypeInfoLayout(props: FullActivityTypeInfoLayoutProps) {
  const {
    form: {
      description,
      image,
      title,
    },
    onLoaded,
  } = props;

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => onLoaded(), []);

  return (
    <Row justify='space-around' align='middle' style={{ margin: '0px 40px 0px 40px' }}>
      <Col span={12}>
        <Title level={4}>{title}</Title>
        <Paragraph>{description} </Paragraph>
      </Col>
      <Col span={12} style={{ textAlign: 'right' }}>
        <img
          onLoad={() => setIsLoading(false)}
          src={image}
          style={{ objectFit: 'contain', backgroundColor: isLoading ? '#F2F2F2' : 'transparent' }}
          width='400'
        />
      </Col>
    </Row>
  );
}

export default FullActivityTypeInfoLayout;
