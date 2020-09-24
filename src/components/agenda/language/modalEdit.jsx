import React, { Component } from "react";
import { Select, Form, Button, InputNumber, notification, Input, Modal } from "antd";
import { AgendaApi } from "../../../helpers/request";
const { Option } = Select;

export default class ModalEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            dataToEdit: {}
        }        
    }

    componentDidMount() {
        this.setState({
            visible: this.props.visible,
            related_meetings: this.props.related_meetings,
            dataToEdit: this.props.data
        })
    }

    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            this.setState({
                visible: this.props.visible,
                related_meetings: this.props.related_meetings,
                dataToEdit: this.props.data
            })
        }
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    render() {
        const { dataToEdit } = this.state
        const { onFinish } = this.props
        return (
            <Modal title="Basic Modal" visible={this.state.visible} onCancel={this.handleCancel}>
                <Form
                    onFinish={onFinish}
                    initialValues={dataToEdit}
                >
                    <Form.Item
                        label="Lenguaje"
                        name="language"
                    >
                        <Select defaultValue={dataToEdit && dataToEdit.language}>
                            <Option value="Ingles">Ingles</Option>
                            <Option value="Español">Español</Option>
                            <Option value="Frances">Frances</Option>
                            <Option value="Portugués">Portugués</Option>
                            <Option value="Aleman"> Aleman</Option>
                        </Select>
                    </Form.Item>
                    {
                        dataToEdit && dataToEdit.meeting_id && (
                            <Form.Item
                                label="Id de conferencia"
                                name="meeting_id"
                            >
                                <Input disabled defaultValue={dataToEdit && dataToEdit.meeting_id} />
                            </Form.Item>
                        )
                    }

                    {
                        dataToEdit && dataToEdit.vimeo_id && (
                            <Form.Item
                                label="Id de conferencia"
                                name="vimeo_id"
                            >
                                <Input disabled defaultValue={dataToEdit && dataToEdit.vimeo_id} />
                            </Form.Item>
                        )
                    }
                    <Form.Item
                        label="estado"
                        name="state"
                    >
                        <Select defaultValue={dataToEdit && dataToEdit.state}>
                            <Option value="open_meeting_room">Conferencia Abierta</Option>
                            <Option value="closed_meeting_room">Conferencia no Iniciada</Option>
                            <Option value="ended_meeting_room">Conferencia Terminada</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Texto informativo "
                        name="informative_text"
                    >
                        <Input defaultValue={dataToEdit && dataToEdit.informative_text} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Guardar
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        )
    }
}