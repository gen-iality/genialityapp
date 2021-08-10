import React from 'react';
import { connect } from 'react-redux';
import { List, Button, Card, Tag, Result, Row, Col } from 'antd';
import {
   CheckCircleOutlined,
   CloseCircleOutlined,
   ExclamationCircleOutlined,
   MehOutlined,
   SyncOutlined,
} from '@ant-design/icons';

function SurveyCard(props) {
   const { publishedSurveys, loadingSurveys, handleClick, currentSurveyStatus } = props;

   const headStyle = {
      fontWeight: 300,
      textTransform: 'uppercase',
      textAlign: 'center',
      color: '#000',
   };
   const bodyStyle = { borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' };
console.log("10. currentSurveyStatus ", currentSurveyStatus)
   return (
      <Card
         style={{ borderRadius: '10px', marginTop: '6px' }}
         bodyStyle={bodyStyle}
         title='Listado de Encuestas'
         headStyle={headStyle}>
         {publishedSurveys && publishedSurveys.length === 0 && !loadingSurveys ? (
            <Result icon={<MehOutlined />} title='Aún no se han publicado encuestas' />
         ) : (
            <List
               style={{ overflowY: 'auto', height: '600px', overflowX: 'hidden' }}
               dataSource={publishedSurveys}
               loading={loadingSurveys}
               renderItem={(survey) => (
                  <>
                     {publishedSurveys && publishedSurveys.length > 0 && (
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
                                 title={survey.name}
                                 style={{ textAlign: 'left' }}
                                 description={
                                    <Row>
                                       {!currentSurveyStatus ||
                                       !currentSurveyStatus[survey._id] ||
                                       !currentSurveyStatus[survey._id].surveyCompleted ? (
                                          <Col style={{ marginBottom: '3px' }}>
                                             <Tag icon={<ExclamationCircleOutlined />} color='warning'>
                                                Sin Contestar
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
                                    </Row>
                                 }
                              />
                              {
                                 <>
                                    <div>
                                       <Button
                                          type={
                                             (currentSurveyStatus &&
                                                currentSurveyStatus[survey._id] &&
                                                currentSurveyStatus[survey._id].surveyCompleted === 'completed') ||
                                             survey.isOpened === 'false' || survey.isOpened === false
                                                ? ' ghost'
                                                : 'primary'
                                          }
                                          className={`${survey.isOpened === 'true' &&
                                             'animate__animated  animate__pulse animate__slower animate__infinite'}`}
                                          onClick={() => {
                                             currentSurveyStatus &&
                                             currentSurveyStatus[survey._id] &&
                                             currentSurveyStatus[survey._id].surveyCompleted === 'completed'
                                                ? handleClick(survey, 'results')
                                                : handleClick(survey);
                                          }}>
                                          {(currentSurveyStatus &&
                                             currentSurveyStatus[survey._id] &&
                                             currentSurveyStatus[survey._id].surveyCompleted === 'completed') ||
                                          survey.isOpened === 'false' || survey.isOpened === false
                                             ? 'Resultados'
                                             : 'Ir a Encuesta'}
                                       </Button>
                                    </div>
                                 </>
                              }
                           </List.Item>
                        </Card>
                     )}
                  </>
               )}
            />
         )}
      </Card>
   );
}

const mapDispatchToProps = {};

const mapStateToProps = (state) => ({
   currentSurveyStatus: state.survey.data.currentSurveyStatus,
});

export default connect(mapStateToProps, mapDispatchToProps)(SurveyCard);
