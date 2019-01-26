import React,{Component} from 'react';
import Slider from "react-slick";
import ListSpeakers from '../components/listSpeakers';
import ListProgramme  from '../components/listProgramme';
import {Actions} from "../../../../helpers/request";

// Muestra la información adicional de el evento como speakers, agenta, boleteria etc...
class AdditonalDataEvent extends Component{
    constructor(props){
        super(props)

        this.state = {
            sessions : []
        }
        console.log('popopo ',this.props.eventInfo)
        this.eventId =this.props.eventInfo._id;  
    }

    async componentDidMount(){
        console.log('url a enviar', `api/events/${this.eventId}/sessions`)
        let resp = await Actions.getAll('url a enviar', `api/events/${this.eventId}/sessions`);
        this.setState({
            sessions : resp.data
        })
        // console.log('respuesta ' ,resp)
    }
   
    render() {
        const settings = {
          dots: true,
          infinite: true,
          speed: 500,
          slidesToShow: 1,
          slidesToScroll: 1
        };
        return (
            <React.Fragment>
                <ListSpeakers speakers = {this.props.eventInfo.speaker} /> 
                <ListProgramme sessions = {this.state.sessions} /> 
             </React.Fragment>
        );
    }
}

export default AdditonalDataEvent;