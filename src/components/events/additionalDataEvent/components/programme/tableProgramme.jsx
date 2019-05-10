import React from 'react';
import {
    Accordion,
    AccordionItem,
    AccordionItemTitle,
    AccordionItemBody,
} from 'react-accessible-accordion';
import renderHTML from 'react-render-html';

// Demo styles, see 'Styles' section below for some notes on use.

import '../../styles.css';
function TableProgramme({...props}){
    return (
        <table className="table">
            <tbody>
            {
                props.filteredSessions.map((item,key)=>{
                        return  <tr key={key} >
                            <td>{item.timeStart}</td>
                            <td>
                                <Accordion>
                                    <AccordionItem>
                                        <AccordionItemTitle>
                                            {item.name}
                                        </AccordionItemTitle>
                                        <AccordionItemBody>
                                            {/* <p>{JSON.stringify(item)}</p> */}
                                            <p>{renderHTML(item.description.html)}</p>
                                            {/* <p>{item.description}</p> */}
                                            <p>{item.timeStart}</p>
                                            <p>{item.timeEnd}</p>
                                        </AccordionItemBody>
                                    </AccordionItem>
                                </Accordion>
                            </td>
                        </tr>
                    }
                )
            }
            </tbody>
        </table>
    )
}


export default TableProgramme;
