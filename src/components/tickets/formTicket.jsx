/*global seatsio*/
import React, { Component } from "react";
import { SeatsioSeatingChart } from '@seatsio/seatsio-react'
import Moment from "moment";
import "moment/locale/es";
import { Actions } from "../../helpers/request";
import * as Cookie from "js-cookie";
import { toast } from "react-toastify";
import UserRegistration from "../events/userRegistration"
import Event from "../event-users/index"
import Item from "antd/lib/list/Item";

class TicketsForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            active: '',
            code_discount: '',
            tickets: [],
            ticketstoshow: [],
            selectValues: {},
            disabledSelect: [],
            summaryList: [],
            listSeats: [],
            ticketsadded: {},
            haspayments: false,
            disabled: false,
            loading: false,
            total: 0,
            currencyFormatConfig:
                { style: 'currency', minimumFractionDigits: 0, maximumFractionDigits: 0 },
            isVisible: false,

        };
        this.chart = [];
        this.request = this.request.bind(this)
    }

    componentDidMount() {

        const haspayments = !!this.props.tickets.find(item => item.price !== "0");
        const evius_token = Cookie.get('evius_token');



        //Arreglo de tiquetes
        const tickets = this.props.tickets.map(ticket => {

            //Encuentro el stage relacionado
            const stage = (!this.props.stages) ? null : this.props.stages.find(stage => stage.stage_id === ticket.stage_id);
            //Lista de opciones para el select
            ticket.options = (stage && (stage.status === 'ended' || stage.status === 'notstarted')) ? [] :
                Array.from(Array(parseInt(ticket.max_per_person, 10))).map((e, i) => i + 1);
            return ticket
        });

        //Se encunetra el primer stage que esté activo para mostrarlo
        let stage = (!this.props.stages) ? null : this.props.stages.find(stage => stage.status == "active");
        //por si ninguna etapa se encuetra activa
        stage = (!stage && this.props.stages && this.props.stages[0]) ? this.props.stages[0] : null;


        const id = stage ? stage.stage_id : ''; //Condición para traer el _id de stage. Se usa para prevenir que los datos del api vengan malos
        const ticketstoshow = tickets.filter(ticket => ticket.stage_id == id); //Filtrar los tiquetes del stage activo
        console.log("DEBUG", "ticketstoshow", tickets[0])
        //"5e835d9fd74d5c6cfd379992"
        //Persistencia de tiquetes seleccionados después de login
        let info = localStorage.getItem('info'); //Se trae info
        if (info && evius_token) {
            info = JSON.parse(info);
            const values = {};
            info.show.map(item => values[item.id] = item.quantity);
            this.setState({ total: info.total, summaryList: info.show, selectValues: values, disabled: false })
        }
        this.setState({ auth: !!evius_token, haspayments, active: id, tickets, ticketstoshow })
    }

    //Al salir del landing se limpia la informacion de los tiquetes seleccionados.
    componentWillUnmount() {
        localStorage.removeItem('info');
    }

    changeStep = (step) => {
        if (!this.state.auth) return this.props.handleModal(); //Si no está logueado muestro popup
        if (step === 1 && this.state.summaryList.length <= 0) return;
        this.setState({ step })
    };

    //Función CLICK para los tabs stage
    selectStage = (stage) => {
        const id = stage.stage_id;
        const ticketstoshow = this.state.tickets.filter(ticket => ticket.stage_id == id); //Filtra tiquetes del stage
        this.setState({ active: id, ticketstoshow })
    };

    //Función para el select tiquetes
    handleQuantity = (e) => {
        let { name, value } = e.target;
        name = name.split('_')[1];
        const ticketsadded = Object.assign(this.state.ticketsadded);
        if (value === '0') this.removeTicket(name);
        else {
            ticketsadded[name] = value;
            const list = this.props.seatsConfig ? [...this.state.ticketstoshow].map(i => i._id) : [];
            this.setState({ ticketsadded, disabledSelect: list.filter(i => i !== name) }, () => {
                this.renderSummary()
            })
        }
        this.setState({ selectValues: { ...this.state.selectValues, [name]: value } })
    };

    //Función para remover tiquete del resument
    removeTicket = (id) => {
        const ticketsadded = Object.assign(this.state.ticketsadded);
        const summaryList = [...this.state.summaryList];
        const pos = summaryList.map(item => item.id).indexOf(id);
        const info = summaryList[pos];
        const price = parseInt(info.price.replace(/[^0-9]/g, ''), 10);
        summaryList.splice(pos, 1);
        delete ticketsadded[id];
        this.setState((prevState) => {
            return { ticketsadded, summaryList, selectValues: { ...this.state.selectValues, [id]: '0' }, total: prevState.total - price, step: 0, disabledSelect: [] }
        })
    };

    //Función para mostrar el resumen
    renderSummary = () => {
        const tickets = this.props.tickets;
        const show = [];
        let total = 0;
        Object.keys(this.state.ticketsadded).map(key => {
            const info = tickets.find(ticket => ticket._id === key);
            const amount = this.state.ticketsadded[key];
            const price = info.price === 'Gratis' ? 0 : parseInt(info.price.replace(/[^0-9]/g, ''), 10) * amount;
            total += price;
            const cost = price <= 0 ? 'Gratis' : new Intl.NumberFormat('es-CO', {
                style: 'currency',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
                currency: info.currency
            }).format(price);
            return show.push({ name: info.title, quantity: amount, id: info._id, price: cost })
        });
        if (!this.state.auth) localStorage.setItem('info', JSON.stringify({ total, show }));
        this.setState({ summaryList: show, total });
    };

    //Función botón RESERVAR
    onClick = () => {
        if (this.state.summaryList.length <= 0) return;//Si no hay tiquetes no hace nada, prevenir click raro
        if (!this.state.auth) return this.props.handleModal(); //Si no está logueado muestro popup

        //@TODO si no tiene sillas debe pasar derecho al checkout y si el tickete tiene silla debe ir en el tickete eso es del API y usado aca
        //Construyo body de acuerdo a peticiones de api
        let tienesilla = false;
        this.state.summaryList.map(item => {
            if (item.name != "General") {
                tienesilla = true;
            }
        });

        if (this.state.step === 0 && !tienesilla) {
            return this.submit(false);
        }
        if (this.state.step === 0) {

            if (this.props.seatsConfig) return this.setState({ step: 1 });

            else return this.submit(false);
        }

        if (this.state.step === 1) return this.submit(true)
    };

    //Función COMPRAR, recibe sillas si tiene o no
    submit = (seats) => {
        const data = { tickets: [] };
        //Construyo body de acuerdo a peticiones de api
        this.state.summaryList.map(item => {
            data[`ticket_${item.id}`] = item.quantity;
            return data.tickets.push(item.id)
        });
        if (seats) {
            //Si tiene sillas hago validaciones de cantidad de tiquetes y sillas seleccionadas
            const quantity = this.state.summaryList.map(i => parseInt(i.quantity, 10)).reduce((a, b) => a + b, 0);
            this.chart.listSelectedObjects(list => {
                //Si las sillas son iguales a los tiquetes lo deja pasar, sino muestra toast
                if (quantity === list.length) {
                    data.seats = list;
                    this.request(data);
                } else {
                    toast.info(`Te quedan ${quantity - list.length} puestos por seleccionar`);
                }
            });
        }
        else this.request(data);
    };

    //Función que hace la petición, carga loading y muestra reusltado en log si hay error muestra en log y en un toast
    async request(data) {
        this.setState({ loading: true });
        try {
            data.code_discount = this.state.code_discount;
            const resp = await Actions.post(`/es/e/${this.props.eventId}/checkout`, data)
            console.log(resp);
            if (resp.status === 'success') {
                //Si la peteción es correcta redirijo a la url que enviaron
                window.location.replace(resp.redirectUrl);
            } else {
                //Muestro error parseado
                this.setState({ loading: false });
                toast.error(JSON.stringify(resp));
            }
        } catch (err) {
            toast.error(JSON.stringify(err));
            console.log(err);
            this.setState({ loading: false })
        }
    }

    //Función para manejar si se selecciona o no alguna silla. Para mostrar o quitar del resumen
    handleObject = (object, flag) => {
        const listSeats = [...this.state.listSeats];
        if (flag)
            listSeats.push({ parent: object.category.label, name: object.seatId });
        else
            listSeats.splice(listSeats.map(e => e.seatId).indexOf(object.seatId), 1);
        this.setState({ listSeats })
    };

    render() {
        const { state: { active, ticketstoshow, summaryList, loading, selectValues, total, step, disabled, listSeats, disabledSelect },
            props: { stages, seatsConfig, experience, fees },
            selectStage, handleQuantity, onClick, changeStep } = this;
        return (
            <>

                {/* <UserRegistration extraFields={[]} eventId={this.props.eventId} /> */}


                <div className="columns is-centered">
                    <div className="column">
                        <div className="columns menu-steps">
                            <div className={`column is-3 has-text-centered has-text-weight-semibold step ${step === 0 ? 'is-active' : ''}`}
                                onClick={e => changeStep(0)}>Escoge tu Boleta</div>
                            {
                                seatsConfig && <div className={`column is-3 has-text-centered step ${step === 1 ? 'is-active' : ''}`}
                                    onClick={e => changeStep(1)}>Escoge tu Silla</div>
                            }
                        </div>
                        <div className='columns tickets-frame'>
                            <div className='column is-8 tickets-content'>
                                {
                                    step === 0 ?
                                        <ListadoTiquetes stages={stages} currencyFormatConfig={this.state.currencyFormatConfig} experience={experience} active={active}
                                            selectStage={selectStage} ticketstoshow={ticketstoshow}
                                            handleQuantity={handleQuantity} selectValues={selectValues}
                                            disabledSelect={disabledSelect} /> :
                                        <div>
                                            <div className="card">
                                                <header className="card-header has-text-left">
                                                    <p className="title-map has-text-primary has-text-weight-bold">
                                                        Mapa del evento
                                                    <p className="subtitle is-6 has-text-weight-normal">
                                                            En el mapa del evento seleccione su ubicación para verlo
                                                            reflejado
                                                            en el resumen de compra.
                                                    </p>
                                                    </p>
                                                </header>
                                                <div className="card-content">
                                                    <div className="content is-center">

                                                        <SeatsioSeatingChart
                                                            publicKey={seatsConfig["keys"]["public"]}
                                                            event={seatsConfig["keys"]["event"]}
                                                            language={seatsConfig["language"]}
                                                            maxSelectedObjects={this.state.summaryList.map(i => parseInt(i.quantity, 10)).reduce((a, b) => a + b, 0)}
                                                            availableCategories={this.state.summaryList.map(ticket => ticket.name)}
                                                            showMinimap={seatsConfig["minimap"]}
                                                            onRenderStarted={createdChart => { this.chart = createdChart }}
                                                            onObjectSelected={object => { this.handleObject(object, true) }}
                                                            onObjectDeselected={object => { this.handleObject(object, false) }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                }
                            </div>
                            <div className='column is-4 resume'>
                                <div className="card card-resume">
                                    <header className="card-header">
                                        <div className='title-header'>
                                            <p className="card-header-title has-text-primary has-text-weight-bold">
                                                <span className="icon is-medium">
                                                    <i className="fas fa-receipt fa-lg"></i>
                                                </span>
                                                <span className='ticket-resume-title'> Resumen de reserva </span>
                                            </p>
                                        </div>
                                    </header>
                                    <div className="card-content">
                                        {
                                            summaryList.length <= 0 ?
                                                <p className="no-tickets">Aún no tienes tiquetes seleccionados :(</p> :
                                                <React.Fragment>
                                                    <div className='is-hidden-mobile'>
                                                        {
                                                            summaryList.map(item => {
                                                                return <div className='box ticket' key={item.id}>
                                                                    <article className='media columns'>
                                                                        <div className='column is-10 column-content'>
                                                                            <div className='content'>
                                                                                <p><strong>{item.name}</strong></p>
                                                                                <p>
                                                                                    <small>Cantidad: {item.quantity} - Valor: {item.price}</small>
                                                                                </p>
                                                                                <p>
                                                                                    <small>Sillas: {listSeats.filter(i => i.parent === item.name).map(i => i.name)}</small>
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="column is-2 column-delete">
                                                                            <button className="delete"
                                                                                onClick={event => this.removeTicket(item.id)} />
                                                                        </div>
                                                                    </article>
                                                                </div>
                                                            })
                                                        }
                                                    </div>
                                                    <div className='is-hidden-tablet'>
                                                        <div className='content'>
                                                            <p className='quantity'>
                                                                <small>Cantidad de tiquetes: {summaryList.map(i => parseInt(i.quantity, 10)).reduce((prev, next) => prev + next)}</small>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="field">
                                                        <label className="label" htmlFor="codpromocional">Código
                                                        Promocional</label>
                                                        <div className="control">
                                                            <input type="text"
                                                                placeholder="Ingrese aqui su código promocional"
                                                                id='codpromocional' className='input'
                                                                name={'code_discount'}
                                                                onChange={e => this.setState({ code_discount: e.target.value })} />
                                                        </div>
                                                        <span>* El descuento será calculado al hacer clic en reservar</span>
                                                    </div>
                                                </React.Fragment>
                                        }
                                    </div>
                                    <footer className="card-footer">
                                        <div className='card-footer-item'>
                                            {
                                                summaryList.length > 0 &&
                                                <React.Fragment>
                                                    <div className='Subtotal'>
                                                        <p>Subtotal: {
                                                            total === 0 ? 'Gratis' :
                                                                new Intl.NumberFormat('es-CO', {
                                                                    style: 'currency',
                                                                    minimumFractionDigits: 0,
                                                                    maximumFractionDigits: 0,
                                                                    currency: "COP"
                                                                }).format(total)
                                                        }</p>
                                                    </div>
                                                    {fees &&
                                                        <React.Fragment>
                                                            <p>Servicio: {fees}</p>
                                                            <div className='Subtotal'>
                                                                <p>Total: {
                                                                    total === 0 ? 'Gratis' :
                                                                        new Intl.NumberFormat('es-CO', {
                                                                            style: 'currency',
                                                                            minimumFractionDigits: 0,
                                                                            maximumFractionDigits: 0,
                                                                            currency: "COP"
                                                                        }).format(total + total * fees)
                                                                }</p>
                                                            </div>
                                                        </React.Fragment>}
                                                </React.Fragment>
                                            }
                                            <div className='Button-reserva'>
                                                <button
                                                    className={`button is-rounded is-primary ${loading ? 'is-loading' : ''}`}
                                                    disabled={summaryList.length <= 0 || disabled} onClick={onClick}>
                                                    {step === 0 ? 'Reservar' : 'Comprar'}
                                                </button>
                                            </div>
                                        </div>
                                    </footer>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

function ListadoTiquetes({ ...props }) {
    const { stages, experience, active, selectStage, ticketstoshow, handleQuantity, selectValues, disabledSelect, currencyFormatConfig } = props;
    return (
        <React.Fragment>
            <div className='columns content-tabs'>
                {
                    stages.map((stage, indice) => {
                        return <div className={`column box has-text-weight-bold tab stage ${(active === stage.stage_id) ? 'is-active' : ''} ${"ended" === stage.status ? 'is-disabled' : ''}`}
                            key={stage.stage_id} onClick={event => selectStage(stage)}>
                            <p>{stage.title}</p>
                            {
                                !experience &&
                                <React.Fragment>
                                    <hr className="separador" />
                                    <div className='columns is-vcentered date-media'>
                                        <div className='column is-5 date-etapa'>
                                            <span className='is-size-5'>{Moment(stage.start_sale_date).format('DD')}</span>
                                            <br />
                                            <span className='is-capitalized'>{Moment(stage.start_sale_date).format('MMMM')}</span>
                                        </div>
                                        <div className='column is-2 date-etapa hasta'>a</div>
                                        <div className='column is-5 date-etapa'>
                                            <span className='is-size-5'>{Moment(stage.end_sale_date).format('DD')}</span>
                                            <br />
                                            <span className='is-capitalized'>{Moment(stage.end_sale_date).format('MMMM')}</span>
                                        </div>
                                    </div>
                                </React.Fragment>
                            }
                        </div>
                    })
                }
            </div>
            {
                ticketstoshow.map(ticket => {
                    return <div className='box box-ticket' key={ticket._id}>
                        <div className="media content-ticket">
                            <div className="media-content">
                                <p className="title is-4">{ticket.title}</p>
                                <p className="subtitle is-6 has-text-weight-normal">{ticket.description}</p>
                            </div>
                            <div className="media-right">
                                <span className="title price">
                                    {ticket.price === '0' ? 'Gratis' : new Intl.NumberFormat('es-CO', { currencyFormatConfig, currency: ticket.currency }).format(ticket.price)}
                                </span>
                                {
                                    ticket.options.length > 0 &&
                                    <div className="select">
                                        <select onChange={handleQuantity} name={`quantity_${ticket._id}`} value={selectValues[ticket._id]} disabled={disabledSelect.includes(ticket._id)}>
                                            <option value={0}>0</option>
                                            {
                                                ticket.options.map(item => {
                                                    return <option value={item} key={item}>{item}</option>
                                                })
                                            }
                                        </select>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                })
            }
        </React.Fragment>

    )
}

export default TicketsForm
