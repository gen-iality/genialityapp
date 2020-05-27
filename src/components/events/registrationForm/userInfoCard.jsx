import React, { useState, useEffect } from "react";

import Form from "./form";

import { Card, Col, Row, Spin, Typography, Button, Modal } from "antd";
const { Text } = Typography;

export default ({ currentUser, extraFields, eventId, userTickets }) => {
  const [infoUser, setInfoUser] = useState({});
  const [userTicketsInfo, setUserTicketsInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleModal, setVisibleModal] = useState(false);

  //   console.log("currentuser", currentUser.properties, extraFields);
  // Se obtiene las propiedades y se asignan a un array con el valor que contenga
  const parseObjectToArray = (info) => {
    return new Promise(async (resolve, reject) => {
      let userProperties = new Promise((resolve, reject) => {
        let userProperties = [];

        for (const key in info) {
          if (key != "displayName") {
            let fieldLabel = "";
            fieldLabel = extraFields.filter((item) => key == item.name);
            fieldLabel = fieldLabel && fieldLabel.length && fieldLabel[0].label ? fieldLabel[0].label : key;
            userProperties.push({ key: key, property: fieldLabel, value: info[key] });
          }
        }
        resolve(userProperties);
      });

      let result = await userProperties;
      resolve(result);
      setInfoUser(result);
      setLoading(false);
    });
  };

  const setTicketList = (list) => {
    let tickets = [];
    list.forEach(async (ticket, index, arr) => {
      let result = await parseObjectToArray(ticket.properties);
      tickets.push(result);

      if (index == arr.length - 1) setUserTicketsInfo(tickets);
    });
  };

  const openModal = () => {
    setVisibleModal(true);
  };

  const handleOk = (e) => {
    setVisibleModal(false);
  };

  const handleCancel = (e) => {
    setVisibleModal(false);
  };

  useEffect(() => {
    setTicketList(userTickets);
  }, [currentUser]);

  if (!loading)
    return (
      <Card>
        {userTicketsInfo.map((ticket, key) => (
          <Card key={`Card_${key}`}>
            {ticket.map((field, key) => (
              <Row key={key} gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col className="gutter-row" xs={24} sm={12} md={12} lg={12} xl={12}>
                  <Text strong>{field.property}</Text>
                </Col>
                <Col className="gutter-row" xs={24} sm={12} md={12} lg={12} xl={12}>
                  <Text>{field.value}</Text>
                </Col>
              </Row>
            ))}
          </Card>
        ))}

        <Modal
          width={700}
          title="Transferir Ticket"
          visible={visibleModal}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel}>
              Cancelar
            </Button>,
          ]}>
          <Form eventId={eventId} extraFields={extraFields} />
        </Modal>
      </Card>
    );

  return <Spin></Spin>;
};
