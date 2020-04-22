//external
import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import GoogleMapReact from "google-map-react";
import Moment from "moment";
import momentLocalizer from "react-widgets-moment";
import firebase from "firebase";
import app from "firebase/app";
import ReactQuill from "react-quill";
import ReactPlayer from "react-player";
import { Layout, Menu, Affix, Drawer, Button, Col, Card, Row } from "antd";
import { MenuOutlined, RightOutlined, LeftOutlined } from "@ant-design/icons";

//custom
import { Actions, EventsApi, SpeakersApi } from "../../helpers/request";
import Loading from "../loaders/loading";
import { BaseUrl, EVIUS_GOOGLE_MAPS_KEY } from "../../helpers/constants";
import Slider from "../shared/sliderImage";
import Dialog from "../modal/twoAction";
import TicketsForm from "../tickets/formTicket";
import CertificadoLanding from "../certificados/cerLanding";
import AgendaForm from "./agendaLanding";
import SpeakersForm from "./speakers";
import SurveyForm from "./surveys";
import DocumentsForm from "../landingDocuments/documents";
import FaqsForm from "../faqsLanding";
import NetworkingForm from "../networking";
import WallForm from "../wall/index";
import ZoomComponent from "./zoomComponent";
import MenuEvent from "./menuEvent";
import BannerEvent from "./bannerEvent"

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

Moment.locale("es");
momentLocalizer();

const html = document.querySelector("html");
const AnyReactComponent = ({ text }) => <div>{text}</div>;
let factor = 0.3;

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
      color: "",
      collapsed: false,
      visible: false,
      placement: "left"
    };
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  /*componentDidUpdate(prevProps) {
        if (this.props.location === prevProps.location) {
            window.scrollTo(0, 0)
        }
    }*/

  showDrawer = () => {
    this.setState({
      visible: true
    });
  };

  onClose = () => {
    this.setState({
      visible: false
    });
  };

  onChange = e => {
    this.setState({
      placement: e.target.value
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
    const queryParamsString = this.props.location.search.substring(1), // remove the "?" at the start
      searchParams = new URLSearchParams(queryParamsString),
      status = searchParams.get("status");
    const id = this.props.match.params.event;

    const event = await EventsApi.landingEvent(id);
    const sessions = await Actions.getAll(`api/events/${id}/sessions`);

    this.loadDynamicEventStyles(id);

    if (status === "5b859ed02039276ce2b996f0") {
      this.setState({ showConfirm: true });
    }
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
          <div className="description-container column is-8">
            <Card
              className="event-description"
              bodyStyle={{ padding: "25px 5px" }}
              bordered={true}
            >
              <h1 className="is-size-4-desktop has-text-weight-semibold">{event.name}</h1>

              <div className="column is-centered">
                <ReactPlayer
                  width={"100%"}
                  height={"auto"}
                  style={{
                    display: "block",
                    margin: "0 auto"
                  }}
                  url="https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/eviuswebassets%2FLa%20asamblea%20de%20copropietarios_%20una%20pesadilla%20para%20muchos.mp4?alt=media&token=b622ad2a-2d7d-4816-a53a-7f743d6ebb5f"
                  controls
                />
              </div>

              <div>
                {typeof event.description === "string" ? (
                  <ReactQuill value={event.description} modules={{ toolbar: false }} readOnly={true} theme="bubble" />
                ) : (
                    "json"
                  )}
              </div>
            </Card>
          </div>
          <MapComponent event={event} />
        </div>
      )
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
        }
      },
      //Disabled accountchooser
      credentialHelper: "none",
      // Terms of service url.
      tosUrl: `${BaseUrl}/terms`,
      // Privacy policy url.
      privacyPolicyUrl: `${BaseUrl}/privacy`
    };
    ui.start("#firebaseui-auth-container", uiConfig);
  };
  openLogin = () => {
    html.classList.add("is-clipped");
    this.setState({ modal: true, modalTicket: false });
  };
  closeLogin = user => {
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

  showSection = section => {
    this.setState({ section });
    this.setState({ visible: false });
    console.log(this.state.section);
  };

  toggleConference = (state, meeting_id) => {
    if (meeting_id != undefined) {
      this.setState({ meeting_id });
    }
    this.setState({ showIframeZoom: state });
  };

  render() {
    const { event, modal, modalTicket, section, sections, showIframeZoom, meeting_id } = this.state;
    return (
      <section className="section landing" style={{ backgroundColor: this.state.color }}>
        {this.state.showConfirm && (
          <div className="notification is-success">
            <button
              className="delete"
              onClick={e => {
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
                {showIframeZoom && <ZoomComponent hideIframe={this.toggleConference} meetingId={meeting_id} />}

                {/* Componente banner */}

                <BannerEvent
                  bgImage={event.picture ? event.picture : "https://bulma.io/images/placeholders/1280x960.png"}
                  title={event.name}
                  organizado={
                    <Link
                      to={`/page/${event.organizer_id}?type=${event.organizer_type}`}>
                      {event.organizer.name ? event.organizer.name : event.organizer.email}
                    </Link>
                  }
                  place={<span>{event.venue} {event.location.FormattedAddress}</span>
                  }
                  dateStart={event.date_start}
                  dateEnd={event.date_end}
                />

                {/* fin del banner */}

              </div>

              {/* Menú secciones del landing */}
              <Content>
                <Layout className="site-layout">

                  {/*Aqui empieza el menu para dispositivos >  */}
                  <div className="hiddenMenu_Landing">
                    <Sider
                      className="containerMenu_Landing"
                      trigger={null}
                      collapsible
                      collapsed={this.state.collapsed}
                      width={250}>
                      <div className="items-menu_Landing ">
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
                            onClick: this.toggle
                          })}
                        </Button>
                      </div>

                      {/*Aqui empieza el menu para dispositivos < tablet*/}

                      <div className="hiddenMenuMobile_Landing">
                        <Button block onClick={this.showDrawer}>
                          {React.createElement(MenuOutlined, {
                            className: "trigger",
                            onClick: this.toggle
                          })}
                          Menu
                        </Button>
                      </div>

                      <Drawer
                        title="Menu"
                        placement={this.state.placement}
                        closable={true}
                        onClose={this.onClose}
                        visible={this.state.visible}
                        maskClosable={true}
                        bodyStyle={{ padding: "0px" }}>
                        <MenuEvent showSection={this.showSection} />
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
                  onClick={e => {
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
                  action: this.openLogin
                }}
                second={{ title: "Cancelar", class: "", action: this.closeModal }}
              />
            </React.Fragment>
          )}
      </section>
    );
  }
}

