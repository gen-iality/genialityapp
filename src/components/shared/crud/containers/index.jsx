import React, {Component} from 'react';
import ModalCrud from "../components/modalCrud";
import configCrud from '../config.jsx'
import ListCrud from '../components/listCrud';
import {Actions} from "../../../../helpers/request";

class ContainerCrud extends Component {
    constructor(props){
        super(props);
        this.state = {
            show: false,
            modal: false,
            fields: [],
            pageOfItems: [],
            data: {}
        };
    
        this.config = configCrud[this.props.idModel];
        this.eventId =this.props.eventId._id;   
      
    }
    componentDidMount() {
        this.getData();
    }

    // Conseguimos la informacion que se va a cargar en la lista de la tabla de el crud
    async getData(){
        console.log('ejecutando bring speakers' ,this.config)
        const pageOfItems = [
        {
            id: '',
            name : '',
            created_at: '',
            updated_at: ''
        }
        ]
        let resp = await Actions.getAll(this.config.ListCrud.urls.getAll(this.eventId));
        console.log('resp here: ', resp);
        
        // var newinfo = resp.data.map((element)=> element);
        
     
        // let fields = Object.keys(resp.data[0])
        // console.log('headers =', Object.keys(resp.data[0]))

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
    updateTable(){
        this.getData();
    };

    render() {
        console.log("here data", this.state);
        return (
            <div>{
                this.state.show ? 
                (<ModalCrud hideModal={this.hideModal} updateTable= {this.updateTable.bind(this)} modal={this.state.modal} info={this.config} config={this.config} enventInfo={this.props.eventId}/>) : ("")
            }
                <div className="column is-narrow has-text-centered">
                    <button className="button is-primary" onClick={this.showModal}>Agregar {this.props.buttonName} +</button>
                </div>
                <React.Fragment>
                    <ListCrud  data={this.state.pageOfItems} config={this.config} />
                </React.Fragment>
            </div>
        );
    }
}

export default ContainerCrud;