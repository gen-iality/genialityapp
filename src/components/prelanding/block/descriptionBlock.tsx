import EventLanding from '@/components/events/eventLanding';
import { Col, Row } from 'antd';

const DescriptionBlock = () => {
  return (
    <Row justify='center'>
      <Col span={22}>
        <EventLanding />
      </Col>
    </Row>
  );
};

export default DescriptionBlock;
