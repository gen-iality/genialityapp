import React, {Component} from 'react';
import {icon} from "../../../../helpers/constants";

class ModalSpeaker extends Component{
    constructor(props){
        super(props)
        this.state = {};
    }

    componentDidMount() {
      
    }

    
    render(){
        console.log('here info speaker', this.props.infoSpeaker[0]);
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
                            {
                             <p htmlFor={this.props.infoSpeaker[0]}>Name</p>
                            }
                            </section>
                            <section className="modal-card-body">
                             <p>Here speaker</p>
                             <p>Other</p>
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