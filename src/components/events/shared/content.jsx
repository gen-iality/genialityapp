import React from "react";

export default function EventContent({...props}) {
    return (
        <div className="event-datos">
            <h2 className="title-section">{props.title}</h2>
            {props.description&&<p>{props.description}</p>}
            {
                props.addAction &&
                <button className="button add is-pulled-right" onClick={props.addAction}>
                    <span className="icon"><i className="fas fa-plus-circle"/></span>
                    <span>{props.addTitle}</span>
                </button>
            }
            {props.children}
        </div>
    )
}
