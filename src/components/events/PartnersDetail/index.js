import React from 'react';
import { Row, Col, Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import ReactPlayer from 'react-player';
// https://youtu.be/d6ssSYyld4o

export default function PartnerDetail({ company, handleClosePartnerDetail }) {
  console.log("company")
  console.log(company)
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

          <div style={{ marginTop:"5vh",fontSize: "120%",fontWeight: "bold"}}>Video promocional de la empresa</div>         

         {company.video_url && <div className='column is-centered mediaplayer'>
              <ReactPlayer
                width={'100%'}
                height={'40vw'}
                style={{
                  marginTop:'0px',
                  display: 'block',
                  margin: '0 auto',
                }}
                url={company.video_url}
                controls
              />
            </div>}


          <div
            style={{ textAlign: 'left', marginTop: '20px' }}
            dangerouslySetInnerHTML={{ __html: company.description }}
          />
        </Col>

      </Row>
    </div>
  );
}
