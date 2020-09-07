import React, { Component, Fragment } from "react"
import { Typography, Select, Checkbox, Card, Input, Button, Col, Row } from "antd";
import { Actions } from "../../helpers/request";
import { toolbarEditor } from "../../helpers/constants";
import ReactQuill from "react-quill";
import { toast } from "react-toastify";
const { Title } = Typography;
const { Option } = Select;
const { Meta } = Card;

class menuLanding extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menu: {
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
                    icon: "ApartmentOutlined",
                    checked: false,
                    permissions: "public"
                },
                interviews: {
                    name: "Vende / Mi agenda",
                    section: "interviews",
                    icon: "UserOutlined",
                    checked: false,
                    permissions: "public"
                },
                trophies: {
                    name: "Trofeos",
                    section: "trophies",
                    icon: "TrophyOutlined",
                    checked: false,
                    permissions: "public"
                },
                informativeSection: {
                    name: "Seccion Informativa",
                    section: "informativeSection",
                    icon: "FileDoneOutlined",
                    markup: "",
                    checked: false,
                    permissions: "public"
                },
                informativeSection1: {
                    name: "Seccion Informativa Segunda",
                    section: "informativeSection1",
                    icon: "FileDoneOutlined",
                    markup: "",
                    checked: false,
                    permissions: "public"
                }

            },
            values: {},
            itemsMenu: {},
            keySelect: Date.now()
        }
        this.submit = this.submit.bind(this)
    }

    async componentDidMount() {
        const menuBase = this.state.menu
        const menuLanding = await Actions.getAll(`/api/events/${this.props.event._id}`)

        for (const prop in menuBase) {
            for (const prop1 in menuLanding.itemsMenu) {
                if (prop1 === prop) {
                    this.mapActiveItemsToAvailable(prop)
                    this.changeNameMenu(prop, menuLanding.itemsMenu[prop1].name)
                    if (menuLanding.itemsMenu[prop1].markup) {
                        this.changeMarkup(prop, menuLanding.itemsMenu[prop1].markup)
                    }
                    this.changePermissions(prop, menuLanding.itemsMenu[prop1].permissions)
                }
            }
        }
    }

    async submit() {
        const itemsMenu = { itemsMenu: { ...this.state.itemsMenu } }
        const data = await Actions.put(`api/events/${this.props.event._id}`, itemsMenu);
        toast.success("Información guardada")
        console.log(data)
    }

    async mapActiveItemsToAvailable(key) {
        let menuBase = { ...this.state.menu }
        let itemsMenuDB = { ...this.state.itemsMenu }
        menuBase[key].checked = !menuBase[key].checked

        if (menuBase[key].checked) {
            itemsMenuDB[key] = menuBase[key]
        } else {
            delete itemsMenuDB[key]
        }
        this.setState({ itemsMenu: itemsMenuDB, values: menuBase })
    };

    changeNameMenu(key, name) {
        let itemsMenuDB = { ...this.state.itemsMenu }
        if (name === "") {
            itemsMenuDB[key].name = itemsMenuDB[key].name
        } else {
            itemsMenuDB[key].name = name
        }
        this.setState({ itemsMenu: itemsMenuDB })
    }

    changeMarkup(key, markup) {
        let itemsMenuDB = { ...this.state.itemsMenu }
        if (markup === "") {
            itemsMenuDB[key].markup = itemsMenuDB[key].markup
        } else {
            itemsMenuDB[key].markup = markup
        }
        this.setState({ itemsMenu: itemsMenuDB })
    }

    changePermissions(key, access) {
        let itemsMenuDB = { ...this.state.itemsMenu }
        itemsMenuDB[key].permissions = access
        this.setState({ itemsMenu: itemsMenuDB, keySelect: Date.now() })
    }
    render() {
        return (
            <Fragment>
                <Title level={3}>Habilitar secciones del evento</Title>
                <h3>(Podrás guardar la configuración de tu menú en la parte inferior)</h3>
                <Row gutter={16}>
                    {
                        Object.keys(this.state.menu).map((key) => {
                            return (
                                <div key={key}>
                                    <Col style={{ marginTop: "3%" }} span={8}>
                                        <Card
                                            title={<Title level={4}>{this.state.menu[key].name}</Title>}
                                            bordered={true}
                                            //extra={<Checkbox disabled checked={this.state.menu[key].checked} />}
                                            style={{ width: 300, marginTop: "2%" }}>

                                            <div style={{ marginBottom: "3%" }}>
                                                <Button onClick={(e) => { this.mapActiveItemsToAvailable(key) }}>{this.state.menu[key].checked === true ? "Deshabilitar" : "Habilitar"}</Button>
                                            </div>


                                            <div style={{ marginTop: "4%" }}>
                                                <label>Cambiar nombre de la sección</label>
                                                <Input disabled={this.state.menu[key].checked === true ? false : true} onChange={(e) => { this.changeNameMenu(key, e.target.value) }} placeholder={this.state.menu[key].name} />
                                            </div>
                                            <div style={{ marginTop: "4%" }}>
                                                <label>Permisos para la sección</label>
                                                <Select key={this.state.keySelect} disabled={this.state.menu[key].checked === true ? false : true} defaultValue={this.state.menu[key].permissions} style={{ width: 200 }} onChange={(e) => { this.changePermissions(key, e) }}>
                                                    <Option value="public">Abierto para todos</Option>
                                                    <Option value="assistants">Usuarios inscritos al evento</Option>
                                                </Select>
                                            </div>
                                        </Card>
                                    </Col>
                                </div>
                            )
                        })}
                </Row>
                <Row>
                    <div style={{ marginTop: "4%" }}>
                        {this.state.menu["informativeSection"].checked === true && (
                            <>
                                <label>Información para insercion en Seccion</label>
                                <ReactQuill value={this.state.menu["informativeSection"].markup} modules={toolbarEditor} onChange={(content) => { this.changeMarkup("informativeSection", content) }} />
                            </>
                        )}
                    </div>
                    <div style={{ marginTop: "4%" }}>
                        {this.state.menu["informativeSection1"].checked === true && (
                            <>
                                <label>Información para insercion en segunda Seccion</label>
                                <ReactQuill value={this.state.menu["informativeSection1"].markup} modules={toolbarEditor} onChange={(content) => { this.changeMarkup("informativeSection1", content) }} />
                            </>
                        )}
                    </div>
                </Row>
                <Row>
                    <Button style={{ marginTop: "1%" }} type="primary" size="large" onClick={this.submit}>Guardar</Button>
                </Row>
            </Fragment >
        )
    }
}

export default menuLanding
