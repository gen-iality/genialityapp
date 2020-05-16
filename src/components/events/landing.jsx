//external
import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import Moment from "moment";
import momentLocalizer from "react-widgets-moment";
import firebase from "firebase";
import app from "firebase/app";
import { Layout, Menu, Affix, Drawer, Button, Col, Card, Row } from "antd";
import { MenuOutlined, RightOutlined, LeftOutlined } from "@ant-design/icons";
import { List, Avatar, Typography } from "antd";
import { MessageOutlined, LikeOutlined, StarOutlined } from "@ant-design/icons";
//custom
import API, { Actions, EventsApi, AgendaApi, SpeakersApi } from "../../helpers/request";
import * as Cookie from "js-cookie";
import Loading from "../loaders/loading";
import { BaseUrl } from "../../helpers/constants";
import Slider from "../shared/sliderImage";
import Dialog from "../modal/twoAction";
import TicketsForm from "../tickets/formTicket";
import CertificadoLanding from "../certificados/cerLanding";
import AgendaForm from "./agendaLanding";
import SpeakersForm from "./speakers";
import SurveyForm from "./surveys";
import DocumentsForm from "../documents/front/documentsLanding";

import FaqsForm from "../faqsLanding";
import NetworkingForm from "../networking";
import WallForm from "../wall/index";
import ZoomComponent from "./zoomComponent";
import MenuEvent from "./menuEvent";
import BannerEvent from "./bannerEvent";
import VirtualConference from "./virtualConference";
import SurveyNotification from "./surveyNotification";
import MapComponent from "./mapComponet"
import EventLanding from "./eventLanding";

const { Title } = Typography;

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

Moment.locale("es");
momentLocalizer();

const html = document.querySelector("html");

const drawerButton = {
  height: "46px",
  padding: "7px 10px",
  fontSize: "10px",
};

