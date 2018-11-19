/*global google*/
import React, {Component} from 'react';
import { withRouter, Link } from "react-router-dom";
import {Actions, CategoriesApi, EventsApi, UsersApi} from "../../helpers/request";
import Geosuggest from 'react-geosuggest'
import Loading from "../loaders/loading";
import EventCard from "../shared/eventCard";
import LogOut from "../shared/logOut";
import ImageInput from "../shared/imageInput";
import {TiArrowLoopOutline} from "react-icons/ti";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dialog from "../modal/twoAction";
import {firebase} from "../../helpers/firebase";
import {DateTimePicker} from "react-widgets";
import {networks} from "../../helpers/constants";
import FormNetwork from "../shared/networkForm";

class UserEditProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOption: [],
            events: [],
            user: {},
            network: {},
            loading: true,
            message:{
                class:'',
                content:''
            }
        };
        this.saveForm = this.saveForm.bind(this);
    }

    async componentDidMount() {
        let userId = this.props.match.params.id;
        try {
            const categories = await CategoriesApi.getAll();
            const resp = await EventsApi.mine();
            const user = await UsersApi.getProfile(userId,true);
            const tickets = await UsersApi.mineTickets();
            console.log(tickets);
            user.name = (user.name) ? user.name: user.displayName? user.displayName: user.email;
            user.picture = (user.picture) ? user.picture : user.photoUrl ? user.photoUrl : 'https://bulma.io/images/placeholders/128x128.png';
            user.location = user.location ? user.location : {};
            user.network = user.network ? user.network : {facebook:'',twitter:'',instagram:'',linkedIn:''};
            this.setState({loading:false,user,events:resp.data,categories},this.scrollEvent);
        }catch (e) {
            console.log(e.response);
            this.setState({timeout:true,loading:false});
        }
    }

    scrollEvent = () => {
        const hash = this.props.location.hash;
        if (hash) {
            const element = document.querySelector(hash);
            if (element) {
                let topOfElement = element.offsetTop + 60;
                window.scrollTo({ top: topOfElement, behavior: "smooth" })
            }
        }
    };

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

    changeDate = (value,name)=>{
        this.setState({user:{...this.state.user,[name]:value}})
    };

    onSuggestSelect = (suggest) => {
        if(suggest){
            const place = suggest.gmaps;
            const location = place.geometry && place.geometry.location ? {
                Latitude: place.geometry.location.lat(),
                Longitude: place.geometry.location.lng()
            } : {};
            const componentForm = {
                street_number: 'short_name',
                route: 'long_name',
                locality: 'long_name',
                administrative_area_level_1: 'short_name'
            };
            const mapping = {
                street_number: 'number',
                route: 'street',
                locality: 'city',
                administrative_area_level_1: 'state'
            };
            for (let i = 0; i < place.address_components.length; i++) {
                const addressType = place.address_components[i].types[0];
                if (componentForm[addressType]) {
                    const val = place.address_components[i][componentForm[addressType]];
                    location[mapping[addressType]] = val;
                }
            }
            location.FormattedAddress = place.formatted_address;
            location.PlaceId = place.place_id;
            this.setState({user:{...this.state.user,location}})
        }
    };

    async saveForm() {
        const { user } = this.state;
        console.log(user);
        try {
            const resp = await UsersApi.editProfile(user,user._id);
            console.log(resp);
            toast.success('All changes saved successfully');
        }catch (e) {
            console.log(e.response);
            toast.error('Something wrong. Try again later');
            this.setState({timeout:true,loader:false});
        }
    };

    closeModal = () => {
        this.setState({modal:false})
    };

    resetPassword = () => {
        const { user } = this.state;
        firebase.auth()
            .sendPasswordResetEmail(user.email)
            .then(()=>{
                this.setState({modal:true});
                console.log('reset email password sent');
            })
            .catch((e)=>{
                console.log(e);
            })
    };

    showNetwork = (network) => {
        this.setState({network})
    };

    changeNetwork = (e) => {
        const {name,value} = e.target;
        const {network} = this.state.user;
        network[name] = value;
        this.setState({user:{...this.state.user,network:network}});
    }

    render() {
        const { loading, timeout, events, user, network } = this.state;
        return (
            <section className="section profile">
                {
                    loading ? <Loading/> :
                        <div className="container org-profile">
                            <div className="profile-info columns">
                                <div className="column is-4 user-info">
                                    <ImageInput picture={user.picture} imageFile={this.state.imageFile}
                                                divClass={'circle-img'}
                                                content={<div style={{backgroundImage: `url(${user.picture})`}} className="avatar-img"/>}
                                                classDrop={'change-img is-size-2'}
                                                contentDrop={<TiArrowLoopOutline className="has-text-white"/>}
                                                contentZone={<figure className="image is-128x128">
                                                    <img className="is-rounded" src="https://bulma.io/images/placeholders/128x128.png" alt={'profileimage'}/>
                                                </figure>} style={{}}
                                                changeImg={this.changeImg}/>
                                    <div className="field">
                                        <label className="label required is-size-7 has-text-grey-light">Nombre</label>
                                        <div className="control">
                                            <input className="input" name={"name"} type="text" placeholder="Nombre" value={user.name} onChange={this.handleChange} />
                                        </div>
                                    </div>
                                    <div className="field">
                                        <label className="label required is-size-7 has-text-grey-light">Correo</label>
                                        <div className="control">
                                            <input className="input" name={"email"} type="email" placeholder="Email" value={user.email} onChange={this.handleChange} />
                                        </div>
                                    </div>
                                    <div className="field change-password">
                                        <button className="button is-text is-size-7 has-text-grey-light" onClick={this.resetPassword}>Haz clic aquí para cambiar tu contraseña</button>
                                    </div>
                                </div>
                                <div className="column is-8 user-data userData">
                                    <h1 className="title has-text-primary">Datos</h1>
                                    <div className="columns is-9">
                                        <div className="field column">
                                            <label className="label is-size-7 has-text-grey-light">Cédula</label>
                                            <div className="control">
                                                <input className="input has-text-weight-bold" name={"dni_number"} value={user.dni_number} type="number" placeholder="1234567890" onChange={this.handleChange}/>
                                            </div>
                                        </div>
                                        <div className="field column">
                                            <label className="label is-size-7 has-text-grey-light">Dirección</label>
                                            <div className="control">
                                                <Geosuggest
                                                    placeholder={'Ingresa tu dirección'}
                                                    onSuggestSelect={this.onSuggestSelect}
                                                    initialValue={user.location.FormattedAddress}
                                                    location={new google.maps.LatLng(user.location.Latitude,user.location.Longitude)}
                                                    radius="20"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="columns is-9">
                                        <div className="field column">
                                            <label className="label required is-size-7 has-text-grey-light">Celular</label>
                                            <div className="control">
                                                <input className="input has-text-weight-bold" name={"phoneNumber"} value={user.phoneNumber} type="number" placeholder="+57 123 456 7890" onChange={this.handleChange}/>
                                            </div>
                                        </div>
                                        <div className="field column">
                                            <label className="label is-size-7 has-text-grey-light">Empresa</label>
                                            <div className="control">
                                                <input className="input has-text-weight-bold" name={"company"} value={user.company} type="text" placeholder="Ingresa el nombre de tu empresa" onChange={this.handleChange}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="columns is-9">
                                        <div className="field column">
                                            <label className="label is-size-7 has-text-grey-light">Fecha de nacimiento</label>
                                            <div className="control">
                                                <DateTimePicker
                                                    value={user.birth_date}
                                                    format={'L'}
                                                    max={new Date()}
                                                    time={false}
                                                    onChange={value => this.changeDate(value,"birth_date")}/>
                                            </div>
                                        </div>
                                        <div className="field column">
                                            <label className="label is-size-7 has-text-grey-light">Intereses</label>
                                            <div className="control">
                                                <input className="input has-text-weight-bold" name={"intereses"} type="text" placeholder="Proximamente" disabled/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="columns is-9">
                                        <div className="column">
                                            <div className="redes level columns is-multiline">
                                                <div className="column is-10">
                                                    <FormNetwork changeNetwork={this.changeNetwork} object={user.network}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="column profile-buttons">
                                            <button className="button is-primary" onClick={this.saveForm}>Guardar</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="profile-data columns" id={'events'}>
                                <div className="column is-8">
                                    <h2 className="data-title">
                                        <small className="is-italic has-text-grey-light has-text-weight-300">Tus</small><br/>
                                        <span className="has-text-grey-dark is-size-3">Eventos</span>
                                    </h2>
                                    <div className="columns home is-multiline is-mobile">
                                        {
                                            events.map((event,key)=>{
                                                return <EventCard event={event} key={event._id} action={''} size={'column is-half'} right={
                                                    <div className="edit">
                                                        <Link className="button-edit has-text-grey-light" to={`/event/${event._id}`}>
                                                                <span className="icon is-medium">
                                                                    <i className="fas fa-lg fa-pencil-alt"/>
                                                                </span>
                                                            <span className="is-size-7 is-italic">Editar</span>
                                                        </Link>
                                                    </div>
                                                }
                                                />
                                            })
                                        }
                                    </div>
                                </div>
                                <div className="column is-4">
                                    <h2 className="data-title">
                                        <small className="is-italic has-text-grey-light has-text-weight-300">Tus</small><br/>
                                        <span className="has-text-grey-dark is-size-3">Tickets</span>
                                    </h2>
                                    <div className="tickets soon"></div>
                                </div>
                            </div>
                        </div>
                }
                {
                    timeout&&(<LogOut/>)
                }
                <Dialog modal={this.state.modal} title={'Reestablecer Contraseña'}
                        content={<p>Se ha enviado un correo a <i>{user.email}</i> con instrucciones para cambiar la contraseña</p>}
                        first={{title:'Ok',class:'is-info is-outlined has-text-danger',action:this.closeModal}}/>
            </section>
        );
    }
}

export default withRouter(UserEditProfile);