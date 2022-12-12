import { getCorrectColor } from '@/helpers/utils';
import { Badge, Col, Row } from 'antd';
import CardContainer from '../../components/presentation/CardContainer';
import { ballotsAnnounced } from '../../functions';

export default function Presentation() {
 
  const gridResponsive = {
    xs: 24,
    sm: 24,
    md: 24,
    lg: 12,
    xl: 12,
    xxl: 12,
  };
  return (
    <div style={{ height: '100vh', width: '100%', padding: '30px 40px', backgroundColor: '#F9FAFE' }}>
      <Row gutter={[16, 16]} style={{ height: '100%', width: '100%' }}>
        <Col {...gridResponsive} style={{ height: '100%' }}>
          <Row gutter={[16, 16]} style={{ height: '100%' }}>
            <Col span={24}>
              <CardContainer title='Balotera'>Aqui va la balotera</CardContainer>
            </Col>
            <Col span={24}>
              <CardContainer title='Figura'>Aqui va la Figura</CardContainer>
            </Col>
          </Row>
        </Col>
        <Col {...gridResponsive} style={{ height: '100%' }}>
          <CardContainer
            title='Historial de balotas'
            extra={
              <Badge
                title={`${ballotsAnnounced(32)}`}
                count={ballotsAnnounced(32)}
                style={{
                  backgroundColor: '#517FD6',
                  color: getCorrectColor('#517FD6'),
                }}
              />
            }>
            Aqui va El historial
          </CardContainer>
        </Col>
      </Row>
    </div>
  );
}
