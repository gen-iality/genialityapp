import React, { Component, Fragment } from "react";
import { AgendaApi } from "../../../helpers/request";
import { Typography, Select, Form, Table, Button, InputNumber, notification, Input, Modal } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import ModalEdit from "./modalEdit"
const { Title } = Typography;
const { Option } = Select;

class ActividadLanguage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activity: {},
            related_meetings: [],
            visible: false
        }
        this.onFinish = this.onFinish.bind(this)
        this.deleteObject = this.deleteObject.bind(this)
        this.onFinishModal = this.onFinishModal.bind(this)
    }


    async componentDidMount() {
        this.loadData()
    }

    async loadData() {
        const { eventId, activityId } = this.props
        const info = await AgendaApi.getOne(activityId, eventId)
        if (info.related_meetings) {
            this.setState({ related_meetings: info.related_meetings })
        }
        this.setState({ activity: info })
    }

    async onFinish(related_meetings_selected) {
        const { eventId, activityId } = this.props
        let related_meetings = this.state.related_meetings
        related_meetings.push(related_meetings_selected)

        let info = ({ related_meetings: related_meetings })
        try {
            await AgendaApi.editOne(info, activityId, eventId)
            notification.open({
                message: 'Información Guardada',
            })
        } catch (e) {
            console.log(e)
            notification.open({
                message: 'Hubo un error',
                description:
                    'No se ha logrado crear la información, intente mas tarde',
            })
        }
        this.loadData()

    }

    async deleteObject(object) {
        const { eventId, activityId } = this.props
        let dataToFilter = this.state.related_meetings

        dataToFilter = dataToFilter.filter(function (i) { return i !== object });

        let info = ({ related_meetings: dataToFilter })

        this.setState({ related_meetings: dataToFilter });
        try {
            await AgendaApi.editOne(info, activityId, eventId)
            notification.open({
                message: 'Dato Eliminado',
            })
        } catch (e) {
            console.log(e)
            notification.open({
                message: 'Hubo un error',
                description:
                    'No se ha logrado eliminar la información, intente mas tarde',
            })
        }
        this.loadData()
    }

    async editObject(key, object) {

        this.setState({ dataToEdit: object, visible: true, idConference: key })
    }

    async onFinishModal(related_meetings_selected) {
        const { eventId, activityId } = this.props
        let related_meetings = this.state.related_meetings

        for (let i = 0; i < related_meetings.length; i++) {            
            if (related_meetings[i].meeting_id) {
                if (related_meetings[i].meeting_id.toString() === related_meetings_selected.meeting_id.toString()) {
                    related_meetings[i].language = related_meetings_selected.language
                    related_meetings[i].state = related_meetings_selected.state
                    related_meetings[i].informative_text = related_meetings_selected.informative_text
                }
            }

            if (related_meetings[i].vimeo_id) {
                if (related_meetings[i].vimeo_id.toString() === related_meetings_selected.vimeo_id.toString()) {
                    related_meetings[i].language = related_meetings_selected.language
                    related_meetings[i].state = related_meetings_selected.state
                    related_meetings[i].informative_text = related_meetings_selected.informative_text
                }
            }
        }

        let info = ({ related_meetings: related_meetings })        

        try {
            await AgendaApi.editOne(info, activityId, eventId)
            notification.open({
                message: 'Dato Actualizado',
            })
        } catch (e) {
            console.log(e)
            notification.open({
                message: 'Hubo un error',
                description:
                    'No se ha logrado actualizar la información, intente mas tarde',
            })
        }

        this.setState({visible: false})
    }
    render() {
        const { activity, related_meetings, dataToEdit, visible, idConference } = this.state
        const { platform, eventId, activityId } = this.props
        const columns = [{
            title: "Lenguaje",
            dataIndex: "language",
            key: "language"
        },
        {
            title: "Id de conferencia",
            render: (value, row) => {
                if (row.vimeo_id !== undefined) {
                    return <p>{value.vimeo_id}</p>
                } else if (row.meeting_id !== undefined) {
                    return <p>{value.meeting_id}</p>
                } else if (row.bigmarker_id !== undefined) {
                    return <p>{value.bigmarker_id}</p>
                }
            },
            key: "meeting_id"
        },
        {
            title: "Estado",
            dataIndex: "state",
            render: (value) => {
                if (value === "open_meeting_room") {
                    return <p>Conferencia Abierta</p>
                } else if (value === "closed_meeting_room") {
                    return <p>Conferencia no Iniciada</p>
                } else if (value === "ended_meeting_room") {
                    return <p>Conferencia Terminada</p>
                }
            },
            key: "state"
        },
        {
            title: "Plataforma",
            render: (row) => {
                if (row.vimeo_id !== undefined) {
                    return <p>vimeo</p>
                } else if (row.meeting_id !== undefined) {
                    return <p>zoom</p>
                }
                else if (row.bigmarker_id !== undefined) {
                    return <p>BigMarker</p>
                }
            }
        },
        {
            title: "Texto Informativo",
            dataIndex: "informative_text",
            key: "informative_text"
        },
        {
            title: 'Action',
            render: (text, record) => (
                <>
                    <div>
                        <DeleteOutlined onClick={() => this.deleteObject(record)} />
                    </div>
                    <div>
                        <EditOutlined onClick={() => this.editObject(text.meeting_id ? text.meeting_id : text.vimeo_id, record)} />
                    </div>
                </>
            ),
        }]
        return (
            <>
                <Fragment>
                    <Title>Lenguaje para {activity.name}</Title>
                    <Form
                        onFinish={this.onFinish}
                    >
                        <Form.Item
                            label="Lenguaje"
                            name="language"
                            rules={[{ required: true, message: 'Por favor seleccione un idioma' }]}
                        >
                            <Select>
                                <Option value="Ingles">Ingles</Option>
                                <Option value="Español">Español</Option>
                                <Option value="Frances">Frances</Option>
                                <Option value="Portugués">Portugués</Option>
                                <Option value="Aleman"> Aleman</Option>
                            </Select>
                        </Form.Item>
                        {
                            platform === "zoom" && (
                                <Form.Item
                                    label="Id de conferencia"
                                    name="meeting_id"
                                    rules={[{ required: true, message: 'Por favor ingrese un id' }]}
                                >
                                    <InputNumber style={{ width: "100%" }} />
                                </Form.Item>
                            )
                        }
                        {
                            platform === "vimeo" && (
                                <Form.Item
                                    label="Id de conferencia"
                                    name="vimeo_id"
                                    rules={[{ required: true, message: 'Por favor ingrese un id' }]}
                                >
                                    <InputNumber style={{ display: "block" }} />
                                </Form.Item>
                            )
                        }

                        <Form.Item
                            label="estado"
                            name="state"
                            rules={[{ required: true, message: 'Por favor seleccione un estado' }]}
                        >
                            <Select>
                                <Option value="open_meeting_room">Conferencia Abierta</Option>
                                <Option value="closed_meeting_room">Conferencia no Iniciada</Option>
                                <Option value="ended_meeting_room">Conferencia Terminada</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Texto informativo "
                            name="informative_text"
                            rules={[{ required: true, message: 'Por favor seleccione un idioma' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Guardar
                        </Button>
                        </Form.Item>
                    </Form>
                    {related_meetings && (
                        <Table dataSource={related_meetings} columns={columns} />
                    )}

                    <ModalEdit eventId={eventId} activityId={activityId} onFinish={this.onFinishModal} related_meetings={related_meetings} visible={visible} data={dataToEdit} />
                </Fragment>
            </>
        )
    }
}

export default ActividadLanguage