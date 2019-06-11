import React, {Component} from "react";
import InfoGeneral from "./additionalDataEvent/InfoGeneral";

class NewEvent extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div>
                <InfoGeneral/>
                <div className="steps">
                    <div className="step-item is-completed">
                        <div className="step-marker">1</div>
                        <div className="step-details">
                            <p className="step-title">Información <br/> General</p>
                        </div>
                    </div>
                    <div className="step-item is-active">
                        <div className="step-marker">2</div>
                        <div className="step-details">
                            <p className="step-title">Información <br/> Asistentes</p>
                        </div>
                    </div>
                    <div className="step-item">
                        <div className="step-marker">3</div>
                        <div className="step-details">
                            <p className="step-title">Tiquetes</p>
                        </div>
                    </div>
                    <div className="step-item">
                        <div className="step-marker">4</div>
                        <div className="step-details">
                            <p className="step-title">Contenidos</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default NewEvent