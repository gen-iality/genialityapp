import React, {Component} from 'react';

class Landing extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <section className="section hero landing">
                <div className="hero-head">
                    <div className="columns is-gapless">
                        <div className="column is-4 info">
                            <div className="item">
                                Fecha
                            </div>
                            <div className="columns item">
                                <div className="columns">
                                    <div className="column is-one-fifth">
                                       <span className="icon is-large has-text-grey">
                                           <i className="fas fa-map-marker-alt fa-2x"/>
                                       </span>
                                    </div>
                                    <div className="column">
                                        <p className="subtitle is-pulled-left">
                                            <p className="has-text-grey-darker has-text-weight-bold">Venue</p>
                                            Location
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="item">
                                <p className="title has-text-grey-darker has-text-weight-bold">Nombre evento</p>
                                Por: ...
                            </div>
                            <div className="item is-italic">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean efficitur sit amet massa fringilla egestas. Nullam condimentum luctus turpis...
                            </div>
                            <div className="item">
                                <p className="subtitle has-text-grey-darker has-text-weight-bold">150/400</p>
                                Aforo
                            </div>
                            {
                                !this.state.showFull && (
                                    <div className="item">
                                        <div className="columns is-mobile">
                                            <div className="column is-4 is-offset-8">
                                                <div className="fab-button has-text-weight-bold"
                                                    onClick={(e)=>{this.setState({showFull:true})}}>
                                                    <span className="is-size-3">+</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                        <div className="column">
                            <figure className="image is-3by2">
                                <img src="https://bulma.io/images/placeholders/1280x960.png" alt="Evius.co"/>
                            </figure>
                        </div>
                    </div>
                    {
                        this.state.showFull && (
                            <div className="info show-full is-hidden-mobile">
                                <div className="item is-italic">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent rhoncus efficitur rhoncus. Praesent congue felis sit amet facilisis vestibulum. Proin rutrum molestie est. Etiam tristique urna vel porta commodo. Cras egestas purus risus, at vestibulum neque molestie vitae. Nulla venenatis feugiat blandit. Aliquam mi nulla, fringilla nec semper id, bibendum ut ipsum. Quisque a diam ex. Mauris sit amet nibh varius, cursus lorem a, tristique ligula. Vestibulum porttitor malesuada urna, vel efficitur dui pellentesque in. Fusce maximus molestie pharetra. Donec pretium tellus justo, et malesuada ante accumsan venenatis. Etiam vehicula eros eget justo consectetur, id lacinia eros sagittis. Sed nisl tellus, viverra ac mi ac, laoreet mattis lacus.
                                </div>
                                <div className="item">
                                    <div className="columns is-mobile">
                                        <div className="column is-4 is-offset-8">
                                            <div className="fab-button has-text-weight-bold"
                                                 onClick={(e)=>{this.setState({showFull:false})}}>
                                                <span className="is-size-3">-</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
                <div className="hero-body">
                    <div className="container has-text-centered">
                        <div className="columns">
                            <div className="column is-7">
                                <div className="has-shadow">
                                    <p>Acciones</p>
                                    <div className="field is-grouped">
                                        <div className="control">
                                            <button className="button is-primary is-small">
                                                <span className="icon">
                                                    <i className="fas fa-share"/>
                                                </span>
                                                <span>Compartir</span>
                                            </button>
                                        </div>
                                        <div className="control">
                                            <button className="button is-text is-small">
                                                <span className="icon">
                                                    <i className="fas fa-check"/>
                                                </span>
                                                <span>Asistiré</span>
                                            </button>
                                        </div>
                                        <div className="control">
                                            <button className="button is-text is-small">
                                                <span className="icon">
                                                    <i className="fas fa-hearth"/>
                                                </span>
                                                <span>Me gusta</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="column">
                                Mapa
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default Landing;