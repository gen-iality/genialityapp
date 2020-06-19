import React, { Component, Fragment, useState, useEffect } from "react";
import { Card, Button, Alert } from "antd";
import WithUserEventRegistered from "../shared/withUserEventRegistered";
import { AgendaApi, SurveysApi, TicketsApi } from "../../helpers/request";
import { firestore } from "../../helpers/firebase";
import TimeStamp from "react-timestamp";
import Moment from "moment";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Meta } = Card;

const MeetingConferenceButton = ({ activity, toggleConference, usuarioRegistrado }) => {
  const [infoActivity, setInfoActivity] = useState({});

  useEffect(() => {
    setInfoActivity(activity);
  }, [activity]);

  switch (infoActivity.habilitar_ingreso) {
    case "open_meeting_room":
      return (
        <>
          <Button
            size="large"
            type="primary"
            className="buttonVirtualConference"
            onClick={() => {
              toggleConference(true, infoActivity.meeting_id, infoActivity);
            }}>
            Entrar
          </Button>
        </>
      );
      break;

    case "closed_meeting_room":
      return <Alert message="El ingreso se habilitará minutos antes del evento" type="warning" showIcon />;
      break;

    case "ended_meeting_room":
      return <Alert message="El evento ha terminado" type="info" showIcon />;

      break;

    default:
      return <Alert message="El ingreso se habilitará minutos antes del evento" type="warning" showIcon />;
      break;
  }
};

class VirtualConference extends Component {
  constructor(props) {
    super(props);
    console.log(
      "INNER event",
      this.props.event,
      "CurrentUser",
      this.props.currentUser,
      "UsuarioRegistrado",
      this.props.usuarioRegistrado
    );
    this.state = {
      data: [],
      infoAgendaArr: [],
      currentUser: this.props.currentUser || undefined,
      usuarioRegistrado: this.props.usuarioRegistrado || undefined,
      event: this.props.event || undefined,
      survey: [],
    };
  }

  async componentDidUpdate() {
    let { infoAgendaArr } = this.state;
    //Si aún no ha cargado el evento no podemos hacer nada más
    if (!this.props.event) return;

    //Si ya cargamos la agenda no hay que volverla a cargar o quedamos en un ciclo infinito
    if (this.state.infoAgendaArr && this.state.infoAgendaArr.length) return;
    console.log("actualizando componente");
    let filteredAgenda = await this.filterVirtualActivities(this.props.event._id);
    this.setState({ infoAgendaArr: filteredAgenda }, this.listeningStateMeetingRoom);
  }

  listeningStateMeetingRoom = () => {
    let { infoAgendaArr } = this.state;
    infoAgendaArr.forEach((activity, index, arr) => {
      firestore
        .collection("events")
        .doc(this.props.event._id)
        .collection("activities")
        .doc(activity._id)
        .onSnapshot((infoActivity) => {
          if (!infoActivity.exists) return;
          console.log("infoActivity:", infoActivity);
          let { habilitar_ingreso } = infoActivity.data();
          let updatedActivityInfo = { ...arr[index], habilitar_ingreso };

          arr[index] = updatedActivityInfo;
          this.setState({ infoAgendaArr: arr });
        });
    });
  };

  async componentDidMount() {
    if (!this.props.event) return;

    let filteredAgenda = await this.filterVirtualActivities(this.props.event._id);
    this.setState({ infoAgendaArr: filteredAgenda });
  }

  async filterVirtualActivities(event_id) {
    let infoAgendaArr = [];
    if (!event_id) return infoAgendaArr;
    const infoAgenda = await AgendaApi.byEvent(event_id);

    for (const prop in infoAgenda.data) {
      if (infoAgenda.data[prop].meeting_id) {
        infoAgendaArr.push(infoAgenda.data[prop]);
      }
    }

    return infoAgendaArr;
  }

  render() {
    const { infoAgendaArr, survey } = this.state;
    const { toggleConference, currentUser, usuarioRegistrado, event } = this.props;
    return (
      <Fragment>
        <div>
          <Card bordered={true}>
            <span>Espacios Virtuales</span>
          </Card>
          {infoAgendaArr.map((item, key) => (
            <div key={key}>
              <Card bordered={true} style={{ marginBottom: "3%" }}>
                <Meta
                  avatar={
                    item.hosts.length > 0 ? (
                      item.hosts.map((host, key) => <div key={key}>{<Avatar size={80} src={host.image} />}</div>)
                    ) : (
                      <Avatar size={80} icon={<UserOutlined />} />
                    )
                  }
                  description={
                    <div key={key}>
                      {item.hosts &&
                        item.hosts.length > 0 &&
                        item.hosts.map((item, key) => <p key={key}> {item.name}</p>)}
                      <p>{item.name}</p>
                      <p>
                        {Moment(item.datetime_start).format("MMMM D h:mm A")} -{" "}
                        {Moment(item.datetime_end).format("h:mm A")}
                      </p>
                      <MeetingConferenceButton activity={item} toggleConference={toggleConference} />
                    </div>
                  }
                />
              </Card>
            </div>
          ))}
        </div>
      </Fragment>
    );
  }
}

export default WithUserEventRegistered(VirtualConference);
