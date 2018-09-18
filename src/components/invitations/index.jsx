import React, {Component} from 'react';
import {Actions} from "../../helpers/request";
import Moment from "moment"
import momentLocalizer from 'react-widgets-moment';
import Pagination from "../shared/pagination";
import MessageUser from "./messageUser";
import EmailPrev from "./emailPreview";
Moment.locale('es');
momentLocalizer();

class Invitations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            invitations:[],
            pageOfItems:[],
            step:       0,
            item:       { message_users: [] },
            modal:      false,
        }
    }

    async componentDidMount() {
        const invitations = await Actions.getOne('/api/event/'+this.props.event._id+'/','rsvp');
        invitations.reverse();
        this.setState({invitations});
    }

    showModal = (item) => {
        this.setState({modal:true,item})
    };

    closeModal = () => {
        const item = { message_users:[] };
        this.setState({modal:false,item,step:0})
    };

    onChangePage = (pageOfItems) => {
        this.setState({ pageOfItems: pageOfItems });
    };

    render() {
        const layout = [
            <EmailPrev event={this.props.event} item={this.state.item}/>,
            <MessageUser users={this.state.item.message_users}/>
        ];
        return (
            <div className={"invitations"}>
                <table className="table is-fullwidth is-hoverable">
                    <thead>
                        <tr>
                            <th>Subject</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.pageOfItems.map((item,key)=>{
                                return <tr key={key} className="tr-item" onClick={(e)=>{this.showModal(item)}}>
                                    <td>{item.subject}</td>
                                    <td>{Moment(item.created_at).format('ll')}</td>
                                </tr>
                            })
                        }
                    </tbody>
                </table>
                <Pagination
                    items={this.state.invitations}
                    onChangePage={this.onChangePage}
                />
                <div className={`modal ${this.state.modal ? "is-active" : ""}`}>
                    <div className="modal-background"/>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title">Detalles</p>
                            <button className="delete" aria-label="close" onClick={(e)=>{this.closeModal()}}/>
                        </header>
                        <section className="modal-card-body">
                            <div className="content has-text-centered">
                                {
                                    this.state.item.message_users.length>0&&
                                        <div className="tabs is-fullwidth">
                                            <ul>
                                                <li className={`${this.state.step === 0 ? "is-active" : ""}`}
                                                    onClick={(e)=>{this.setState({step:0})}}>
                                                    <a>Email</a>
                                                </li>
                                                <li className={`${this.state.step === 1 ? "is-active" : ""}`}
                                                    onClick={(e)=>{this.setState({step:1})}}>
                                                    <a>Users</a>
                                                </li>
                                            </ul>
                                        </div>
                                }
                                {
                                    layout[this.state.step]
                                }
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        );
    }
}

export default Invitations;