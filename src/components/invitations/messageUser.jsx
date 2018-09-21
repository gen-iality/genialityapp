import React, {Component} from 'react';

class MessageUser extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <React.Fragment>
                <table className="table is-fullwidth">
                    <thead>
                    <tr>
                        <th>Email</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.props.users.map((item,key)=>{
                            return <tr key={key}>
                                <td>{item.email}</td>
                                <td>{item.status}</td>
                            </tr>
                        })
                    }
                    </tbody>
                </table>
            </React.Fragment>
        );
    }
}

export default MessageUser;