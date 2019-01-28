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
                                    <img class="img-modal" src={this.props.infoSpeaker['picture'] ? this.props.infoSpeaker['picture'] : 'https://bulma.io/images/placeholders/1280x960.png'} alt="Pic" />
                                </div>
                                <div>
                                    <h1>{this.props.infoSpeaker.name}</h1>
                                    <h2>{this.props.infoSpeaker.position}</h2>
                                    <h2>{this.props.infoSpeaker.company}</h2>
                                    <h2>{this.props.infoSpeaker.country}</h2>
                                    <h2>{this.props.infoSpeaker.description}</h2>
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