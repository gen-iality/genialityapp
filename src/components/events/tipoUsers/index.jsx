import React, {Component, Fragment} from "react";
import Moment from "moment";
import {RolAttApi} from "../../../helpers/request";
import EventContent from "../shared/content";
import EvenTable from "../shared/table";
import Dialog from "../../modal/twoAction";

class TipoAsistentes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roles:[],
            id:'',
            deleteID:'',
            name:'',
            isLoading:false,
            deleteModal:false,
        };
        this.fetchRoles = this.fetchRoles.bind(this);
        this.saveRole = this.saveRole.bind(this);
        this.deleteRol = this.deleteRol.bind(this);
    }

    async componentDidMount() {
        this.fetchRoles()
    }

    async fetchRoles() {
        const roles = await RolAttApi.byEvent(this.props.eventID);
        this.setState({roles})
    }

    onChange = (e) => {
        this.setState({name:e.target.value})
    };

    newRole = () => {
        if(!this.state.roles.find(({_id})=>_id === "new")) {
            this.setState(state => {
                const list = state.roles.concat({name: '', created_at: new Date(), _id: 'new'});
                return {roles: list, id: 'new',};
            });
        }
    };

    removeNewRole = () => {
        this.setState(state => {
            const list = state.roles.filter(item => item._id !== "new");
            return {roles:list,id:"",name:""};
        });
    };

    async saveRole() {
        try{
            if(this.state.id !== 'new') {
                await RolAttApi.editOne({name: this.state.name}, this.state.id);
                this.setState(state => {
                    const list = state.roles.map(item => {
                        if (item._id === state.id) {
                            item.name = state.name;
                            return item;
                        } else return item;
                    });
                    return {roles: list, id: "", name: ""};
                });
            }else{
                const newRole = await RolAttApi.create({name: this.state.name, event_id:this.props.eventID});
                this.setState(state => {
                    const list = state.roles.map(item => {
                        if (item._id === state.id) {
                            item.name = newRole.name;
                            item.created_at = newRole.created_at;
                            item._id = newRole._id;
                            return item;
                        } else return item;
                    });
                    return {roles: list, id: "", name: ""};
                });
            }
        }catch (e) {
            console.log(e);
        }
    };

    async deleteRol() {
        this.setState({isLoading:'Cargando....'});
        const self = this;
        try {
            await RolAttApi.deleteOne(this.state.deleteID);
            this.setState({message:{...this.state.message,class:'msg_success',content:'Rol borrado'},isLoading:false},()=>{
                setTimeout(()=>{
                    self.setState({deleteModal:false,deleteID:false,message:""});
                },1200)
                this.fetchRoles()
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
        const {roles, id, name, deleteModal, message, isLoading} = this.state;
        return (
            <Fragment>
                <EventContent title={"Tipo de asistentes"} description={"Clasifique a los asistentes en categorías personalizadas. Ej: Asistente, conferencista, mesa de honor, etc."}
                    addAction={this.newRole} addTitle={"Nuevo rol"}>
                    <EvenTable head={["Nombre","Fecha Creación","Acciones"]}>
                        {roles.map((cert,key)=>{
                            return <tr key={key}>
                                <td>
                                    {
                                        id === cert._id ?
                                            <input type="text" value={name} autoFocus onChange={this.onChange}/>:
                                            <p>{cert.name}</p>
                                    }
                                </td>
                                <td>{Moment(cert.created_at).format("DD/MM/YYYY")}</td>
                                <td>
                                    {
                                        id === cert._id ?
                                            <button>
                                            <span className="icon has-text-grey"
                                                  onClick={(e)=>{this.saveRole(cert)}}><i className="fas fa-save"/></span>
                                            </button>:
                                            <button>
                                            <span className="icon has-text-grey"
                                                  onClick={(e)=>this.setState({id:cert._id,name:cert.name})}><i className="fas fa-edit"/></span>
                                            </button>
                                    }
                                    {
                                        cert._id === 'new' ?
                                            <button><span className='icon has-text-grey'
                                                          onClick={this.removeNewRole}><i className='fas fa-times'/></span></button>:
                                            <button><span className='icon has-text-grey'
                                                          onClick={(e)=>{this.setState({deleteID:cert._id,deleteModal:true})}}><i className='far fa-trash-alt'/></span></button>
                                    }
                                </td>
                            </tr>
                        })}
                    </EvenTable>
                </EventContent>
                {
                    deleteModal &&
                    <Dialog modal={deleteModal} title={'Borrar Rol'}
                            content={<p>¿Estas seguro de eliminar este rol de asistente?</p>}
                            first={{title:'Borrar',class:'is-dark has-text-danger',action:this.deleteRol}}
                            message={message} isLoading={isLoading}
                            second={{title:'Cancelar',class:'',action:this.closeDelete}}/>
                }
            </Fragment>
        )
    }
}

export default TipoAsistentes
