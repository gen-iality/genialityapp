import React, {Component} from 'react';
import configCrud from '../config'
import ListCrud from '../components/listCrud'

class ContainerCrud extends Component {
    constructor(props){
        super(props);
       
    this.state = {
        pageOfItems: []
    }
}
componentDidMount() {
    const pageOfItems= [
        {
            correo: 'jose@jose.com',
            name : 'jose',
            rol: 'administrador'
        },
        {
            correo: 'jose@jose.com',
            name : 'jose',
            rol: 'administrador'
        },
        {
            correo: 'jose@jose.com',
            name : 'jose',
            rol: 'administrador'
        },
        {
            correo: 'jose@jose.com',
            name : 'jose',
            rol: 'administrador'
        }
        ]
    this.setState({
        pageOfItems: pageOfItems
    });
   
}

    render() {
        
        return(
            <React.Fragment>
          
              <ListCrud  data={this.state.pageOfItems} config={configCrud} />
            </React.Fragment>
        )
    }
}

export default ContainerCrud;