import React, {Component} from 'react';


class ContainerCrud extends Component {
    constructor(props){
        super(props);
    }

    render() {
        return(
            <div>
                {this.props.idModel}
            </div>
        )
    }
}

export default ContainerCrud;