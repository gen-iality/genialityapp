import React, { useState, useEffect, Fragment } from "react";

import { List, Button, Card, Tag, Result } from "antd";
import { MehOutlined } from "@ant-design/icons";
const headStyle = {
  fontWeight: 300,
  textTransform: "uppercase",
  textAlign: "center",
  color: "#000",
};

//Componente que renderiza el listado de encuestas publicadas para la actividad

const SurveyList = ({ jsonData, showSurvey, usuarioRegistrado, surveyLabel }) => {
  const [surveyList, setSurveyList] = useState([]);
  //const [ isASpeaker, setIsASpeaker ] = useState( false );

  useEffect(() => {
    let surveyList = jsonData;
    //Los usuarios anónimos solo ven las encuestas que permiten respuestas anónimas
    if (!usuarioRegistrado) {
      surveyList = jsonData.filter((item) => { return item.allow_anonymous_answers !== "false" })
    }

    setSurveyList(surveyList);

  }, [jsonData, usuarioRegistrado]);

  // useEffect( () => {
  //   let isASpeaker = false
  //   if ( usuarioRegistrado.rol ) {
  //     if ( usuarioRegistrado.rol === 'Speaker' ) {
  //       isASpeaker = true
  //     }
  //   }
  //   setIsASpeaker( isASpeaker )
  // }, [ usuarioRegistrado ] )

  const pluralToSingular = (char, t1, t2) => {
    if (t1 !== undefined) return `${t1}${t2}`;
    return "";
  };

  return (
    <Card title={`Lista de ${surveyLabel.name}`} className="survyCard" headStyle={headStyle}>
      <Fragment>
        {surveyList && surveyList.length === 0 && (
          <Result icon={<MehOutlined />} title="Aún no se han publicado encuestas" />
        )}

        {surveyList && surveyList.length > 0 && (
          <List
            dataSource={surveyList}
            renderItem={(survey) =>
              <List.Item key={survey._id}>
                <List.Item.Meta title={survey.survey} style={{ textAlign: "left" }} />
                {survey.userHasVoted && (<div><Tag color="success">Respondida</Tag></div>)}
                {survey.open && (<div> {survey.open == "true" ? <Tag color="green">Abierta</Tag> : <Tag color="red">Cerrada</Tag>}</div>)}
                <div>
                  <Button
                    ghost
                    type={!survey.userHasVoted ? "primary" : ""}
                    className={`${!survey.userHasVoted ? "animate__animated  animate__pulse animate__slower animate__infinite" : ""}`}
                    onClick={() => showSurvey(survey)}
                    loading={survey.userHasVoted === undefined}>
                    {(!survey.userHasVoted && survey.open == "true")
                      ? `Ir a ${surveyLabel.name ? surveyLabel.name.replace(/([^aeiou]{2})?(e)?s\b/gi, pluralToSingular) : "Encuesta"
                      }`
                      : " Ver Resultados"}
                  </Button>
                </div>
              </List.Item>
            }
          />
        )}
      </Fragment>
    </Card>
  );
};

export default SurveyList