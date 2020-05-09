import React, { Component } from "react"
import { withRouter } from "react-router"
import { Modal, Typography } from 'antd';
const { Title } = Typography;


class DetailTickets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: {},
            visible: this.props.visible
        }
        this.handleCancel = this.handleCancel.bind(this)
        this.handleOk = this.handleOk.bind(this)
    }
    componentWillMount() {

    }
    componentDidUpdate(prevProps) {
        if (this.props.items !== prevProps.items) {
            this.setState({ items: this.props.items, visible: true });
            console.log(this.state.items)
        }
        if (this.props.visible !== prevProps.visible) {
            this.setState({ items: this.props.items, visible: true });
            console.log(this.state.items)
        }
    }

    handleOk = e => {
        this.setState({
            visible: false,
        });
    };

    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };

    render() {
        const { visible, items } = this.state
        return (
            <div>
                <Modal
                    title={items.event}
                    visible={visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >

                    {
                        items.rol && (
                            <p><strong>Rol: </strong>{items.rol}</p>
                        )
                    }
                    {
                        items.state && (
                            <p><strong>Estado: </strong>{items.state}</p>
                        )
                    }
                    <p><strong>Registro: </strong>{items.status === true ? "Asistencia Confirmada" : "Tu asistencia no ha sido confirmada contacta al administrador"}</p>
                    {
                        items.description && (
                            <div>
                                <Title level={4}>Descripción</Title>
                                <div
                                    className="is-size-5-desktop has-margin-bottom-10"
                                    dangerouslySetInnerHTML={{
                                        __html: items.description
                                    }}
                                />
                            </div>
                        )
                    }
                    {
                        items.properties && (
                            <div>
                                {
                                    Object.keys(items.properties).map((propertyName) => (
                                        <div>
                                            {propertyName + ": " + items.properties[propertyName]}
                                        </div>
                                    ))
                                }
                            </div>
                        )
                    }
                </Modal>
            </div >
        );
    }
}

export default withRouter(DetailTickets)