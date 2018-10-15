import React, {Component} from 'react';
import { withRouter, Link } from "react-router-dom";
import {CategoriesApi, EventsApi} from "../../helpers/request";
import Loading from "../loaders/loading";
import EventCard from "../shared/eventCard";
import LogOut from "../shared/logOut";
import ImageInput from "../shared/imageInput";
import {TiArrowLoopOutline} from "react-icons/ti";

class UserEditProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOption: [],
            events: [],
            user: {},
            loading: true
        };
    }

    async componentDidMount() {
        let userId = this.props.match.params.id;
        try {
            const categories = await CategoriesApi.getAll();
            this.setState({});
            const resp = await EventsApi.mine();
            this.setState({loading:false,events:resp.data,categories});
        }catch (e) {
            console.log(e.response);
            this.setState({timeout:true,loading:false});
        }
    }

    async componentWillReceiveProps(nextProps) {
        let userId = nextProps.match.params.id;
        try {
            const categories = await CategoriesApi.getAll();
            this.setState({});
            const resp = await EventsApi.mine();
            this.setState({loading:false,events:resp.data,categories});
        }catch (e) {
            console.log(e.response);
            this.setState({timeout:true,loading:false});
        }
    }

    handleChange = (e) => {
        const {name, value} = e.target;
        this.setState({org:{...this.state.org,[name]:value}},this.valid)
    };

    render() {
        const { loading, timeout, events, user } = this.state;
        return (
            <section className="section">
                {
                    loading ? <Loading/> :
                        <div className="container org-profile">
                            <div className="columns">
                                <div className="column is-3">
                                    <ImageInput picture={user.picture} imageFile={this.state.imageFile}
                                                divClass={'circle-img'}
                                                content={<div style={{backgroundImage: `url(${user.picture})`}}
                                                              className="avatar-img"/>}
                                                classDrop={'change-img is-size-2'}
                                                contentDrop={<TiArrowLoopOutline className="has-text-white"/>}
                                                contentZone={<figure className="image is-128x128">
                                                    <img className="is-rounded"
                                                         src="https://bulma.io/images/placeholders/128x128.png"/>
                                                </figure>} style={{}}
                                                changeImg={this.changeImg}/>
                                    <div className="field">
                                        <label className="label">Nombre</label>
                                        <div className="control">
                                            <input className="input" name={"name"} type="text"
                                                   placeholder="Text input" value={user.name}
                                                   onChange={this.handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="field">
                                        <label className="label">Correo</label>
                                        <div className="control">
                                            <input className="input" name={"email"} type="email"
                                                   placeholder="Text input" value={user.email}
                                                   onChange={this.handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="column is-9 user-data">
                                    <h1 className="title has-text-primary">Datos</h1>
                                </div>
                            </div>
                            <div>
                                <h2>Eventos:</h2>
                                <div className="columns home is-multiline is-mobile">
                                    {
                                        events.map((event,key)=>{
                                            return <EventCard event={event} key={event._id}
                                                              action={''}
                                                              right={
                                                                  <Link className="button is-text is-inverted is-primary" to={`/event/${event._id}`}>
                                                                      <span>Editar</span>
                                                                  </Link>}
                                            />
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                }
                {
                    timeout&&(<LogOut/>)
                }
            </section>
        );
    }
}

export default withRouter(UserEditProfile);