//Component del lado del mapa
const MapComponent = props => {
  const { event } = props;
  return (
    <div className="column container-map">
      <div>
        {
          (console.log(event),
            event.type_event === "onlineEvent" ? (
              <div>
                <ReactQuill
                  value="Este tipo de evento es virtual, Accede directo a la conferencia desde el listado de Agenda"
                  modules={{ toolbar: false }}
                  readOnly={true}
                />
              </div>
            ) : (
                <div>
                  <Card>
                    <div className="map-head">
                      <h2 className="title is-size-5 has-text-left has-padding-top-15">
                        <b>Encuentra la ubicación</b>

                      </h2>
                      <div className="lugar item columns">
                        <div className="column is-12 container-icon hours has-text-left">
                          <span className="icon is-small">
                            <i className="far fa-clock" />
                          </span>
                          <span className="subt is-size-6 has-text-left">
                            {""} Desde {Moment(event.hour_start).format("HH:mm")}
                          </span>
                          <span className="subt is-size-6 has-text-left"> a {Moment(event.hour_end).format("HH:mm")}</span>
                        </div>
                      </div>
                      <div className="lugar item columns">
                        <div className="column is-12 container-icon has-text-left">
                          <span className="icon is-small">
                            <i className="fas fa-map-marker-alt" />
                          </span>
                          <span className="has-text-left">
                            {""} {event.venue} {event.location.FormattedAddress}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                  <div style={{ height: "400px", width: "100%" }}>
                    <GoogleMapReact
                      bootstrapURLKeys={{ key: EVIUS_GOOGLE_MAPS_KEY }}
                      defaultCenter={{
                        lat: event.location.Latitude,
                        lng: event.location.Longitude
                      }}
                      defaultZoom={11}>
                      <AnyReactComponent lat={event.location.Latitude} lng={event.location.Longitude} text="My Marker" />
                    </GoogleMapReact>
                  </div>
                </div>
              ))
        }
      </div>

      {/* ESTO ES UNA PRUEBA PARA UN BANNER DE PUBLICIDAD*/}
      <div className="has-margin-top-50 is-hidden-touch" >
        <img style={{ width: "100%" }} src="http://www.ofifacil.com/ideas-ejemplos/varios/ofifacil-hacer-pagina-web-diseno-grafico-023.gif" alt="" srcset="" />
      </div>
    </div>
  );
};

export default withRouter(Landing);
