import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import MessageUser from "./messageUser";
import EmailPrev from "./emailPreview";

class InvitationDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step:0
        }
    }

    close = () => {
        this.props.history.goBack()
    }

    render() {
        const {users,item} = this.props.location.state;
        const layout = [
            <MessageUser users={users}/>,
            <EmailPrev event={this.props.event} item={item}/>
        ];
        return (
            <section className="modal-card-body">
                <div className="content has-text-centered">
                    <nav className="breadcrumb" aria-label="breadcrumbs">
                        <ul>
                            <li onClick={this.close}>
                                <a>
                                    <span className="icon is-small">
                                        <i className="far fa-arrow-alt-circle-left"/>
                                    </span>
                                </a>
                            </li>
                            <li className={`${this.state.step === 0 ? "is-active" : ""}`}
                                onClick={(e)=>{this.setState({step:0})}}>
                                <a>Users</a>
                            </li>
                            <li className={`${this.state.step === 1 ? "is-active" : ""}`}
                                onClick={(e)=>{this.setState({step:1})}}>
                                <a>Email</a>
                            </li>
                        </ul>
                    </nav>
                    {
                        layout[this.state.step]
                    }
                </div>
            </section>
        );
    }
}

export default withRouter(InvitationDetail);