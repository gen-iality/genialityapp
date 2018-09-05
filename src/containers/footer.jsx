import React, {Component} from 'react';

class Footer extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <footer className="footer">
                <div className="content has-text-centered">
                    <p>
                        Evius Co Footer
                    </p>
                </div>
            </footer>
        );
    }
}

export default Footer;