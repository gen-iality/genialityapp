import React, {Component} from 'react';
import * as Cookie from "js-cookie";
import {ApiUrl} from "../../helpers/constants";
import IFrame from "../shared/iFrame";

class OrdersEvent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:true,
            iframeUrl:''
        }
    }

    componentDidMount(){
        const evius_token = Cookie.get('evius_token');
        const {eventId} = this.props;
        if(evius_token){
            const iframeUrl = `${ApiUrl}/es/event/${eventId}/orders?evius_token=${evius_token}`;
            this.setState({iframeUrl,loading:false})
        }
    }

    render() {
        return (
            <div>
                {
                    this.state.loading ? <p>Loading...</p>:<IFrame iframeUrl={this.state.iframeUrl}/>
                }
            </div>
        );
    }
}

export default OrdersEvent;