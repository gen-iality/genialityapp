/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable no-lone-blocks */
/* eslint-disable react-hooks/exhaustive-deps */
// import DrawerBingo from '@components/games/bingo/components/DrawerBingo';
// import PrintBingoCartonButton from '@/components/games/bingo/components/PrintBingoCartonButton';
// import useActivityType from '@/context/activityType/hooks/useActivityType';
// import WithEviusContext from '../../../context/withContext';
// import { isMobile } from 'react-device-detect';
import {
  activitiesCode,
  cityValid,
  codeActivity,
} from "../../../helpers/constants";
import { AgendaApi } from "../../../helpers/request";
import { checkinAttendeeInActivity } from "../../../helpers/HelperAuth";
import { connect } from "react-redux";
import {
  disconnectUserPresenceInActivity,
  listenUserPresenceInActivity,
} from "./utils";
import {
  Row,
  Card,
  Alert,
  Space,
  Result,
  Button,
  notification,
  Input,
} from "antd";
import { setTopBanner } from "../../../redux/topBanner/actions";
import { setVirtualConference } from "../../../redux/virtualconference/actions";
import { UseCurrentUserContext } from "@/context/userContext";
import { UseEventContext } from "@/context/eventContext";
import { useHelper } from "../../../context/helperContext/hooks/useHelper";
import { useState, useEffect } from "react";
import { UseSurveysContext } from "../../../context/surveysContext";
import { UseUserEvent } from "@/context/eventUserContext";
import { withRouter } from "react-router-dom";
import * as SurveyActions from "../../../redux/survey/actions";
import AditionalInformation from "./AditionalInformation";
import HCOActividad from "./HOC_Actividad";
import Moment from "moment-timezone";
import PlayMillonaire from "@/components/games/WhoWantsToBeAMillonaire/components/PlayMillonaire";
import SharePhotoInLanding from "@/components/games/sharePhoto/views/SharePhotoInLanding";
import SurveyDrawer from "../surveys/components/surveyDrawer";
import WhereisInLanding from "@/components/games/whereIs/views/WhereIsInLanding";
import { fireRealtime } from "@/helpers/firebase";
import ReactQuill from "react-quill";

const { setHasOpenSurveys } = SurveyActions;
const millonaireEventSatus = true;
const sharePhotoEventStatus = true;
const whereIsEventStatus = true;

