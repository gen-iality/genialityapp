import React, {Component} from 'react';
import Moment from "moment";
import QRCode from "qrcode.react";
import {BadgeApi} from "../../helpers/request";

class Badge extends Component {
    constructor(props) {
        super(props);
        this.state = {
            badge:[],
            qrExist:false,
            extraFields:[
                {value:'name',label:'nombre'},
                {value:'email',label:'correo'}
            ],
            fontSize: [18,22,36,44],
            qrSize: [64,128],
            newField:false
        };
        this.saveBadge = this.saveBadge.bind(this)
    }

    async componentDidMount() {
        const { event } = this.props;
        const properties = event.user_properties;
        /*const badge = await BadgeApi.get(event._id);
        console.log(badge);*/
        const {extraFields} = this.state;
        properties.map(prop=>{
            return extraFields.push({value:prop._id,label:prop.name})
        })
        this.setState({ extraFields });
    }

    addField = () => {
        const {badge} = this.state;
        badge.push({edit:true,line:true,id_properties:'',size:'18'});
        this.setState({badge,newField:true})
    };

    addQR = () => {
        const {badge} = this.state;
        badge.push({edit:true,line:true,qr:true});
        this.setState({badge,qrExist:true,newField:true,size:'64'})
    };

    handleChange = (e,key) => {
        const {value,name} = e.target;
        const {badge,extraFields} = this.state;
        let field = value;
        if(name === 'id_properties'){
            const pos = extraFields.map(field=>{return field.value}).indexOf(value);
            field = extraFields[pos];
        }else{
            field = parseInt(field,10);
        }
        badge[key][name] = field;
        this.setState({badge})
    };

    toggleSwitch = (key) => {
        const {badge} = this.state;
        badge[key].line = !badge[key].line;
        this.setState({badge})
    };

    saveField = (key) => {
        const {badge,extraFields} = this.state;
        if(badge[key].id_properties){
            const pos = extraFields.map(field=>{return field.value}).indexOf(badge[key].id_properties.value);
            extraFields.splice(pos, 1);
        }
        badge[key].edit = !badge[key].edit;
        this.setState({badge,extraFields,newField:false,showPrev:true})
    };

    editField = (key) => {
        const {badge} = this.state;
        badge[key].edit = !badge[key].edit;
        this.setState({badge,newField:true})
    };

    removeField = (key) => {
        const {badge} = this.state;
        if(badge[key].qr) this.setState({qrExist:false});
        badge.splice(key,1);
        this.setState({badge})
    };

    renderPrint = () => {
        const badge = [...this.state.badge];
        let items = [];
        let i = 0;
        for(;i<badge.length;){
            let item;
            if(badge[i].line){
                item = badge[i].qr ?
                    <QRCode value={'alejomg27@gmail.com'} size={64}/>:
                    <div><p style={{fontSize:`${badge[i].size}px`}}>{badge[i].id_properties.label}</p></div>;
                items.push(item);
                i++
            }else{
                if(badge[i+1]&&!badge[i+1].line){
                    item = <div style={{display:"flex"}}>
                        {
                            !badge[i].qr?
                                <div style={{marginRight:"20px"}}>
                                    <p style={{fontSize:`${badge[i].size}px`}}>
                                        {badge[i].id_properties.label}
                                    </p>
                                </div>:
                                <div style={{marginRight:"20px"}}><QRCode value={'evius.co'} size={badge[i].size}/></div>
                        }
                        {
                            !badge[i+1].qr?
                                <div style={{marginRight:"20px"}}>
                                    <p style={{fontSize:`${badge[i+1].size}px`}}>
                                        {badge[i+1].id_properties.label}
                                    </p>
                                </div>:
                                <div><QRCode value={'evius.co'} size={badge[i+1].size}/></div>
                        }
                    </div>;
                    items.push(item);
                    i = i + 2;
                } else {
                    item = <div style={{display:"flex"}}>
                        <div style={{marginRight:"20px"}}>
                            {
                                !badge[i].qr?
                                    <p style={{fontSize:`${badge[i].size}px`}}>
                                        {badge[i].id_properties.label}
                                    </p>:
                                    <QRCode value={'evius.co'} size={badge[i].size}/>
                            }
                        </div>
                    </div>;
                    items.push(item);
                    i++
                }
            }
        }
        return items.map((item,key)=>{
            return <React.Fragment key={key}>{item}</React.Fragment>
        });
    };

