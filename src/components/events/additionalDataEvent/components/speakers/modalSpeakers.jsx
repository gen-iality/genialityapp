import React from 'react';
import {icon} from "../../../../../helpers/constants";

function ModalSpeaker({...props}) {
    return (
        <div className={`modal modal-add-user ${props.modal ? "is-active" : ""}`}>
            <div className="modal-background"/>
            <div className="modal-card">
                <header className="modal-card-head">
                    <div className="modal-card-title">
                        <div className="icon-header" dangerouslySetInnerHTML={{ __html: icon }}/>
                    </div>
                    <button className="delete" aria-label="close" onClick={props.hideModal}/>
                </header>
                <section className="modal-card-body">
                    <div>
                        <img className="img-modal" src={props.infoSpeaker['picture'] ? props.infoSpeaker['picture'] : 'https://bulma.io/images/placeholders/1280x960.png'} alt="Pic" />
                    </div>
                    <div>
                        <p className="is-size-4 modal-titulo">Name:
                            <span className="modal-contenido"> {props.infoSpeaker.name}</span>
                        </p>
                        <p className="is-size-4 modal-titulo">Position:
                            <span className="modal-contenido"> {props.infoSpeaker.position} </span>
                        </p>
                        <p className="is-size-4 modal-titulo">Company:
                            <span className="modal-contenido"> {props.infoSpeaker.company}</span>
                        </p>
                        <p className="is-size-4 modal-titulo">Country:
                            <span className="modal-contenido"> {props.infoSpeaker.country}</span>
                        </p>
                        <p className="is-size-4 modal-titulo">Description:
                            <span className="modal-contenido"> {props.infoSpeaker.description}</span>
                        </p>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default ModalSpeaker