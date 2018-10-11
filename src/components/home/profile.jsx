import React, {Component} from 'react';

class HomeProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <section className="section home">
                <aside className="is-narrow-mobile is-fullheight menu is-hidden-mobile aside">
                    <p className="menu-label">Menú</p>
                </aside>
                <div className="dynamic-content">
                    Perfil User/Org
                </div>
            </section>
        );
    }
}

export default HomeProfile;