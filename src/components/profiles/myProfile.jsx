import React, {Component} from 'react';
import { withRouter } from "react-router-dom";
import OrgEditProfile from "./orgEdit";
import UserEditProfile from "./userEdit";

class MyProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type:''
        }
    }

    async componentDidMount(){
        const search = this.props.location.search;
        const params = new URLSearchParams(search);
        const type = params.get('type');
        this.setState({type});
    }

    async componentWillReceiveProps(nextProps){
        const search = nextProps.location.search;
        const params = new URLSearchParams(search);
        const type = params.get('type');
        this.setState({type});
    }

    render() {
        const layout = {
            organization: <OrgEditProfile/>,
            user: <UserEditProfile/>
        }
        return (
            <React.Fragment>
                {layout[this.state.type]}
            </React.Fragment>
        );
    }
}

export default withRouter(MyProfile);