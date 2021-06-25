import React from 'react'
import { List, Button, Card, Tag, Result, Spin, Row, Col } from 'antd';
import { MehOutlined } from '@ant-design/icons';

function SurveyCard(props) {
    const { surveyLabel, loading, publishedSurveys, loadingSurveys } = props
    const headStyle = {
        fontWeight: 300,
        textTransform: 'uppercase',
        textAlign: 'center',
        color: '#000',
     };
     const bodyStyle = { borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' };

     console.log("SurveyCard props=======>>", props)
    return (
        <Card
        // className='lowerTabs__mobile-visible'
        style={{ borderRadius: '10px', marginTop: '6px' }}
        bodyStyle={bodyStyle}
        title='Listado de Encuestas'
        headStyle={headStyle}>
        {publishedSurveys && publishedSurveys.length === 0 && loading ? (
           <Result icon={<MehOutlined />} title='Aún no se han publicado encuestas' />
        ) : (
           <List
              dataSource={publishedSurveys}
              loading={loadingSurveys}
              renderItem={(survey) => (
                 <>
                    {publishedSurveys && publishedSurveys.length > 0 && !loading && (
                       <Card
                          style={{
                             borderRadius: '10px',
                             marginBottom: '5px',
                             border: '1px solid',
                             borderColor: '#0000001c',
                          }}>
                          <List.Item key={survey._id}>
                             <List.Item.Meta
                                title={survey.name}
                                style={{ textAlign: 'left' }}
                                description={
                                   !loading && (
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
                                   )
                                }
                             />
                             {loading ? (
                                <Spin />
                             ) : (
                                <>
                                   <div>
                                      {/* <Button
                                         type={
                                            !survey.userHasVoted && survey.isOpened === 'true'
                                               ? 'primary'
                                               : 'ghost'
                                         }
                                         className={`${
                                            !survey.userHasVoted && survey.isOpened === 'true'
                                               ? 'animate__animated  animate__pulse animate__slower animate__infinite'
                                               : ''
                                         }`}
                                         onClick={() => this.handleClick(survey)}>
                                         {!survey.userHasVoted && survey.isOpened === 'true'
                                            ? `Ir a ${
                                                 surveyLabel.name
                                                    ? surveyLabel.name.replace(
                                                         /([^aeiou]{2})?(e)?s\b/gi,
                                                         this.pluralToSingular
                                                      )
                                                    : 'Encuesta'
                                              }`
                                            : 'Resultados'}
                                      </Button> */}
                                   </div>
                                </>
                             )}
                          </List.Item>
                       </Card>
                    )}
                 </>
              )}
           />
        )}
     </Card>
    )
}

export default SurveyCard
