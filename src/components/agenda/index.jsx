import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import Moment from "moment"
import AddAgenda from "../shared/modal/addAgenda";
Moment.locale('es');

class Agenda extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect:false,
            url_redirect:'',
            modal:false
        }
    }

    handleModal = () => {
        this.setState((prevState) => {
            return {modal:!prevState.modal}
        });
    };

    handleChange = (e) => {
        const {name} = e.target;
        const {value} = e.target;
        this.setState({[name]:value});
    };

    createAgenda = () => {
        const { event } = this.props;
        this.setState({redirect:true,url_redirect:'/edit/'+event._id+'/agenda/asdasd'})
    };

    render() {
        if(this.state.redirect) return (<Redirect to={{pathname: this.state.url_redirect}} />);
        return (
            <React.Fragment>
                <button className="button is-outlined" onClick={()=>{this.setState({modal:true})}}>Agregar </button>
                <h3>Coming Soon:</h3>
                <p>Lista de Agendas</p>
                <AddAgenda modal={this.state.modal} handleModal={this.handleModal} createAgenda={this.createAgenda} change={this.handleChange}/>
            </React.Fragment>
        );
    }
}

export default Agenda;