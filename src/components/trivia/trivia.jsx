import { useEffect, useState } from "react";
import { SurveysApi} from "../../helpers/request";
import CMS from "../newComponent/CMS";
import { getColumnSearchProps } from "../speakers/getColumnSearch";
import { UnorderedListOutlined } from "@ant-design/icons";
import { deleteSurvey } from "./services";
import { Result } from "antd";
import { recordTypeForThisEvent } from "../events/Landing/helpers/thisRouteCanBeDisplayed";

const trivia = (props) => {
  const [columnsData, setColumnsData] = useState({});
  const [typeEvent, settypeEvent] = useState();

  useEffect(() => {
    const cEvent = {};
    cEvent.value = props.event;
    const eventtype = recordTypeForThisEvent(cEvent);
    settypeEvent(eventtype);
  }, [props]);

  const columns = [
    {
      title: "Nombre de la evaluación",
      dataIndex: "survey",
      ellipsis: true,
      sorter: (a, b) => a.survey.localeCompare(b.survey),
      ...getColumnSearchProps("survey", columnsData),
    },
    {
      title: "Publicada",
      dataIndex: "publish",
      ellipsis: true,
      width: 130,
      sorter: (a, b) => a.publish.localeCompare(b.publish),
      ...getColumnSearchProps("publish", columnsData),
      render(val, item) {
        return <p>{item.publish && item.publish !== 'false' ? "Sí" : "No"}</p>;
      },
    },
  ];
  async function deleteCallback(surveyId) {
    await deleteSurvey(surveyId);
  }
  return (
    <>
      {typeEvent == "UN_REGISTERED_PUBLIC_EVENT" ? (
        <Result title="Este modulo no esta habilitado para cursos publicos sin registro" />
      ) : (
        <CMS
          API={SurveysApi}
          eventId={props.event._id}
          title={"Evaluación"}
          titleTooltip={
            "Agregue o edite las Agendas que se muestran en la aplicación"
          }
          addUrl={{
            pathname: `${props.matchUrl}/encuesta`,
            state: { new: true },
          }}
          columns={columns}
          key="_id"
          editPath={`${props.matchUrl}/encuesta`}
          pagination={false}
          actions
          search
          setColumnsData={setColumnsData}
          extraPath={`${props.matchUrl}/report`}
          extraPathIcon={<UnorderedListOutlined />}
          extraPathTitle="Detalle"
          extraPathId
          extraPathStateName={`${props.matchUrl}/ranking`}
          widthAction={160}
          deleteCallback={(surveyId) => deleteCallback(surveyId)}
        />
      )}
    </>
  );
};

export default trivia;
