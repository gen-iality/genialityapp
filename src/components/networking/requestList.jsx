import React, { Fragment, useState, useEffect } from "react";

import { Spin, Alert, Col, Divider, Card, List, Button, Avatar, Tag } from "antd";
import { ScheduleOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import * as Cookie from "js-cookie";
import { Networking } from "../../helpers/request";
import { userRequest, getCurrentUser, getCurrentEventUser } from "./services";

// Componente que lista las invitaciones recibidas -----------------------------------------------------------
const InvitacionListReceived = ({ list, sendResponseToInvitation }) => {
  const [invitationsReceived, setInvitationsReceived] = useState([]);

  useEffect(() => {
    setInvitationsReceived(list);
  }, [list]);

  if (invitationsReceived.length)
    return (
      <Col xs={24} sm={22} md={18} lg={18} xl={18} style={{ margin: "0 auto" }}>
        <Card>
          <List
            dataSource={invitationsReceived}
            renderItem={(item) => (
              <List.Item
                key={item._id}
                actions={[
                  <Button onClick={() => sendResponseToInvitation(item._id, true)}>Aceptar</Button>,
                  <Button onClick={() => sendResponseToInvitation(item._id, false)}>Rechazar</Button>,
                ]}>
                <List.Item.Meta
                  avatar={
                    <Avatar>
                      {item.user_name_requested
                        ? item.user_name_requested.charAt(0).toUpperCase()
                        : item._id.charAt(0).toUpperCase()}
                    </Avatar>
                  }
                  title={item.user_name_requested || item._id}
                  style={{ textAlign: "left" }}
                />
              </List.Item>
            )}
          />
        </Card>
      </Col>
    );

  return (
    <Col xs={24} sm={22} md={18} lg={18} xl={18} style={{ margin: "0 auto" }}>
      <Card>No tiene solicitudes actualmente</Card>
    </Col>
  );
};

// Componente que lista las invitaciones enviadas -----------------------------------------------------------
const InvitacionListSent = ({ list }) => {
  const [invitationsSent, setInvitationsSent] = useState([]);

  useEffect(() => {
    setInvitationsSent(list);
  }, [list]);

  if (invitationsSent.length)
    return (
      <Col xs={24} sm={22} md={18} lg={18} xl={18} style={{ margin: "0 auto" }}>
        <Card>
          <List
            dataSource={invitationsSent}
            renderItem={(item) => (
              <List.Item key={item._id}>
                <List.Item.Meta
                  avatar={
                    <Avatar>
                      {item.user_name_requesting
                        ? item.user_name_requesting.charAt(0).toUpperCase()
                        : item._id.charAt(0).toUpperCase()}
                    </Avatar>
                  }
                  title={item.user_name_requesting || item._id}
                  style={{ textAlign: "left" }}
                />
                <div>
                  <Tag
                    icon={!item.response ? <ScheduleOutlined /> : <CloseCircleOutlined />}
                    color={item.response == "rejected" && "error"}>
                    {!item.response ? item.state : item.response}
                  </Tag>
                </div>
              </List.Item>
            )}
          />
        </Card>
      </Col>
    );

  return (
    <Col xs={24} sm={22} md={18} lg={18} xl={18} style={{ margin: "0 auto" }}>
      <Card>No ha enviado ninguna solicitud</Card>
    </Col>
  );
};

export default ({ eventId }) => {
  const [requestListReceived, setRequestListReceived] = useState([]);
  const [requestListSent, setRequestListSent] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Funcion que obtiene la lista de solicitudes o invitaciones recibidas
  const getInvitationsList = async () => {
    // Se consulta el id del usuario por el token

    getCurrentUser(Cookie.get("evius_token")).then(async (user) => {
      // Servicio que obtiene el eventUserId del usuario actual
      let eventUser = await getCurrentEventUser(eventId, user._id);

      // Servicio que trae las invitaciones / solicitudes recibidas
      Networking.getInvitationsReceived(eventId, eventUser._id).then(({ data }) => {
        console.log("estas son las invitaciones recibidas :", data);
        setCurrentUserId(user._id);

        // Solo se obtendran las invitaciones que no tengan respuesta
        if (data.length > 0) setRequestListReceived(data.filter((item) => !item.response));
      });

      // Servicio que trae las invitaciones / solicitudes enviadas
      Networking.getInvitationsSent(eventId, eventUser._id).then(({ data }) => {
        console.log("estas son las invitaciones enviadas :", data);

        if (data.length > 0) setRequestListSent(data.filter((item) => !item.response || item.response == "rejected"));
      });
    });
  };

  // Funcion para aceptar o rechazar una invitacion o solicitud
  const sendResponseToInvitation = (requestId, state) => {
    let data = { response: state ? "accepted" : "rejected" };

    Networking.acceptOrDeclineInvitation(eventId, requestId, data)
      .then(() => {
        toast.success("Respuesta enviada");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Hubo un problema", err);
      });
  };

  useEffect(() => {
    getInvitationsList();
  }, [eventId]);

  if (currentUserId)
    return currentUserId == "guestUser" ? (
      <Col xs={22} sm={22} md={15} lg={15} xl={15} style={{ margin: "0 auto" }}>
        <Alert
          message="Iniciar Sesión"
          description="Para poder ver contactos es necesario iniciar sesión."
          type="info"
          showIcon
        />
      </Col>
    ) : (
      <div>
        <Divider>Solicitudes Recibidas</Divider>
        <InvitacionListReceived list={requestListReceived} sendResponseToInvitation={sendResponseToInvitation} />
        <Divider>Solicitudes Enviadas</Divider>
        <InvitacionListSent list={requestListSent} />
      </div>
    );
  return <Spin></Spin>;
};
