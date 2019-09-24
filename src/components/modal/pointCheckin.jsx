import React, {Component} from "react";
import {RolAttApi} from "../../helpers/request";
import Moment from "moment";
import Dialog from "./twoAction";

class PointCheckin extends Component {
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
        this.setState(state => {
            const list = state.roles.concat({name:'',created_at:new Date(),_id:'new'});
            return {
                roles:list,
                id: 'new',
            };
        });
    };

    removeNewRole = () => {
        this.setState(state => {
            const list = state.roles.filter(item => item._id !== "new");
            return {
                roles:list,id:"",name:""
            };
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
        return (
            <React.Fragment>
                <div style={{width:this.props.visible?'100%':'0%'}} className="overlay">
                    <p className="close-btn action_pointer" onClick={e=>this.props.close(false)}>&times;</p>
                    <div className="overlay-content">
                        <button className="button" onClick={this.newRole}>Nuevo</button>
                        <table className="table">
                            <thead>
                            <tr>
                                <th style={{width:'60%'}}>Nombre</th>
                                <th style={{width:'30%'}}>Fecha Creación</th>
                                <th style={{width:'10%'}}/>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.roles.map((cert,key)=>{
                                return <tr key={key}>
                                    <td>
                                        {
                                            this.state.id === cert._id ?
                                                <input type="text" value={this.state.name} onChange={this.onChange}/>:
                                                <p>{cert.name}</p>
                                        }
                                    </td>
                                    <td>{Moment(cert.created_at).format("DD/MM/YYYY")}</td>
                                    <td style={{textAlign:'left'}}>
                                        {
                                            this.state.id === cert._id ?
                                                <span className="icon has-text-primary action_pointer"
                                                      onClick={(e)=>{this.saveRole(cert)}}><i className="fas fa-save"/></span>:
                                                <span className="icon has-text-primary action_pointer"
                                                      onClick={(e)=>this.setState({id:cert._id,name:cert.name})}><i className="fas fa-edit"/></span>
                                        }
                                        {
                                            cert._id === 'new' ?
                                                <span className='icon action_pointer'
                                                      onClick={this.removeNewRole}><i className='fas fa-times'/></span>:
                                                <span className='icon has-text-danger action_pointer'
                                                      onClick={(e)=>{this.setState({deleteID:cert._id,deleteModal:true})}}><i className='far fa-trash-alt'/></span>
                                        }
                                    </td>
                                </tr>
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
                {
                    this.state.deleteModal &&
                    <Dialog modal={this.state.deleteModal} title={'Borrar Rol'}
                            content={<p>¿Estas seguro de eliminar este rol de asistente?</p>}
                            first={{title:'Borrar',class:'is-dark has-text-danger',action:this.deleteRol}}
                            message={this.state.message} isLoading={this.state.isLoading}
                            second={{title:'Cancelar',class:'',action:this.closeDelete}}/>
                }
            </React.Fragment>
        )
    }
}

export default PointCheckin
