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
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean efficitur sit amet massa fringilla egestas. Nullam condimentum luctus turpis.
                            </div>
                            <div className="item">
                                <p className="subtitle has-text-grey-darker has-text-weight-bold">150/400</p>
                                Aforo
                            </div>
                            <div className="item">
                                <div className="columns is-mobile">
                                    <div className="column is-4 is-offset-8">
                                        <div className="fab-button has-text-weight-bold"><span className="is-size-3">+</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="column">
                            <figure className="image is-3by2">
                                <img src="https://bulma.io/images/placeholders/1280x960.png" alt="Evius.co"/>
                            </figure>
                        </div>
                    </div>
                </div>
                <div className="hero-body">
                    <div className="container has-text-centered">
                        <h1 className="title">
                            Title
                        </h1>
                        <h2 className="subtitle">
                            Subtitle
                        </h2>
                    </div>
                </div>
            </section>
        );
    }
}

export default Landing;