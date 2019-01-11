import React, {Component} from 'react';

class IFrame extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <iframe title={'Tiquets'} src={this.props.iframeUrl} width={'100%'} height={'600px'}/>
        );
    }
}

export default IFrame;