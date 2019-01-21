import React, {Component} from 'react';
import configCrud from '../../../../configComponents/config-crud'


class ContainerCrud extends Component {
 
    constructor(props){
        super(props)
        console.log('holajlkdsjfk', configCrud.speakers.name)
    }
    render() {
        return(
            <React.Fragment>
                <div>
                    hola insecto
               
                </div>
               </React.Fragment>
        )
    }
}

export default ContainerCrud;