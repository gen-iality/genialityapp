import { Space, Col, Affix, Card, Form, Input, Button, Select, Row } from 'antd';
import { Question } from 'survey-react';
import CreateMillonaire from './CreateMillonaire';
import StageSettings from './StageSettings';
const GeneralConfiguration = () => {
  return (
    <Row gutter={[16, 0]}>
      <Col span={8}>
        <CreateMillonaire />
      </Col>
      <Col span={16}>
        <StageSettings />
      </Col>
    </Row>
  );
};
export default GeneralConfiguration;
