import React, { Component } from "react";
import { SpeakersApi } from "../../helpers/request"
import { Modal } from "antd"
import { withRouter } from 'react-router-dom';

class ModalDetailSpeaker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visibleModal: "",
            data: []
        }
    }

    async componentDidMount() {
        this.getSpeaker()
        console.log(this.props.visibleModal)
        this.setState({
            visibleModal: this.props.visibleModal
        })
        console.log(this.state.visibleModal)
    }

    async getSpeaker() {
        const eventId = await this.props.eventId
        const speakerId = await this.props.speakerId

        const data = await SpeakersApi.getOne(speakerId, eventId)
        this.setState({ data })
    }
    handleOkModal = e => {
        //console.log(e);
        this.setState({
            visibleModal: false,
        });
    };

    handleCancel = e => {
        //console.log(e);
        this.setState({
            visibleModal: false,
        });
    };

    render() {
        const { visibleModal, handleOkModal, handleCancel } = this.props
        const { data } = this.state
        return (
            <div>
                {
                    //console.log(visibleModal)
                }
                <Modal title="Conferencista"
                    visible={this.state.visibleModal}
                    onOk={this.handleOkModal}
                    onCancel={this.handleCancel}>
                    <figure className="media-left image is-128x128">
                        <img src={data.image} alt="Placeholder image" />
                    </figure>

                    <div className="media-content ">
                        <span className="title is-3">{data.name}</span>
                        <p className="is-4">{data.profession}</p>
                        <p className="is-4">{data.description}</p>
                    </div>

                </Modal>
            </div>
        )
    }
}

export default withRouter(ModalDetailSpeaker) 