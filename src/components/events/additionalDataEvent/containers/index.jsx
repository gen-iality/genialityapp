import React,{Component} from 'react';
import Slider from "react-slick";
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
        console.log(this.props)
        return (


            <React.Fragment>
               
                 
            </React.Fragment>
        );
    }
}

export default AdditonalDataEvent;