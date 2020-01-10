import React, {Component} from 'react';
import ImageInput from "../shared/imageInput";
import axios from "axios/index";
import { toast } from 'react-toastify';
import {Actions} from "../../helpers/request";
import {FormattedMessage} from "react-intl";
import { EventsApi } from "../../helpers/request";
import {Link} from "react-router-dom";
import LoadingEvent from "../loaders/loadevent";
import Moment from "moment";
import EventCard from "../shared/eventCard";
import LogOut from "../shared/logOut";
import {fetchRol} from "../../redux/rols/actions";
import {fetchPermissions} from "../../redux/permissions/actions";
import { app } from '../../helpers/firebase';
import ImageUploader from 'react-images-upload';
import * as Cookie from "js-cookie";
import privateInstance from "../../helpers/request";
import { parseUrl } from "../../helpers/constants";
import {BaseUrl} from "../../helpers/constants";

class Styles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            eventId : this.props.event,
            loading:true,
            message:{
                class:'',
                content:''
            },
            color: '#fff',
            setColor: {},
            styles:{},
            pictures:[],
            dates:{},
            info:{}
        };
        
        this.saveEventImage = this.saveEventImage.bind(this)
        this.saveMenuImage = this.saveMenuImage.bind(this)
        this.saveBannerImage = this.saveBannerImage.bind(this)
        this.saveBackgroundImage = this.saveBackgroundImage.bind(this)
        this.submit = this.submit.bind(this)
    }
    
    async componentDidMount(){
        const info = await Actions.getAll(`/api/events/${this.props.eventId}`);
        this.setState({info});

        for(const info in this.state.info.styles){
            var data = info+this.state.info.styles[info]
            this.setState({dates:{
                brandPrimary:this.state.info.styles.brandPrimary,
                brandSuccess:this.state.info.styles.brandSuccess,
                brandInfo:this.state.info.styles.brandInfo,
                brandDanger:this.state.info.styles.brandDanger,
                containerBgColor: this.state.info.styles.containerBgColor,
                brandWarning:this.state.info.styles.brandWarning,
                toolbarDefaultBg:this.state.info.styles.toolbarDefaultBg,
                brandDark:this.state.info.styles.brandDark,
                brandLight:this.state.info.styles.brandLight,
                event_image:this.state.info.styles.event_image,
                banner_image:this.state.info.styles.banner_image,
                menu_image:this.state.info.styles.menu_image
            }})

            this.setState({
                path:this.state.info.styles.event_image
            })

            this.setState({
                pathBannerImage:this.state.info.styles.banner_image,
            })

            this.setState({
                pathImage:this.state.info.styles.menu_image
            })

            this.setState({
                pathBackgroundImage:this.state.info.styles.BackgroundImage
            })

            this.setState({
                styles:{
                    brandPrimary:this.state.info.styles.brandPrimary,
                    brandSuccess:this.state.info.styles.brandSuccess,
                    brandInfo:this.state.info.styles.brandInfo,
                    containerBgColor: this.state.info.styles.containerBgColor,
                    brandDanger:this.state.info.styles.brandDanger,
                    brandWarning:this.state.info.styles.brandWarning,
                    brandDark:this.state.info.styles.brandDark,
                    brandLight:this.state.info.styles.brandLight,
                    toolbarDefaultBg:this.state.info.styles.toolbarDefaultBg,
                    event_image:this.state.info.styles.event_image,
                    banner_image:this.state.info.styles.banner_image,
                    menu_image:this.state.info.styles.menu_image,
                    BackgroundImage:this.state.info.styles.BackgroundImage
                }
            })

            console.log(this.state.styles)
        }
    }

    componentWillMount() {
        let dataUrl = parseUrl(document.URL);
        if (dataUrl && dataUrl.token) {
            console.log(dataUrl);
            if (dataUrl.token){
                Cookie.set("evius_token", dataUrl.token);
                privateInstance.defaults.params = {};
                privateInstance.defaults.params['evius_token'] = dataUrl.token;
            }
            if(dataUrl.refresh_token){
                Actions.put('/api/me/storeRefreshToken',{refresh_token:dataUrl.refresh_token})
                    .then(resp=>{
                        console.log(resp);
                    })
            }
        }
    }

    saveEventImage(files){
        console.log(files);
        const file = files[0];
        const url = '/api/files/upload', path = [], self = this;
        if(file){
            this.setState({imageFile: file,
                event:{...this.state.event, picture: null}});

            //envia el archivo de imagen como POST al API    
            const uploaders = files.map(file => {
                let data = new FormData();
                data.append('file',file);
                return Actions.post(url,data).then((image) => {
                    console.log(image);
                    if(image) path.push(image);
                });
            });

            //cuando todaslas promesas de envio de imagenes al servidor se completan
            axios.all(uploaders).then((data) => {
                console.log(path);
                this.setState({styles: {...this.state.styles, event_image: path[0]}})
                console.log('SUCCESSFULL DONE');
                self.setState({event: {
                        ...self.state.event,
                        picture: path[0]
                    },fileMsg:'Imagen subida con exito',imageFile:null,path});
                    
                toast.success(<FormattedMessage id="toast.img" defaultMessage="Ok!"/>);
            });
        }
        else{
            this.setState({errImg:'Solo se permiten imágenes. Intentalo de nuevo'});
        }
    }

    saveBannerImage(files){
        console.log(files);
        const file = files[0];
        const url = '/api/files/upload', pathBannerImage = [], self = this;
        if(file){
            this.setState({imageFileFooter: file,
                event:{...this.state.event, picture: null}});

            //envia el archivo de imagen como POST al API    
            const uploaders = files.map(file => {
                let data = new FormData();
                data.append('file',file);
                return Actions.post(url,data).then((image) => {
                    console.log(image);
                    if(image) pathBannerImage.push(image);
                });
            });

            //cuando todaslas promesas de envio de imagenes al servidor se completan
            axios.all(uploaders).then((data) => {
                console.log(pathBannerImage);
                this.setState({styles: {...this.state.styles, banner_image: pathBannerImage[0]}})
                console.log('SUCCESSFULL DONE');
                self.setState({event: {
                        ...self.state.event,
                        picture: pathBannerImage[0]
                    },fileMsgFooter:'Imagen subida con exito',imageFileFooter:null,pathBannerImage});
                    
                toast.success(<FormattedMessage id="toast.img" defaultMessage="Ok!"/>);
            });
        }
        else{
            this.setState({errImg:'Solo se permiten imágenes. Intentalo de nuevo'});
        }
    }

    saveMenuImage(files){
        console.log(files);
        const file = files[0];
        const url = '/api/files/upload', pathImage = [], self = this;
        if(file){
            this.setState({imageFileImage: file,
                event:{...this.state.event, picture: null}});

            //envia el archivo de imagen como POST al API    
            const uploaders = files.map(file => {
                let data = new FormData();
                data.append('file',file);
                return Actions.post(url,data).then((image) => {
                    console.log(image);
                    if(image) pathImage.push(image);
                });
            });

            //cuando todaslas promesas de envio de imagenes al servidor se completan
            axios.all(uploaders).then((data) => {
                console.log(pathImage);
                this.setState({styles: {...this.state.styles, menu_image: pathImage[0]}})
                console.log('SUCCESSFULL DONE');
                self.setState({event: {
                        ...self.state.event,
                        picture: pathImage[0]
                    },fileMsgLogo:'Imagen subida con exito',imageFileImage:null,pathImage});
                    
                toast.success(<FormattedMessage id="toast.img" defaultMessage="Ok!"/>);
            });
        }
        else{
            this.setState({errImg:'Solo se permiten imágenes. Intentalo de nuevo'});
        }
    }

    saveBackgroundImage(files){
        console.log(files);
        const file = files[0];
        const url = '/api/files/upload', pathBackgroundImage = [], self = this;
        if(file){
            this.setState({imageBackgroundImage: file,
                event:{...this.state.event, picture: null}});

            //envia el archivo de imagen como POST al API    
            const uploaders = files.map(file => {
                let data = new FormData();
                data.append('file',file);
                return Actions.post(url,data).then((image) => {
                    console.log(image);
                    if(image) pathBackgroundImage.push(image);
                });
            });

            //cuando todaslas promesas de envio de imagenes al servidor se completan
            axios.all(uploaders).then((data) => {
                console.log(pathBackgroundImage);
                this.setState({styles: {...this.state.styles, BackgroundImage: pathBackgroundImage[0]}})
                console.log('SUCCESSFULL DONE');
                self.setState({event: {
                        ...self.state.event,
                        picture: pathBackgroundImage[0]
                    },fileMsgBackground:'Imagen subida con exito',BackgroundImage:null,pathBackgroundImage});
                    
                toast.success(<FormattedMessage id="toast.img" defaultMessage="Ok!"/>);
            });
        }
        else{
            this.setState({errImg:'Solo se permiten imágenes. Intentalo de nuevo'});
        }
    }

    async submit(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const { eventId } = this.state;
        
        const self = this;
        // this.state.data.push(this.state.styles);
        this.state.data={styles:this.state.styles};
        try {
            if(eventId){
                const info = await Actions.put(`/api.evius.co/api/events/${this.props.eventId}`,this.state.data);
                this.props.updateEvent(info);
                console.log(this.state.data)
                this.setState({loading:false});
                toast.success(<FormattedMessage id="toast.success" defaultMessage="Ok!"/>)
            }
            else{
                const result = await Actions.put(`/api/events/${this.props.eventId}`, this.state.data);
                this.setState({loading:false});
                if(result._id){
                    window.location.replace(`${BaseUrl}/event/${this.props.eventId}/styles`);
                    toast.success(<FormattedMessage id="toast.success" defaultMessage="Ok!"/>)
                }else{
                    toast.warn(<FormattedMessage id="toast.warning" defaultMessage="Idk"/>);
                    this.setState({msg:'Cant Create',create:false})
                }
            }
        }
        catch(error) {
            toast.error(<FormattedMessage id="toast.error" defaultMessage="Sry :("/>);
            if (error.response) {
                console.log(this.state.data)
                console.log(error.response);
                const {status,data} = error.response;
                console.log('STATUS',status,status === 401);
                if(status === 401) this.setState({timeout:true,loader:false});
                else this.setState({serverError:true,loader:false,errorData:data})
            } else {
                let errorData = error.message;
                console.log('Error', error.message);
                console.log(this.state.styles)
                if(error.request) {
                    console.log(error.request);
                    errorData = error.request
                };
                
                this.setState({serverError:true,loader:false,errorData})
            }
            console.log(error.config);
        }
    }

    render() {
        const {timeout} = this.state;
    
        return (
            <React.Fragment>
                
                <div className="columns general">
                    <div className="column is-12">
                        <h2 className="title-section">Configuracion de estilos</h2>
                        <div className="column inner-column">
                            <label className="label has-text-grey-light">Elige un color para los botones</label>
                            <input type="color" disabled style={{marginRight:"3%", borderRadius:"100%", width:"23px"}} value={this.state.dates.brandPrimary}/>
                            <input type="color" name="colorBtn" onChange={(save) => {this.setState({styles: {...this.state.styles, brandPrimary: save.target.value}})}}/>
                        </div>

                        <h2 className="title-section">Configuracion de Fondo de pantalla</h2>
                        <div className="column inner-column">
                            <label className="label has-text-grey-light">Elige un color para el fondo de tu app</label>
                            <input type="color" disabled style={{marginRight:"3%", borderRadius:"100%", width:"23px"}} value={this.state.dates.containerBgColor}/>
                            <input type="color" name="colorBtn" onChange={(save) => {this.setState({styles: {...this.state.styles, containerBgColor: save.target.value}})}}/>
                        </div>


                        <h2 className="title-section">Configuracion de Menu</h2>
                        <div className="column inner-column">
                            <label className="label has-text-grey-light">Elige un color para el menu</label>
                            <input type="color" disabled style={{marginRight:"3%", borderRadius:"100%", width:"23px"}} value={this.state.dates.toolbarDefaultBg}/>
                            <input type="color" name="colorBtn" onChange={(save) => {this.setState({styles: {...this.state.styles, toolbarDefaultBg: save.target.value}})}}/>
                        </div>                          
                        

                        {/* <div className="column inner-column">
                            <label className="label has-text-grey-light">Elige un color Para la informacion</label>
                            <input type="color" disabled style={{marginRight:"3%", borderRadius:"100%", width:"23px"}} value={this.state.dates.brandInfo}/>
                            <input type="color" name="menuColor" onChange={(save) => {this.setState({styles: {...this.state.styles, brandInfo: save.target.value}})}} />
                        </div>

                        <div className="column inner-column">
                            <label className="label has-text-grey-light">Elige un color para operaciones realizada con exito</label>
                            <input type="color" disabled style={{marginRight:"3%", borderRadius:"100%", width:"23px"}} value={this.state.dates.brandSuccess}/>
                            <input type="color" name="iconsColor" onChange={(save) => {this.setState({styles: {...this.state.styles, brandSuccess: save.target.value}})}} />    
                        </div>

                        <div className="column inner-column">
                            <label className="label has-text-grey-light">Elige un color para operaciones erroneas</label>
                            <input type="color" disabled style={{marginRight:"3%", borderRadius:"100%", width:"23px"}} value={this.state.dates.brandDanger}/>
                            <input type="color" name="iconsColor" onChange={(save) => {this.setState({styles: {...this.state.styles, brandDanger: save.target.value}})}} />    
                        </div> */}

                        {/* <div className="column inner-column">
                            <label className="label has-text-grey-light">Elige un color para advertencias</label>
                            <input type="color" disabled style={{marginRight:"3%", borderRadius:"100%", width:"23px"}} value={this.state.dates.brandWarning}/>
                            <input type="color" name="iconsColor" onChange={(save) => {this.setState({styles: {...this.state.styles, brandWarning: save.target.value}})}} />    
                        </div>
                        
                        <div className="column inner-column">
                            <label className="label has-text-grey-light">Elige un color para tema oscuro</label>
                            <input type="color" disabled style={{marginRight:"3%", borderRadius:"100%", width:"23px"}} value={this.state.dates.brandDark}/>
                            <input type="color" name="iconsColor" onChange={(save) => {this.setState({styles: {...this.state.styles, brandDark: save.target.value}})}} />    
                        </div> */}

                        {/* <div className="column inner-column">
                            <label className="label has-text-grey-light">Elige un color para tema claro</label>
                            <input type="color" disabled style={{marginRight:"3%", borderRadius:"100%", width:"23px"}} value={this.state.dates.brandLight}/>
                            <input type="color" name="iconsColor" onChange={(save) => {this.setState({styles: {...this.state.styles, brandLight: save.target.value}})}} />    
                        </div> */}

                        {/* Se carga la imagen de registro y login com base a la funcion save configuration */}
                        <div className="column inner-column">
                            <label className="label has-text-grey-light">Elige una imagen de Login</label>
                             <div className="control">
                                <ImageInput picture={this.state.path} imageFile={this.state.event_image}
                                    divClass={'drop-img'} content={<img src={this.state.path} alt={'Imagen Perfil'}/>}
                                    classDrop={'dropzone'} contentDrop={<button onClick={(e)=>{e.preventDefault()}} className={`button is-primary is-inverted is-outlined ${this.state.event_image?'is-loading':''}`}>Cambiar foto</button>}
                                    contentZone={<div className="has-text-grey has-text-weight-bold has-text-centered"><span>Subir foto</span><br/><small>(Tamaño recomendado: 1280px x 960px)</small></div>}
                                    changeImg={this.saveEventImage} errImg={this.state.errImg}
                                    style={{cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', height: 250, width: '100%', borderWidth: 2, borderColor: '#b5b5b5', borderStyle: 'dashed', borderRadius: 10}}/>
                            </div>
                            {this.state.fileMsg && (<p className="help is-success">{this.state.fileMsg}</p>)}
                        </div>

                        <div className="column inner-column">
                            <label className="label has-text-grey-light">Elige una imagen para el encabezado del menu</label>
                            <div className="control">
                                <ImageInput picture={this.state.pathImage} imageFile={this.state.imageFileImage}
                                    divClass={'drop-img'} content={<img src={this.state.pathImage} alt={'Imagen Perfil'}/>}
                                    classDrop={'dropzone'} contentDrop={<button onClick={(e)=>{e.preventDefault()}} className={`button is-primary is-inverted is-outlined ${this.state.imageFileImage?'is-loading':''}`}>Cambiar foto</button>}
                                    contentZone={<div className="has-text-grey has-text-weight-bold has-text-centered"><span>Subir foto</span><br/><small>(Tamaño recomendado: 1280px x 960px)</small></div>}
                                    changeImg={this.saveMenuImage} errImg={this.state.errImg}
                                    style={{cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', height: 250, width: '100%', borderWidth: 2, borderColor: '#b5b5b5', borderStyle: 'dashed', borderRadius: 10}}/>
                            </div>
                            {this.state.fileMsgLogo && (<p className="help is-success">{this.state.fileMsgLogo}</p>)}
                        </div>

                        <div className="column inner-column">
                            <label className="label has-text-grey-light">Elige las imagenes de tu banner</label>
                            <div className="control">
                                <ImageInput picture={this.state.pathBannerImage} imageFile={this.state.imageFileFooter}
                                    divClass={'drop-img'} content={<img src={this.state.pathBannerImage} alt={'Imagen Perfil'}/>}
                                    classDrop={'dropzone'} contentDrop={<button onClick={(e)=>{e.preventDefault()}} className={`button is-primary is-inverted is-outlined ${this.state.imageFileFooter?'is-loading':''}`}>Cambiar foto</button>}
                                    contentZone={<div className="has-text-grey has-text-weight-bold has-text-centered"><span>Subir foto</span><br/><small>(Tamaño recomendado: 1280px x 960px)</small></div>}
                                    changeImg={this.saveBannerImage} errImg={this.state.errImg}
                                    style={{cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', height: 250, width: '100%', borderWidth: 2, borderColor: '#b5b5b5', borderStyle: 'dashed', borderRadius: 10}}/>
                            </div>
                            {this.state.fileMsgFooter && (<p className="help is-success">{this.state.fileMsgFooter}</p>)}
                        </div>

                        <div className="column inner-column">
                            <label className="label has-text-grey-light">Elige la imagen de fondo</label>
                            <div className="control">
                                <ImageInput picture={this.state.pathBackgroundImage} imageFile={this.state.BackgroundImage}
                                    divClass={'drop-img'} content={<img src={this.state.pathBackgroundImage} alt={'Imagen Perfil'}/>}
                                    classDrop={'dropzone'} contentDrop={<button onClick={(e)=>{e.preventDefault()}} className={`button is-primary is-inverted is-outlined ${this.state.BackgroundImage?'is-loading':''}`}>Cambiar foto</button>}
                                    contentZone={<div className="has-text-grey has-text-weight-bold has-text-centered"><span>Subir foto</span><br/><small>(Tamaño recomendado: 1280px x 960px)</small></div>}
                                    changeImg={this.saveBackgroundImage} errImg={this.state.errImg}
                                    style={{cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', height: 250, width: '100%', borderWidth: 2, borderColor: '#b5b5b5', borderStyle: 'dashed', borderRadius: 10}}/>
                            </div>
                            {this.state.fileMsgBackground && (<p className="help is-success">{this.state.fileMsgBackground}</p>)}
                        </div>

                        <button className="button is-primary" onClick={this.submit}>Guardar</button>         
                    </div>
                </div>
                {timeout&&(<LogOut/>)}
            </React.Fragment>
        );
    }
}

export default Styles