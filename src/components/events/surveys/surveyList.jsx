import React, { useState, useEffect, Fragment } from "react";

import { List, Button, Card, Col, Tag, Spin, Result, Empty } from "antd";
import { MehOutlined } from "@ant-design/icons";

const AnonymousList = ({ anonymousSurveyList, showSurvey, usuarioRegistrado }) => {
  return (
    <Fragment>
      {anonymousSurveyList && anonymousSurveyList.length == 0 && (
        <Result icon={<MehOutlined />} title="Aún no se han publicado encuestas" />
      )}
      {console.log("anonymousSurveyList:", anonymousSurveyList)}
      {anonymousSurveyList && anonymousSurveyList.length > 0 && (
        <List
          dataSource={anonymousSurveyList}
          renderItem={(survey) =>
            survey.open == "true" ? (
              <Fragment>
                {survey.allow_anonymous_answers === "true" && !usuarioRegistrado && (
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
                          !survey.userHasVoted
                            ? "animate__animated  animate__pulse animate__slower animate__infinite"
                            : ""
                        }`}
                        onClick={() => showSurvey(survey)}
                        loading={survey.userHasVoted == undefined}>
                        {!survey.userHasVoted ? "Ir a la Encuesta" : " Ver Resultados"}
                      </Button>
                    </div>
                  </List.Item>
                )}
              </Fragment>
            ) : (
              <Fragment>
                {survey.allow_anonymous_answers === "true" && !usuarioRegistrado && (
                  <List.Item key={survey._id} actions={[]}>
                    <List.Item.Meta title={survey.survey} style={{ textAlign: "left" }} />
                    <div>
                      <Tag color="red">Cerrada</Tag>
                    </div>
                    <Button onClick={() => showSurvey(survey)}>Ver Resultados</Button>
                  </List.Item>
                )}
              </Fragment>
            )
          }
        />
      )}
    </Fragment>
  );
};

export default ({ jsonData, showSurvey, usuarioRegistrado }) => {
  const [surveyList, setSurveyList] = useState([]);
  const [anonymousSurveyList, setAnonymousSurveyList] = useState([]);

  useEffect(() => {
    setSurveyList(jsonData);
    setAnonymousSurveyList(jsonData.filter((item) => item.allow_anonymous_answers === "true"));
    console.log(usuarioRegistrado);
  }, [jsonData]);

  return (
    <Col xs={24} sm={22} md={18} lg={18} xl={22} style={{ margin: "0 auto" }}>
      <Card>
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
                          type={!survey.userHasVoted ? "primary" : ""}
                          className={`${
                            !survey.userHasVoted
                              ? "animate__animated  animate__pulse animate__slower animate__infinite"
                              : ""
                          }`}
                          onClick={() => showSurvey(survey)}
                          loading={survey.userHasVoted == undefined}>
                          {!survey.userHasVoted ? "Ir a la Encuesta" : " Ver Resultados"}
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
    </Col>
  );
};
