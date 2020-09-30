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
      <div className='name-parner'>
        <h1 style={{ fontWeight: '300', fontSize: '30px', textAlign: 'left' }}>{company.name}</h1>
      </div>

      {company.list_image && (
        <Row justify='center'>
          <img src={company.list_image} alt='img-logo-parner' style={{ width: '100%' }} />
        </Row>
      )}
      <Row justify='center'>
        {company.video_url && (
          <ReactPlayer
            width={'100%'}
            style={{
              display: 'block',
              margin: '0 auto',
            }}
            url={company.video_url}
            //url="https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/eviuswebassets%2FLa%20asamblea%20de%20copropietarios_%20una%20pesadilla%20para%20muchos.mp4?alt=media&token=b622ad2a-2d7d-4816-a53a-7f743d6ebb5f"
            controls
          />
        )}
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
