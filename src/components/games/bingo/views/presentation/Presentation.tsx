import { getCorrectColor } from '@/helpers/utils';
import { Badge, Card, Col, Row } from 'antd';
import { ballotsAnnounced } from '../../functions';

export default function Presentation() {
  const cardStyles = {
    headStyles: { border: 'none' },
    bodyStyles: { padding: '0px 24px 24px 24px' },
    styles: { height: '100%', borderRadius: '15px' },
  };
   const gridResponsive = {
    xs:24, sm:24, md:24, lg:12, xl:12, xxl:12
   }
  return (
    <div style={{ height: '100vh', width: '100%', padding: '30px 40px', backgroundColor: '#F9FAFE' }}>
      <Row gutter={[16, 16]} style={{ height: '100%', width: '100%' }}>
        <Col {...gridResponsive } style={{ height: '100%' }}>
          <Row gutter={[16, 16]} style={{ height: '100%' }}>
            <Col span={24}>
              <Card
                title={'Balotera'}
                headStyle={cardStyles.headStyles}
                bodyStyle={cardStyles.bodyStyles}
                style={cardStyles.styles}>
                Aqui componente de la balotera
              </Card>
            </Col>
            <Col span={24}>
              <Card
                title={'Figura'}
                headStyle={cardStyles.headStyles}
                bodyStyle={cardStyles.bodyStyles}
                style={cardStyles.styles}>
                Aqui componente de la figura
              </Card>
            </Col>
          </Row>
        </Col>
        <Col {...gridResponsive } style={{ height: '100%' }}>
          <Card
            extra={
              <Badge
                title={`${ballotsAnnounced(32)}`}
                count={ballotsAnnounced(32)}
                style={{
                  backgroundColor: '#517FD6',
                  color: getCorrectColor('#517FD6'),
                }}
              />
            }
            title={'Historial de balotas'}
            headStyle={cardStyles.headStyles}
            bodyStyle={cardStyles.bodyStyles}
            style={cardStyles.styles}>
            Aqui componente del historial
          </Card>
        </Col>
      </Row>
    </div>
  );
}
