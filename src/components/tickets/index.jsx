import React, { Component, Fragment } from "react";
import * as Cookie from "js-cookie";
import { ApiUrl } from "../../helpers/constants";
import { fieldNameEmailFirst } from "../../helpers/utils";

import TimeStamp from "react-timestamp";
import { TicketsApi, EventsApi, UsersApi } from "../../helpers/request";
import { Typography, Card, Col, Row, Button, message } from "antd";
import Moment from "moment";
import EventImage from "../../eventimage.png";
import { Link } from "react-router-dom";
import DetailTickets from "./detalleTickets";
import { CheckCircleOutlined, WarningOutlined } from "@ant-design/icons";
import { Modal } from "antd";

import Form from "../events/registrationForm/form";

const { Title } = Typography;

class TicketInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      iframeUrl: "",
      usersInscription: [],
      visible: false,
      items: {},
      visibleModal: false,
      currentEventId: null,
    };
    this.changeVisible = this.changeVisible.bind(this);
  }
  async componentWillMount() {
    const token = Cookie.get("evius_token");
    const tickets = await TicketsApi.getAll(token);
    const usersInscription = [];
    tickets.forEach(async (element) => {
      const eventByTicket = await EventsApi.getOne(element.event_id);
      if (eventByTicket) {
        usersInscription.push({
          _id: element._id,
          picture: eventByTicket.picture ? eventByTicket.picture : EventImage,
          id: eventByTicket._id,
          place: eventByTicket.venue,
          event: eventByTicket.name,
          event_start: eventByTicket.datetime_from,
          event_end: eventByTicket.datetime_to,
          rol: element.properties.rol,
          state: element.state ? element.state.name : "Sin Confirmar",
          properties: element.properties,
          status: element.checked_in,
          author: eventByTicket.author.displayName,
        });
      }
      console.log(element);
      this.setState({ usersInscription });
    });
  }

  async changeVisible(item) {
    this.setState({ item, visible: this.state.visible === false ? true : false });
  }

  // Funciones del modal para transferir los ticketes -----------------------------------------
  openModal = async (eventId) => {
    message.loading({ content: "Cargando...", key: "loading" }, 10);
    let extraFields = await this.getEventFields(eventId);
    message.success({ content: "Formulario cargado", key: "loading" });
    this.setState({ visibleModal: true, currentEventId: eventId, extraFields });
  };

  handleOk = (e) => {
    this.setState({ visibleModal: false });
  };

  handleCancel = (e) => {
    this.setState({ visibleModal: false });
  };

  //   -----------------------------------------------------------------------------------------

  // Funcion que extrae los campos -------------------------------------------------------------
  addDefaultLabels = (extraFields) => {
    extraFields = extraFields.map((field) => {
      field["label"] = field["label"] ? field["label"] : field["name"];
      return field;
    });
    return extraFields;
  };

  orderFieldsByWeight = (extraFields) => {
    extraFields = extraFields.sort((a, b) =>
      (a.order_weight && !b.order_weight) || (a.order_weight && b.order_weight && a.order_weight < b.order_weight)
        ? -1
        : 1
    );
    return extraFields;
  };

  getEventFields = (eventId) => {
    return new Promise(async (resolve, reject) => {
      const event = await EventsApi.getOne(eventId);

      const eventUsers = await UsersApi.getAll(eventId, "?pageSize=10000");

      const properties = event.user_properties;

      // Trae la informacion para los input
      let extraFields = fieldNameEmailFirst(properties);
      extraFields = this.addDefaultLabels(extraFields);
      extraFields = this.orderFieldsByWeight(extraFields);

      console.log("extraFields", properties);
      resolve(extraFields);
    });
  };

  //   -----------------------------------------------------------------------------------------

  render() {
    const { usersInscription, currentEventId, extraFields } = this.state;
    return (
      <Fragment>
        <Title level={2}>Tus Tickets</Title>
        <Row gutter={16}>
          {usersInscription.map((items, key) => (
            <Col span={9} key={key}>
              <Card
                style={{ marginLeft: "15%", marginTop: "3%" }}
                bordered={true}
                actions={[
                  <Link to={{ pathname: `/landing/${items.id}` }}>
                    <Button> Ir al evento</Button>
                  </Link>,
                  <Button onClick={() => this.openModal(items.id)}>Transferir</Button>,
                  <Button
                    onClick={() => {
                      this.changeVisible(items);
                    }}>
                    Detalles
                  </Button>,
                ]}
                cover={
                  <div>
                    <figure className="image is-3by2">
                      {" "}
                      <img alt="example" src={items.picture} />{" "}
                    </figure>
                  </div>
                }>
                <div className="media-content">
                  <div className="">
                    <h2 className="title is-size-6 is-medium has-text-grey-dark">{items.event}</h2>
                  </div>
                </div>

                <div>
                  <div className="is-size-7">
                    <div style={{ float: "left", marginRight: "3%" }}>
                      <TimeStamp data={items.event_start} />
                    </div>
                    <div>
                      <TimeStamp data={items.event_end} />
                    </div>
                  </div>
                  <p>{items.place}</p>
                  <p>
                    {items.status === true ? (
                      <div>
                        <CheckCircleOutlined />
                        <p>Asististe a este evento</p>
                      </div>
                    ) : (
                      <div>
                        <WarningOutlined />
                        <p>No has asistido a este evento</p>
                      </div>
                    )}
                  </p>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
        <DetailTickets item={this.state.item} visible={this.state.visible} />

        {/* Modal para realizar transferencia de ticketes */}
        <Modal
          width={700}
          title="Transferir Ticket"
          visible={this.state.visibleModal}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              Cancelar
            </Button>,
          ]}>
          <Form eventId={currentEventId} extraFields={extraFields} />
        </Modal>
      </Fragment>
    );
  }
}

export default TicketInfo;
