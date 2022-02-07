import React, {Component} from "react";

class InfoTiquetes extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    submit = (flag) => {
        flag? this.props.nextStep('tickets',[], 'pages') : this.props.prevStep('tickets',[], 'attendees')
    };

    render() {
        return (
            <div>
                <h1>Soy Tiquetes</h1>
                <div className="buttons is-right">
                    <button onClick={e=>{this.submit(true)}} className={`button is-primary`}>Siguiente</button>
                    <button onClick={e=>{this.submit(false)}} className={`button is-text`}>Anterior</button>
                </div>
            </div>
        )
    }
}

export default InfoTiquetes