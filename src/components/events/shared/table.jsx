import React from "react"
import "react-tabs/style/react-tabs.css"

export default function EvenTable ( { ...props } ) {
    return (
        //<Table columns={columns} dataSource={data} size="middle" />
        <table>
            {props.head &&
                <thead>
                    <tr>
                        { props.head.map( ( name, idx ) => <th key={ idx } style={ props.headStyle && props.headStyle[ idx ] }>{ name }</th> ) }
                    </tr>
                </thead>
            }
            <tbody>
                { props.children }
            </tbody>
        </table>
    )
}
