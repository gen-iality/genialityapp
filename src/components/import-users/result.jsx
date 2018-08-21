import React, {Component} from 'react';

class Result extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const { list } = this.props;
        return (
            <div>
                <div className="columns">
                    <div className="column">
                        <div className="tags has-addons">
                            <span className="tag is-white">Total</span>
                            <span className="tag">{list.length}</span>
                        </div>
                    </div>
                    <div className="column">
                        <div className="tags has-addons">
                            <span className="tag is-white">Importados</span>
                            <span className="tag is-primary">7</span>
                        </div>
                    </div>
                    <div className="column">
                        <div className="tags has-addons">
                            <span className="tag is-white">Fallidos</span>
                            <span className="tag is-danger">1</span>
                        </div>
                    </div>
                    <div className="column">
                        <div className="tags has-addons">
                            <span className="tag is-white">Actualizados</span>
                            <span className="tag is-warning">2</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Result;