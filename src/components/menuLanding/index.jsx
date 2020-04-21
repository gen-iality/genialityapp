import React, { Component, Fragment } from "react"
import * as iconComponents from "@ant-design/icons";
import { Typography, Checkbox, Menu, Button } from "antd";
import { Actions } from "../../helpers/request";
import { toast } from "react-toastify";
const { Title } = Typography;

class menuLanding extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menu: {
                agenda: {
                    name: "Agenda",
                    section: "agenda",
                    icon: "ReadOutlined",
                    checked: false,
                },
                evento: {
                    name: "Evento",
                    section: "evento",
                    icon: "CalendarOutlined",
                    checked: false,
                },
                speakers: {
                    name: "Conferencistas",
                    section: "speakers",
                    icon: "AudioOutlined",
                    checked: false,
                },
                tickets: {
                    name: "Boletería",
                    section: "tickets",
                    icon: "CreditCardOutlined",
                    checked: false,
                },
                certs: {
                    name: "Certificados",
                    section: "certs",
                    icon: "FileDoneOutlined",
                    checked: false,
                },
                documents: {
                    name: "Documentos",
                    section: "documents",
                    icon: "FolderOutlined",
                    checked: false,
                },
                wall: {
                    name: "Muro",
                    section: "wall",
                    icon: "TeamOutlined",
                    checked: false,
                },
                survey: {
                    name: "Encuestas",
                    section: "survey",
                    icon: "FileUnknownOutlined",
                    checked: false,
                },
                faqs: {
                    name: "Preguntas Frecuentes",
                    section: "faqs",
                    icon: "QuestionOutlined",
                    checked: false,
                },
                networking: {
                    name: "Networking",
                    section: "networking",
                    icon: "LaptopOutlined",
                    checked: false,
                }
            },
            values: {

            },
            itemsMenu: {}
        }
        this.submit = this.submit.bind(this)
    }

    async componentDidMount() {
        const menuLanding = await Actions.getAll(`/api/events/${this.props.event._id}`)
        console.log(menuLanding.itemsMenu)
    }

    async submit() {
        console.log(this.state.itemsMenu)
        toast.success("Información guardada")
    }

    saveItemsMenu = key => {
        let menuBase = { ...this.state.menu }
        let itemsMenuCP = { ...this.state.itemsMenu }
        menuBase[key].checked = !menuBase[key].checked

        if (menuBase[key].checked) {
            itemsMenuCP[key] = menuBase[key]
        } else {

            delete itemsMenuCP[key]
        }
        this.setState({
            itemsMenu: {
                itemsMenu: menuBase
            },
            values: menuBase
        })
    };
    render() {
        return (
            <Fragment>
                <Title level={3}>Habilitar secciones de landing</Title>
                {
                    Object.keys(this.state.menu).map((key) => {
                        let IconoComponente = iconComponents[this.state.menu[key].icon];
                        return (
                            <div key={key}>
                                <Checkbox
                                    checked={this.state.menu[key].checked}
                                    onChange={(e) => { this.saveItemsMenu(key) }}
                                // onChange={this.onChange}
                                >
                                    <IconoComponente />
                                    {this.state.menu[key].name}

                                </Checkbox>
                            </div>
                        )
                    })
                }
                {
                    console.log(this.state.itemsMenu)
                }
                <Button onClick={this.submit}>Guardar</Button>
            </Fragment>
        )
    }
}

export default menuLanding  