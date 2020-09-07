import { Modal } from 'antd';
import React, { Component } from "react"

export default class ModalRelation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false
        };
    }

    componentDidMount() {
        this.setState({
            visible: this.props.showModal
        })
    }
    handleOk = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    render() {
        return (
            <div>
                <Modal
                    title="Basic Modal"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                </Modal>
            </div>
        );
    }
}

