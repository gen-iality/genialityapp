import React from 'react';
import Moment from 'moment';


const TicketsList=({ stages,  experience,  active,  selectStage,  ticketstoshow, handleQuantity, selectValues,  disabledSelect, currencyFormatConfig})=>{

    return (     
           <>
               <div className="columns content-tabs">
                    {stages && stages.map((stage, indice) => {
                      return (
                       <div
                         className={`column box has-text-weight-bold tab stage ${active === stage.stage_id ? "is-active" : ""} ${
                            "ended" === stage.status ? "is-disabled" : ""
                            }`}
                          key={stage.stage_id}
                         onClick={(event) => selectStage(stage)}>
                           <p>{stage.title}</p>
                          {!experience && (
                           <React.Fragment>
                            <hr className="separador" />
                              <div className="columns is-vcentered date-media">
                               <div className="column is-5 date-etapa">
                                  <span className="is-size-5">{Moment(stage.start_sale_date).format("DD")}</span>
                                <br />
                                  <span className="is-capitalized">{Moment(stage.start_sale_date).format("MMMM")}</span>
                                </div>
                                <div className="column is-2 date-etapa hasta">a</div>
                                <div className="column is-5 date-etapa">
                                 <span className="is-size-5">{Moment(stage.end_sale_date).format("DD")}</span>
                             <br />
                             <span className="is-capitalized">{Moment(stage.end_sale_date).format("MMMM")}</span>
                            </div>
                          </div>
                        </React.Fragment>
                       )}
                     </div>
                   );
                     })}
                  </div>
                  {ticketstoshow.map((ticket) => {
                    return (
                  <div className="box box-ticket" key={ticket._id}>
                        <div className="media content-ticket">
                      <div className="media-content">
                          <p className="title is-4">{ticket.title}</p>
                            <p className="subtitle is-6 has-text-weight-normal">{ticket.description}</p>
                           </div>
                          <div className="media-right">
                            <span className="title price">
                              {ticket.price === "0"
                                 ? "Gratis"
                                : new Intl.NumberFormat("es-CO", { currencyFormatConfig, currency: ticket.currency }).format(
                                  ticket.price
                               )}
                           </span>
                            {ticket.options.length > 0 && (
                              <div className="select">
                             <select
                              onChange={handleQuantity}
                               name={`quantity_${ticket._id}`}
                               value={selectValues[ticket._id]}
                               disabled={disabledSelect.includes(ticket._id)}>
                                  <option value={0}>0</option>
                              {ticket.options.map((item) => {
                                     return (
                                       <option value={item} key={item}>
                                      {item}
                                      </option>
                                     );
                                   })}
                                </select>
                               </div>
                             )}
                           </div>
                         </div>
                   </div>)})}
                   </>                
    );
}

export default TicketsList;