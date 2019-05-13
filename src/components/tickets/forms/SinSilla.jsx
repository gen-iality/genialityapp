import React from "react";
import Moment from "moment";
import "moment/locale/es";
Moment.locale('es');

export function SinSilla({...props}) {
    const {stages,active,selectStage,ticketstoshow,handleQuantity,selectValues} = props;
    return (
        <React.Fragment>
            <div className='columns content-tabs'>
                {

                    stages.map(stage=>{
                        return <div className={`column box has-text-weight-bold tab stage ${active===stage.stage_id?'is-active':''} ${"ended"===stage.status?'is-disabled':''}`}
                                    key={stage.stage_id} onClick={event => selectStage(stage)}>
                            <p>{stage.title}</p>
                            <hr className="separador"/>
                            <div className='columns is-vcentered'>
                                <div className='column is-5 date-etapa'>
                                    <span className='is-size-5'>{Moment(stage.start_sale_date).format('DD')}</span>
                                    <br/>
                                    <span className='is-capitalized'>{Moment(stage.start_sale_date).format('MMMM')}</span>
                                </div>
                                <div className='column is-2 date-etapa hasta'>a</div>
                                <div className='column is-5 date-etapa'>
                                    <span className='is-size-5'>{Moment(stage.end_sale_date).format('DD')}</span>
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
                    return  <div className='box box-ticket' key={ticket._id}>
                        <div className="media">
                            <div className="media-content">
                                <p className="title is-4">{ticket.title}</p>
                                <p className="subtitle is-6 has-text-weight-normal">{ticket.description}</p>
                            </div>
                            <div className="media-right">
                                <span className="title price"> {ticket.price}</span>
                                {
                                    ticket.options.length>0&&
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
                                }
                            </div>
                        </div>
                    </div>
                })
            }
        </React.Fragment>
    )
}