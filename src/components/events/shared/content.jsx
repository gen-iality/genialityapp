import React from "react";

export default function EventContent({...props}) {
    return (
        <div className={`event-datos ${props.classes}`}>
            <h2 className="title-section">{props.title}</h2>
            {props.description&&<p>{props.description}</p>}
            {
                props.addAction &&
                <div className="columns is-mobile">
                    <div className="column is-3 is-offset-9">
                        <button className="button add" onClick={props.addAction}>
                            <span className="icon"><i className="fas fa-plus-circle"/></span>
                            <span>{props.addTitle}</span>
                        </button>
                    </div>
                </div>
            }
            {props.children}
        </div>
    )
}
