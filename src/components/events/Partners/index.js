import React from 'react';
import { Button, Row, Col, Avatar, Card, Spin } from 'antd';
import useGetEventCompanies from '../../empresas/customHooks/useGetEventCompanies';

export default function Partners({ eventId }) {
  const [companies, loadingCompanies] = useGetEventCompanies(eventId);

  return (
    <Card title='Partners'>
      {companies.map((company, index) => {
        return (
          <>
            {loadingCompanies && <Spin />}
            <Card style={{ marginBottom: "12px" }}>
              <Row key={index} gutter={[16, 16]} justify='center' align='middle'>
                <Col xs={24} sm={24} md={12} lg={6} xl={6} xxl={6}>
                  <Avatar src={company.list_image} size={100}></Avatar>
                </Col>
                <Col
                  xs={24}
                  sm={24}
                  md={12}
                  lg={12}
                  xl={12}
                  xxl={12}
                  style={{ textAlign: 'left', fontSize: '12px', borderLeft: '5px solid', padding: '18px' }}>
                  <h1 style={{ fontSize: '22px', fontWeight: '300' }}>{company.name}</h1>
                  <div dangerouslySetInnerHTML={{ __html: company.short_description }} />
                </Col>
                <Col xs={24} sm={24} md={24} lg={4} xl={4} xxl={4} span={4}>
                  <Button type='primary'>Conocer Más</Button>
                </Col>
              </Row>
            </Card>
          </>
        );
      })}
    </Card>
  );
}
