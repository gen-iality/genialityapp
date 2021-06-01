import React, {Component} from 'react';
import {networks} from "../../helpers/constants";

class FormNetwork extends Component {
    constructor(props) {
        super(props);
        this.state = {
            network:{}
        }
    }

    showNetwork = (network) => {
        this.setState({network})
    };

    render() {
        const {network} = this.state;
        const {object} = this.props;
        return (
            <React.Fragment>
                <div className="field columns is-mobile">
                    {
                        networks.map((item,key)=>{
                            return <button className={`button column is-text`}
                                           key={key} onClick={() => {this.showNetwork(item)}}>
                                <span className={`icon is-small ${item.path===network.path?'has-text-primary':''}`}>{item.icon}</span>
                            </button>
                        })
                    }
                </div>
                {
                    network.path && (
                        <div className="column is-10">
                            <div className="field columns is-mobile">
                                <div className="control column is-12 input-redes">
                                    <input className="input is-small" name={network.path} type="url" onChange={this.props.changeNetwork}
                                           value={object[network.path]} placeholder={`URL de ${network.name}`}/>
                                </div>
                            </div>
                        </div>
                    )
                }
            </React.Fragment>
        );
    }
}

export default FormNetwork;