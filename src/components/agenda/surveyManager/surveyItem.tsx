import { SurveyInFirestore, SurveyStatus } from '@/types/survey';
import { parseStringBoolean } from '@/Utilities/parseStringBoolean';
import { Row, Col, Switch } from 'antd';

interface Props {
  survey: SurveyInFirestore
  onChange: (surveyId: SurveyInFirestore['id'], surveyStatus: SurveyStatus) => Promise<void>
}

export default function SurveyItem(props: Props) {
  const { survey, onChange } = props
  return (
    <Row style={{ padding: '8px 16px' }}>
      <Col xs={12} lg={8}>
        {survey.name}
      </Col>
      <Col xs={4} lg={3}>
        <Switch
          checked={ parseStringBoolean(survey.isPublished)}
          onChange={(checked) => onChange(survey.id, { isPublished: checked })}
        />
      </Col>
      <Col xs={4} lg={2}>
        <Switch
          checked={parseStringBoolean(survey.isOpened)}
          onChange={(checked) => onChange(survey.id, { isOpened: checked })}
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
