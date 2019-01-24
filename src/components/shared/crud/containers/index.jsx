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
            data: {},
            itemInfo: {}
        };
    
        this.config = configCrud[this.props.idModel];
        this.eventId =this.props.eventId._id;   
        console.log('ejecutando bring speakers' ,this.config)
    }
    componentDidMount() {
        this.getData();
    }

    // Conseguimos la informacion que se va a cargar en la lista de la tabla de el crud
    async getData(){
       
        const pageOfItems = [
        {
            id: '',
            name : '',
            created_at: '',
            updated_at: ''
        }
        ]
        let resp = await Actions.getAll(this.config.ListCrud.urls.getAll(this.eventId));
        
        // var newinfo = resp.data.map((element)=> element);
        
     
        // let fields = Object.keys(resp.data[0])
        // console.log('headers =', Object.keys(resp.data[0]))
        console.log("resp data", resp.data);
        this.setState({
            pageOfItems: resp.data
        });
    }
   
    async update(id){
        let data = await Actions.getOne(this.config.ListCrud.urls.getOne(this.eventId),`/${id}`);
  
        this.setState(
             {itemInfo: data}
        )
        console.log('obtenemos la info====>> ',data)
        // console.log(id)
        // this.showModal()
        // alert('actualizando ' ,id)
    }

    async delete(id){
        console.log('==============>> >> ',this.config.ListCrud.urls.delete(this.eventId),id)
        await Actions.delete(this.config.ListCrud.urls.delete(this.eventId),id);
    
        console.log(this.config.ListCrud.urls.delete(this.eventId))
        this.updateTable()
    }

    showModal = () => {
        this.setState(prevState => {
            return {modal: true, show: true}
        });
    };

    hideModal = () => {
        this.setState({ show: false });
    };
    //Refresca la pagina para mostrar los cambios
    updateTable(){
        this.getData();
    };

    render() {
        console.log("here pageofitems", this.state.pageOfItems);
        return (
            <div>{
                this.state.show ? 
                (<ModalCrud itemInfo = {this.itemInfo} hideModal={this.hideModal} updateTable= {this.updateTable.bind(this)} modal={this.state.modal} info={this.config} config={this.config} enventInfo={this.props.eventId}/>) : ("")
            }
                <div className="column is-narrow has-text-centered">
                    <button className="button is-primary" onClick={this.showModal}>Agregar {this.props.buttonName} +</button>
                </div>
                <React.Fragment>
                    <ListCrud  data={this.state.pageOfItems} config={this.config} delete={this.delete.bind(this)}  update={this.update.bind(this)} />
                </React.Fragment>
            </div>
        );
    }
}

export default ContainerCrud;