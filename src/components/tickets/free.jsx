import React, {Component} from "react";
import Moment from "moment";
import "moment/locale/es";
import {Actions} from "../../helpers/request";
import * as Cookie from "js-cookie";
import {toast} from "react-toastify";
Moment.locale('es');

class TicketFree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            active: '',
            tickets: [],
            ticketstoshow: [],
            selectValues: {},
            summaryList: [],
            ticketsadded: {},
            haspayments: false,
            loading: false
        }
    }

    componentDidMount() {
        const haspayments = !!this.props.tickets.find(item=>item.price !== "0");
        const evius_token = Cookie.get('evius_token');
        const tickets = this.props.tickets.map(ticket => {
            ticket.options = Array.from(Array(parseInt(ticket.max_per_person,10))).map((e,i)=>i+1);
            return ticket
        });
        const stage = this.props.stages.find(stage=>stage.status=="active");
        const id = stage ? stage.stage_id : '';
        const ticketstoshow = tickets.filter(ticket => ticket.stage_id === id);
        this.setState({auth:!!evius_token,haspayments,active:id,tickets,ticketstoshow})
    }

    selectStage = (stage) => {
        if(!stage.status) return;
        const id = stage.stage_id;
        const ticketstoshow = this.state.tickets.filter(ticket => ticket.stage_id === id);
        this.setState({active:id,ticketstoshow})
    };

    handleQuantity = (e) => {
        let {name,value} = e.target;
        name = name.split('_')[1];
        const ticketsadded = Object.assign(this.state.ticketsadded);
        if(value === '0') this.removeTicket(name);
        else {
            ticketsadded[name] = value;
            this.setState({ticketsadded}, () => {
                this.renderSummary()
            })
        }
        this.setState({selectValues:{...this.state.selectValues,[name]:value}})
    };

    removeTicket = (id) => {
        const ticketsadded = Object.assign(this.state.ticketsadded);
        const summaryList = [...this.state.summaryList];
        const pos = summaryList.map(item=>item.id).indexOf(id);
        summaryList.splice(pos,1);
        delete ticketsadded[id];
        this.setState({ticketsadded,summaryList,selectValues:{...this.state.selectValues,[id]:'0'}})
    };

    renderSummary = () => {
        const tickets = this.props.tickets;
        const show = [];
        Object.keys(this.state.ticketsadded).map(key=>{
            const info = tickets.find(ticket=>ticket._id === key);
            return show.push({name:info.title,quantity:this.state.ticketsadded[key],id:info._id})
        });
        this.setState({summaryList:show});
    };

    onClick = () => {
        if(this.state.summaryList.length<=0) return;
        if(!this.state.auth) return this.props.handleModal();
        this.setState({loading:true});
        const data = {
            tickets:[]
        };
        this.state.summaryList.map(item=>{
            data[`ticket_${item.id}`] = item.quantity;
            return data.tickets.push(item.id)
        });
        Actions.post(`/es/e/${this.props.eventId}/checkout`,data)
            .then(resp=>{
                console.log(resp);
                if(resp.status === 'success'){
                    /*const evius_token = Cookie.get('evius_token');
                    const url = `${resp.redirectUrl}/?evius_token=${evius_token}`;*/
                    const url = resp.redirectUrl;
                    window.location.replace(url);
                }else{
                    this.setState({loading:false});
                    toast.error(JSON.stringify(resp));
                }
            })
            .catch(err=>{
                console.log(err);
                this.setState({loading:false})
            })
    };

    render() {
        const {state:{active,ticketstoshow,ticketsadded,summaryList,loading,selectValues},props:{stages},selectStage,handleQuantity,onClick} = this;
        return (
            <div className="columns is-centered">
                <div className="column">
                    {/*<div className="tabs">
                        <ul>
                            <li><a className='has-text-weight-semibold' onClick={onClick}>Escoge tu Boleta</a></li>
                            <li><a className='has-text-weight-semibold' onClick={onClick}>Confirma tus Datos</a></li>
                            {haspayments&&<li><a className='has-text-weight-semibold' onClick={onClick}>Paga</a></li>}
                            <li><a className='has-text-weight-semibold' onClick={onClick}>Confirmación</a></li>
                        </ul>
                    </div>*/}
                    <div className='columns'>
                        <div className='column is-8'>
                            <div className='columns content-tabs'>
                                {

                                    stages.map(stage=>{
                                        return <div className={`column box has-text-weight-bold tab stage ${active===stage.stage_id?'is-active':''} ${"ended"===stage.status?'is-disabled':''}`}
                                                    key={stage.stage_id} onClick={event => selectStage(stage)}>
                                            <p>{stage.title}</p>
                                            <hr className="separador"/>
                                            <div className='columns is-vcentered'>
                                                <div className='column is-5 date-etapa'>
                                                    <span className='is-size-4'>{Moment(stage.start_sale_date).format('DD')}</span>
                                                    <br/>
                                                    <span className='is-capitalized'>{Moment(stage.start_sale_date).format('MMMM')}</span>
                                                </div>
                                                <div className='column is-2 date-etapa hasta'>a</div>
                                                <div className='column is-5 date-etapa'>
                                                    <span className='is-size-4'>{Moment(stage.end_sale_date).format('DD')}</span>
                                                    <br/>
                                                    <span className='is-capitalized'>{Moment(stage.end_sale_date).format('MMMM')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    })
                                }
                            </div>
                            {
                                ticketstoshow.map(ticket=>{
                                    return <div className='box' key={ticket._id}>
                                        <div className="media">
                                            <div className="media-content">
                                                <p className="title is-4">{ticket.title}</p>
                                                <p className="subtitle is-6 has-text-weight-normal">{ticket.description}</p>
                                                {parseInt(ticket.number_person_per_ticket,10)>1&&
                                                <p className='has-text-weight-normal is-italic is-8'>Un {ticket.title} equivale a {ticket.number_person_per_ticket} de personas</p>}
                                            </div>
                                            <div className="media-right">
                                                <span className="title price"> {ticket.price === '0' ? 'Gratis' : `$ ${ticket.price}`}</span>
                                                <div className="select">
                                                    <select onChange={handleQuantity} name={`quantity_${ticket._id}`} value={selectValues[ticket._id]}>
                                                        <option value={0}>0</option>
                                                        {
                                                            ticket.options.map(item => {
                                                                return <option value={item} key={item}>{item}</option>
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                })
                            }
                        </div>
                        <div className='column is-4'>
                            <div className="card">
                                <header className="card-header has-text-centered">
                                    <p className="card-header-title has-text-primary has-text-weight-bold">Resumen de reserva</p>
                                </header>
                                <div className="card-content">
                                    {
                                        summaryList.length<=0 ?
                                            <p>Aún no tienes tiquetes seleccionados :(</p>:
                                            <React.Fragment>
                                                {
                                                    summaryList.map(item=>{
                                                        return <div className='box ticket' key={item.id}>
                                                            <article className='media'>
                                                                <div className='media-content'>
                                                                    <div className='content'>
                                                                        <p><strong>{item.name}</strong></p>
                                                                        <p><small>Cantidad: {item.quantity}</small></p>
                                                                    </div>
                                                                </div>
                                                                <div className="media-right">
                                                                    <button className="delete" onClick={event => this.removeTicket(item.id)}/>
                                                                </div>
                                                            </article>
                                                        </div>
                                                    })
                                                }
                                            </React.Fragment>
                                    }
                                </div>
                                <footer className="card-footer">
                                    <div className='card-footer-item'>
                                        <button className={`button is-rounded is-primary ${loading?'is-loading':''}`} disabled={Object.keys(ticketsadded).length<=0}  onClick={onClick}>Reservar</button>
                                    </div>
                                </footer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

/*function SeleccionTiquete({...props}){
    const {stages} = props;
    return (
        <React.Fragment>
            {
                stages.map(stage=>{
                    return <div className='column box has-text-weight-bold' key={stage.stage_id}>
                        <p>{stage.title}</p>
                        <div className='columns is-vcentered'>
                            <div className='column is-5'>
                                <span className='is-size-3'>{Moment(stage.start_sale_date).format('DD')}</span>
                                <br/>
                                <span className='is-capitalized'>{Moment(stage.start_sale_date).format('MMMM')}</span>
                            </div>
                            <div className='column is-2'>hasta</div>
                            <div className='column is-5'>
                                <span className='is-size-3'>{Moment(stage.end_sale_date).format('DD')}</span>
                                <br/>
                                <span className='is-capitalized'>{Moment(stage.end_sale_date).format('MMMM')}</span>
                            </div>
                        </div>
                    </div>
                })
            }
        </React.Fragment>
    )
}*/

export default TicketFree