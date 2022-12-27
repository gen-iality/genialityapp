import { Row, Col, Typography } from 'antd';

import Participants from './Participants';
import useSharePhoto from '../../hooks/useSharePhoto';

const { Title } = Typography;

export default function TabData() {
  const { scores, sharePhoto  } = useSharePhoto();

  return (
    <Row gutter={[16, 16]} style={{ padding: '40px' }}>
      <Col span={24}>
        <Participants participants={scores} />
      </Col>
    </Row>
  );
}
