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
    const event = await Actions.getAll(`/api/events/${this.props.eventId}`)
    try {
      const resp = await API.get(`/auth/currentUser?evius_token=${Cookie.get("evius_token")}`);
      console.log("respuesta status", resp.status !== 202);


      if (resp.status !== 200 && resp.status !== 202)
        return;

      firestore.collection(`${this.props.eventId}_event_attendees`)
        .where("properties.email", "==", resp.data.email)
        .get()
        .then(snapshot => {
          if (snapshot.empty) {
            this.publicItems(event)
            console.log("No matching documents.");
            return;
          } else {
            console.log("USUARIO REGISTRADO.");
            let menuBase = { ...event.itemsMenu }
            this.setState({ itemsMenu: menuBase })
          }
        })
        .catch(err => {
          console.log("Error getting documents", err);
        });

      console.log("data ", resp.data);
    } catch{
      this.publicItems(event)
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