    async saveBadge(){
        const { event } = this.props;
        const { badge } = this.state;
        const data = {
            "fields_id":event._id,
            "BadgeFields":[]
        };
        badge.map(item=>{
            if(!item.qr){
                item.id_properties = item.id_properties.value
            }
            return data.BadgeFields.push({item})
        });
        console.log(data);
        /*try{
            const resp = await BadgeApi.create(data);
            console.log(resp);
        }catch (err) {
            console.log(err.response);
        }*/
    };

    render() {
        const {badge,qrExist,extraFields,newField,showPrev,fontSize,qrSize} = this.state;
        return (
            <React.Fragment>
                <div className="columns">
                    <div className="column is-4">
                        <div className="field is-grouped">
                            <label className="label">Agregar:</label>
                            <p className="control">
                                <button className="button" onClick={this.addField} disabled={newField}>Campo</button>
                            </p>
                            {!qrExist&&
                            <p className="control">
                                <button className="button" onClick={this.addQR} disabled={newField}>QR</button>
                            </p>
                            }
                        </div>
                        {
                            badge.map((item,key)=>{
                                return <article key={key} className="media">
                                    {
                                        item.edit ?
                                            <div className="media-content">
                                                {
                                                    !item.qr?
                                                        <React.Fragment>
                                                            <div className="field">
                                                                <label className="label">Campo</label>
                                                                <div className="control">
                                                                    <div className="select">
                                                                        <select onChange={(e)=>{this.handleChange(e,key)}} name={'id_properties'} value={item.id_properties.value}>
                                                                            <option value={''}>Seleccione...</option>
                                                                            {
                                                                                extraFields.map((field,key)=>{
                                                                                    return <option value={field.value} key={key} className="is-capitalized">{field.label}</option>
                                                                                })
                                                                            }
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="field">
                                                                <label className="label">Tamaño</label>
                                                                <div className="control">
                                                                    <div className="select">
                                                                        <select onChange={(e)=>{this.handleChange(e,key)}} name={'size'} value={item.size}>
                                                                            <option value={''}>Seleccione...</option>
                                                                            {
                                                                                fontSize.map((field,key)=>{
                                                                                    return <option value={field} key={key}>{field}</option>
                                                                                })
                                                                            }
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="field">
                                                                <input id={`switch_${key}`} type="checkbox" name={`switch_${key}`}
                                                                       className="switch" checked={item.line} onChange={(e)=>{this.toggleSwitch(key)}}/>
                                                                <label htmlFor={`switch_${key}`}>Line</label>
                                                            </div>
                                                        </React.Fragment>:
                                                        <div className="content">
                                                            <p><strong>QR</strong></p>
                                                            <div className="field">
                                                                <input id={`switch_${key}`} type="checkbox" name={`switch_${key}`}
                                                                       className="switch" checked={item.line} onChange={(e)=>{this.toggleSwitch(key)}}/>
                                                                <label htmlFor={`switch_${key}`}>Line</label>
                                                            </div>
                                                            <div className="field">
                                                                <label className="label">Tamaño</label>
                                                                <div className="control">
                                                                    <div className="select">
                                                                        <select onChange={(e)=>{this.handleChange(e,key)}} name={'size'} value={item.size}>
                                                                            <option value={''}>Seleccione...</option>
                                                                            {
                                                                                qrSize.map((field,key)=>{
                                                                                    return <option value={field} key={key}>{field}</option>
                                                                                })
                                                                            }
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                }
                                                <nav className="level">
                                                    <div className="level-left">
                                                        <div className="level-item">
                                                            <button className="button is-info is-small is-outlined" onClick={(e)=>{this.saveField(key)}}>Agregar</button>
                                                        </div>
                                                    </div>
                                                </nav>
                                            </div>:
                                            <React.Fragment>
                                                <div className="media-content">
                                                    <div className="content">
                                                        <p>{item.qr?'Código QR':item.id_properties.label}</p>
                                                    </div>
                                                </div>
                                                <div className="media-right">
                                                    <div>
                                                        <button className="delete" onClick={(e)=>{this.removeField(key)}}/>
                                                    </div>
                                                    <div>
                                                        <button className="button is-small">
                                                            <span className="icon is-small" onClick={(e)=>{this.editField(key)}}><i className="fas fa-edit"/></span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                    }
                                </article>
                            })
                        }
                    </div>
                    <div className="column">
                        <h1>Preview</h1>
                        {showPrev && (this.renderPrint())}
                    </div>
                </div>
                <button className="button" onClick={this.saveBadge} disabled={badge.length<=0}>Guardar</button>
            </React.Fragment>
        );
    }
}

export default Badge;