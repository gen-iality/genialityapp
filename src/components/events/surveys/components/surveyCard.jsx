import React, { useEffect } from 'react';
import { List, Button, Card, Tag, Result, Row, Col } from 'antd';
import { MehOutlined } from '@ant-design/icons';

/** Redux */
import { connect } from 'react-redux';
import * as StageActions from '../../../../redux/stage/actions';
import * as SurveyActions from '../../../../redux/survey/actions';

const { setMainStage } = StageActions;
const { setCurrentSurvey, setSurveyVisible } = SurveyActions;

function SurveyCard(props) {
   const {
      publishedSurveys,
      loadingSurveys,
      activity,
      setMainStage,
      setSurveyVisible,
      setCurrentSurvey,
      surveyVisible,
      currentSurvey,
   } = props;

   const headStyle = {
      fontWeight: 300,
      textTransform: 'uppercase',
      textAlign: 'center',
      color: '#000',
   };
   const bodyStyle = { borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' };
   function handleClick(currentSurvey) {
      if (activity !== null) {
         setMainStage('surveyDetalle');
      } else {
         setSurveyVisible(true);
      }
      setCurrentSurvey(currentSurvey);
   }
   useEffect(() => {
      if (currentSurvey && surveyVisible === true) {
         console.log("10_currentSurvey")
         setMainStage('surveyDetalle');
         setCurrentSurvey(currentSurvey);
      }
   }, [currentSurvey, surveyVisible])

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
                                          {survey.userHasVoted ? (
                                             <Col>
                                                <Tag color='success'>Contestada</Tag>
                                             </Col>
                                          ) : (
                                             <Col>
                                                <Tag color='warning'>Sin Contestar</Tag>
                                             </Col>
                                          )}
                                          {survey.isOpened && (
                                             <Col>
                                                {' '}
                                                {survey.isOpened == 'true' || survey.isOpened == true ? (
                                                   <Tag color='green'>Abierta</Tag>
                                                ) : (
                                                   <Tag color='red'>Cerrada</Tag>
                                                )}
                                             </Col>
                                          )}
                                       </Row>
                                    
                                 }
                              />
                              { <>
                                    <div>
                                       <Button
                                          type={
                                             survey.isOpened === 'true' ? 'primary' : 'ghost'
                                          }
                                          className={`${survey.isOpened === 'true' &&
                                             'animate__animated  animate__pulse animate__slower animate__infinite'}`}
                                          onClick={() => handleClick(survey)}>
                                          {survey.isOpened === 'true'
                                             ? 'Ir a Encuesta'
                                             : 'Resultados'}
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
const mapStateToProps = (state) => ({
   activity: state.stage.data.currentActivity,
   surveyVisible: state.survey.data.surveyVisible,
});

const mapDispatchToProps = {
   setMainStage,
   setCurrentSurvey,
   setSurveyVisible,
};

export default connect(mapStateToProps, mapDispatchToProps)(SurveyCard);
