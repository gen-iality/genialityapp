import React from 'react';
import { Row, Col, Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import ReactPlayer from 'react-player';
// https://youtu.be/d6ssSYyld4o

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
      <Row justify='start'>
        <Col span={20} offset={2}>
          <div className='name-parner'>
            <h1 style={{ fontWeight: '700', fontSize: '50px', borderBottom: '2px solid' }}>{company.name}</h1>
          </div>

          {company.list_image && (
            <Row justify='center'>
              <img src={company.list_image} alt='img-logo-parner' style={{}} />
            </Row>
          )}


          <div
            style={{ textAlign: 'left', marginTop: '20px' }}
            dangerouslySetInnerHTML={{ __html: company.description }}
          />
        </Col>

      </Row>
    </div>
  );
}
