import React from "react";

export default function EventModal({...props}) {
    return (
        <div className={`modal ${props.modal ? "is-active" : ""}`}>
            <div className="modal-background"/>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">{props.title}</p>
                    <button className="delete is-large" aria-label="close" onClick={props.closeModal}/>
                </header>
                {props.children}
            </div>
        </div>
    )
}
