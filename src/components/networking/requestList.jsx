import React, { Fragment, useState, useEffect } from "react";

import { Spin, Alert, Col, Divider, Card, List, Button, Avatar } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import * as Cookie from "js-cookie";
import { Networking } from "../../helpers/request";
import { userRequest, getCurrentUser, getCurrentEventUser } from "./services";

export default ({ eventId }) => {
  const [requestList, setRequestList] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Funcion que obtiene la lista de solicitudes o invitaciones recibidas
  const getInvitationsList = async () => {
    // Se consulta el id del usuario por el token

    getCurrentUser(Cookie.get("evius_token")).then(async (user) => {
      // Servicio que obtiene el eventUserId del usuario actual
      let eventUser = await getCurrentEventUser(eventId, user._id);

      // Servicio que trae las invitaciones / solicitudes
      Networking.getInvitationsReceived(eventId, eventUser._id).then(({ data }) => {
        console.log("esta es la respuesta :", data);
        setCurrentUserId(user._id);

        // Solo se obtendran las invitaciones que no tengan respuesta
        if (data) setRequestList(data.filter((item) => !item.response));
      });
    });
  };

  // Funcion para aceptar o rechazar una invitacion o solicitud
  const sendResponseToInvitation = (requestId, state) => {
    let data = { response: state ? "acepted" : "rejected" };

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
    ) : requestList.length > 0 ? (
      <Col xs={24} sm={22} md={18} lg={18} xl={18} style={{ margin: "0 auto" }}>
        <Card>
          <List
            dataSource={requestList}
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
    ) : (
      <Divider>No tiene solicitudes actualmente</Divider>
    );

  return <Spin></Spin>;
};
