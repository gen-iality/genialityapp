import React, {Component} from 'react';
import '../../styles.css';
class TableProgramme extends Component{

    constructor(props){
        super(props)   
    }


    render() {  
        return (
            <React.Fragment>
               
                <table className="table"> 
                    <tbody> 
                       
                        {
                            this.props.filteredSessions.map((item,key)=>{
                            return   <tr key={key}><td>{item.time}</td>    <td>{item.name}</td>  </tr> 
                        
                                }
                                )                                                                                                                                                           
                        }                   
                    </tbody> 
                 </table>
            </React.Fragment>
        )
    }
}


export default TableProgramme;
