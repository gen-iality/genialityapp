import React, { Component } from "react"
import { Link } from 'react-router-dom'
import { withRouter } from "react-router-dom"
import { Card } from "antd";
import ReactQuill from "react-quill";
import ReactPlayer from "react-player";
import { Row, Col } from 'antd';
import { AgendaApi } from '../../helpers/request'
import { getCurrentUser, getCurrentEventUser, userRequest } from "../networking/services";
import * as Cookie from "js-cookie";
import { parseUrl } from '../../helpers/constants'
import AgendaActividadDetalle from '../../components/events/agendaActividadDetalle'

class eventLanding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onPage: "event",
      activityId: null,
      activityDetail: null
    }
    this.onChangePage = this.onChangePage.bind(this)
  }

  async componentDidMount() {

    const { event } = this.props
    let currentUser = Cookie.get("evius_token");

    if (currentUser) {
      let eventUserList = await userRequest.getEventUserList(event._id, Cookie.get("evius_token"));
      let user = await getCurrentUser(currentUser);
      const eventUser = await getCurrentEventUser(event._id, user._id);

      this.setState({ users: eventUserList, eventUser, eventUserId: eventUser._id, currentUserName: eventUser.names || eventUser.email });
    } else {
      this.setState({ onPage: "event" })
    }
    this.setState({ onPage: "event" })

  }

  async componentDidUpdate() {

    //Utilizada para concatenar parametros
    this.currentUrl = window.location.href;
    this.urlParams = parseUrl(this.currentUrl)

    const { event } = this.props

    //Si existe el activity_id por urlParams entonces seteamos el estado
    if (this.urlParams.activity_id) {
      const activity = await AgendaApi.getOne(this.urlParams.activity_id, event._id)
      this.setState({
        activityId: this.urlParams.activity_id,
        activityDetail: activity
      })
    }
  }


  onChangePage(value) {
    this.props.showSection(value)
  }

  onClick() {
    this.setState({ onClick: true })
  }

  /* Consultar las actividades de la agenda del evento */
  getActivities = async (eventId) => {
    // Se consulta a la api de agenda
    const { data } = await AgendaApi.byEvent(eventId);
    return data
  };

  render() {

    const { event } = this.props

    return (

      <div style={{ marginBottom: 12 }}>

        <Card className="event-description" bodyStyle={{ padding: "25px 5px" }} bordered={true} style={event.styles && event.styles.show_card_banner && event.styles.show_card_banner === true ? { marginTop: "23%" } : { marginTop: "0px" }}>

          {
            event._id === "5f0622f01ce76d5550058c32" ?
              <></> :
              (
                <>
                  <h1 className="is-size-4-desktop has-text-weight-semibold">{event.name}</h1>
                  <ReactQuill value={event.description} modules={{ toolbar: false }} readOnly={true} theme="bubble" />
                </>
              )
          }
          {/* Si event video existe */}
          {
            event.video && (
              <div className="column is-centered mediaplayer">
                <ReactPlayer
                  width={"100%"}
                  height={"500px"}
                  style={{
                    display: "block",
                    margin: "0 auto",
                  }}
                  url={event.video}
                  controls
                />
              </div>
            )}
          {/* {
            (event._id !== "5f0622f01ce76d5550058c32" && !this.state.activityId) && (
              <div>
                <ReactQuill value={event.description} modules={{ toolbar: false }} readOnly={true} theme="bubble" />
              </div>
            )
          } */}
          {/*Contenedor personalizado FENALCO*/}
          {
            event._id === "5f0622f01ce76d5550058c32" && (
              <div>
                <div className="containerfenalco">
                  <Row gutter={[8, 16]} justify="center">
                    <Col xs={24} sm={12} md={12} lg={12} xl={8}>
                      <div className="imagen">
                        <img onClick={() => this.onChangePage("interviews")} alt="interviews" style={{ cursor: 'pointer' }} src="https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Btn-A3.png?alt=media&token=3ff840dc-d9a6-4ea1-9e9c-a623cb796ef5" />
                      </div>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={12} xl={8}>
                      <div className="imagen">
                        <img onClick={() => this.onChangePage("networking")} alt="networking" style={{ cursor: 'pointer' }} src="https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Btn-B3.png?alt=media&token=d9a64548-1fed-43d8-9adf-3aaee0e719f5" />
                      </div>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={12} xl={8}>
                      <img onClick={() => this.onChangePage("agenda")} alt="agenda" style={{ cursor: 'pointer' }} src="https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Btn-C3.png?alt=media&token=615fb718-af55-478f-b444-d8486edfc24a" />
                    </Col>
                  </Row>
                </div>
              </div>
            )
          }
          {
            event._id === "5f282d98c32fa03a4299582d" && (
              <div>
                <div className="containerfenalco">
                  <Row gutter={[8, 16]} justify="center">
                    <Col xs={24} sm={12} md={12} lg={12} xl={8}>
                      <div className="imagen">
                        <img onClick={() => this.onChangePage("interviews")} alt="interviews" style={{ cursor: 'pointer' }} src="https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Btn-A3.png?alt=media&token=3ff840dc-d9a6-4ea1-9e9c-a623cb796ef5" />
                      </div>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={12} xl={8}>
                      <div className="imagen">
                        <img onClick={() => this.onChangePage("networking")} alt="networking" style={{ cursor: 'pointer' }} src="https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Btn-B3.png?alt=media&token=d9a64548-1fed-43d8-9adf-3aaee0e719f5" />
                      </div>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={12} xl={8}>
                      <img onClick={() => this.onChangePage("agenda")} alt="agenda" style={{ cursor: 'pointer' }} src="https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Btn-C3.png?alt=media&token=615fb718-af55-478f-b444-d8486edfc24a" />
                    </Col>
                  </Row>
                </div>
              </div>
            )
          }
          {/*Contenedor personalizado COMPENSAR - Detalle del Evento*/}
          {
            (event._id === "5f4e41d5eae9886d464c6bf4" && !this.state.activityId) && (
              <div>
                <div className="containerGaming">
                  <Row gutter={[12, 12]}>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                      <div className="imagen">
                        <Link to={`?activity_id=5f52b54bcb6b4f4301100bd4`}>
                          <img style={{ cursor: 'pointer' }} src="https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/imageFirst.jpg?alt=media&token=5b5fe5a7-d76b-42d2-bea9-13292e138528" />
                        </Link>
                      </div>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                      <div className="imagen">
                        <Link to={`?activity_id=5f52be8902804145fa62a7c2`}>
                          <img style={{ cursor: 'pointer' }} src="https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/callOfDutti.jpg?alt=media&token=920646aa-50b9-4a4b-97e9-d18d62f6a9ca" />
                        </Link>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            )
          }
          {
            event._id === "5f7f21217828e17d80642856" && (
              <div>
                <div className="containerRuedaNaranja">
                  <Row gutter={[8, 16]} justify="center">
                    <Col xs={24} sm={12} md={12} lg={8} xl={4}>
                      <div className="imagen">
                        <img onClick={() => this.onChangePage("informativeSection")} style={{ cursor: 'pointer' }} alt="preparate" src="https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/RuedaNaranja%2F2020-10-27%20(3).png?alt=media&token=fe3e47b7-a4e1-4b73-bd48-573f9361389e" />
                      </div>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={8} xl={4}>
                      <div className="imagen">
                        <img onClick={() => this.onChangePage("networking")} style={{ cursor: 'pointer' }} alt="agendate" src="https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/RuedaNaranja%2F2020-10-27.png?alt=media&token=1d99a1ac-4353-45a8-80f7-7aae6ed441f9" />
                      </div>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={8} xl={4}>
                      <img onClick={() => this.onChangePage("interviews")} style={{ cursor: 'pointer' }} alt="negocia" src="https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/RuedaNaranja%2F2020-10-27%20(2).png?alt=media&token=45f1e902-c9d8-4565-a346-27182ec80cf7" />
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={8} xl={4}>
                      <img onClick={() => this.onChangePage("agenda")} style={{ cursor: 'pointer' }} alt="inspirate" src="https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/ruedasNaranja%2F2020-10-27%20(1).png?alt=media&token=70c15313-9fde-4a8c-ae77-41a657e95415" />
                    </Col>
                  </Row>
                </div>
              </div>
            )
          }
        </Card>
        {/*Contenedor personalizado COMPENSAR - Detalle de la actividad del evento*/}
        {
          (event._id === "5f4e41d5eae9886d464c6bf4" && this.state.activityId) && (
            <AgendaActividadDetalle
              currentActivity={this.state.activityDetail}
            />
          )
        }
      </div>
    )
  }
}


export default withRouter(eventLanding)