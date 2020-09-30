import React from 'react';
import { Row, Col, Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';

export default function PartnerDetail({ company, handleClosePartnerDetail }) {
  return (
    <div>
      <Row justify='start' style={{ marginBottom: '15px' }}>
        <Col>
          <Button onClick={handleClosePartnerDetail}>
            <LeftOutlined style={{ fontSize: '16px' }} />
          </Button>
        </Col>
      </Row>
      <div className='name-parner'>
        <h1 style={{ fontWeight: '300', fontSize: '30px', textAlign: 'left' }}>{company.name}</h1>
      </div>

      <Row justify='center'>
        <img src={company.list_image} alt='img-logo-parner' style={{ width: '100%' }} />
      </Row>
      <Row justify='start'>
        <div
          style={{ textAlign: 'left', marginTop: '20px' }}
          dangerouslySetInnerHTML={{ __html: company.description }}
        />
      </Row>
    </div>
  );
}
