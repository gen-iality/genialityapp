import React, {Component} from 'react';
import {icon} from "../../../../../helpers/constants";

class ModalSpeaker extends Component{
    constructor(props){
        super(props)

    }
    
    
    render(){
      
        return(
            <React.Fragment>
                <div className={`modal modal-add-user ${this.props.modal ? "is-active" : ""}`}>
                        <div className="modal-background"/>
                        <div className="modal-card">
                            <header className="modal-card-head">
                                <div className="modal-card-title">
                                    <div className="icon-header" dangerouslySetInnerHTML={{ __html: icon }}/>
                                </div>
                                <button className="delete" aria-label="close" onClick={this.props.hideModal}/>
                            </header>
                            <section className="modal-card-body">
                                <div>
                                    <img className="img-modal" src={this.props.infoSpeaker['picture'] ? this.props.infoSpeaker['picture'] : 'https://bulma.io/images/placeholders/1280x960.png'} alt="Pic" />
                                </div>
                                <div>
                                    <p className="is-size-4 modal-titulo">Name: 
                                        <span className="modal-contenido"> {this.props.infoSpeaker.name}</span>
                                    </p>
                                    <p className="is-size-4 modal-titulo">Address:  
                                        <span className="modal-contenido"> {this.props.infoSpeaker.position} </span>
                                    </p>
                                    <p className="is-size-4 modal-titulo">Company:  
                                        <span className="modal-contenido"> {this.props.infoSpeaker.company}</span>
                                    </p>
                                    <p className="is-size-4 modal-titulo">Country:  
                                        <span className="modal-contenido"> {this.props.infoSpeaker.country}</span>
                                    </p>
                                    <p className="is-size-4 modal-titulo">Description:  
                                        <span className="modal-contenido"> {this.props.infoSpeaker.description}</span>
                                    </p>
                                </div>
                            </section>
                            {
                            <footer className="modal-card-foot">
                                {
                                    
                                }
                            </footer>
                            }
                        </div>
                    </div>
                    {/* <div className={`modal modal-add-user ${this.props.modal ? "is-active" : ""}`}>
                        
                        <div className="column is-narrow has-text-centered">
                            <button className="button is-primary" onClick={this.props.hideModal}>Cerrar</button>
                        </div>
                    </div> */}
            </React.Fragment>
        )
    }
}

export default ModalSpeaker