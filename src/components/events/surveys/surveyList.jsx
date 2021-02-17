import React, { useState, useEffect, Fragment } from 'react';
import { List, Button, Card, Tag, Result, Spin } from 'antd';
import { MehOutlined } from '@ant-design/icons';

const headStyle = {
  fontWeight: 300,
  textTransform: 'uppercase',
  textAlign: 'center',
  color: '#000',
};

//Componente que renderiza el listado de encuestas publicadas para la actividad
const SurveyList = ({ jsonData, showSurvey, currentUser, surveyLabel, event, loading, forceCheckVoted }) => {
  //const [list, loading] = useFilterSurveyList({ jsonData, currentUser, event });
  const [surveyList, setSurveyList] = useState([]);

  const pluralToSingular = (char, t1, t2) => {
    if (t1 !== undefined) return `${t1}${t2}`;
    return '';
  };

  useEffect(() => {
    let surveyList = jsonData;
    //Los usuarios anónimos solo ven las encuestas que permiten respuestas anónimas
    if (!currentUser) {
      surveyList = jsonData.filter((item) => {
        return item.allow_anonymous_answers !== 'false';
      });
    }

    setSurveyList(surveyList);
  }, [jsonData, currentUser, forceCheckVoted]);

  return (
    <>
      {loading ? (
        <Spin />
      ) : (
        <Card title={`Lista de ${surveyLabel.name}`} className='survyCard' headStyle={headStyle}>
          <Fragment>
            {surveyList && surveyList.length === 0 && (
              <Result icon={<MehOutlined />} title='Aún no se han publicado encuestas' />
            )}

            {surveyList && surveyList.length > 0 && (
              <List
                dataSource={surveyList}
                renderItem={(survey) => (
                  <List.Item key={survey._id}>
                    <List.Item.Meta title={survey.name} style={{ textAlign: 'left' }} />
                    {survey.userHasVoted && (
                      <div>
                        <Tag color='success'>Respondida</Tag>
                      </div>
                    )}
                    {survey.isOpened && (
                      <div>
                        {' '}
                        {survey.isOpened == 'true' || survey.isOpened == true ? (
                          <Tag color='green'>Abierta</Tag>
                        ) : (
                          <Tag color='red'>Cerrada</Tag>
                        )}
                      </div>
                    )}
                    <div>
                      <Button
                        type={!survey.userHasVoted ? 'primary' : 'ghost'}
                        className={`${
                          !survey.userHasVoted
                            ? 'animate__animated  animate__pulse animate__slower animate__infinite'
                            : ''
                        }`}
                        onClick={() => showSurvey(survey)}
                        loading={survey.userHasVoted === undefined}>
                        {!survey.userHasVoted && survey.isOpened === 'true'
                          ? `Ir a ${
                              surveyLabel.name
                                ? surveyLabel.name.replace(/([^aeiou]{2})?(e)?s\b/gi, pluralToSingular)
                                : 'Encuesta'
                            }`
                          : ' Ver Resultados'}
                      </Button>
                    </div>
                  </List.Item>
                )}
              />
            )}
          </Fragment>
        </Card>
      )}
    </>
  );
};

export default SurveyList;
