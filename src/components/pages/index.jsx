import React, {Component} from "react";
import { Route, NavLink, Switch, withRouter } from "react-router-dom";
import PagePersonalizada from "./Personalizada";


const options = [
    {label:'Agenda',description:'Aquí puedes agregar las sesiones de tu evento',path:'/agenda',id:"0"},
    {label:'Personalizada',description:'Usa el más para agregar contenido como párrafo, separador o multimedia',path:'/personalizada',id:"1"},
];
class Pages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name:'',
            type:{},
            disabled:true,
            pages:[]
        }
    }

    onChange = (e) => {
        const {name,value} = e.target;
        this.setState({[name]:value},this.valid)
    };

    valid = () => {
        if(this.state.name !=='' && this.state.type !== '') this.setState({disabled:false});
    };

    addPage = () => {
        const page = Object.assign({name:this.state.name},options.find(opt=>opt.id===this.state.type));
        this.setState({pages:[...this.state.pages,page]})
    };

    render() {
        const {type,name,disabled,pages} = this.state;
        const matchUrl = this.props.match.url;
        return (
            <div>
                <p>Agrega una sección de contenido para tu evento</p>
                <div className='columns'>
                    <div className='column'>
                        <div className="field">
                            <div className="control">
                                <div className="select">
                                    <select onChange={this.onChange} name={'type'} value={type}>
                                        <option value={''}>Tipo de sección...</option>
                                        {options.map((option,key)=>{return <option key={key} value={option.id}>{option.label}</option>})}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='column'>
                        <div className="field">
                            <div className="control">
                                <input className="input" type="text" name={'name'} onChange={this.onChange} value={name} placeholder="Nombre sección"/>
                            </div>
                        </div>
                    </div>
                    <div className='column is-2'>
                        <button className={`button is-success`} disabled={disabled} onClick={this.addPage}>Agregar</button>
                    </div>
                </div>
                <nav className="level">
                    {pages.map(page=>{
                        return <div className="level-item" key={page.id}>
                        <p className="subtitle is-5">
                            <NavLink activeClassName={"active"} to={{
                                pathname:`${matchUrl}${page.path}`,
                                state: {info:{...page}}
                            }}>{page.name}</NavLink>
                        </p>
                    </div>})}
                </nav>
                <section>
                    <Switch>
                        <Route exact path={`${matchUrl}/agenda`} render={()=><p>Agenda content</p>}/>
                        <Route exact path={`${matchUrl}/personalizada`} render={()=><PagePersonalizada/>}/>
                    </Switch>
                </section>
            </div>
        )
    }
}

export default withRouter(Pages)