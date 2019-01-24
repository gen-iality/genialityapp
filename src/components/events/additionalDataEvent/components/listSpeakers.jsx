import React, {Component} from 'react';
import ModalSpeaker from '../components/modalSpeakers';
import '../styles.css'
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
        // console.log("here speaker", this.props.speakers[key]);

        this.setState(prevState => {
            return {modal: true, show: true, speakerData: this.props.speakers[key]}
        });
    };
    
    hideModal = () => {
        this.setState({ show: false });
    };

    render() {

    
        console.log('====|=|======>>>>> ',this.props.speakers)
        return (


            <React.Fragment>
                <br/>   <br/>
                <p class="has-text-grey-dark is-size-2  titulo cabecera">SPEAKERS</p>
                <div className="columns is-multiline">
                    {/* <div className="column">
                        First column
                    </div> */}
                    {/* <div className="column">
                        Second column
                    </div> */}
                    {/* <div className="column">
                        Third column
                    </div> */}
                    {this.props.speakers.map((item,key)=>{
                        return (
                    
                    <div className="column is-one-quarter" key={key} >
                            <div className="card">
                                <div className="card-image">
                                    <figure className="image is-4by3">
                                    <img src={(item.picture) ? item.picture :'https://bulma.io/images/placeholders/1280x960.png'} alt="Placeholder image" />
                                    </figure>
                                </div>
                                <div className="card-content">
                                    <div className="media">                         
                                        <div className="media-content">
                                            {/* <p className="title is-4">{item.name}</p> */}
                                            <p class="has-text-grey-dark is-size-3  titulo">{item.name}</p>
                                            <a class="verMas" onclick={() => this.showModal(key)}><span>+ </span><br/> Ver Más</a>
                                            {/* <h2 className="data-title has-text-left">
                                                <small className="is-italic has-text-grey-light has-text-weight-300">Encuentra la</small><br/>
                                                <span className="has-text-grey-dark is-size-3">Ubicación</span>
                                            </h2> */}
                                            {/* <p className="subtitle is-6">@johnsmith</p> */}
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


              