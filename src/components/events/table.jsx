import React from "react";

export default function EvenTable({...props}) {
    return (
        <table className="table">
            <thead>
            <tr>
                {props.head.map((name,idx)=><th key={idx}>{name}</th>)}
            </tr>
            </thead>
            <tbody>
            {props.children}
            </tbody>
        </table>
    )
}
