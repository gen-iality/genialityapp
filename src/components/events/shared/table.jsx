import React from "react";

export default function EvenTable({...props}) {
    return (
        <table className="table">
            {props.head&&
                <thead>
                <tr>
                    {props.head.map((name,idx)=><th key={idx} style={props.headStyle&&props.headStyle[idx]}>{name}</th>)}
                </tr>
                </thead>
            }
            <tbody>
            {props.children}
            </tbody>
        </table>
    )
}
