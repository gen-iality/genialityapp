import React, {Component} from 'react';
import ModalCrud from "../../../shared/crud/containers/modalCrud";
import configCrud from '../config'
import ListCrud from '../components/listCrud'

class ContainerCrud extends Component {
    constructor(props){
        super(props);
        this.state = {
            show: false,
            addUser: false,
            modal: false,
            fields: [],
            pageOfItems: []
        };
}
componentDidMount() {
    const pageOfItems= [
        {
            correo: 'jose@jose.com',
            name : 'jose',
            rol: 'administrador'
        },
        {
            correo: 'jose@jose.com',
            name : 'jose',
            rol: 'administrador'
        },
        {
            correo: 'jose@jose.com',
            name : 'jose',
            rol: 'administrador'
        },
        {
            correo: 'jose@jose.com',
            name : 'jose',
            rol: 'administrador'
        }
        ]
    this.setState({
        pageOfItems: pageOfItems
    });
   
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