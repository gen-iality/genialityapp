import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {SpacesApi} from "../../helpers/request";
import Loading from "../loaders/loading";
import Moment from "moment";
import Dialog from "../modal/twoAction";

class Espacios extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list:[],
            id:'',
            deleteID:'',
            name:'',
            isLoading:false,
            loading:true,
            deleteModal:false,
        };
    }

    componentDidMount() {
        this.fetchItem();
    }

    fetchItem = async() => {
        const list = await SpacesApi.byEvent(this.props.eventID);
        this.setState({list,loading:false})
    };

    onChange = (e) => {
        this.setState({name:e.target.value})
    };

    newRole = () => {
        this.setState(state => {
            const list = state.list.concat({name:'',created_at:new Date(),_id:'new'});
            return {list, id: 'new'};
        });
    };

    removeNewRole = () => {
        this.setState(state => {
            const list = state.list.filter(item => item._id !== "new");
            return {list,id:"",name:""};
        });
    };

    saveRole = async() => {
        try{
            if(this.state.id !== 'new') {
                await SpacesApi.editOne({name: this.state.name}, this.state.id, this.props.eventID);
                this.setState(state => {
                    const list = state.list.map(item => {
                        if (item._id === state.id) {
                            item.name = state.name;
                            return item;
                        } else return item;
                    });
                    return {list, id: "", name: ""};
                });
            }else{
                const newRole = await SpacesApi.create({name: this.state.name, event_id:this.props.eventID});
                this.setState(state => {
                    const list = state.list.map(item => {
                        if (item._id === state.id) {
                            item.name = newRole.name;
                            item.created_at = newRole.created_at;
                            item._id = newRole._id;
                            return item;
                        } else return item;
                    });
                    return {list, id: "", name: ""};
                });
            }
        }catch (e) {
            console.log(e);
        }
    };

    deleteRol = async() => {
        this.setState({isLoading:'Cargando....'});
        const self = this;
        try {
            await SpacesApi.deleteOne(this.state.deleteID, this.props.eventID);
            this.setState({message:{...this.state.message,class:'msg_success',content:'Espacio borrado'},isLoading:false},()=>{
                setTimeout(()=>{
                    self.setState({deleteModal:false,deleteID:false,message:""});
                },1200);
                this.fetchItem()
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
                    <button className="button" onClick={this.newRole}>Nuevo</button>
                </div>
                {this.state.loading ? <Loading/> :
                    <div className="table">
                        <table className="table">
                            <thead>
                            <tr>
                                <th style={{width:'60%'}}>Nombre</th>
                                <th style={{width:'30%'}}>Fecha Creación</th>
                                <th style={{width:'10%'}}/>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.list.map((cert,key)=>{
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
                }
                {
                    this.state.deleteModal &&
                    <Dialog modal={this.state.deleteModal} title={'Borrar Espacio'}
                            content={<p>¿Estas seguro de eliminar este espacio?</p>}
                            first={{title:'Borrar',class:'is-dark has-text-danger',action:this.deleteRol}}
                            message={this.state.message} isLoading={this.state.isLoading}
                            second={{title:'Cancelar',class:'',action:this.closeDelete}}/>
                }
            </React.Fragment>
        )
    }
}

export default withRouter(Espacios)
