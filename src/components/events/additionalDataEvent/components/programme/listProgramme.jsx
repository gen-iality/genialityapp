import React, {Component} from 'react';
import TableProgramme from './tableProgramme'
import '../../styles.css'
class ListProgramme extends Component{

    constructor(props){
        super(props) 
    }
    
    filterByDays(array,key){
        this.props.filterByDays(array,key)
    }
    render() {
        return (
            <React.Fragment>
                <br/> <br/>
                <div className="botonera">
                    <p className="button botones is-rounded">agenda</p>
                    <p className="button botones is-rounded">agenda</p>
                    <p className="button botones is-rounded">agenda</p>
                    <p className="button botones is-rounded">agenda</p>
                    <p className="button botones is-rounded">agenda</p>
                </div>
                <div className="tabs">
                            <ul>
                                    {
                                this.props.headersTable.map((item,key)=>{
                                return  <li key= {key} ><a onClick={()=> this.filterByDays(this.props.sessions,item.date)}>{item.label}</a></li>                      
                                    })                                                                                                                                                    
                            }
                            </ul>
                </div>
                <TableProgramme eventId={this.props.eventId} filteredSessions= {this.props.filteredSessions} />
            </React.Fragment>
        );
    }
}

export default ListProgramme;
