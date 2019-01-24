import React, {Component} from 'react';
import {icon} from "../../../../helpers/constants";

class ModalSpeaker extends Component{
    constructor(props){
        super(props)
        // this.state = {
        //     speakerDetails: [] 
        // };
    }

    componentDidMount() {
        this.props.infoSpeaker.map(data => {
            console.log('data: ', data);

        })
    }
    

    showSpeakerInfo () {
        let info = this.props.infoSpeaker.map(data => {
            return(
                <p>{data}</p>
            )
        })
    }

    
    render(){
        // console.log("here array", this.props.infoSpeaker);
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
                                // this.showSpeakerInfo()
                            }
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