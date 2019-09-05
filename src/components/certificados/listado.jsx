import React, {Component} from "react";
import NewCert from "./modalNewCert";
import {CertsApi} from "../../helpers/request";
import Moment from "moment";
import Dialog from "../modal/twoAction";
Moment.locale('es');

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list:[],
            modalCert:false,
            id:false,
            deleteModal:false,
            name:"",
            message:""
        };
        this.fetchCerts = this.fetchCerts.bind(this);
        this.deleteCert = this.deleteCert.bind(this)
    }

    componentDidMount() {
        this.fetchCerts()
    }

    async fetchCerts() {
        try{
            const list = await CertsApi.byEvent(this.props.event._id);
            this.setState({list})
        }catch (e) {
            console.log(e);
        }
    }

    newCert = () => {
        if(this.state.name.length>0){
            this.props.certTab({name:this.state.name});
            this.closeModal()
        }else{
            this.setState({message:"Por favor coloca un nombre"})
        }
    };

    onChange = e => {this.setState({name:e.target.value,message:""})};

    closeModal = () => {
        this.setState({modalCert:false,name:"",message:""})
    };

    editCert = (data) => {
        this.props.certTab(data)
    };

    async deleteCert() {
        this.setState({isLoading:'Cargando....'});
        try {
            await CertsApi.deleteOne(this.state.id);
            this.setState({message:{...this.state.message,class:'msg_success',content:'Certificado borrado'},isLoading:false},()=>{
                this.setState({deleteModal:false});
                this.fetchCerts()
            });
        }
        catch (error) {
            if (error.response) {
                console.log(error.response);
                this.setState({message:{...this.state.message,class:'msg_error',content:JSON.stringify(error.response)},isLoading:false})
            }
            else if (error.request) {
                console.log(error.request);
                this.setState({serverError:true,errorData:{message:error.request,status:708}});
            }
            else {
                console.log('Error', error.message);
                this.setState({serverError:true,errorData:{message:error.message,status:708}});
            }
        }
    };

    closeDelete = () => {
        this.setState({deleteModal:false})
    };

    render() {
        return (
            <React.Fragment>
                <div className="has-text-right">
                    <button className="button is-primary" onClick={e=>this.setState({modalCert:true})}>
                        <span className="icon"><i className="fas fa-plus"/></span>
                        <span className="text-button">Nuevo Certificado</span>
                    </button>
                </div>
                <div className="table">
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Fecha Creación</th>
                            <th/>
                            <th/>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.list.map((cert,key)=>{
                            return <tr key={key}>
                                <td>{cert.name}</td>
                                <td>{Moment(cert.created_at).format("DD/MM/YYYY")}</td>
                                <td>
                                    <span className="icon has-text-primary action_pointer"
                                          onClick={(e)=>{this.editCert(cert)}}><i className="fas fa-edit"/></span>
                                </td>
                                <td className='has-text-centered'>
                                    <span className='icon has-text-danger action_pointer'
                                          onClick={(e)=>{this.setState({id:cert._id,deleteModal:true})}}><i className='far fa-trash-alt'/></span>
                                </td>
                            </tr>
                        })}
                        </tbody>
                    </table>
                </div>
                {
                    this.state.modalCert && <NewCert modal={this.state.modalCert} name={this.state.name} onChange={this.onChange}
                                                     message={this.state.message} newCert={this.newCert} closeModal={this.closeModal}/>
                }
                {
                    this.state.deleteModal &&
                        <Dialog modal={this.state.deleteModal} title={'Borrar Certificado'}
                                content={<p>¿Estas seguro de eliminar este certificado?</p>}
                                first={{title:'Borrar',class:'is-dark has-text-danger',action:this.deleteCert}}
                                message={this.state.message} isLoading={this.state.isLoading}
                                second={{title:'Cancelar',class:'',action:this.closeDelete}}/>
                }
            </React.Fragment>
        )
    }
}

export default List
