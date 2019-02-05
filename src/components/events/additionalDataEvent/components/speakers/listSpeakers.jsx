import React, {Component} from 'react';
import ModalSpeaker from './modalSpeakers';
import '../../styles.css'
class ListSpeakers extends Component{

    constructor(props){
        super(props)
        this.state = {
            show: false,
            modal: false,
            speakerData: []
        }
        this.showModal = this.showModal.bind(this)
    }

    showModal(key) {
        this.setState(prevState => {
            return {modal: true, show: true, speakerData: this.props.speakers[key]}
        });
    };
    
    hideModal = () => {
        this.setState({ show: false });
    };

    render() {
        return (
            <React.Fragment>
                <br/>   <br/>
                {
                    (this.props.speakers.length > 0) ?
                    (<p className="has-text-grey-dark is-size-2 cabecera">SPEAKERS</p>) :
                    (null)
                }
                <div className="columns is-multiline">
                    {this.props.speakers.map((item,key)=>{
                        return (
                            <div className="column is-12-mobile is-6-tablet is-4-desktop is-3-widescreen" key={key} >
                                <div className="card">
                                    <div className="card-image">
                                        <figure className="image is-4by3">
                                            <img src={(item.picture) ? item.picture :'https://bulma.io/images/placeholders/1280x960.png'} alt="Placeholder image" />
                                        </figure>
                                    </div>
                                    <div className="card-content">
                                        <div className="media">                         
                                            <div className="media-content media-cont">
                                                <div className="columns info-card">
                                                    <div className="column is-9 texto-tarjetas">
                                                        <p className="has-text-grey-dark is-size-4  titulo">{item.name}</p>
                                                        <p className="sub-titulo">Temática</p>
                                                    </div>
                                                    <div className="column is-3" onClick={() => this.showModal(key)}>
                                                        <p className="verMasPlus">+</p>
                                                        <p className="verMas" >Más</p>
                                                    </div>
                                                </div>
                                                </div>
                                                </div>
                                            <div className="content">
                                                
                                            </div>
                                        </div>
                                    </div> 
                            </div>
                        )
                    })}  
                    </div>
                    {
                        this.state.show ?
                        (<ModalSpeaker hideModal={this.hideModal} modal={this.state.modal} infoSpeaker={this.state.speakerData}/>) 
                        : (null)
                    }
                    </React.Fragment>
        );
    }
}

export default ListSpeakers;


              