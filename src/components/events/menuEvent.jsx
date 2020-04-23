import React, { useState, useEffect } from "react";
import WithLoading from "./../shared/withLoading";
import { Link, withRouter } from "react-router-dom";
import { Layout, Menu } from "antd";

//Se importan todos los iconos a  un Objeto para llamarlos dinámicamente
import * as iconComponents from "@ant-design/icons";
import { Actions } from "../../helpers/request";
import { Component } from "react";
import * as Cookie from "js-cookie";
import API, { UsersApi } from "../../helpers/request";

const { Sider } = Layout;
class MenuEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemsMenu: {},
      showSection: this.props.showSection,
      logged: false,
      email: false
    }
    this.validationMenu = this.validationMenu.bind(this)
  }

  async componentDidMount() {
    // console.log(this.props)
    // const event = await Actions.getAll(`/api/events/${this.props.eventId}`)
    // const menuEvent = event.itemsMenu || {};
    // console.log("MENU LANDING", menuEvent);
    // this.setState({ itemsMenu: menuEvent })
    this.validationMenu()
  }

  async validationMenu() {
    //Se consultan las api necesarias para obtener el menu y los usuarios del evento 
    const usersEvent = await UsersApi.getAll(this.props.eventId, "?pageSize=10000")
    const event = await Actions.getAll(`/api/events/${this.props.eventId}`)

    //Se declara una variable para poder salvar el menu, en caso de estar vacio será un objeto vacio 
    let items = event.itemsMenu || {}

    //Se declara un array para guardar las secciones que tengan permiso publico
    let itemsMenu = []
    let menuBase = []

    try {
      const userLogged = await API.get(
        `/auth/currentUser?evius_token=${Cookie.get("evius_token")}`
      );
      //Si el usuario logueado se encuentra en el evento, muestra el menu por completo, si no muestra el menu publico
      if (userLogged.status === 200) {
        for (const userEvnt in usersEvent.data) {
          if (userLogged.data.email === usersEvent.data[userEvnt].email) {
            let menuBase = { ...event.itemsMenu }
            this.setState({ itemsMenu: menuBase })
          } else {
            this.publicItems(event)
          }
        }

      }
    } catch (error) {
      console.log(error)
      for (const prop in items) {
        if (items[prop].permissions === "public") {
          console.log(itemsMenu)
          itemsMenu.push(items[prop])
          this.setState({ itemsMenu })
        }
      }
    }

  }

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
        style={{ height: "100%", padding: "50px 0" }}>
        {Object.keys(itemsMenu).map((key, i) => {
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
