/*global google*/
import React, {Component} from 'react';
import Geosuggest from 'react-geosuggest'
import Dropzone from 'react-dropzone'
import {MdAttachFile, MdSave} from 'react-icons/md'
import {FaTwitter, FaFacebook, FaInstagram, FaLinkedinIn} from 'react-icons/fa'
import {Actions, CategoriesApi} from "../../helpers/request";
import ImageInput from "../shared/imageInput";
import {TiArrowLoopOutline} from "react-icons/ti";
import Select from 'react-select';
import SelectInput from "../shared/selectInput";

class OrgProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOption: [],
            org: {
                location:{}
            }
        }
    }

    async componentDidMount() {
        let orgId = this.props.match.params.org;
        const categories = await CategoriesApi.getAll();
        this.setState({categories});
        if(orgId === 'create'){
            this.setState({create:true,loading:false})
        }else{
            this.setState({loading:false});
        }
    }

    docDrop=(files)=>{
        console.log('ARHIVO');
        const file = files[0];
        (!file)?
            this.setState({documentos:{...this.state.documentos,error:{...this.state.documentos.error,rut:true},data:{...this.state.documentos.data,rut:file}}}) :
            this.setState({documentos:{...this.state.documentos,data:{...this.state.documentos.data,rut:file},error:{...this.state.documentos.error,rut:false}}});
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
                        },fileMsg:'Image uploaded successfull'
                    });
                });
        }
        else{
            this.setState({errImg:'Only images files allowed. Please try again (:'});
        }
    };

    showNetwork = (network) => {
      this.setState({network})
    };

    handleSelect = (selectedOption) => {
        this.setState({ selectedOption });
    };

    render() {
        const { org, categories } = this.state;
        return (
            <section className="section">
                <div className="container org-profile">
                    <div className="columns">
                        <div className="column is-3">
                            <ImageInput picture={org.picture} imageFile={this.state.imageFile}
                                        divClass={'circle-img'} content={<div style={{backgroundImage: `url(${org.picture})`}} className="avatar-img"/>}
                                        classDrop={'change-img is-size-2'} contentDrop={<TiArrowLoopOutline className="has-text-white"/>}
                                        contentZone={<figure className="image is-128x128">
                                            <img className="is-rounded" src="https://bulma.io/images/placeholders/128x128.png"/>
                                        </figure>} style={{}}
                                        changeImg={this.changeImg}/>
                            <div className="field">
                                <label className="label">Nombre Empresa</label>
                                <div className="control">
                                    <input className="input" name={"name"} type="text"
                                           placeholder="Text input" value={org.name}
                                           onChange={this.handleChange}
                                    />
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Correo Corporativo</label>
                                <div className="control">
                                    <input className="input" name={"email"} type="email"
                                           placeholder="Text input" value={org.email}
                                           onChange={this.handleChange}
                                    />
                                </div>
                            </div>
                            <SelectInput handleSelect={this.handleSelect} options={categories}/>
                        </div>
                        <div className="column is-9 org-data">
                            <h1 className="title has-text-primary">Datos</h1>
                            <div className="columns">
                                <div className="column">
                                    <div className="field">
                                        <label className="label">Nit</label>
                                        <div className="control">
                                            <input className="input" name={"nit"} type="number"
                                                   placeholder="Text input" value={org.nit}
                                                   onChange={this.handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="field">
                                        <label className="label">Dirección</label>
                                        <div className="control">
                                            <Geosuggest
                                                placeholder={'Dirección'}
                                                onSuggestSelect={this.onSuggestSelect}
                                                initialValue={org.location.FormattedAddress}
                                                location={new google.maps.LatLng(org.location.Latitude,org.location.Longitude)}
                                                radius="20"/>
                                        </div>
                                    </div>
                                    <div className="field is-grouped">
                                        <button className={`is-text button`} onClick={(e)=>{this.showNetwork('Facebook')}}><FaFacebook/></button>
                                        <button className={`is-text button`} onClick={(e)=>{this.showNetwork('Twitter')}}><FaTwitter/></button>
                                        <button className={`is-text button`} onClick={(e)=>{this.showNetwork('Instagram')}}><FaInstagram/></button>
                                        <button className={`is-text button`} onClick={(e)=>{this.showNetwork('LinkedIn')}}><FaLinkedinIn/></button>
                                    </div>
                                    {
                                        this.state.network&&(
                                            <div className="field has-addons">
                                                <div className="control">
                                                    <input className="input is-small" type="url"
                                                           placeholder={`${this.state.network} URL`}/>
                                                </div>
                                                <div className="control">
                                                    <button className="button is-info is-outlined is-small"><MdSave/></button>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                                <div className="column">
                                    <div className="field">
                                        <label className="label">Celular o Teléfono</label>
                                        <div className="control">
                                            <input className="input" name={"phone"} type="tel"
                                                   placeholder="Text input" value={org.phone}
                                                   onChange={this.handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="field">
                                        <label className="label">Cámara de Comercio</label>
                                        <Dropzone accept="application/pdf" className="document-zone" onDrop={this.docDrop}>
                                            <div className="control has-text-centered">
                                                <p>Selecciona archivo <MdAttachFile className="has-text-primary"/></p>
                                            </div>
                                        </Dropzone>
                                    </div>
                                    <div className="control">
                                        <button className="button is-primary">Submit</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>Content</div>
                </div>
            </section>
        );
    }
}

const handleData = (data) => {
    let list = [];
    data.map(item=>{
        return list.push({value:item._id,label:item.name})
    })
    return list;
};

export default OrgProfile;