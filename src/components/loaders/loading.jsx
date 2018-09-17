import React, {Component} from 'react';

class Loading extends Component {

    render() {
        return (
            <div className="load-bar">
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
            </div>
        );
    }
}

export default Loading;