import React, {Component} from "react"
import {Link, withRouter} from "react-router-dom";
import {ChromePicker} from "react-color";
import {FaChevronLeft} from "react-icons/fa";
import {CategoriesAgendaApi, TypesAgendaApi} from "../../helpers/request";
import EventContent from "../events/shared/content";
import Loading from "../loaders/loading";
import EvenTable from "../events/shared/table";

class AgendaTypeCat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:true,
            displayColorPicker:false,
            id:"",
            subject:"",
            color:"",
            name:"",
            list:[],
            headers:[]
        };
        this.eventID = "";
        this.apiURL = "";
    }

    async componentDidMount() {
        console.log(this.props);
        this.eventID = this.props.event._id;
        const subject = this.props.match.url.split("/").slice(-1)[0];
        this.apiURL = subject === "categorias" ? CategoriesAgendaApi : TypesAgendaApi;
        const headers = subject === "categorias" ? ["Nombre", "Color", ""] : ["Nombre", ""];
        const list = await this.apiURL.byEvent(this.eventID);
        this.setState({list,loading:false,subject, headers})
    }

    editItem = (type) => this.setState({id:type._id,name:type.name});

    onChange = (e) => {
        this.setState({name:e.target.value})
    };
    handleClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker })
    };
    handleChangeComplete = (color) => {
        this.setState({ color: color.hex });
    };

    newItem = () => {
        if(!this.state.list.find(({value})=>value === "new"))
            this.setState(state => ({list: state.list.concat({label: '', value: 'new'}), id: 'new'}));
    };

    removeNewItem = () => this.setState(state => ({list:state.list.filter(({value}) => value !== "new"),id:"",name:""}));

    async saveItem() {
        try{
            const info = this.state.subject === "categorias" ? {name: this.state.name,color: this.state.color} : {name: this.state.name};
            if(this.state.id !== 'new') {
                await this.apiURL.editOne(info, this.state.id, this.eventID);
                this.setState(state => {
                    const data = state.list.map(object => {
                        if (object.value === state.id) {
                            object.item.name = state.name;
                            object.item.color = state.color;
                            return object;
                        } else return object;
                    });
                    return {list: data, id: "", name: "", color: ""};
                });
            }else{
                const newRole = await this.apiURL.create(this.eventID, info);
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

    async removeItem(deleteID) {
        this.setState({isLoading:'Cargando....'});
        try {
            await this.apiURL.deleteOne(deleteID);
            this.setState(state => ({list:state.list.filter(({value}) => value !== deleteID),id:"",name:""}))
        }
        catch (error) {
            console.log(error);
        }
    };

    render() {
        const {loading,subject,list,id,name,color,headers} = this.state;
        return (
            <EventContent title={<span><span onClick={()=>this.props.history.goBack()}><FaChevronLeft/></span>{subject} de Actividad</span>}
                          addAction={this.newItem} addTitle={"Nuevo tipo"}>
                {loading ? <Loading/> :
                    <EvenTable head={headers}>
                        {list.map(object => {
                            return <tr key={object.value}>
                                <td>
                                    {
                                        id === object.value ?
                                            <input type="text" value={name} autoFocus onChange={this.onChange}/>:
                                            <p>{object.label}</p>
                                    }
                                </td>
                                {
                                    subject === "categorias" && <td>
                                        {
                                            id === object.value ?
                                                <div>
                                                    <div style={ {
                                                        padding: '5px',
                                                        background: '#fff',
                                                        borderRadius: '1px',
                                                        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                                                        display: 'inline-block',
                                                        cursor: 'pointer'} } onClick={ this.handleClick }>
                                                        <div style={ {
                                                            width: '36px',
                                                            height: '14px',
                                                            borderRadius: '2px',
                                                            background: `${ this.state.color }`,
                                                        } } />
                                                    </div>
                                                    { this.state.displayColorPicker && <div style={ {position: 'absolute', zIndex: '2'} }>
                                                        <div style={ {position: 'fixed', top: '0px', right: '0px', bottom: '0px', left: '0px'} } onClick={ this.handleClick }/>
                                                        <ChromePicker color={color} onChange={this.handleChangeComplete}/>
                                                    </div>}
                                                </div>:
                                                <div style={{padding: '5px', width: '36px', height: '14px', background: object.item.color, borderRadius: '1px', boxShadow: '0 0 0 1px rgba(0,0,0,.1)'}}/>
                                        }
                                    </td>
                                }
                                <td>
                                    {
                                        id === object.value ?
                                            <button>
                                            <span className="icon has-text-grey"
                                                  onClick={(e)=>{this.saveItem(object)}}><i className="fas fa-save"/></span>
                                            </button>:
                                            <button>
                                            <span className="icon has-text-grey"
                                                  onClick={(e)=>this.editItem(object.item)}><i className="fas fa-edit"/></span>
                                            </button>
                                    }
                                    {
                                        object.value === 'new' ?
                                            <button><span className='icon has-text-grey'
                                                          onClick={this.removeNewItem}><i className='fas fa-times'/></span></button>:
                                            <button><span className='icon has-text-grey'
                                                          onClick={(e)=>{this.removeItem(object.value)}}><i className='far fa-trash-alt'/></span></button>
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


export default withRouter(AgendaTypeCat)
