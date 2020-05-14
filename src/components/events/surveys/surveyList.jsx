import React, { useState, useEffect } from "react";

import { List, Button, Card, Col, Tag, Spin } from "antd";

export default ({ jsonData, showSurvey, usuarioRegistrado }) => {
  const [surveyList, setSurveyList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSurveyList(jsonData);
    if (jsonData.length > 0) setLoading(false);
  }, [jsonData]);

  return (
    <Col xs={24} sm={22} md={18} lg={18} xl={22} style={{ margin: "0 auto" }}>
      <Card>
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
                {usuarioRegistrado === true ?
                  <div>
                    <Button onClick={() => showSurvey(survey)} loading={survey.userHasVoted == undefined}>
                      {!survey.userHasVoted ? "Ir a Encuesta" : " Ver Resultados"}
                    </Button>
                  </div>
                  :
                  survey.allow_anonymous_answers === "true" ?
                    <div>
                      <Button onClick={() => showSurvey(survey)} loading={survey.userHasVoted == undefined}>
                        {!survey.userHasVoted ? "Ir a Encuesta" : " Ver Resultados"}
                      </Button>
                    </div>
                    :
                    <></>
                }


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
      </Card>
    </Col>
  );
};