const IconText = ({ icon, text }) => (
  <span>
    {React.createElement(icon, { style: { marginRight: 8 } })}
    {text}
  </span>
);
const imageCenter = {
  maxWidth: "100%",
  minWidth: "100%",
  margin: "0 auto",
  display: "block",
};

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      modalTicket: false,
      modal: false,
      editorState: "",
      sections: {},
      section: "evento",
      showIframeZoom: false,
      meeting_id: null,
      userEntered: null,
      color: "",
      collapsed: false,
      visible: false,
      placement: "left",
      headerVisible: "true",
      namesUser: "",
      data: null,
      activitySurvey: null,
    };
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  hideHeader = () => {
    this.setState({
      headerVisible: false,
    });
  };

  /*componentDidUpdate(prevProps) {
        if (this.props.location === prevProps.location) {
            window.scrollTo(0, 0)
        }
    }*/

  showDrawer = () => {
    this.setState({
      visible: true,
    });
    this.hideHeader();
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  onChange = (e) => {
    this.setState({
      placement: e.target.value,
    });
  };

  /* Carga  dinamicamente los colores base para el evento */
  async loadDynamicEventStyles(eventId) {
    const eventStyles = await EventsApi.getStyles(eventId);

    var oldStyle = document.getElementById("eviusDynamicStyle");
    if (oldStyle) oldStyle.parentNode.removeChild(oldStyle);

    var head = document.getElementsByTagName("head")[0];
    var styleElement = document.createElement("style");
    styleElement.innerHTML = eventStyles;
    styleElement.type = "text/css";
    styleElement.id = "eviusDynamicStyle";
    document.body.appendChild(styleElement);
    head.append(styleElement);
    /* Fin Carga */
  }

  async componentDidMount() {
    try {
      const resp = await API.get(`/auth/currentUser?evius_token=${Cookie.get("evius_token")}`);
      console.log("respuesta status", resp.status !== 202);
      if (resp.status !== 200 && resp.status !== 202) return;

      const data = resp.data;

      console.log("USUARIO", data);
      this.setState({ data, namesUser: data.names || data.displayName || "" });
    } catch { }
    const queryParamsString = this.props.location.search.substring(1), // remove the "?" at the start
      searchParams = new URLSearchParams(queryParamsString),
      status = searchParams.get("status");
    const id = this.props.match.params.event;
    console.log(id);

    const event = await EventsApi.landingEvent(id);
    const sessions = await Actions.getAll(`api/events/${id}/sessions`);

    this.loadDynamicEventStyles(id);

    const dateFrom = event.datetime_from.split(" ");
    const dateTo = event.datetime_to.split(" ");
    event.hour_start = Moment(dateFrom[1], "HH:mm").toDate();
    event.hour_end = Moment(dateTo[1], "HH:mm").toDate();
    event.date_start = dateFrom[0];
    event.date_end = dateTo[0];
    event.sessions = sessions;
    event.organizer = event.organizer ? event.organizer : event.author;
    event.event_stages = event.event_stages ? event.event_stages : [];

    // manda el color de fondo al state para depues renderizarlo
    this.setState({ color: "#E6F7FE" });
    console.log("s", event);
    const sections = {
      agenda: <AgendaForm event={event} eventId={event._id} showIframe={this.toggleConference} />,
      tickets: (
        <TicketsForm
          stages={event.event_stages}
          experience={event.is_experience}
          fees={event.fees}
          tickets={event.tickets}
          eventId={event._id}
          seatsConfig={event.seats_configuration}
          handleModal={this.handleModal}
        />
      ),
      survey: <SurveyForm event={event} />,
      certs: <CertificadoLanding event={event} tickets={event.tickets} />,
      speakers: <SpeakersForm eventId={event._id} />,
      wall: <WallForm event={event} eventId={event._id} />,
      documents: <DocumentsForm event={event} eventId={event._id} />,
      faqs: <FaqsForm event={event} eventId={event._id} />,
      networking: <NetworkingForm event={event} eventId={event._id} />,
      evento: (
        <div className="columns is-centered">
          <EventLanding event={event} />
          <MapComponent event={event} toggleConference={this.toggleConference} namesUser={this.state.namesUser} />
        </div>
      ),
    };
    this.setState({ event, loading: false, sections }, () => {
      this.firebaseUI();
      this.handleScroll();
    });
  }

  firebaseUI = () => {
    //FIREBSAE UI
    const firebaseui = global.firebaseui;
    let ui = firebaseui.auth.AuthUI.getInstance();
    if (!ui) {
      ui = new firebaseui.auth.AuthUI(firebase.auth());
    }
    const uiConfig = {
      //POPUP Facebook/Google
      signInFlow: "popup",
      //The list of providers enabled for signing
      signInOptions: [app.auth.EmailAuthProvider.PROVIDER_ID],
      //Allow redirect
      callbacks: {
        signInSuccessWithAuthResult: (authResult, redirectUrl) => {
          const user = authResult.user;
          this.closeLogin(user);
          return false;
        },
      },
      //Disabled accountchooser
      credentialHelper: "none",
      // Terms of service url.
      tosUrl: `${BaseUrl}/terms`,
      // Privacy policy url.
      privacyPolicyUrl: `${BaseUrl}/privacy`,
    };
    ui.start("#firebaseui-auth-container", uiConfig);
  };

  openLogin = () => {
    html.classList.add("is-clipped");
    this.setState({ modal: true, modalTicket: false });
  };
  closeLogin = (user) => {
    html.classList.remove("is-clipped");
    this.setState({ modal: false });
    if (user) {
      const { event, stage, ticket } = this.state;
      localStorage.setItem("stage", stage);
      localStorage.setItem("ticket", ticket);
      window.location.replace(
        `https://api.evius.co/api/user/loginorcreatefromtoken?evius_token=${user.ra}&refresh_token=${user.refreshToken}&destination=${BaseUrl}/landing/${event._id}`
      );
    }
  };

  handleScroll = () => {
    const hash = this.props.location.hash;
    if (hash) {
      document.getElementById(hash.substring(1)).scrollIntoView();
    }
  };

  handleModal = () => {
    html.classList.add("is-clipped");
    this.setState({ modal: false, modalTicket: true });
  };

  closeModal = () => {
    html.classList.remove("is-clipped");
    this.setState({ modal: false, modalTicket: false });
  };

  showSection = (section) => {
    this.setState({ section });
    this.setState({ visible: false });
    console.log(this.state.section);
  };

  toggleConference = (state, meeting_id, userEntered, activitySurvey) => {
    console.log("ACTIVANDOSE", meeting_id, state, userEntered, activitySurvey);
    if (meeting_id != undefined) {
      this.setState({ meeting_id, userEntered, activitySurvey });
    }
    this.setState({ showIframeZoom: state });
  };

  render() {
    const {
      event,
      modal,
      modalTicket,
      section,
      sections,
      showIframeZoom,
      meeting_id,
      userEntered,
      activitySurvey,
    } = this.state;
    return (
      <section className="section landing" style={{ backgroundColor: this.state.color }}>
        {this.state.showConfirm && (
          <div className="notification is-success">
            <button
              className="delete"
              onClick={(e) => {
                this.setState({ showConfirm: false });
              }}
            />
            Tu asistencia ha sido confirmada
          </div>
        )}
        {this.state.loading ? (
          <Loading />
        ) : (
            <React.Fragment>
              <div className="hero-head">
                {/* Condicion para mostrar el componente de zoom */}
                {showIframeZoom && (
                  <ZoomComponent
                    hideIframe={this.toggleConference}
                    meetingId={meeting_id}
                    userEntered={userEntered}
                    activitySurveyList={activitySurvey}
                    event={event}
                  />
                )}

                {/* ESTO ES UNA PRUEBA PARA LA ENCUESTA EN VIVO */}

                {/* <SurveyNotification /> */}

                {this.state.headerVisible && (
                  <BannerEvent
                    bgImage={
                      event.styles && event.styles.banner_image
                        ? event.styles.banner_image
                        : event.picture
                          ? event.picture
                          : "https://bulma.io/images/placeholders/1280x960.png"
                    }
                    bgImageText={event.styles && event.styles.event_image ? event.styles.event_image : ""}
                    title={event.name}
                    organizado={
                      <Link to={`/page/${event.organizer_id}?type=${event.organizer_type}`}>
                        {event.organizer.name ? event.organizer.name : event.organizer.email}
                      </Link>
                    }
                    place={
                      <span>
                        {event.venue} {event.location.FormattedAddress}
                      </span>
                    }
                    dateStart={event.date_start}
                    dateEnd={event.date_end}
                    type_event={event.type_event}
                  />
                )}
              </div>

              {/* Menú secciones del landing */}
              <Content>
                <Layout className="site-layout">
                  {/*Aqui empieza el menu para dispositivos >  */}
                  <div className="hiddenMenu_Landing">
                    <Sider
                      className="containerMenu_Landing"
                      style={{
                        backgroundColor:
                          event.styles && event.styles.toolbarDefaultBg ? event.styles.toolbarDefaultBg : "white",
                      }}
                      trigger={null}
                      collapsible
                      collapsed={this.state.collapsed}
                      width={250}>
                      <div className="items-menu_Landing ">
                        {event.styles && <img src={event.styles.event_image} style={imageCenter} />}
                        <MenuEvent eventId={event._id} showSection={this.showSection} collapsed={this.state.collapsed} />
                      </div>
                    </Sider>
                  </div>
                  {/*Aqui termina el menu para dispositivos >  */}

                  <Layout className="site-layout">
                    <Content className="site-layout-background">
                      {/* Boton que abre el menu para dispositivos > tablet  */}
                      <div className="hiddenMenu_Landing">
                        <Button onClick={this.toggle}>
                          {React.createElement(this.state.collapsed ? RightOutlined : LeftOutlined, {
                            className: "trigger",
                            onClick: this.toggle,
                          })}
                        </Button>
                      </div>

                      {/*Aqui empieza el menu para dispositivos < tablet*/}

                      <div className="hiddenMenuMobile_Landing">
                        <Button block style={drawerButton} onClick={this.showDrawer}>
                          <MenuOutlined style={{ fontSize: "15px" }} />
                          <div>Menu</div>
                        </Button>
                      </div>

                      <Drawer
                        title={event.name}
                        placement={this.state.placement}
                        closable={true}
                        onClose={this.onClose}
                        visible={this.state.visible}
                        maskClosable={true}
                        bodyStyle={{
                          padding: "0px",
                          backgroundColor:
                            event.styles && event.styles.toolbarDefaultBg ? event.styles.toolbarDefaultBg : "white",
                        }}>
                        {event.styles && <img src={event.styles.event_image} style={imageCenter} />}
                        <MenuEvent eventId={event._id} showSection={this.showSection} collapsed={this.state.collapsed} />
                      </Drawer>

                      {/* Contenedor donde se mapea la información de cada seccion */}

                      <div style={{ margin: "40px 6px", overflow: "initial", textAlign: "center" }}>
                        {sections[section]}
                      </div>
                    </Content>
                  </Layout>
                </Layout>
              </Content>

              {/* Final del menú  */}

              <div className={`modal ${modal ? "is-active" : ""}`}>
                <div className="modal-background"></div>
                <div className="modal-content">
                  <div id="firebaseui-auth-container" />
                </div>
                <button
                  className="modal-close is-large"
                  aria-label="close"
                  onClick={(e) => {
                    this.closeLogin();
                  }}
                />
              </div>
              <Dialog
                modal={modalTicket}
                title={"Atención!!"}
                content={
                  <p className="has-text-weight-bold">Para seleccionar tiquetes debes iniciar sesión o registrarse !!</p>
                }
                first={{
                  title: "Iniciar Sesión o Registrarse",
                  class: "is-info",
                  action: this.openLogin,
                }}
                second={{ title: "Cancelar", class: "", action: this.closeModal }}
              />
            </React.Fragment>
          )}
      </section>
    );
  }
}

export default withRouter(Landing);
