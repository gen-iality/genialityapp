import React, { useState, useEffect } from "react";
import WithLoading from "./../shared/withLoading";
import { Link, withRouter } from "react-router-dom";
import { Layout, Menu } from "antd";

//Se importan todos los iconos a  un Objeto para llamarlos dinámicamente
import * as iconComponents from "@ant-design/icons";

const { Sider } = Layout;

const MenuEvent = props => {
  let showSection = props.showSection;
  //let collapsed = props.collapsed;

  let itemsMenu = {
    agenda: {
      name: "Agenda",
      section: "agenda",
      icon: "ReadOutlined"
    },
    evento: {
      name: "Evento",
      section: "evento",
      icon: "CalendarOutlined"
    },
    speakers: {
      name: "Conferencistas",
      section: "speakers",
      icon: "AudioOutlined"
    },
    tickets: {
      name: "Boletería",
      section: "tickets",
      icon: "CreditCardOutlined"
    },
    certs: {
      name: "Certificados",
      section: "certs",
      icon: "FileDoneOutlined"
    },
    documents: {
      name: "Documentos",
      section: "documents",
      icon: "FolderOutlined"
    },
    wall: {
      name: "Muro",
      section: "wall",
      icon: "TeamOutlined"
    },
    survey: {
      name: "Encuestas",
      section: "survey",
      icon: "FileUnknownOutlined"
    },
    faqs: {
      name: "Preguntas Frecuentes",
      section: "faqs",
      icon: "QuestionOutlined"
    }
  };

  return (
    <Menu
      mode="inline"
      // theme="dark"
      defaultSelectedKeys={["1"]}
      // defaultOpenKeys={['sub1']}
      style={{ height: "100%", padding: "50px 0" }}>
      {Object.keys(itemsMenu).map((key, i) => {
        let IconoComponente = iconComponents[itemsMenu[key].icon];
        return (
          <Menu.Item key={itemsMenu[key].section} onClick={e => showSection(itemsMenu[key].section)}>
            <IconoComponente />
            <span> {itemsMenu[key].name}</span>
          </Menu.Item>
        );
      })}
    </Menu>
  );
};

export default WithLoading(MenuEvent);
