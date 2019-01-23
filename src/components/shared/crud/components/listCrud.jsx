import React, {Component} from 'react';
import '../crud.css'
import Table from '../../table';

class ListCrud extends Component {
    constructor(props){
        super(props);
        console.log('props ===>> ')
       this.state = {
            modalFields: []
       }
     
    }
    componentWillReceiveProps(){ 
        this.pageOfItems = this.props.data;
        console.log('here.jkj. ===>> ',this.props)
    }

    componentDidMount() {

        const fields = this.props.config.fieldsModal;
        this.setState({modalFields: fields});
        let newInfo = {};
        /*
            * This is to create keys inside newInfo object and avoid uncontrolled input error
        */
        fields.map(info => (
            newInfo[info.name] = ''));
        this.setState({newInfo, edit:false});
    }

    render() {
     
      
        
        console.log('this.props.data: ', this.props.data);
        return(
            <React.Fragment>
                 
                <table className="table"> 
                                            <thead>
                                                <tr>                                                  
                                                {
                                                    this.props.config.ListCrud.headers.map((item,key)=>{
                                                        return <th>{item}</th>
                                                })
                                                }
                                                </tr>
                                            </thead>
                                            <tbody>
                                           {
                                                this.props.data.map((item,key)=>{
                                                    return <tr key={key}>
                                                   {Object.keys(item).map((keyField)=>{
                                                       return  <td>{item[keyField]}</td>
                                                    })}
                                                        {/* <td><img className="imageTable" src={(item.image)?item.image: ''} height="25" width= "25" alt=""/></td>
                                                        <td>{item.name}</td>
                                                        <td>{item.rol}</td> */}
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