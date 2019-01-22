import React, {Component} from 'react';
import ModalCrud from "../../../shared/crud/containers/modalCrud";


class ContainerCrud extends Component {
    constructor(props){
        super(props);
        this.state = {
            show: false,
            addUser: false,
            modal: false,
            fields: []
        };
    }

    componentDidMount() {
        // console.log("here all info", this.props.eventId);
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
                (<ModalCrud hideModal={this.hideModal} modal={this.state.modal} info={this.props.eventId.user_properties}/>) : ("")
            }
                <div className="column is-narrow has-text-centered">
                    <button className="button is-primary" onClick={this.showModal}>Agregar Conferencista +</button>
                </div>
            </div>
        );
    }
}

export default ContainerCrud;