import React, {Component} from "react"
import {Link} from "react-router-dom";
import {FaChevronLeft} from "react-icons/fa";
import {CategoriesAgendaApi} from "../../helpers/request";
import EventContent from "../events/shared/content";
import Loading from "../loaders/loading";
import EvenTable from "../events/shared/table";

class AgendaCat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:true,
            id:"",
            name:"",
            list:[]
        };
        this.eventID = ""
    }

    async componentDidMount() {
        this.eventID = this.props.event._id;
        const list = await CategoriesAgendaApi.byEvent(this.eventID);
        this.setState({list,loading:false})
    }

    editType = (type) => this.setState({id:type._id,name:type.name});

    onChange = (e) => {
        this.setState({name:e.target.value})
    };

    newType = () => {
        if(!this.state.list.find(({value})=>value === "new"))
            this.setState(state => ({list: state.list.concat({label: '', value: 'new'}), id: 'new'}));
    };

    removeNewType = () => this.setState(state => ({list:state.list.filter(({value}) => value !== "new"),id:"",name:""}));

    async saveRole() {
        try{
            if(this.state.id !== 'new') {
                await CategoriesAgendaApi.editOne({name: this.state.name}, this.state.id, this.eventID);
                this.setState(state => {
                    const types = state.list.map(item => {
                        if (item._id === state.id) {
                            item.name = state.name;
                            return item;
                        } else return item;
                    });
                    return {list: types, id: "", name: ""};
                });
            }else{
                const newRole = await CategoriesAgendaApi.create(this.eventID, {name: this.state.name});
                this.setState(state => {
                    const types = state.list.map(item => {
                        if (item.value === state.id) {
                            item.label = newRole.name;
                            item.item = newRole;
                            item.value = newRole._id;
                            return item;
                        } else return item;
                    });
                    return {list: types, id: "", name: ""};
                });
            }
        }catch (e) {
            console.log(e);
        }
    };

    async removeType(deleteID) {
        this.setState({isLoading:'Cargando....'});
        try {
            await CategoriesAgendaApi.deleteOne(deleteID);
            this.setState(state => ({list:state.list.filter(({value}) => value !== deleteID),id:"",name:""}))
        }
        catch (error) {
            console.log(error);
        }
    };

    render() {
        const {matchUrl} = this.props;
        const {loading,list,id,name} = this.state;
        return (
            <EventContent title={<span><Link to={matchUrl}><FaChevronLeft/></Link>Tipos de Actividad</span>}
                          addAction={this.newType} addTitle={"Nuevo tipo"}>
                {loading ? <Loading/> :
                    <EvenTable head={["Nombre", ""]}>
                        {list.map(type => {
                            return <tr key={type.value}>
                                <td>
                                    {
                                        id === type.value ?
                                            <input type="text" value={name} autoFocus onChange={this.onChange}/>:
                                            <p>{type.label}</p>
                                    }</td>
                                <td>
                                    {
                                        id === type.value ?
                                            <button>
                                            <span className="icon has-text-grey"
                                                  onClick={(e)=>{this.saveRole(type)}}><i className="fas fa-save"/></span>
                                            </button>:
                                            <button>
                                            <span className="icon has-text-grey"
                                                  onClick={(e)=>this.editType(type.item)}><i className="fas fa-edit"/></span>
                                            </button>
                                    }
                                    {
                                        type.value === 'new' ?
                                            <button><span className='icon has-text-grey'
                                                          onClick={this.removeNewType}><i className='fas fa-times'/></span></button>:
                                            <button><span className='icon has-text-grey'
                                                          onClick={(e)=>{this.removeType(type.value)}}><i className='far fa-trash-alt'/></span></button>
                                    }
                                </td>
                            </tr>
                        })}
                    </EvenTable>
                }
            </EventContent>
        );
    }
}

export default AgendaCat
