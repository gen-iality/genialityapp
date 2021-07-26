import React, { useEffect, useState } from 'react';
import { List, Button, Card, Tag, Result, Row, Col } from 'antd';
import {
   CheckCircleOutlined,
   CloseCircleOutlined,
   ExclamationCircleOutlined,
   MehOutlined,
   SyncOutlined,
} from '@ant-design/icons';
import { ListenUserCompletedSurvey } from '../services/userCompletedSurvey';

function SurveyCard(props) {
   const [userHasVoted, setUserHasVoted] = useState();
   const { publishedSurveys, loadingSurveys, currentUser, handleClick } = props;

   const headStyle = {
      fontWeight: 300,
      textTransform: 'uppercase',
      textAlign: 'center',
      color: '#000',
   };
   const bodyStyle = { borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' };

   function userCompletedSurvey() {
      if (publishedSurveys) {
         publishedSurveys.map((survey) => {
            ListenUserCompletedSurvey(survey, currentUser, setUserHasVoted);
         });
      }
   }

   useEffect(() => {
      userCompletedSurvey();
   }, [publishedSurveys]);

   useEffect(() => {
      console.log("10. ==> ", userHasVoted)
      if (userHasVoted) {
         /** Se realiza filtro por id de la encuesta y luego se asigna a la data de la encuesta la propiedad userHasVote */
         let surveyFilter = publishedSurveys?.find((filter) => filter._id === userHasVoted.surveyId);
         Object.defineProperties(surveyFilter, {
            userHasVoted: {
               value: userHasVoted.completeSurvey,
               writable: true
            },
         });
      }
   }, [userHasVoted]);

   

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
                                       {survey.userHasVoted ? (
                                          <Col style={{ marginBottom: '3px' }}>
                                             <Tag icon={<CheckCircleOutlined />} color='success'>
                                                Contestada
                                             </Tag>
                                          </Col>
                                       ) : survey.userHasVoted === false ? (
                                          <Col style={{ marginBottom: '3px' }}>
                                             <Tag icon={<SyncOutlined spin />} color='geekblue'>
                                                En progreso
                                             </Tag>
                                          </Col>
                                       ) : (
                                          <Col style={{ marginBottom: '3px' }}>
                                             <Tag icon={<ExclamationCircleOutlined />} color='warning'>
                                                Sin Contestar
                                             </Tag>
                                          </Col>
                                       )}
                                       {survey.isOpened && (
                                          <Col style={{ marginBottom: '3px' }}>
                                             {' '}
                                             {survey.isOpened == 'true' || survey.isOpened == true ? (
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
                                          type={survey.isOpened === 'true' && survey.userHasVoted !== true ? 'primary' : 'ghost'}
                                          className={`${survey.isOpened === 'true' &&
                                             'animate__animated  animate__pulse animate__slower animate__infinite'}`}
                                          onClick={() =>{survey.userHasVoted !== true ? handleClick(survey) : handleClick(survey, 'results')}}>
                                          {survey.isOpened === 'true' && survey.userHasVoted !== true ? 'Ir a Encuesta' : 'Resultados'}
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

export default SurveyCard;
