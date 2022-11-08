import { CheckCircleFilled } from '@ant-design/icons';
import { Badge, Col, Image, Row, Grid } from 'antd';
import { isMobile } from 'react-device-detect';
import useWhereIsInLanding from '../../hooks/useWhereIsInLanding';

const { useBreakpoint } = Grid;

export default function FooterWithHints() {
  const {
    location,
    whereIsGame: { points },
  } = useWhereIsInLanding();

  if (location.activeView !== 'game') return null;
  const screens = useBreakpoint();

  return (
    <Row align='middle' justify={isMobile ? 'space-around' : 'center'} gutter={[10, 0]}>
      {points.map((point) => (
        <Col key={point.id} style={{}}>
          <Badge
            offset={[-10, 10]}
            count={point.isFound ? <CheckCircleFilled style={{ color: '#52C41A', fontSize: '32px' }} /> : 0}>
            <Image
              src={point.image}
              height={screens.xs ? 40 : 60}
              preview={false}
              style={{
                filter: point.isFound ? 'grayscale(100%)' : '',
              }}
            />
          </Badge>
        </Col>
      ))}
    </Row>
  );
}
