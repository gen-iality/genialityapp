import React, {Component} from "react";
import {Link, Redirect, withRouter} from "react-router-dom";
import {FaChevronLeft} from "react-icons/fa";
import {SpeakersApi} from "../../helpers/request";
import EventContent from "../events/shared/content";
import Loading from "../loaders/loading";
import EvenTable from "../events/shared/table";
import {handleRequestError, sweetAlert} from "../../helpers/utils";

class SpeakersList extends Component{
    constructor(props){
        super(props);
        this.state = {
            loading:true,
            list:[],
            redirect:false
        }
    }

    componentDidMount() {
        this.fetchSpeakers();
    }

    fetchSpeakers = async() => {
        const data = await SpeakersApi.byEvent(this.props.eventID);
        this.setState({list:data,loading:false})
    };

    redirect = () => this.setState({redirect:true});

    remove = (info) => {
        sweetAlert.twoButton(`Está seguro de borrar a ${info.name}`, "warning", true, "Borrar", async (result)=>{
            try{
                if(result.value){
                    sweetAlert.showLoading("Espera (:", "Borrando...");
                    await SpeakersApi.deleteOne(info._id, this.props.eventID);
                    this.fetchSpeakers();
                    sweetAlert.hideLoading();
                    sweetAlert.showSuccess("Conferencista borrado")
                }
            }catch (e) {
                sweetAlert.showError(handleRequestError(e))
            }
        })
    }

    goBack = () => this.props.history.goBack();

    render() {
        if(this.state.redirect) return <Redirect to={{pathname:`${this.props.matchUrl}/speaker`,state:{new:true}}}/>;
        const {list,loading} = this.state;
        if(loading) return <Loading/>;
        return (
            <EventContent title="Conferencistas" closeAction={this.goBack} description={"Agregue o edite las personas que son conferencistas"} addAction={this.redirect} addTitle={"Nuevo conferencista"}>
                <EvenTable>
                    {
                        list.map(speaker => <tr key={speaker._id}>
                                <td>
                                <div style={{display:"flex"}}>
                                    {speaker.image&&<img src={speaker.image} alt={`speaker_${speaker.name}`} className="author-image"/>}
                                    <p>{speaker.name}</p>
                                </div>
                                </td>
                                <td>
                                    <Link to={{pathname:`${this.props.matchUrl}/speaker`,state:{edit:speaker._id}}}>
                                        <button><span className="icon has-text-grey"><i className="fas fa-edit"/></span></button>
                                    </Link>
                                    <button>
                                        <span className="icon has-text-grey"
                                              onClick={(e)=>{this.remove(speaker)}}><i className="far fa-trash-alt"/></span>
                                    </button>
                                </td>
                            </tr>)
                    }
                </EvenTable>
            </EventContent>
        )
    }
}

export default withRouter(SpeakersList)
