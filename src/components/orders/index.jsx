import React, {Component} from 'react';
import * as Cookie from "js-cookie";
import {ApiUrl} from "../../helpers/constants";

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
                    this.state.loading ? <p>Loading...</p>:
                        <iframe title={'Tiquets'} src={this.state.iframeUrl} width={'600px'} height={'600px'}/>
                }
            </div>
        );
    }
}

export default OrdersEvent;