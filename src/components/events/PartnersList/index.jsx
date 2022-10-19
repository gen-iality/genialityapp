import { Button, Row, Col, Avatar, Card, Image } from 'antd';

function PartnerItemList({ company, handleOpenPartnerDetail, companyId }) {
  return (
    (company.visible || company.visible == 'true') && (
      <Card style={{ marginBottom: '12px' }}>
        <Row gutter={[8, 8]} /* justify='center'  */ align='middle'>
          <Col xs={24} sm={24} md={6} lg={6} xl={6} xxl={6}>
            <div className='img-contact'>
              <img width={'200px'} src={company.list_image ? company.list_image : 'error'} />
            </div>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={18}
            lg={14}
            xl={14}
            xxl={14}
            style={{ textAlign: 'justify', fontSize: '12px', borderLeft: '5px solid', padding: '18px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: '300' }}>{company.name}</h1>
            <div dangerouslySetInnerHTML={{ __html: company.short_description }} />
          </Col>
          <Col xs={24} sm={24} md={24} lg={4} xl={4} xxl={4}>
            <Button type='primary' onClick={() => handleOpenPartnerDetail(companyId)}>
              Conocer más
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
