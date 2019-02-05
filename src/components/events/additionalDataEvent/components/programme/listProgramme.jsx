import React, {Component} from 'react';
import TableProgramme from './tableProgramme'
import '../../styles.css'
class ListProgramme extends Component{

    constructor(props){
        super(props) 
        this.activo = 0;
    }
    
    filterByDays(array,key,num){
        this.props.filterByDays(array,key)
        this.activo = num
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
                            <ul >
                            {
                                this.props.headersTable.map((item,key)=>{
                                return  <li className="fecha" key= {key} ><a className={` ${this.activo == key ? "activo" : ""}`} onClick={()=> this.filterByDays(this.props.sessions,item.date,key)}>{item.label}</a></li>                      
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
