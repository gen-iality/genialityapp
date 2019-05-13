import React, {Component} from "react";
import Moment from "moment";
import "moment/locale/es";
import {Actions} from "../../helpers/request";
import * as Cookie from "js-cookie";
import {toast} from "react-toastify";
import {SinSilla} from "./forms/SinSilla";
import ConSilla from "./forms/ConSilla";
Moment.locale('es');

class TicketsForm extends Component {
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
            loading: false,
            total:0
        }
    }

    componentDidMount() {
        const haspayments = !!this.props.tickets.find(item=>item.price !== "0");
        const evius_token = Cookie.get('evius_token');
        //Arreglo de tiquetes
        const tickets = this.props.tickets.map(ticket => {
            //Formateo de precio
            ticket.price =
                ticket.price === '0' ? 'Gratis' :
                new Intl.NumberFormat('es-CO', { style: 'currency', minimumFractionDigits:0 , maximumFractionDigits: 0, currency: ticket.currency}).format(ticket.price);
            //Encuentro el stage relacionado
            const stage =  this.props.stages.find(stage=>stage.stage_id === ticket.stage_id);
            //Lista de opciones para el select
            ticket.options = (stage.status === 'ended' || stage.status === 'notstarted') ? [] :
                Array.from(Array(parseInt(ticket.max_per_person,10))).map((e,i)=>i+1);
            return ticket
        });
        const stage = this.props.stages.find(stage=>stage.status==="active"); //Se encunetra el primer stage que esté activo para mostrarlo
        const id = stage ? stage.stage_id : ''; //Condición para traer el _id de stage. Se usa para prevenir que los datos del api vengan malos
        const ticketstoshow = tickets.filter(ticket => ticket.stage_id === id); //Filtrar los tiquetes del stage activo
        this.setState({auth:!!evius_token,haspayments,active:id,tickets,ticketstoshow})
    }

    changeStep = (step) => {
        if(step === 1 && this.state.summaryList.length <= 0 ) return;
        this.setState({step})
    };

    //Función CLICK para los tabs stage
    selectStage = (stage) => {
        const id = stage.stage_id;
        const ticketstoshow = this.state.tickets.filter(ticket => ticket.stage_id === id); //Filtra tiquetes del stage
        this.setState({active:id,ticketstoshow})
    };

    //Función para el select tiquetes
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

    //Función para remover tiquete del resument
    removeTicket = (id) => {
        const ticketsadded = Object.assign(this.state.ticketsadded);
        const summaryList = [...this.state.summaryList];
        const pos = summaryList.map(item=>item.id).indexOf(id);
        const info = summaryList[pos];
        const price = parseInt(info.price.replace(/[^0-9]/g, ''), 10);
        summaryList.splice(pos,1);
        delete ticketsadded[id];
        this.setState((prevState)=>{
            return {ticketsadded,summaryList,selectValues:{...this.state.selectValues,[id]:'0'},total:prevState.total-price}
        })
    };

    //Función para mostrar el resumen
    renderSummary = () => {
        const tickets = this.props.tickets;
        const show = [];
        let total = 0;
        Object.keys(this.state.ticketsadded).map(key=>{
            const info = tickets.find(ticket=>ticket._id === key);
            const amount = this.state.ticketsadded[key];
            const price = parseInt(info.price.replace(/[^0-9]/g, ''), 10) * amount;
            total += price;
            const cost = new Intl.NumberFormat('es-CO', {
                style: 'currency',
                minimumFractionDigits:0 ,
                maximumFractionDigits: 0,
                currency: info.currency}).format(price);
            return show.push({name:info.title,quantity:amount,id:info._id,price:cost})
        });
        this.setState({summaryList:show,total});
    };

    //Función botón RESERVAR
    onClick = () => {
        if(this.state.summaryList.length<=0) return;//Si no hay tiquetes no hace nada, prevenir click raro
        if(!this.state.auth) return this.props.handleModal(); //Si no está logueado muestro popup
        this.setState({loading:true});
        const data = {tickets:[]};
        //Construyo body de acuerdo a peticiones de api
        this.state.summaryList.map(item=>{
            data[`ticket_${item.id}`] = item.quantity;
            return data.tickets.push(item.id)
        });
        Actions.post(`/es/e/${this.props.event.id}/checkout`,data)
            .then(resp=>{
                console.log(resp);
                if(resp.status === 'success'){
                    //Si la peteción es correcta redirijo a la url que enviaron
                    window.location.replace(resp.redirectUrl);
                }else{
                    //Muestro error parseado
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
        const {state:{active,ticketstoshow,ticketsadded,summaryList,loading,selectValues,total,step},props:{stages},selectStage,handleQuantity,onClick,changeStep} = this;
        const steps = [
            <SinSilla stages={stages} active={active} selectStage={selectStage} ticketstoshow={ticketstoshow} handleQuantity={handleQuantity} selectValues={selectValues}/>,
            <ConSilla />
        ];
        return (
            <div className="columns is-centered">
                <div className="column">
                   {/* <div className="columns">
                        <div className={`column is-3 has-text-centered has-text-weight-semibold step ${step===0?'is-active':''}`}
                             onClick={e=>changeStep(0)}>Escoge tu Boleta</div>
                        <div className={`column is-3 has-text-centered has-text-weight-semibold step ${step===1?'is-active':''}`}
                             onClick={e=>changeStep(1)}>Escoge tu Silla</div>
                    </div>*/}
                    <div className='columns'>
                        <div className='column is-8'>
                            {steps[step]}
                        </div>
                        <div className='column is-4 resume'>
                            <div className="card">
                                <header className="card-header has-text-centered">
                                    <p className="card-header-title has-text-primary has-text-weight-bold">Resumen de reserva</p>
                                </header>
                                <div className="card-content">
                                    {
                                        summaryList.length<=0 ?
                                            <p className="no-tickets">Aún no tienes tiquetes seleccionados :(</p>:
                                            <React.Fragment>
                                                {
                                                    summaryList.map(item=>{
                                                        return <div className='box ticket' key={item.id}>
                                                            <article className='media columns'>
                                                                <div className='column is-10'>
                                                                    <div className='content'>
                                                                        <p><strong>{item.name}</strong></p>
                                                                        <p>
                                                                            <small>Cantidad: {item.quantity} - Valor: {item.price}</small>
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className="column is-2">
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
                                            <div className='Subtotal'>
                                                <p>Subtotal {new Intl.NumberFormat('es-CO', { style: 'currency', minimumFractionDigits:0, maximumFractionDigits: 0,currency: "COP"}).format(total)}</p>
                                            </div>
                                            <div className='Button-reserva'>
                                                <button className={`button is-rounded is-primary ${loading?'is-loading':''}`} disabled={Object.keys(ticketsadded).length<=0}  onClick={onClick}>Reservar</button>
                                            </div>
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

export default TicketsForm