import React,{Component} from 'react';
import Slider from "react-slick";
import ModalSpeaker from '../components/modalSpeakers';

// Muestra la información adicional de el evento como speakers, agenta, boleteria etc...
class AdditonalDataEvent extends Component{
    constructor(props){
        super(props)

        this.state = {
            show: false,
            modal: false
        }
    }

    showModal = () => {
        this.setState(prevState => {
            return {modal: true, show: true}
        });
    };

    hideModal = () => {
        this.setState({ show: false });
    };

    render() {
        const settings = {
          dots: true,
          infinite: true,
          speed: 500,
          slidesToShow: 1,
          slidesToScroll: 1
        };
        return (
            <div>
            {
                this.state.show ? (<ModalSpeaker hideModal={this.hideModal} modal={this.state.modal} infoSpeaker={this.props.eventInfo.speaker}/>) 
                : 
                (null)
            }
                <div className="column is-narrow has-text-centered">
                    <button className="button is-primary" onClick={this.showModal}>Show modal {this.props.buttonName} +</button>
                </div>
            </div>
            
        );
    }
}

export default AdditonalDataEvent;