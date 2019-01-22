import React, {Component} from 'react';
import Table from '../../table';

class ListCrud extends Component {
    constructor(props){
        super(props);
        console.log('props ===>> ')
       
     
    }
    componentWillReceiveProps(){ 
        this.pageOfItems = this.props.data;
        console.log('here.jkj. ===>> ',this.props )
    }

    render() {
     
      
        
        return(
            <React.Fragment>
                <table className="table">
                                            <thead>
                                                <tr>
                                                    
                                                    <th className="is-capitalized">Correo</th>
                                                    <th className="is-capitalized">Nombre</th>
                                                    <th className="is-capitalized">Rol</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                           {
                                                this.props.data.map((item,key)=>{
                                                    return <tr key={key}>
                                                        <td>{item.correo}</td>
                                                        <td>{item.name}</td>
                                                        <td>{item.rol}</td>
                                                    </tr>
                                                })
                                                }
                                           
                                            </tbody>
                </table>


            </React.Fragment>
        )
    }

}

export default ListCrud;