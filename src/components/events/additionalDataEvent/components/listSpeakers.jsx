import React, {Component} from 'react';
import ModalSpeaker from '../components/modalSpeakers';

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
                            <div className="column is-one-quarter" key={key}>
                                <div className="card">
                                    <div className="card-image">
                                        <figure className="image is-4by3">
                                            <img src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder image" />
                                        </figure>
                                    </div>
                                    <div className="card-content">
                                        <div className="media">
                                            <div className="media-left">
                                                <figure className="image is-48x48">
                                                    <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image" />
                                                </figure>
                                            </div>
                                            <div className="media-content">
                                                <p className="title is-4">John Smith</p>
                                                <p className="subtitle is-6">@johnsmith</p>
                                            </div>
                                        </div>

                                        <div className="content">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                            Phasellus nec iaculis mauris. <a>@bulmaio</a>.
                                            <a href="#">#css</a> <a href="#">#responsive</a>
                                            <br/>
                                            <time dateTime="2016-1-1">11:09 PM - 1 Jan 2016</time>
                                        </div>
                                    </div>
                                </div> 
                            <div>
                            <div className="column is-narrow has-text-centered">
                                <button className="button is-primary" onClick={() => this.showModal(key)}>Show modal</button>
                            </div>
                        </div>
                    </div>
                        )
                    })}
                    {
                        this.state.show ?
                        (<ModalSpeaker hideModal={this.hideModal} modal={this.state.modal} infoSpeaker={this.state.speakerData}/>) 
                        : (null)
                    }
                </div>
                
          
            </React.Fragment>
        );
    }
}

export default ListSpeakers;


                {/* 
                <div className="card">
                <div className="card-image">
                    <figure className="image is-4by3">
                    <img src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder image" />
                    </figure>
                </div>
                <div className="card-content">
                    <div className="media">
                    <div className="media-left">
                        <figure className="image is-48x48">
                        <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image" />
                        </figure>
                    </div>
                    <div className="media-content">
                        <p className="title is-4">John Smith</p>
                        <p className="subtitle is-6">@johnsmith</p>
                    </div>
                    </div>

                    <div className="content">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Phasellus nec iaculis mauris. <a>@bulmaio</a>.
                    <a href="#">#css</a> <a href="#">#responsive</a>
                    <br/>
                    <time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
                    </div>
                </div>
                </div> */}