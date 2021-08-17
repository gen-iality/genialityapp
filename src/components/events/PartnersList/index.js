import React from 'react';
import { Button, Row, Col, Avatar, Card } from 'antd';

function PartnerItemList({ company, handleOpenPartnerDetail, companyId }) {
  return (
    (company.visible || company.visible == 'true') && (
      <Card style={{ marginBottom: '12px' }}>
        <Row gutter={[16, 16]} justify='center' align='middle'>
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
            <Button type='primary' onClick={() => handleOpenPartnerDetail(companyId)}>
              Conocer Más
            </Button>
          </Col>
        </Row>
      </Card>
    )
  );
}

export default function PartnersList({ companies, handleOpenPartnerDetail }) {
  return (
    <>
      {companies.map((company, key) => {
        return (
          <PartnerItemList
            key={key}
            company={company}
            handleOpenPartnerDetail={handleOpenPartnerDetail}
            companyId={key}
          />
        );
      })}
    </>
  );
}
