/* eslint-disable no-fallthrough */
/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useContext, useEffect, useState } from "react";
import WithEviusContext from "../../../context/withContext";
import ImageComponentwithContext from "./ImageComponent";
import { useHelper } from "../../../context/helperContext/hooks/useHelper";
import ZoomIframe from "../ZoomIframe";
import { VideoActivity } from "./VideoActivity";
import GameDrawer from "../game/gameDrawer";
import { withRouter } from "react-router-dom";
import { firestore } from "../../../helpers/firebase";
import HeaderColumnswithContext from "./HeaderColumns";
import WowzaStreamingPlayer from "./wowzaStreamingPlayer";
import AgendaContext from "../../../context/AgendaContext";
import { CurrentEventContext } from "@/context/eventContext";
import moment from "moment";
import CountdownBlock from "@/components/prelanding/block/countdownBlock";
import CustomCountdownMessage from "./CustomCountdownMessage";
import { createEvent } from "ics";
import { saveAs } from "file-saver";

const RenderComponent = (props: any) => {
  let tabsdefault = {
    attendees: false,
    chat: true,
    games: true,
    surveys: false,
  };

  const [tabsGeneral, settabsGeneral] = useState(tabsdefault);
  const [activityState, setactivityState] = useState("");
  const [activityStateGlobal, setactivityStateGlobal] = useState("");
  const [renderGame, setRenderGame] = useState("");
  const [platform, setplatform] = useState("");
  const [meetingId, setmeetingId] = useState("");
  const [fnCiclo, setFnCiclo] = useState(false);
  //ESTADO PARA CONTROLAR ORIGEN DE TRANSMISION
  const agendaContext = useContext(AgendaContext);
  const {
    transmition,
    setTransmition,
    setTypeActivity,
    typeActivity,
  } = agendaContext;
  const {
    currentActivity,
    chatAttendeChats,
    HandleChatOrAttende,
    HandlePublicPrivate,
    helperDispatch,
  } = useHelper();

  const cEventContext = useContext(CurrentEventContext);

  const generateICSFile = () => {
    const event = {
      start: formatDateToICSArray(currentActivity?.datetime_start),
      end: formatDateToICSArray(currentActivity?.datetime_end),
      title: currentActivity?.name || "Actividad sin nombre",
      description: currentActivity?.descripcion || "",
      location: currentActivity?.lugar || "Evento virtual",
      url: `https://liveevents.geniality.com.co/${cEventContext.nameEvent}`,
      status: "CONFIRMED",
      organizer: { name: "Live Events", email: "alerts@geniality.com.co" },
    };

    createEvent(event, (error, value) => {
      if (error) {
        console.error(error);
        return;
      }
      const blob = new Blob([value], { type: "text/calendar;charset=utf-8" });
      saveFile(blob);
    });
  };

  const formatDateToICSArray = (dateString) => {
    if (!dateString) return null;
    // Parsea la fecha y hora de inicio
    const [date, time] = dateString.split(" ");
    const [year, month, day] = date.split("-").map((num) => parseInt(num, 10));
    const [hour, minute] = time.split(":").map((num) => parseInt(num, 10));

    // Retorna el arreglo en el formato esperado por ics
    return [year, month, day, hour, minute];
  };

  const saveFile = (blob) => {
    if (navigator.msSaveBlob) {
      // Para Internet Explorer
      navigator.msSaveBlob(blob, "evento.ics");
    } else {
      const link = document.createElement("a");
      if (link.download !== undefined) {
        // Para navegadores modernos
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "evento.ics");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Para Safari en iOS, abrir el archivo en una nueva pestaña
        window.open(URL.createObjectURL(blob), "_blank");
      }
    }
  };

  async function listeningStateMeetingRoom(
    event_id: string,
    activity_id: string
  ) {
    if (!fnCiclo) {
      let tempactivty = currentActivity;
      firestore
        .collection("events")
        .doc(event_id)
        .collection("activities")
        .doc(activity_id)
        .onSnapshot((infoActivity) => {
          if (!infoActivity.exists) return;
          const data = infoActivity.data() as any;
          const {
            habilitar_ingreso,
            meeting_id,
            platform,
            tabs,
            avalibleGames,
          } = data as any;
          setplatform(platform);
          settabsGeneral(tabs);
          setactivityState(habilitar_ingreso);
          setactivityStateGlobal(habilitar_ingreso);
          setmeetingId(meeting_id);
          setTransmition(data.transmition);
          setTypeActivity(data.typeActivity);
          if (!tabs.games) {
            HandleChatOrAttende("1");
            HandlePublicPrivate("public");
          }
          //Validacion para colombina (quitar apenas pase el evento)
          if (event_id === "619d09f7cbd9a47c2d386372") {
            HandleChatOrAttende("4");
          }

          helperDispatch({ type: "changeTabs", tabs: tabs });
          tempactivty.habilitar_ingreso = habilitar_ingreso;
          tempactivty.avalibleGames = avalibleGames;
          helperDispatch({
            type: "currentActivity",
            currentActivity: tempactivty,
          });
          setFnCiclo(true);
        });
    }
  }

  useEffect(() => {
    async function GetStateMeetingRoom() {
      await listeningStateMeetingRoom(
        props.cEvent.value._id,
        currentActivity._id
      );
    }

    if (currentActivity != null) {
      GetStateMeetingRoom();
    }
  }, [currentActivity, props.cEvent]);

  useEffect(() => {
    if (chatAttendeChats === "4") {
      setRenderGame("game");
    } else {
      if (activityStateGlobal) {
        setactivityState(activityStateGlobal);
      }
    }
  }, [chatAttendeChats]);

  const RenderizarComponente = useCallback(
    (plataforma: string, actividad_estado: string, render_Game: string) => {
      const cEventContext = useContext(CurrentEventContext);
      const textColor = cEventContext.value?.styles?.textMenu;
      const imageBackEvent = "";
      const countdownMessage =
        "El contenido para esta actividad estará disponible en:";
      const startDate = currentActivity
        ? moment(currentActivity.datetime_start).format("YYYY-MM-DD HH:mm:ss")
        : "";
      const finalMessage = "Estará disponible en pocos minutos.";

      const calendarLink = (
        <div
          style={{ textDecoration: "underline", cursor: "pointer" }}
          onClick={generateICSFile}
          align="center"
        >
          Clic aquí para añadir este evento a tú calendario
        </div>
      );

      if (
        plataforma === "vimeo" ||
        plataforma === "zoom" ||
        plataforma === "dolby"
      ) {
        switch (actividad_estado) {
          case "open_meeting_room":
            if (render_Game === "game") {
              return (
                <>
                  <ZoomIframe
                    platform={plataforma}
                    meeting_id={meetingId}
                    generalTabs={tabsGeneral}
                  />
                  <GameDrawer />
                </>
              );
            }
            return (
              <ZoomIframe
                platform={plataforma}
                meeting_id={meetingId}
                generalTabs={tabsGeneral}
              />
            );
          case "closed_meeting_room":
            return <ImageComponentwithContext willStartSoon={true} />;
          case "ended_meeting_room":
            return <VideoActivity />;
          case "created_meeting_room":
            return currentActivity?.video ? (
              <VideoActivity />
            ) : (
              <>
                <CountdownBlock
                  textColor={textColor}
                  imageBackEvent={imageBackEvent}
                  date={startDate}
                  countdownMessage={countdownMessage}
                  countdownFinalMessage={finalMessage}
                />
                {calendarLink}
              </>
            );
          case "record_meeting_room":
            return (
              <ZoomIframe
                platform={plataforma}
                meeting_id={meetingId}
                generalTabs={tabsGeneral}
              />
            );
          default:
            return (
              <>
                <CountdownBlock
                  textColor={textColor}
                  imageBackEvent={imageBackEvent}
                  date={startDate}
                  countdownMessage={countdownMessage}
                  countdownFinalMessage={finalMessage}
                />
                {calendarLink}
              </>
            );
        }
      }

      if (plataforma === "wowza") {
        switch (actividad_estado) {
          case "open_meeting_room":
            if (render_Game === "game") {
              return (
                <>
                  <WowzaStreamingPlayer
                    activity={currentActivity}
                    transmition={transmition}
                    meeting_id={meetingId}
                  />
                  <GameDrawer />
                </>
              );
            }
            return (
              <>
                <WowzaStreamingPlayer
                  activity={currentActivity}
                  transmition={transmition}
                  meeting_id={meetingId}
                />
              </>
            );
          case "closed_meeting_room":
            return typeActivity === "url" || typeActivity === "video" ? (
              <WowzaStreamingPlayer
                activity={currentActivity}
                transmition={transmition}
                meeting_id={meetingId}
              />
            ) : (
              <ImageComponentwithContext willStartSoon={true} />
            );
          case "ended_meeting_room":
            return typeActivity === "url" || typeActivity === "video" ? (
              <WowzaStreamingPlayer
                activity={currentActivity}
                transmition={transmition}
                meeting_id={meetingId}
              />
            ) : (
              <VideoActivity />
            );
          case "":
          case "created_meeting_room":
            return typeActivity === "url" || typeActivity === "video" ? (
              <WowzaStreamingPlayer
                activity={currentActivity}
                transmition={transmition}
                meeting_id={meetingId}
              />
            ) : currentActivity?.video ? (
              <VideoActivity />
            ) : (
              <>
                <ImageComponentwithContext />
                {calendarLink}
              </>
            );
          case "no_visibe":
            return <ImageComponentwithContext />;
          case null:
            return (
              <>
                <WowzaStreamingPlayer
                  activity={currentActivity}
                  transmition={transmition}
                  meeting_id={meetingId}
                />
                <GameDrawer />
              </>
            );
          default:
            return (
              <>
                <CountdownBlock
                  textColor={textColor}
                  imageBackEvent={imageBackEvent}
                  date={startDate}
                  countdownMessage={countdownMessage}
                  countdownFinalMessage={""}
                />
                {calendarLink}
              </>
            );
        }
      }

      if (plataforma === "only") {
        return (
          <>
            <WowzaStreamingPlayer
              activity={currentActivity}
              transmition={transmition}
              meeting_id={meetingId}
            />
            <GameDrawer />
          </>
        );
      }

      return (
        <>
          <CountdownBlock
            textColor={textColor}
            imageBackEvent={imageBackEvent}
            date={startDate}
            countdownMessage={countdownMessage}
            //@ts-ignore
            countdownFinalMessage={<CustomCountdownMessage />}
          />
          {calendarLink}
        </>
      );
    },
    [platform, currentActivity, meetingId, tabsGeneral, transmition, fnCiclo]
  );

  return (
    <>
      {!props.isBingo && (
        <HeaderColumnswithContext
          isVisible={true}
          activityState={activityState}
        />
      )}
      {RenderizarComponente(platform, activityState, renderGame)}
    </>
  );
};

export default withRouter(WithEviusContext(RenderComponent));
