import React,{Component} from 'react';
import Slider from "react-slick";
import ListSpeakers from '../components/listSpeakers'


// Muestra la información adicional de el evento como speakers, agenta, boleteria etc...
class AdditonalDataEvent extends Component{
    constructor(props){
        super(props)
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
             </React.Fragment>
        );
    }
}

export default AdditonalDataEvent;