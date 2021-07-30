import React from "react"
import "react-tabs/style/react-tabs.css"

export default function EvenTable ( { ...props } ) {
    return (
        //<Table columns={columns} dataSource={data} size="middle" />
        <div className='ant-table-content'>
        <table style={{tableLayout:'auto'}}>
            {props.head &&
                <thead className='ant-table-thead'>
                    <tr >
                        { props.head.map( ( name, idx ) => <th key={ idx } style={ props.headStyle && props.headStyle[ idx ] }>{ name }</th> ) }
                    </tr>
                </thead>
            }
            <tbody className='ant-table-tbody'>
                { props.children }
            </tbody>
        </table>
        </div>
    )
}
