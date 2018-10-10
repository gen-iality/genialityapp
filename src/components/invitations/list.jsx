import React, {Component} from 'react';
import {FormattedDate, FormattedTime} from "react-intl";
import {Link,withRouter} from "react-router-dom";
import {FaEye} from "react-icons/fa";
import Pagination from "../shared/pagination";
import {Actions} from "../../helpers/request";

class InvitationsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            invitations:[],
            pageOfItems:[],
            item:       { message_users: [] }
        }
    }

    async componentDidMount() {
        try {
            const invitations = await Actions.getOne('/api/event/'+this.props.eventId+'/','rsvp');
            invitations.reverse();
            console.log(invitations);
            this.setState({invitations});
        }catch (e) {
            console.log(e);
            this.setState({timeout:true,loader:false});
        }
    }

    onChangePage = (pageOfItems) => {
        this.setState({ pageOfItems: pageOfItems });
    };

    render() {
        const { match } = this.props;
        return (
            <React.Fragment>
                <table className="table is-fullwidth">
                    <thead>
                    <tr>
                        <th>Subject</th>
                        <th>Fecha</th>
                        <th>Total</th>
                        <th>Detalle</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.pageOfItems.map((item,key)=>{
                            return <tr key={key} className="tr-item">
                                <td>{item.subject}</td>
                                <td><FormattedDate value={item.created_at}/> <FormattedTime value={item.created_at}/></td>
                                <td>{item.number_of_recipients}</td>
                                <td>
                                    <Link to={{
                                        pathname: `${match.url}/detail`,
                                        state: { item: item, users:item.message_users }
                                    }}><FaEye/></Link>
                                </td>
                            </tr>
                        })
                    }
                    </tbody>
                </table>
                <Pagination
                    items={this.state.invitations}
                    initialPage={this.state.initialPage}
                    onChangePage={this.onChangePage}
                />
            </React.Fragment>
        );
    }
}

export default withRouter(InvitationsList);