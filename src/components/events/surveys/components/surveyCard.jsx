import { List, Button, Card, Tag, Result, Row, Col, Typography } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, SyncOutlined } from '@ant-design/icons';
import ClipboardTextOff from '@2fd/ant-design-icons/lib/ClipboardTextOff';

const { Title } = Typography;

function SurveyCard(props) {
  const { publishedSurveys, status, handleClick, currentSurveyStatus } = props;

  const headStyle = {
    fontWeight: 300,
    textTransform: 'uppercase',
    textAlign: 'center',
    color: '#000',
  };
  const bodyStyle = { borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' };

  return (
    <Card style={{ borderRadius: '10px', marginTop: '6px' }} bodyStyle={bodyStyle}>
      {publishedSurveys && publishedSurveys.length === 0 ? (
        <Result icon={<ClipboardTextOff />} title='Aún no se han publicado encuestas' />
      ) : (
        <List
          style={{ overflowY: 'auto', height: 'auto', overflowX: 'hidden' }}
          className='asistente-list'
          dataSource={publishedSurveys}
          loading={status != 'LOADED'}
          renderItem={(survey) => (
            <>
              <Card
                className='card-agenda-desktop agendaHover efect-scale'
                style={{
                  borderRadius: '10px',
                  marginBottom: '8px',
                  border: '1px solid',
                  borderColor: '#0000001c',
                }}>
                <List.Item key={survey._id}>
                  <List.Item.Meta
                    title={<Title level={5}>{survey.name}</Title>}
                    style={{ textAlign: 'left' }}
                    description={
                      <Row>
                        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                          {!currentSurveyStatus ||
                          !currentSurveyStatus[survey._id] ||
                          !currentSurveyStatus[survey._id].surveyCompleted ? (
                            <Col style={{ marginBottom: '3px' }}>
                              <Tag icon={<ExclamationCircleOutlined />} color='warning'>
                                Sin contestar
                              </Tag>
                            </Col>
                          ) : currentSurveyStatus[survey._id].surveyCompleted === 'running' ? (
                            <Col style={{ marginBottom: '3px' }}>
                              <Tag icon={<SyncOutlined spin />} color='geekblue'>
                                En progreso
                              </Tag>
                            </Col>
                          ) : currentSurveyStatus[survey._id].surveyCompleted === 'completed' ? (
                            <Col style={{ marginBottom: '3px' }}>
                              <Tag icon={<CheckCircleOutlined />} color='success'>
                                Completada
                              </Tag>
                            </Col>
                          ) : (
                            <Col style={{ marginBottom: '3px' }}>
                              <Tag color='red'>Error</Tag>
                            </Col>
                          )}
                          {survey && (
                            <Col style={{ marginBottom: '3px' }}>
                              {' '}
                              {survey.isOpened === 'true' || survey.isOpened === true ? (
                                <Tag icon={<CheckCircleOutlined />} color='green'>
                                  Abierta
                                </Tag>
                              ) : (
                                <Tag icon={<CloseCircleOutlined />} color='red'>
                                  Cerrada
                                </Tag>
                              )}
                            </Col>
                          )}
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                          {
                            <>
                              <Button
                                type={
                                  (currentSurveyStatus &&
                                    currentSurveyStatus[survey._id] &&
                                    currentSurveyStatus[survey._id].surveyCompleted === 'completed') ||
                                  survey.isOpened === 'false' ||
                                  survey.isOpened === false
                                    ? ' ghost'
                                    : 'primary'
                                }
                                className={`${survey.isOpened === 'true' &&
                                  'animate__animated  animate__pulse animate__slower animate__infinite'}`}
                                onClick={() => {
                                  handleClick(survey);
                                }}>
                                {(currentSurveyStatus &&
                                  currentSurveyStatus[survey._id] &&
                                  currentSurveyStatus[survey._id].surveyCompleted === 'completed') ||
                                survey.isOpened === 'false' ||
                                survey.isOpened === false
                                  ? 'Resultados'
                                  : 'Ir a Encuesta'}
                              </Button>
                            </>
                          }
                        </Col>
                      </Row>
                    }
                  />
                </List.Item>
              </Card>
            </>
          )}
        />
      )}
    </Card>
  );
}

export default SurveyCard;
