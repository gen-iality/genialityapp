import React, { useState, useEffect, Fragment } from "react";

import { List, Button, Card, Col, Tag, Spin, Result, Empty } from "antd";
import { MehOutlined } from "@ant-design/icons";
const headStyle = {
  fontWeight: 300,
  textTransform: "uppercase",
  textAlign: "center",
  color: "#000",
};

const AnonymousList = ({ anonymousSurveyList, showSurvey }) => {
  return (
    <Fragment>
      {anonymousSurveyList && anonymousSurveyList.length == 0 && (
        <Result icon={<MehOutlined />} title="Aún no se han publicado encuestas" />
      )}
      {/* {console.log("anonymousSurveyList:", anonymousSurveyList)} */}
      {anonymousSurveyList && anonymousSurveyList.length > 0 && (
        <List
          dataSource={anonymousSurveyList}
          renderItem={(survey) =>            
            survey.open == "true" ? (              
              <List.Item key={survey._id}>
                <List.Item.Meta title={survey.survey} style={{ textAlign: "left" }} />
                {survey.userHasVoted && (
                  <div>
                    <Tag color="success">Respondida</Tag>
                  </div>
                )}
                <div>
                  <Button
                    type={!survey.userHasVoted ? "primary" : ""}
                    className={`${
                      !survey.userHasVoted ? "animate__animated  animate__pulse animate__slower animate__infinite" : ""
                    }`}
                    onClick={() => showSurvey(survey)}
                    loading={survey.userHasVoted == undefined}>        
                    {console.log("iteracion de voto",survey)}            
                    {survey.userHasVoted ? "Ir a la Encuesta" : " Ver Resultados"}
                  </Button>
                </div>
              </List.Item>
            ) : (
              <List.Item key={survey._id} actions={[]}>
                <List.Item.Meta title={survey.survey} style={{ textAlign: "left" }} />
                <div>
                  <Tag color="red">Cerrada</Tag>
                </div>
                <Button onClick={() => showSurvey(survey)}>Ver Resultados</Button>
              </List.Item>
            )
          }
        />
      )}
    </Fragment>
  );
};

const surveyList =  ({ jsonData, showSurvey, usuarioRegistrado, surveyLabel }) => {
  const [surveyList, setSurveyList] = useState([]);
  const [anonymousSurveyList, setAnonymousSurveyList] = useState([]);

  useEffect(() => {
    setSurveyList(jsonData);
    setAnonymousSurveyList(jsonData.filter((item) => item.allow_anonymous_answers === "true"));
    console.log(usuarioRegistrado);
  }, [jsonData]);

  const pluralToSingular = (char, t1, t2) => {
    if (t1 != undefined) return `${t1}${t2}`;
    return "";
  };

  return (
    <Card title={`Lista de ${surveyLabel.name}`} className="survyCard" headStyle={headStyle}>
      {usuarioRegistrado ? (
        <Fragment>
          {surveyList && surveyList.length == 0 && (
            <Result icon={<MehOutlined />} title="Aún no se han publicado encuestas" />
          )}

          {surveyList && surveyList.length > 0 && (
            <List
              dataSource={surveyList}
              renderItem={(survey) =>
                survey.open == "true" ? (
                  <List.Item key={survey._id}>
                    <List.Item.Meta title={survey.survey} style={{ textAlign: "left" }} />
                    {survey.userHasVoted && (
                      <div>
                        <Tag color="success">Respondida</Tag>
                      </div>
                    )}
                    <div>
                      <Button
                        ghost
                        type={!survey.userHasVoted ? "primary" : ""}
                        className={`${
                          !survey.userHasVoted
                            ? "animate__animated  animate__pulse animate__slower animate__infinite"
                            : ""
                        }`}
                        onClick={() => showSurvey(survey)}
                        loading={survey.userHasVoted == undefined}>
                        {(!survey.userHasVoted &&  usuarioRegistrado && usuarioRegistrado.rol && usuarioRegistrado.rol.name != "Speaker")
                          ? `Ir a ${
                              surveyLabel.name
                                ? surveyLabel.name.replace(/([^aeiou]{2})?(e)?s\b/gi, pluralToSingular)
                                : "Encuesta"
                            }`
                          : " Ver Resultados"}
                      </Button>
                    </div>
                  </List.Item>
                ) : (
                  <List.Item key={survey._id} actions={[]}>
                    <List.Item.Meta title={survey.survey} style={{ textAlign: "left" }} />
                    <div>
                      <Tag color="red">Cerrada</Tag>
                    </div>
                    <Button onClick={() => showSurvey(survey)}>Ver Resultados</Button>
                  </List.Item>
                )
              }
            />
          )}
        </Fragment>
      ) : (
        <AnonymousList
          anonymousSurveyList={anonymousSurveyList}
          showSurvey={showSurvey}
          usuarioRegistrado={usuarioRegistrado}
        />
      )}
    </Card>
  );
};

export default surveyList
