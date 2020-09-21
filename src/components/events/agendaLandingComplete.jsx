import React, { Component, Fragment } from "react";
import { notification } from "antd";
import API, { AgendaApi, SpacesApi, SurveysApi, DocumentsApi, Activity } from "../../helpers/request";
import * as Cookie from "js-cookie";
import AgendaActividadDetalle from "./agendaActividadDetalle";
import { firestore } from "../../helpers/firebase";
import AgendaActivityItem from './AgendaActivityItem'

class AgendaLandingComplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      showButtonDocuments: false,
      showButtonSurvey: false,
      spaces: [],
      currentActivity: null,
      survey: [],
      loading: false,
      userId: null,
      userAgenda: []
    }
  }

  componentDidMount() {    
    this.getCurrentUser()
    this.getDataAgenda()    
  }

  getCurrentUser = async () => {
    let evius_token = Cookie.get("evius_token");

    if (!evius_token) {
      this.setState({ user: false });
    } else {
      try {
        const resp = await API.get(`/auth/currentUser?evius_token=${Cookie.get("evius_token")}`);
        if (resp.status === 200) {
          const data = resp.data;
          // Solo se desea obtener el id del usuario                    
          this.setState({ uid: data._id })

          this.setState({ userId: data._id })
        }
      } catch (error) {
        const { status } = error.response;
        console.error('Error:', status)
      }
    }
  };

  async getDataAgenda() {
    const { eventId, event } = this.props    

    this.setState({ showInscription: event.styles && event.styles.show_inscription ? event.styles.show_inscription : false })
    // Se consulta a la api de agenda
    const { data } = await AgendaApi.byEvent(eventId);
    this.listeningStateMeetingRoom(data)
    //se consulta la api de espacios para
    let space = await SpacesApi.byEvent(eventId);

    let surveysData = await SurveysApi.getAll(eventId);
    let documentsData = await DocumentsApi.getAll(eventId)

    if (surveysData.data.length >= 1) {
      this.setState({ showButtonSurvey: true })
    }
    if (documentsData.data.length >= 1) {
      this.setState({ showButtonDocuments: true })
    }

    this.setState({ data, spaces: space });
  }

  async listeningStateMeetingRoom(list) {
    list.forEach((activity, index, arr) => {
      firestore
        .collection("events")
        .doc(this.props.event._id)
        .collection("activities")
        .doc(activity._id)
        .onSnapshot((infoActivity) => {
          if (!infoActivity.exists) return;
          let { habilitar_ingreso } = infoActivity.data();
          let updatedActivityInfo = { ...arr[index], habilitar_ingreso };

          arr[index] = updatedActivityInfo;
          this.setState({ data: arr });
        });
    });

  }

  gotoActivity(activity) {
    this.setState({ currentActivity: activity });

    //Se trae la funcion survey para pasarle el objeto activity y asi retornar los datos que consulta la funcion survey
    this.survey(activity);
  }

  async survey(activity) {
    //Con el objeto activity se extrae el _id para consultar la api y traer la encuesta de ese evento
    const survey = await SurveysApi.getByActivity(this.props.event._id, activity._id);
    this.setState({ survey: survey });
  }

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    this.setState({ visible: false });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  gotoActivityList = () => {
    this.setState({ currentActivity: null });
  };

  //Funcion para ejecutar el filtro por espacio y mandar el espacio a filtrar
  selectSpace(space) {
    const filtered = this.filterBySpace(space, this.state.list);
    this.setState({ filtered, toShow: filtered, space });
  }

  // Funcion para registrar usuario en la actividad
  registerInActivity = async (activityId, eventId, userId, callback) => {
    Activity.Register(eventId, userId, activityId)
    .then(() => {
      notification.open({
        message: 'Inscripción realizada',
      });
      callback(true)
    })
    .catch((err) => {
      notification.open({
        message: err,
      });
    });
  };

  async getAgendaUser() {

    const { event } = this.props
    
    try {
      const infoUserAgenda = await Activity.GetUserActivity(event._id, this.state.userId)
      this.setState({userAgenda: infoUserAgenda.data})      
    } catch (e) {
      console.error(e)
    }
  } 

  checkInscriptionStatus(activityId = ''){
    const { userAgenda } = this.state
    const checkInscription = userAgenda.filter((activity) => activity.activity_id === activityId)
    const statusInscription = checkInscription.length ? true: false
    return statusInscription  
  }

  render() {
    const { toggleConference } = this.props;
    const { data, showInscription, showButtonSurvey, showButtonDocuments, spaces, currentActivity, survey, visible, loading } = this.state
    return (
      <Fragment>
        {currentActivity && (
          <AgendaActividadDetalle
            visible={visible}
            onClose={this.onClose}
            showDrawer={this.showDrawer}
            matchUrl={this.props.matchUrl}
            survey={survey}
            currentActivity={currentActivity}
            image_event={this.props.event.styles.event_image}
            gotoActivityList={this.gotoActivityList}
            toggleConference={toggleConference}
          />
        )}
        {
          !currentActivity && !loading && (
            <div className="container-calendar-section">
              <div className="columns is-centered">
                <div className="container-calendar is-three-fifths">
                  {spaces && spaces.length > 1 && (
                    <>
                      <p className="is-size-5">Seleccióne el espacio</p>
                      <div
                        className="select is-fullwidth is-three-fifths has-margin-bottom-20"
                        style={{ height: "3rem" }}>
                        <select
                          id="selectedSpace"
                          onClick={this.selectionSpace}
                          className="has-text-black  is-pulled-left"
                          style={{ height: "3rem" }}>
                          <option onClick={this.returnList}>Todo</option>
                          {spaces.map((space, key) => (
                            <option
                              onClick={() => this.selectSpace(space.name, space.datetime_start, space.datetime_start)}
                              key={key}>
                              {space.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}

                  {/* Contenedor donde se pinta la información de la agenda */}

                  {data.map((item, index) => {
                    const isRegistered = this.checkInscriptionStatus(item._id)
                    return (
                      <AgendaActivityItem 
                      item={item} 
                      key={index}
                      showButtonDocuments={showButtonDocuments}
                      showButtonSurvey={showButtonSurvey}
                      toggleConference={toggleConference}
                      event_image={this.props.event.event_image}
                      gotoActivity={this.gotoActivity}
                      registerInActivity={this.registerInActivity}
                      registerStatus={isRegistered}
                      eventId={this.props.eventId}
                      userId={this.state.userId}
                      />
                  )})}
                </div>
              </div>
            </div>
          )
        }
      </Fragment>
    )
  }
}

export default AgendaLandingComplete