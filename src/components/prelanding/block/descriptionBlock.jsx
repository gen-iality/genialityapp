import EventLanding from '@/components/events/eventLanding';
import { Col, Row } from 'antd';

const DescriptionBlock = () => {
  return (
    <Row justify='center'>
      <Col span={22} /* sm={24} md={16} lg={18} xl={18} */>
        <EventLanding />
      </Col>
    </Row>
  );
};

export default DescriptionBlock;