const AgendaActividadDetalle = (props: any) => {
  const [orderedHost, setOrderedHost] = useState<any[]>([]);
  const [blockActivity, setblockActivity] = useState(false);
  // Context hooks
  const cHelper = useHelper();
  const cEvent = UseEventContext();
  const cEventUser = UseUserEvent();
  const cSurveys = UseSurveysContext();
  const cUser = UseCurrentUserContext();
  // const [videoStyles, setVideoStyles] = useState<CSSProperties | null>(null);
  // const [videoButtonStyles, setVideoButtonStyles] = useState<CSSProperties | null>(null);
  // const [activity, setactivity] = useState('');
  // Constants from hooks
  const { HandleOpenCloseMenuRigth, currentActivity, helperDispatch } = cHelper;
  const uid = cUser.value?.uid;
  const activityId = props.match.params.activity_id;
  const eventId = cEvent.value?._id;
  const isAssambleyMod = cEvent.value?.user_properties.some(
    (property: any) => property.type === "voteWeight"
  );
  const voteWeight = cEventUser.value?.properties?.voteWeight
    ? Number(cEventUser.value?.properties?.voteWeight)
    : 1;
  //   const intl = useIntl();
  {
    Moment.locale(window.navigator.language);
  }
  const [dataTypes, setDataTypes] = useState<any[]>([]);

  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [isMessageSent, setIsMessageSent] = useState<Boolean>(false);

  useEffect(() => {
    if (fireRealtime) {
      const notificationRef = fireRealtime.ref("notifications/message");
      notificationRef.on("value", (snapshot) => {
        const msg = snapshot.val();
        const key = cEventUser.value._id; // Asumiendo que esta es la clave única para la notificación
        console.log(snapshot.val());
        if (msg) {
          // Si hay un mensaje, mostrar la notificación
          showNotification(msg);
          setIsMessageSent(true);
        } else {
          // Si el mensaje es null o vacío, cerrar la notificación
          notification.close(key);
          setIsMessageSent(false);
        }
      });

      return () => {
        notificationRef.off();
      };
    }
  }, [fireRealtime, cEventUser.value._id]);

  const showNotification = (msg: any) => {
    const key = cEventUser.value._id; // Clave única para la notificación

    notification.open({
      message: "Notificación",
      description: <div dangerouslySetInnerHTML={{ __html: msg }} />,
      duration: 0, // Duración infinita
      key, // Asigna la clave única
    });
  };

  const hiddenNotify = () => {
    if (fireRealtime) {
      const notificationRef = fireRealtime.ref("notifications/message");
      notificationRef
        .remove()
        .then(() => console.log("Mensaje borrado con éxito."))
        .catch((error) => console.error("Error al borrar el mensaje: ", error));

      // Para restablecer el campo de mensaje
      // setMessage("");
    }
  };

  const handleSendMessage = () => {
    const notificationRef = fireRealtime.ref("notifications");
    notificationRef.set({ message });
    setIsEditing(false);
  };

  // quita las etiquetas html del contenido
  const stripHtmlTags = (html: string): string => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  // Manejar cambios en el editor ReactQuill
  const handleQuillChange = (content: string) => {
    // Asegurar que los enlaces tengan el formato correcto
    const formattedContent = formatLinks(content);
    setMessage(formattedContent);
  };

  // Formatear enlaces para asegurar que tengan el formato correcto
  const formatLinks = (content: string): string => {
    const regex = /<a\b[^>]*>(.*?)<\/a>/gm;
    const formattedContent = content.replace(regex, (match, p1) => {
      // Asegurarse de extraer el href del enlace
      const hrefMatch = match.match(/href="([^"]*)"/);
      let href = hrefMatch ? hrefMatch[1] : "";
      if (!href.startsWith("http://") && !href.startsWith("https://")) {
        href = `https://${href}`;
      }
      // Reconstruir el enlace con el href corregido
      return `<a href="${href}" rel="noopener noreferrer" target="_blank">${p1}</a>`;
    });
    return formattedContent;
  };

  useEffect(() => {
    if (!!activityId && !!eventId && !!uid && !!isAssambleyMod) {
      listenUserPresenceInActivity(eventId, activityId, uid, voteWeight);
    }
    async function getActividad() {
      return await AgendaApi.getOne(
        props.match.params.activity_id,
        cEvent.value._id
      );
    }

    function orderHost(hosts: any) {
      hosts.sort(function(a: any, b: any) {
        return a.order - b.order;
      });
      setOrderedHost(hosts);
    }

    getActividad().then((result) => {
      setDataTypes(result.userTypes || []);
      helperDispatch({ type: "currentActivity", currentActivity: result });
      // setactivity(result);

      orderHost(result.hosts);
      //@ts-ignore
      cSurveys.set_current_activity(result);
    });

    props.setTopBanner(false);
    props.setVirtualConference(false);

    HandleOpenCloseMenuRigth(false);
    if (
      props.socialzonetabs?.publicChat ||
      props.socialzonetabs?.privateChat ||
      props.socialzonetabs?.attendees
    ) {
      HandleOpenCloseMenuRigth(false);
    } else {
      HandleOpenCloseMenuRigth(true);
    }

    return () => {
      !!isAssambleyMod &&
        disconnectUserPresenceInActivity(eventId, activityId, uid, voteWeight);
      props.setTopBanner(true);
      props.setVirtualConference(true);
      HandleOpenCloseMenuRigth(true);
      helperDispatch({ type: "currentActivity", currentActivity: null });
      // setactivity(null);
    };
  }, []);

  useEffect(() => {
    let unSuscribe = () => {};
    if (cEventUser.status === "LOADED" && cEventUser.value != null) {
      //@ts-ignore
      cSurveys.set_current_activity(currentActivity);

      if (cEvent.value.type_event !== "physicalEvent") {
        const eventId = cEvent.value._id;
        const activityId = props.match.params.activity_id;

        unSuscribe = checkinAttendeeInActivity(
          cEventUser.value,
          eventId,
          activityId
        );
      }
    }

    return () => unSuscribe();
  }, [currentActivity, cEventUser.status]);

  // useEffect(() => {
  // 	if (chatAttendeChats === '4') {
  // 		// const sharedProperties: CSSProperties = {
  // 		// 	position: 'fixed',
  // 		// 	right: '0',
  // 		// 	width: '170px',
  // 		// };
  // 		// const verticalVideo = isMobile ? { top: '5%' } : { bottom: '0' };
  // 		// setVideoStyles({
  // 		// 	...sharedProperties,
  // 		// 	...verticalVideo,
  // 		// 	zIndex: '100',
  // 		// 	transition: '300ms',
  // 		// });
  // 		// const verticalVideoButton = isMobile ? { top: '9%' } : { bottom: '27px' };
  // 		// setVideoButtonStyles({
  // 		// 	...sharedProperties,
  // 		// 	...verticalVideoButton,
  // 		// 	zIndex: '101',
  // 		// 	cursor: 'pointer',
  // 		// 	display: 'block',
  // 		// 	height: '96px',
  // 		// });
  // 	} else {
  // 		// setVideoStyles({ width: '100%', height: '80vh', transition: '300ms' });
  // 		// setVideoButtonStyles({ display: 'none' });
  // 	}
  // }, [chatAttendeChats, isMobile]);

  // VALIDAR ACTIVIDADES POR CODIGO
  useEffect(() => {
    if (cEvent.value && cUser.value) {
      if (cEvent.value?._id === "61200dfb2c0e5301fa5e9d86") {
        if (activitiesCode.includes(props.match.params.activity_id)) {
          if (cEventUser.value) {
            if (
              codeActivity.includes(cEventUser.value?.properties.codigo) ||
              cityValid.includes(cEventUser.value?.properties.ciudad)
            ) {
              setblockActivity(false);
            } else {
              setblockActivity(true);
            }
          }
        }
      } else {
        setblockActivity(false);
      }
    }
  }, [cEvent.value, cEventUser.value, cUser.value]);

  const agenda = () => {
    props.history.push({
      pathname: `/landing/${eventId}/agenda`,
    });
  };
  const userType = cEventUser.value?.properties.list_type_user;
  const MIN_vALUE = 0;

  if (!dataTypes.includes(userType) && dataTypes.length > MIN_vALUE) {
    return (
      <div className="mediaplayer" style={{ background: "white" }}>
        <Result
          status="403"
          title="No estás autorizado para ver este recurso"
          extra={
            <Button
              type="primary"
              onClick={() => {
                agenda();
              }}
            >
              Volver
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div>
      {/*Interfaz mensaje de notificación*/}
      {cEventUser.value.rol.name === "Administrator" && (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <Space direction="vertical">
            <Card style={{ backgroundColor: "white" }}>
              <Space direction="vertical">
                {isEditing ? (
                  <ReactQuill value={message} onChange={handleQuillChange} />
                ) : (
                  <Input
                    placeholder="Escribe tu mensaje.."
                    onFocus={() => setIsEditing(true)}
                    value={stripHtmlTags(message)}
                  />
                )}
                {isMessageSent ? (
                  <Button type="primary" onClick={hiddenNotify}>
                    Ocultar Notificación
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    onClick={handleSendMessage}
                    disabled={message === "<p><br></p>" || !message}
                  >
                    Enviar Notificación
                  </Button>
                )}
              </Space>
            </Card>
          </Space>
        </div>
      )}
      <div className=" container_agenda-information container-calendar2">
        <Card
          style={{ padding: "1 !important" }}
          className="agenda_information"
        >
          {/* <HeaderColumnswithContext isVisible={true} /> */}
          {!blockActivity ? (
            <>
              {props.match.params.activity_id === "61992d5f020bde260e068402" &&
              cEventUser.value.user.rol_id !== "619d0c9161162b7bd16fcb82" ? (
                <Alert
                  showIcon
                  style={{
                    width: "100%",
                    marginTop: 40,
                    marginBottom: 40,
                    textAlign: "center",
                    fontSize: "19px",
                  }}
                  message={
                    <>
                      {`Hola ${cEventUser.value.user.displayName} 👋, Este contenido es exclusivo para usuarios con paquete UNIVERSO`}
                    </>
                  }
                  type="warning"
                />
              ) : (
                <HCOActividad />
              )}
            </>
          ) : (
            <>
              <Row>
                {/* <ImageComponentwithContext /> */}
                <Alert
                  showIcon
                  style={{
                    width: "100%",
                    marginTop: 40,
                    marginBottom: 40,
                    textAlign: "center",
                    fontSize: "19px",
                  }}
                  message={
                    <>
                      ¿Quieres acceder a la membresía del taller? ingresa aqui:{" "}
                      <a
                        style={{ color: "#3273dc" }}
                        target="_blank"
                        href="https://iberofest.co/producto/edc/"
                      >
                        https://iberofest.co/producto/edc/
                      </a>{" "}
                    </>
                  }
                  type="warning"
                />
              </Row>
            </>
          )}
          <div
            style={{
              width: "100%",
              padding: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Space direction="vertical" align="center">
              {/* {cEvent.value?.bingo && (
								<>
									<Button
										size='large'
										type='primary'
										onClick={() => {
											setOpenOrCloseModalDrawer(true);
										}}>
										¡Jugar BINGO!
									</Button>

									<DrawerBingo openOrClose={openOrCloseModalDrawer} setOpenOrClose={setOpenOrCloseModalDrawer} />
								</>
							)} */}
              {sharePhotoEventStatus && (
                <SharePhotoInLanding eventId={cEvent.value._id} />
              )}
              {millonaireEventSatus && <PlayMillonaire />}
              {whereIsEventStatus && (
                <WhereisInLanding eventId={cEvent.value._id} />
              )}
              {/* { <PrintBingoCartonButton /> } */}
            </Space>
          </div>
          {/* @ts-ignore */}
          <AditionalInformation orderedHost={orderedHost} />
        </Card>
      </div>
      {/* Drawer encuestas */}
      <SurveyDrawer
        colorFondo={cEvent.value.styles.toolbarDefaultBg}
        colorTexto={cEvent.value.styles.textMenu}
      />
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  mainStageContent: state.stage.data.mainStage,
  userInfo: state.user.data,
  currentActivity: state.stage.data.currentActivity,
  currentSurvey: state.survey.data.currentSurvey,
  hasOpenSurveys: state.survey.data.hasOpenSurveys,
  tabs: state.stage.data.tabs,
  generalTabs: state.tabs.generalTabs,
  permissions: state.permissions,
  isVisible: state.survey.data.surveyVisible,
  viewSocialZoneNetworking: state.spaceNetworkingReducer.view,
});

const mapDispatchToProps = {
  setTopBanner,
  setVirtualConference,
  setHasOpenSurveys,
};

// let AgendaActividadDetalleWithContext = WithEviusContext(AgendaActividadDetalle);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AgendaActividadDetalle));
