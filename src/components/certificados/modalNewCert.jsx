import React from "react";

export default function NewCert({...props}) {
    return (
        <div className={`modal ${props.modal ? "is-active" : ""}`}>
            <div className="modal-background"/>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Nuevo Certificado</p>
                    <button className="delete is-large" aria-label="close" onClick={props.closeModal}/>
                </header>
                <section className="modal-card-body">
                    <div className="field">
                        <label className={`label has-text-grey-light is-capitalized required`}>Nombre</label>
                        <div className="control">
                            <input className="input"
                                name={"name"}
                                value={props.name}
                                onChange={props.onChange}/>
                        </div>
                    </div>
                    <div className="field">
                        <label className={`label has-text-grey-light is-capitalized required`}>Asignación</label>
                        <div className="control">
                            <div className="select">
                                <select value={props.rol} onChange={props.handleSelect} name={'rol'}>
                                    <option>...Seleccione</option>
                                    {
                                        props.roles.map((item,key)=>{
                                            return <option key={key} value={item._id}>{item.name}</option>
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                    </div>
                    {
                        props.message &&
                        <div className="msg">
                            <p className="help danger">{props.message}</p>
                        </div>
                    }
                </section>
                <footer className="modal-card-foot">
                    <button className="button is-primary" onClick={props.newCert}>Crear Certificado</button>
                    <button className="button is-text" onClick={props.closeModal}>Cancelar</button>
                </footer>
            </div>
        </div>
    )
}
