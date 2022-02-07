import React from "react";

export default function EventContent({...props}) {
    const classes = props.classes?`event-datos ${props.classes}`:"event-datos";
    return (
        <div className={classes}>
            <div className="header">
                {props.closeAction && <button className="button is-text" onClick={props.closeAction}><span className="icon"><i className="fas fa-chevron-left"/></span></button>}
                <h2 className="title-section">{props.title}</h2>
            </div>
            {props.description&&<p>{props.description}</p>}
            {
                (props.actionLeft || props.addAction) &&
                <nav className="level">
                    <div className="level-left">
                        {props.actionLeft}
                    </div>
                    {
                        props.addAction &&
                        <div className="level-right">
                            <div className="level-item">
                                <button className="button add" onClick={props.addAction}>
                                    <span className="icon"><i className="fas fa-plus-circle"/></span>
                                    <span>{props.addTitle}</span>
                                </button>
                            </div>
                        </div>
                    }
                </nav>
            }
            {props.children}
        </div>
    )
}
