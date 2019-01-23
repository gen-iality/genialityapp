import React, {Component} from 'react';
import ModalCrud from "../components/modalCrud";
import configCrud from '../config.jsx'
import ListCrud from '../components/listCrud';
import {SpeakersApi} from "../../../../helpers/request";

class ContainerCrud extends Component {
    constructor(props){
        super(props);
        this.state = {
            show: false,
            modal: false,
            fields: [],
            pageOfItems: []
        };
    }
    componentDidMount() {
        this.bringSpeakers();
    }

    async bringSpeakers(){
        const pageOfItems = [
        {
            id: '',
            name : '',
            created_at: '',
            updated_at: ''
        }
        ]
        let resp = await SpeakersApi.getList(this.props.eventId);
        this.setState({
            pageOfItems: resp.data
        });
    }
    

    showModal = () => {
        this.setState(prevState => {
            return {modal: true, show: true}
        });
    };

    hideModal = () => {
        this.setState({ show: false });
    };

    render() {
        return (
            <div>{
                this.state.show ? 
                (<ModalCrud hideModal={this.hideModal} modal={this.state.modal} info={configCrud} enventInfo={this.props.eventId}/>) : ("")
            }
                <div className="column is-narrow has-text-centered">
                    <button className="button is-primary" onClick={this.showModal}>Agregar {this.props.buttonName} +</button>
                </div>
                <React.Fragment>
                    <ListCrud  data={this.state.pageOfItems} config={configCrud} />
                </React.Fragment>
            </div>
        );
    }
}

export default ContainerCrud;