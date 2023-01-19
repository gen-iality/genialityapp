import { parseStringBoolean } from '@/Utilities/parseStringBoolean';
import { Row, Col, Switch } from 'antd';

export default function SurveyItem({ survey, onChange }) {
  return (
    <Row style={{ padding: '8px 16px' }}>
      <Col xs={12} lg={8}>
        {survey.name}
      </Col>
      <Col xs={4} lg={3}>
        <Switch
          checked={ parseStringBoolean(survey.isPublished)}
          onChange={(checked) => onChange(survey.survey_id, { isPublished: checked })}
        />
      </Col>
      <Col xs={4} lg={2}>
        <Switch
          checked={parseStringBoolean(survey.isOpened)}
          onChange={(checked) => onChange(survey.survey_id, { isOpened: checked })}
        />
      </Col>
      {/* <Col xs={4} lg={2}>
        <Switch
          checked={survey.freezeGame === 'true' || survey.freezeGame === true}
          onChange={(checked) => onChange(survey.survey_id, { freezeGame: checked ? 'true' : 'false' })}
        />
      </Col> */}
    </Row>
  );
}
