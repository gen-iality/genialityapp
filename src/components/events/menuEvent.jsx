import React, { useState, useEffect } from "react";
import WithLoading from "./../shared/withLoading";
import { Link, withRouter } from "react-router-dom";
import { Layout, Menu } from "antd";
import { firestore } from "../../helpers/firebase";

//Se importan todos los iconos a  un Objeto para llamarlos dinámicamente
import * as iconComponents from "@ant-design/icons";
import { Actions } from "../../helpers/request";
import { Component } from "react";
import * as Cookie from "js-cookie";
import API, { UsersApi } from "../../helpers/request";

const { Sider } = Layout;

const stylesMenuItems = {
  height: "100%",
  padding: "30px 0",
  backgroundColor: "transparent"
}
class MenuEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemsMenu: {},
      user: null,
      showSection: this.props.showSection,
      logged: false,
      email: false,
      menuDefault: {
        evento: {
          name: "Evento",
          section: "evento",
          icon: "CalendarOutlined",
          checked: false,
          permissions: "public"
        },
        agenda: {
          name: "Agenda",
          section: "agenda",
          icon: "ReadOutlined",
          checked: false,
          permissions: "public"
        },
        speakers: {
          name: "Conferencistas",
          section: "speakers",
          icon: "AudioOutlined",
          checked: false,
          permissions: "public"
        },
        tickets: {
          name: "Boletería",
          section: "tickets",
          icon: "CreditCardOutlined",
          checked: false,
          permissions: "public"
        },
        certs: {
          name: "Certificados",
          section: "certs",
          icon: "FileDoneOutlined",
          checked: false,
          permissions: "public"
        },
        documents: {
          name: "Documentos",
          section: "documents",
          icon: "FolderOutlined",
          checked: false,
          permissions: "public"
        },
        wall: {
          name: "Muro",
          section: "wall",
          icon: "TeamOutlined",
          checked: false,
          permissions: "public"
        },
        survey: {
          name: "Encuestas",
          section: "survey",
          icon: "FileUnknownOutlined",
          checked: false,
          permissions: "public"
        },
        faqs: {
          name: "Preguntas Frecuentes",
          section: "faqs",
          icon: "QuestionOutlined",
          checked: false,
          permissions: "public"
        },
        networking: {
          name: "Networking",
          section: "networking",
          icon: "LaptopOutlined",
          checked: false,
          permissions: "public"
        },
        my_agenda: {
          name: "Mi Agenda",
          section: "my_agenda",
          icon: "BookOutlined",
          checked: false,
          permissions: "public"
        },
        my_section: {
          name: "Seccion Personalizada",
          section: "my_section",
          icon: "EnterOutlined",
          checked: false,
          permissions: "public"
        },
        companies: {
          name: "Empresas",
          section: "companies",
          icon: "WechatOutlined",
          checked: false,
          permissions: "public"
        }
      },
    }
    this.obtainUserFirebase = this.obtainUserFirebase.bind(this)
  }

  async componentDidMount() {
    // console.log(this.props)
    // const event = await Actions.getAll(`/api/events/${this.props.eventId}`)
    // const menuEvent = event.itemsMenu || {};
    // console.log("MENU LANDING", menuEvent);
    // this.setState({ itemsMenu: menuEvent })
    if (this.props.user) {
      this.setState({ user: this.props.user })
    }
    this.obtainUserFirebase()
  }

  async componentDidUpdate() {
    console.log("user data", this.props.user);
    if (this.props.user && !this.state.user) {
      this.setState({ user: this.props.user })
    }
  }
  async obtainUserFirebase() {
    //Se trae el api que contiene el menu
    const event = await Actions.getAll(`/api/events/${this.props.eventId}`)

    //Se declara una variable para poder salvar el menu, en caso de estar vacio será un objeto vacio 
    let items = event.itemsMenu || this.state.menuDefault

    console.log("items", items, this.props.user);
    this.setState({ itemsMenu: items })


    //Cargar por defecto la primera opcion habilitada del MENU
    let secciones = Object.keys(items);
    if (secciones && secciones.length >= 0) {
      let defaultSeccion = items[secciones[0]].section;
      this.state.showSection(defaultSeccion)
    }


  }

  //Funcion que carga los items publicos del menu
  publicItems(event) {
    let items = event.itemsMenu || {}
    let itemsMenu = []

    for (const prop in items) {
      if (items[prop].permissions === "public") {
        console.log(itemsMenu)
        itemsMenu.push(items[prop])
        this.setState({ itemsMenu })
      }
    }
  }
  //let collapsed = props.collapsed;

  render() {
    const { itemsMenu } = this.state
    return (
      <Menu
        mode="inline"
        // theme="dark"
        defaultSelectedKeys={["1"]}
        // defaultOpenKeys={['sub1']}
        style={stylesMenuItems}>
        {Object.keys(itemsMenu).map((key, i) => {
          if ((itemsMenu[key] && itemsMenu[key].permissions == "assistants") && !this.state.user) { return null }
          let IconoComponente = iconComponents[itemsMenu[key].icon];
          return (
            <Menu.Item key={itemsMenu[key].section} onClick={e => this.state.showSection(itemsMenu[key].section)}>
              <IconoComponente />
              <span> {itemsMenu[key].name}</span>
            </Menu.Item>
          );
        })}
      </Menu>
    );
  }

};

export default WithLoading(MenuEvent);
