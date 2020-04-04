import React, {Fragment, useState, useEffect} from 'react';
import {Route, Switch, withRouter} from "react-router-dom";
import UsersRsvp from "./users";
import { EventsApi, UsersApi } from "../../helpers/request";
import ImportUsers from "../import-users/importUser";
import {
    useTable,
    useGroupBy,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination
  } from 'react-table'


  function Tabla(props){
    let data = [
        {
          col1: 'Hello',
          col2: 'World',
        },
        {
          col1: 'react-table',
          col2: 'rocks',
        },
        {
          col1: 'whatever',
          col2: 'you want',
        },
      ]      
    const [guests, setGuests] = useState(data); 


    
      const columns = [
          {
            Header: 'Column 1',
            accessor: 'col1', // accessor is the "key" in the data
          },
          {
            Header: 'Column 2',
            accessor: 'col2',
          },
        ]
    
    useEffect(() => {
        console.log('mounted',props)
        
        async function fetchData(props){
            const guestsResult = await UsersApi.getAll(props.event._id, "?pageSize=10");
            //setGuests(guestsResult.data);
            console.log("resultado",props, guestsResult);
        }
        fetchData(props);
    }, []);

let {getTableProps,getTableBodyProps,headerGroups,rows,prepareRow} = useTable({ columns, data });


return (



    <table {...getTableProps()}>
       <thead>
         {headerGroups.map(headerGroup => (
           <tr {...headerGroup.getHeaderGroupProps()}>
             {headerGroup.headers.map(column => (
               <th {...column.getHeaderProps()}>{column.render('Header')}</th>
             ))}
           </tr>
         ))}
       </thead>
       <tbody {...getTableBodyProps()}>
         {rows.map(row => {
           prepareRow(row)
           return (
             <tr {...row.getRowProps()}>
               {row.cells.map(cell => {
                 return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
               })}
             </tr>
           )
         })}
       </tbody>
     </table>
   
 )

  
}


function ListaInvitados({...props}) {
    const {eventId, event, match} = props;
    return (
        <Fragment>
            <Tabla {...props}/>
            <Switch>
               {/* 
                <Route exact path={`${match.url}/`} render={()=><UsersRsvp event={event} eventID={eventId} matchUrl={match.url}/>}/>
                */}
                <Route exact path={`${match.url}/importar-excel`} render={()=><ImportUsers extraFields={event.user_properties} eventId={eventId} matchUrl={match.url}/>}/>
            </Switch>
        </Fragment>
    );
}

export default withRouter(ListaInvitados);
