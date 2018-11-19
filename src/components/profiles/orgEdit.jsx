/*global google*/
import React, {Component} from 'react';
import { withRouter } from "react-router-dom";
import Geosuggest from 'react-geosuggest'
import Dropzone from 'react-dropzone'
import {MdAttachFile} from 'react-icons/md'
import {Actions, CategoriesApi, EventsApi, OrganizationApi} from "../../helpers/request";
import ImageInput from "../shared/imageInput";
import {TiArrowLoopOutline} from "react-icons/ti";
import {BaseUrl} from "../../helpers/constants";
import Loading from "../loaders/loading";
import LogOut from "../shared/logOut";
import EventCard from "../shared/eventCard";
import {Link} from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dialog from "../modal/twoAction";
import FormNetwork from "../shared/networkForm";

class OrgEditProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOption: [],
            org: {
                location:{},
                doc:{}
            },
            events: [],
            loading: true,
            wait: false,
            message:{
                class:'',
                content:''
            }
        };
        this.saveForm = this.saveForm.bind(this);
        this.deleteEvent = this.deleteEvent.bind(this);
    }

    async componentDidMount() {
        let orgId = this.props.match.params.id;
        try {
            const categories = await CategoriesApi.getAll();
            this.setState({categories});
            if(orgId === 'create'){
                const org= {location:{}, doc:{}, network:{facebook:'',twitter:'',instagram:'',linkedIn:''}};
                this.setState({create:true,loading:false,events:[],org})
            }else{
                const org = await OrganizationApi.getOne(orgId);
                const resp = await OrganizationApi.events(orgId);
                org.location = org.location? org.location: {};
                org.doc = org.doc? org.doc: {};
                org.network = org.network ? org.network : {facebook:'',twitter:'',instagram:'',linkedIn:''};
                this.setState({org,loading:false,events:resp.data});
            }
        }catch (e) {
            console.log(e.response);
            this.setState({timeout:true,loading:false});
        }
    }

    async componentWillReceiveProps(nextProps) {
        let orgId = nextProps.match.params.id;
        if(orgId === 'create'){
            this.setState({loading:true});
            setTimeout(()=>{
                const org= {location:{}, doc:{}, network:{facebook:'',twitter:'',instagram:'',linkedIn:''}};
                this.setState({create:true,loading:false,events:[],org})
            },1000)
        }else{
            this.setState({loading:true});
            const org = await OrganizationApi.getOne(orgId);
            const resp = await OrganizationApi.events(orgId);
            org.location = org.location? org.location: {};
            org.doc = org.doc? org.doc: {};
            org.network = org.network ? org.network : {facebook:'',twitter:'',instagram:'',linkedIn:''};
            this.setState({org,loading:false,events:resp.data});
        }
    }

    handleChange = (e) => {
        const {name, value} = e.target;
        this.setState({org:{...this.state.org,[name]:value}},this.valid)
    };

    //Doc
    docDrop=(files)=>{
        console.log('ARHIVO');
        const file = files[0];
        (!file)?
            this.setState({org:{...this.state.org,doc:{...this.state.org.doc,flag:false,file:'',msg:'sólo archivos pdf permitidos'}}}) :
            this.uploadFile(file);
    };
    uploadFile = (archivo) => {
        let data = new FormData();
        this.setState({org:{...this.state.org,doc:{...this.state.org.doc,loading:true}}});
        const url = '/api/files/upload',
            self = this;
        data.append('file',archivo);
        Actions.post(url, data)
            .then((file) => {
                self.setState({
                    org: {
                        ...self.state.org,
                        doc: {
                            ...this.state.org.doc,
                            flag:true,
                            name:archivo.name,
                            file,
                            msg:'Upload successfully',
                            loading:false
                        }
                    }
                });
                toast.success('File uploaded successfully');
            })
            .catch (e=> {
                console.log(e.response);
                toast.error('Something wrong. Try again later');
                this.setState({timeout:true,loader:false});
            });
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
            this.setState({org:{...this.state.org,location}},this.valid)
        }
    };

    changeImg = (files) => {
        const file = files[0];
        if(file){
            this.setState({imageFile: file,
                org:{...this.state.org, picture: null}});
            let data = new FormData();
            const url = '/api/files/upload',
                self = this;
            data.append('file',this.state.imageFile);
            Actions.post(url, data)
                .then((image) => {
                    self.setState({
                        org: {
                            ...self.state.org,
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

    async saveForm() {
        const { org, create } = this.state;
        this.setState({wait:true});
        org.doc = org.doc.file;
        try {
            const resp = create ? await Actions.create('/api/organizations',org) : await OrganizationApi.editOne(org,org._id);
            console.log(resp);
            if(resp._id){
                if(create) {
                    const html = document.querySelector("html");
                    html.classList.add('is-clipped');
                    this.setState({modalOrg:true, wait:false, org:{...this.state.org,_id:resp._id}});
                    toast.success('Organization created successfully');
                }
                else{
                    org.doc = !(org.doc) && {};
                    this.setState({msg:'Saved successfully',create:false, org, wait:false});
                    toast.success('All changes saved successfully');
                }
            }else{
                this.setState({msg:'Cant Create',create:false, wait:false});
                toast.error('Something wrong. Try again later');
            }
        }catch (e) {
            console.log(e.response);
            toast.error('Something wrong. Try again later');
            this.setState({timeout:true,loader:false,org, wait:false});
        }
    }

    async deleteEvent() {
        this.setState({isLoading:'Wait....'});
        const result = await EventsApi.deleteOne(this.state.eventId);
        console.log(result);
        if(result.data === "True"){
            this.setState({message:{...this.state.message,class:'msg_success',content:'Evento borrado'},isLoading:false});
            const events = await EventsApi.getAll();
            setTimeout(()=>{
                this.setState({modal:false,events});
            },500)
        }else{
            this.setState({message:{...this.state.message,class:'msg_error',content:'Evento no borrado'},isLoading:false})
        }
    }

    closeModal = () => {
        this.setState({modal:false})
    };

    closeOrg = () => {
        const { org } = this.state;
        const html = document.querySelector("html");
        html.classList.remove('is-clipped');
        window.location.replace(`${BaseUrl}/profile/${org._id}?type=organization`);
    };

    changeNetwork = (e) => {
        const {name,value} = e.target;
        const {network} = this.state.org;
        network[name] = value;
        this.setState({org:{...this.state.org,network:network}});
    };

    render() {
        const { org, loading, timeout, events, wait } = this.state;
        return (
            <section className="section profile">
                {
                    loading ? <Loading/> :
                        <div className="container org-profile">
                            <div className="profile-info columns">
                                <div className="column is-4 user-info">
                                    <ImageInput picture={org.picture} imageFile={this.state.imageFile}
                                                divClass={'circle-img'}
                                                content={<div style={{backgroundImage: `url(${org.picture})`}} className="avatar-img"/>}
                                                classDrop={'change-img is-size-2'}
                                                contentDrop={<TiArrowLoopOutline className="has-text-white"/>}
                                                contentZone={<figure className="image is-128x128">
                                                    <img className="is-rounded" src="https://bulma.io/images/placeholders/128x128.png" alt={'profileimage'}/>
                                                </figure>} style={{}}
                                                changeImg={this.changeImg}/>
                                    <div className="field">
                                        <label className="label required is-size-7 has-text-grey-light">Nombre Empresa</label>
                                        <div className="control">
                                            <input className="input" name={"name"} type="text"
                                                   placeholder="Nombre" value={org.name}
                                                   onChange={this.handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="field">
                                        <label className="label required is-size-7 has-text-grey-light">Correo Corporativo</label>
                                        <div className="control">
                                            <input className="input" name={"email"} type="email"
                                                   placeholder="Email" value={org.email}
                                                   onChange={this.handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="field">
                                        <label className="label is-size-7 has-text-grey-light">Estado de empresa</label>
                                        <div className="control">
                                            <input className="input" name={"estado"} type="text" placeholder="Estado" disabled={true} onChange={this.handleChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="column is-8 user-data userData">
                                    <h1 className="title has-text-primary">Datos</h1>
                                    <div className="columns is-9">
                                        <div className="field column">
                                            <label className="label is-size-7 has-text-grey-light">NIT</label>
                                            <div className="control">
                                                <input className="input has-text-weight-bold" name={"nit"} type="number" placeholder="123456789-0" value={org.nit} onChange={this.handleChange} />
                                            </div>
                                        </div>
                                        <div className="field column">
                                            <label className="label is-size-7 has-text-grey-light">Cámara de Comercio</label>
                                            {
                                                org.doc.loading ?
                                                    <p>Subiendo archivo</p> :
                                                    <React.Fragment>
                                                        {org.doc.name? <Dropzone accept="application/pdf" className="document-zone" style={{padding:0}} onDrop={this.docDrop}>
                                                                <div className="field has-addons">
                                                                    <div className="control is-expanded">
                                                                        <input className="input" type="text" disabled={true}
                                                                               value={org.doc.name}/>
                                                                    </div>
                                                                    <div className="control"><a className="button is-outlined is-info"><TiArrowLoopOutline/></a></div>
                                                                </div>
                                                            </Dropzone>
                                                            :<React.Fragment>
                                                                <Dropzone accept="application/pdf" className="document-zone" onDrop={this.docDrop}>
                                                                    <div className="control">
                                                                        <span className="has-text-grey-light">Selecciona archivo</span>
                                                                        <MdAttachFile/>
                                                                    </div>
                                                                </Dropzone>
                                                                <p className={"help " + (org.doc.flag ? 'is-success' : 'is-danger')}>{org.doc.msg}</p>
                                                            </React.Fragment>
                                                        }
                                                    </React.Fragment>
                                            }
                                        </div>
                                    </div>
                                    <div className="columns is-9">
                                        <div className="field column">
                                            <label className="label is-size-7 has-text-grey-light">Dirección</label>
                                            <div className="control">
                                                <Geosuggest
                                                    placeholder={'Ingresa tu dirección'}
                                                    onSuggestSelect={this.onSuggestSelect}
                                                    initialValue={org.location.FormattedAddress}
                                                    location={new google.maps.LatLng(org.location.Latitude, org.location.Longitude)}
                                                    radius="20"/>
                                            </div>
                                        </div>
                                        <div className="field column">
                                            <label className="label is-size-7 has-text-grey-light">Celular o Teléfono</label>
                                            <div className="control">
                                                <input className="input has-text-weight-bold" name={"phone"} type="tel" placeholder="+57 123 456 7890" value={org.phone} onChange={this.handleChange}
                                                />
                                            </div>
                                        </div>
                                        {/*<div className="field column">
                                            <label className="label is-size-7 has-text-grey-light">Opción</label>
                                            <div className="control">
                                                <input className="input" name={"opcion"} type="text"
                                                        placeholder="Opción" value={org.phone}
                                                        onChange={this.handleChange}
                                                />
                                            </div>
                                        </div>*/}
                                    </div>
                                    <div className="columns is-9">
                                        <div className="column">
                                            <div className="redes level columns is-multiline">
                                                <div className="column is-10">
                                                    <FormNetwork changeNetwork={this.changeNetwork} object={org.network}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="column profile-buttons">
                                            <button className={`button is-primary ${wait?'is-loading':''}`} onClick={this.saveForm}>Guardar</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="profile-data columns">
                                <div className="column is-12">
                                    <h2 className="data-title">
                                        <small className="is-italic has-text-grey-light has-text-weight-300">Tus</small><br/>
                                        <span className="has-text-grey-dark is-size-3">Eventos</span>
                                    </h2>
                                    <div className="columns home is-multiline is-mobile">
                                        {
                                            events.map((event,key)=>{
                                                return  <EventCard event={event} key={event._id} action={''} size={'column is-one-third'} right={
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
                            </div>
                        </div>
                }
                {
                    timeout&&(<LogOut/>)
                }
                <Dialog modal={this.state.modal} title={'Borrar Evento'}
                        content={<p>Seguro de borrar este evento?</p>}
                        first={{title:'Borrar',class:'is-dark has-text-danger',action:this.deleteEvent}}
                        message={this.state.message} isLoading={this.state.isLoading}
                        second={{title:'Cancelar',class:'',action:this.closeModal}}/>
                <Dialog modal={this.state.modalOrg} title={'Organización Creada'}
                        content={<div><p className='has-text-weight-bold has-text-success'>Organización creada correctamente</p><p>Nuestro equipo validará tu información</p></div>}
                        first={{title:'OK',class:'',action:this.closeOrg}}/>
            </section>
        );
    }
}

export default withRouter(OrgEditProfile);