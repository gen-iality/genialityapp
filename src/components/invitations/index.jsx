import React, {Component} from 'react';
import {Actions} from "../../helpers/request";
import Pagination from "../shared/pagination";
import {FormattedDate, FormattedTime} from 'react-intl';
import InvitationDetail from "./invitationDetail";
import LogOut from "../shared/logOut";

class Invitations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            invitations:[],
            pageOfItems:[],
            item:       { message_users: [] },
            detail:     false,
        }
    }

    async componentDidMount() {
        try {
            const invitations = await Actions.getOne('/api/event/'+this.props.event._id+'/','rsvp');
            invitations.reverse();
            console.log(invitations);
            this.setState({invitations});
        }catch (e) {
            console.log(e.response);
            this.setState({timeout:true,loader:false});
        }
    }

    showDetail = (item) => {
        this.setState({detail:true,item})
    };

    closeDetail = () => {
        const item = { message_users:[] };
        this.setState({detail:false,item})
    };

    onChangePage = (pageOfItems) => {
        this.setState({ pageOfItems: pageOfItems });
    };

    componentWillUnmount() {
        this.setState({detail:false,item:{}})
    }

    render() {
        const { detail, timeout } = this.state;
        return (
            <div className={"invitations"}>
                {
                    this.state.detail?
                        <InvitationDetail event={this.props.event} close={this.closeDetail}
                                          item={this.state.item} users={this.state.item.message_users}/>:
                        <React.Fragment>
                            <table className="table is-fullwidth is-hoverable">
                                <thead>
                                <tr>
                                    <th>Subject</th>
                                    <th>Fecha</th>
                                    <th>Total</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    this.state.pageOfItems.map((item,key)=>{
                                        return <tr key={key} className="tr-item" onClick={(e)=>{this.showDetail(item)}}>
                                            <td>{item.subject}</td>
                                            <td><FormattedDate value={item.created_at}/> <FormattedTime value={item.created_at}/></td>
                                            <td>{item.number_of_recipients}</td>
                                        </tr>
                                    })
                                }
                                </tbody>
                            </table>
                            <Pagination
                                items={this.state.invitations}
                                onChangePage={this.onChangePage}
                            />
                        </React.Fragment>
                }
                {
                    timeout&&(<LogOut/>)
                }
            </div>
        );
    }
}

export default Invitations;