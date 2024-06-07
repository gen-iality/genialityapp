import { useState, useEffect } from "react";
import { connect } from "react-redux";
import GraphicsRefactor from "./graphicsRefactor";
import SurveyComponent from "./surveyComponent";
import { Card, Result, Divider } from "antd";

/** Context´s */
import { UseCurrentUser } from "../../../context/userContext";
import { UseSurveysContext } from "../../../context/surveysContext";
import { UseUserEvent } from "@context/eventUserContext";
function SurveyDetailPage(props: any) {
  const cSurveys: any = UseSurveysContext();
  const currentUser = UseCurrentUser();
  const cEventUser = UseUserEvent();
  const [showSurveyTemporarily, setShowSurveyTemporarily] = useState(false);

  useEffect(() => {
    if (showSurveyTemporarily === true) {
      setTimeout(() => {
        console.log("Soy un ciclo");
        setShowSurveyTemporarily(false);
      }, 10000);
    }
  }, [showSurveyTemporarily]);

  if (!cSurveys.currentSurvey) {
    return <h1>No hay nada publicado</h1>;
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "16px",
        }}
      >
        {cSurveys.shouldDisplaySurveyAttendeeAnswered() && !cSurveys.shouldDisplaySurveyClosedMenssage() && (
          <Result
            style={{ height: "30%", padding: "0px" }}
            status="success"
            title="Ya has contestado esta encuesta"
          />
        )}
        {cSurveys.shouldDisplaySurveyClosedMenssage() && (
          <Result
            style={{ height: "30%", padding: "0px" }}
            title="Esta encuesta ha sido cerrada"
          />
        )}
      </div>
      {(cSurveys.shouldDisplaySurvey() || showSurveyTemporarily) && (
        <Card className="survyCard">
          <SurveyComponent
            idSurvey={cSurveys.currentSurvey._id}
            eventId={cSurveys.currentSurvey.eventId}
            cEventUser={cEventUser}
            currentUser={currentUser}
            setShowSurveyTemporarily={setShowSurveyTemporarily}
            operation="participationPercentage"
          />
        </Card>
      )}
      {cSurveys.shouldDisplayGraphics() && (
        <>
          <Divider />
          <GraphicsRefactor
            idSurvey={cSurveys.currentSurvey._id}
            eventId={cSurveys.currentSurvey.eventId}
            operation="participationPercentage"
          />
          {/* <Divider />
					<Graphics
						idSurvey={cSurveys.currentSurvey._id}
						eventId={cSurveys.currentSurvey.eventId}
						operation='participationPercentage'
					/> */}
        </>
      )}
      {/* {cSurveys.surveyResult === 'closedSurvey' && <ClosedSurvey />} */}
    </div>
  );
}

const mapStateToProps = (state: any) => ({
  isVisible: state.survey.data.surveyVisible,
});

export default connect(mapStateToProps)(SurveyDetailPage);
