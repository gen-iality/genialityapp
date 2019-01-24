import React,{Component} from 'react';
import Slider from "react-slick";
// Muestra la información adicional de el evento como speakers, agenta, boleteria etc...
class AdditonalDataEvent extends Component{
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
                 <a className="button is-primary  is-normal">Agenda</a>    
                 <a className="button is-primary  is-normal">Speakers</a>    
                 
            </React.Fragment>
        );
    }
}

export default AdditonalDataEvent;