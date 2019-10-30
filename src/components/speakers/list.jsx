import React, {Component} from "react";
import {Link, Redirect} from "react-router-dom";
import {SpeakersApi} from "../../helpers/request";
import EventContent from "../events/shared/content";
import Loading from "../loaders/loading";

class SpeakersList extends Component{
    constructor(props){
        super(props);
        this.state = {
            loading:true,
            list:[],
            redirect:false
        }
    }

    async componentDidMount() {
        const data = await SpeakersApi.byEvent(this.props.eventID);
        console.log(data);
        this.setState({list:data,loading:false})
    }

    redirect = () => this.setState({redirect:true});


    render() {
        if(this.state.redirect) return <Redirect to={{pathname:`${this.props.matchUrl}/speaker`,state:{new:true}}}/>;
        const {list,loading} = this.state;
        if(loading) return <Loading/>;
        return (
            <EventContent title={"Conferencistas"} addAction={this.redirect} addTitle={"Nuevo conferencista"}>
                {
                    list.map(i=><div key={i._id}>
                        <p>{i.name}</p>
                        <Link to={{pathname:`${this.props.matchUrl}/speaker`,state:{edit:i._id}}}>Editar</Link>
                    </div>)
                }
            </EventContent>
        )
    }
}

export default SpeakersList
