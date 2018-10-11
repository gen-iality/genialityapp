import React, {Component} from 'react';
import { withRouter, Link } from 'react-router-dom';

class HomeProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount(){
        const search = this.props.location.search;
        const params = new URLSearchParams(search);
        const type = params.get('type');
        console.log(type);
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

export default withRouter(HomeProfile);