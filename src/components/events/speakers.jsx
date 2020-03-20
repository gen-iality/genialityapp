import React, { Component, Fragment } from "react";
import { SpeakersApi } from "../../helpers/request";

class Speakers extends Component {

    constructor(props) {
        //Se realiza constructor para traer props desde landing.jsx
        super(props);
        this.state = {
            speakers: []
        }
    }

    async componentDidMount() {
        
        //Se hace la consulta a la api de speakers
        let speakers = await SpeakersApi.byEvent(this.props.eventId);

        //Se envia al estado para acceder desde ahí a los datos
        this.setState({
            speakers
        });

        //Se comprueban los datos desde el estado
        console.log(this.state.speakers)
    }

    render() {
        return (
            <div></div>
        )
    }
}

export default Speakers