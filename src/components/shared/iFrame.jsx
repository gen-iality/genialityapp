import React, {Component} from 'react';

class IFrame extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
<<<<<<< HEAD
            <iframe title={'Tiquets'} src={this.props.iframeUrl} width={'100%'} style={{height:"70vh"}} height={'600px'}/>
=======
            <iframe title={'Tiquets'} src={this.props.iframeUrl} width={'100%'} style={{height:"70vh"}} height={'1000'}/>
>>>>>>> master
        );
    }
}

export default IFrame;