import React,{ useState }  from 'react';
import TicketsList from './TicketList_old';
import withContext from '../../Context/withContext';



const TicketsEvent=({ selectStage,handleQuantity, changeStep,total,removeTicket, onClick,step,seatsConfig,stages, experience, fees, disabled, listSeats, disabledSelect,summaryList,ticketstoshow,loading,
    selectValues,active,currencyFormatConfig,cUser,cEvent})=>{        
   const [code_discount,setCodeDiscount]=useState()
     //Función botón RESERVAR

    return (
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
                            <div className='column is-12 tickets-content'>
                                {
                                    step === 0 ?
                                        <TicketsList stages={stages} currencyFormatConfig={currencyFormatConfig} experience={experience} active={active}
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
                                                       {/* <SeatsioSeatingChart
                                                            publicKey={seatsConfig["keys"]["public"]}
                                                            event={seatsConfig["keys"]["event"]}
                                                            language={seatsConfig["language"]}
                                                            maxSelectedObjects={this.state.summaryList.map(i => parseInt(i.quantity, 10)).reduce((a, b) => a + b, 0)}
                                                            availableCategories={this.state.summaryList.map(ticket => ticket.name)}
                                                            showMinimap={seatsConfig["minimap"]}
                                                            onRenderStarted={createdChart => { this.chart = createdChart }}
                                                            onObjectSelected={object => { this.handleObject(object, true) }}
                                                            onObjectDeselected={object => { this.handleObject(object, false) }}
                                                        />*/}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                }
                            </div>
                           
                        </div>
                        <div className='column is-12 resume'>
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
                                                                                onClick={event => removeTicket(item.id)} />
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
                                                                onChange={e =>  {setCodeDiscount(e.target.value)}} />
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
    );
}

export default withContext(TicketsEvent);