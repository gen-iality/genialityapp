import React, {Component} from 'react';
import { withRouter, Link } from "react-router-dom";
import {Actions, CategoriesApi, EventsApi, UsersApi} from "../../helpers/request";
import Loading from "../loaders/loading";
import EventCard from "../shared/eventCard";
import LogOut from "../shared/logOut";
import ImageInput from "../shared/imageInput";
import {TiArrowLoopOutline} from "react-icons/ti";
import {BaseUrl} from "../../helpers/constants";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class UserEditProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOption: [],
            events: [],
            user: {},
            loading: true
        };
        this.saveForm = this.saveForm.bind(this);
    }

    async componentDidMount() {
        let userId = this.props.match.params.id;
        try {
            const categories = await CategoriesApi.getAll();
            const resp = await EventsApi.mine();
            const user = await UsersApi.getProfile(userId,true);
            this.setState({loading:false,user,events:resp.data,categories});
        }catch (e) {
            console.log(e.response);
            this.setState({timeout:true,loading:false});
        }
    }

    changeImg = (files) => {
        const file = files[0];
        if(file){
            this.setState({imageFile: file,
                user:{...this.state.user, picture: null}});
            let data = new FormData();
            const url = '/api/files/upload',
                self = this;
            data.append('file',this.state.imageFile);
            Actions.post(url, data)
                .then((image) => {
                    self.setState({
                        user: {
                            ...self.state.user,
                            picture: image
                        },fileMsg:'Image uploaded successfully'
                    });
                    toast.success('Image uploaded successfully');
                })
                .catch (e=> {
                    console.log(e.response);
                    toast.error('Something wrong. Try again later');
                    this.setState({timeout:true,loader:false});
                });
        }
        else{
            this.setState({errImg:'Only images files allowed. Please try again (:'});
        }
    };

    handleChange = (e) => {
        const {name, value} = e.target;
        this.setState({user:{...this.state.user,[name]:value}},this.valid)
    };

    async saveForm() {
        const { user } = this.state;
        try {
            const resp = await UsersApi.editProfile(user,user._id);
            console.log(resp);
            toast.success('All changes saved successfully');
        }catch (e) {
            console.log(e.response);
            toast.error('Something wrong. Try again later');
            this.setState({timeout:true,loader:false});
        }
    }

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
                                    <div className="control field">
                                        <button className="button is-primary" onClick={this.saveForm}>Submit</button>
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