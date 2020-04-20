import React, { Component, Fragment } from "react"
import * as iconComponents from "@ant-design/icons";
import { Checkbox, Menu } from "antd";

class menuLanding extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menu: {
                agenda: {
                    name: "Agenda",
                    section: "agenda",
                    icon: "ReadOutlined",
                },
                evento: {
                    name: "Evento",
                    section: "evento",
                    icon: "CalendarOutlined",
                },
                speakers: {
                    name: "Conferencistas",
                    section: "speakers",
                    icon: "AudioOutlined",
                },
                tickets: {
                    name: "Boletería",
                    section: "tickets",
                    icon: "CreditCardOutlined",
                },
                certs: {
                    name: "Certificados",
                    section: "certs",
                    icon: "FileDoneOutlined",
                },
                documents: {
                    name: "Documentos",
                    section: "documents",
                    icon: "FolderOutlined",
                },
                wall: {
                    name: "Muro",
                    section: "wall",
                    icon: "TeamOutlined",
                },
                survey: {
                    name: "Encuestas",
                    section: "survey",
                    icon: "FileUnknownOutlined",
                },
                faqs: {
                    name: "Preguntas Frecuentes",
                    section: "faqs",
                    icon: "QuestionOutlined",
                },
                networking: {
                    name: "Networking",
                    section: "networking",
                    icon: "LaptopOutlined",
                }
            },
            values: []
        }
        this.saveMenu = this.saveMenu.bind(this)
        this.getMenuLanding = this.getMenuLanding.bind(this)
    }

    async componentDidMount() {
        this.getMenuLanding()
    }

    async getMenuLanding() {
        let menuMapped = this.state.menu
        let menuDatabase = {
            agenda: {
                name: "Agenda",
                section: "agenda",
                icon: "ReadOutlined",
            },
            certs: {
                name: "Certificados",
                section: "certs",
                icon: "FileDoneOutlined",
            },
            networking: {
                name: "Networking",
                section: "networking",
                icon: "LaptopOutlined",
            }
        }

        for (const prop in menuMapped) {
            for (const prop1 in menuDatabase) {
                if (menuMapped[prop].name === menuDatabase[prop1].name) {
                    await this.saveMenu(menuDatabase[prop1].name, menuDatabase[prop1])
                    document.getElementById(`${menuDatabase[prop].name}`).checked = true
                } else { continue }
            }
        }
    }

    async saveMenu(name, val) {
        if (this.state.values[name]) {
            delete this.state.values[name];
            console.log('Eliminado', this.state.values);
            this.setState({
                itemsMenu: {
                    itemsMenu: {
                        ...this.state.values
                    }
                }
            })
        } else {
            await this.setState({
                values: {
                    ...this.state.values, [name]: val
                }
            })

            await this.setState({
                itemsMenu: {
                    itemsMenu: {
                        ...this.state.values, [name]: val
                    }
                }
            })
            console.log('campo nuevo agregado', this.state.itemsMenu)
        }
    }

    submit() {
        console.log(this.state.itemsMenu)
    }

    render() {
        const { menu } = this.state
        return (
            <Fragment>
                <Menu
                    mode="inline"
                    // theme="dark"
                    defaultSelectedKeys={["1"]}
                    // defaultOpenKeys={['sub1']}
                    style={{ height: "100%", padding: "50px 0" }}>
                    {Object.keys(menu).map((key, i) => {
                        let IconoComponente = iconComponents[menu[key].icon];
                        return (
                            <Menu.Item key={menu[key].section}>
                                <label style={{ marginRight: "2%" }} className="checkbox">
                                    <input id={menu[key].name} type="checkbox" onClick={() => { this.saveMenu(menu[key].name, menu[key]) }} />
                                </label>
                                <IconoComponente />
                                <span> {menu[key].name}</span>
                            </Menu.Item>
                        );
                    })}
                </Menu>
            </Fragment>
        )
    }
}

export default menuLanding