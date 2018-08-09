import React, {Component} from 'react';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    show = () => {
        let items = [];
        for (let i = 0; i < 3; ++i) {
            items.push(<div className="card">
                <div className="card-image">
                    <figure className="image is-4by3">
                        <img src="https://bulma.io/images/placeholders/1280x960.png" alt="Evius.co"/>
                    </figure>
                </div>
                <div className="card-content">
                    <div className="media">
                        <div className="media-content">
                            <p className="title is-4">Evento</p>
                            <p className="subtitle is-6">@evius</p>
                        </div>
                    </div>

                    <div className="content">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Phasellus nec iaculis mauris.
                        <br/>
                        <time dateTime="2016-1-1">11:09 PM - 1 Jan 2016</time>
                    </div>
                </div>
            </div>)
        }
        return items
    }

    render() {
        return (
            <section className="section">
                <div className="row columns">
                    {
                        this.show().map((item,key)=>{
                            return <div className="column is-one-third" key={key}>
                                {item}
                            </div>
                        })
                    }
                </div>
            </section>
        );
    }
}

export default Home;