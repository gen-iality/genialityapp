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
class MenuEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemsMenu: {},
      showSection: this.props.showSection,
      logged: false,
      email: false
    }
    this.obtainUserFirebase = this.obtainUserFirebase.bind(this)
  }

  async componentDidMount() {
    // console.log(this.props)
    // const event = await Actions.getAll(`/api/events/${this.props.eventId}`)
    // const menuEvent = event.itemsMenu || {};
    // console.log("MENU LANDING", menuEvent);
    // this.setState({ itemsMenu: menuEvent })

    this.obtainUserFirebase()
  }

  async obtainUserFirebase() {
    //Se trae el api que contiene el menu
    const event = await Actions.getAll(`/api/events/${this.props.eventId}`)

    //Se declara una variable para poder salvar el menu, en caso de estar vacio será un objeto vacio 
    let items = event.itemsMenu || {}
    this.setState({ itemsMenu: items })
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
        style={{ height: "100%", padding: "30px 0" }}>
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
