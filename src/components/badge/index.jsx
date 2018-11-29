import React, {Component} from 'react';
import Moment from "moment";
import QRCode from "qrcode.react";

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
            newField:false
        }
    }

    componentDidMount() {
        const { event } = this.props;
        const properties = event.user_properties;
        const {extraFields} = this.state;
        properties.map(prop=>{
            return extraFields.push({value:prop._id,label:prop.name})
        })
        this.setState({ extraFields });
    }

    addField = () => {
        const {badge} = this.state;
        badge.push({edit:true,line:true,property:''});
        this.setState({badge,newField:true})
    };

    addQR = () => {
        const {badge} = this.state;
        badge.push({edit:true,line:true,qr:true});
        this.setState({badge,qrExist:true,newField:true})
    };

    handleChange = (e,key) => {
        const {value} = e.target;
        const {badge} = this.state;
        badge[key].property = value;
        this.setState({badge})
    };

    toggleSwitch = (key) => {
        const {badge} = this.state;
        badge[key].line = !badge[key].line;
        this.setState({badge})
    };

    saveField = (key) => {
        const {badge} = this.state;
        badge[key].edit = !badge[key].edit;
        this.setState({badge,newField:false,showPrev:true})
    };

    editField = (key) => {
        const {badge} = this.state;
        badge[key].edit = !badge[key].edit;
        this.setState({badge,showPrev:false})
    };

    removeField = (key) => {
        const {badge} = this.state;
        if(badge[key].qr) this.setState({qrExist:false});
        badge.splice(key,1);
        this.setState({badge})
    };

    renderPrint = () => {
        const {badge} = this.state;
        let items = [];
        let i = 0;
        for(;i<badge.length;){
            let item;
            if(badge[i].line){
                item = badge[i].qr ? <QRCode value={'alejomg27@gmail.com'} size={64}/>:<div>{badge[i].property}</div>;
                items.push(item);
                i++
            }else{
                if(badge[i+1]&&!badge[i+1].line){
                    item = <div style={{display:"flex"}}>
                        <div>{!badge[i].qr?badge[i].property: <QRCode value={'alejomg27@gmail.com'} size={64}/>}</div>
                        <div>{badge[i+1].property}</div>
                    </div>;
                    items.push(item);
                    i = i + 2;
                } else {
                    item = <div style={{display:"flex"}}>
                        <div>{!badge[i].qr?badge[i].property:<QRCode value={'alejomg27@gmail.com'} size={64}/>}</div>
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

    render() {
        const {badge,qrExist,extraFields,newField,showPrev} = this.state;
        return (
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
                                         <React.Fragment>
                                             {!item.qr?
                                                 <div className="media-content">
                                                     <div className="field">
                                                         <div className="control">
                                                             <div className="select">
                                                                 <select onChange={(e)=>{this.handleChange(e,key)}} value={item.property}>
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
                                                         <input id={`switch_${key}`} type="checkbox" name={`switch_${key}`}
                                                                className="switch" checked={item.line} onChange={(e)=>{this.toggleSwitch(key)}}/>
                                                         <label htmlFor={`switch_${key}`}>Line</label>
                                                     </div>
                                                     <nav className="level">
                                                         <div className="level-left">
                                                             <div className="level-item">
                                                                 <button className="button is-info is-small is-outlined" onClick={(e)=>{this.saveField(key)}}>Agregar</button>
                                                             </div>
                                                         </div>
                                                     </nav>
                                                 </div>
                                             :<div className="media-content">
                                                     <div className="content">
                                                         <p><strong>QR</strong></p>
                                                         <div className="field">
                                                             <input id={`switch_${key}`} type="checkbox" name={`switch_${key}`}
                                                                    className="switch" checked={item.line} onChange={(e)=>{this.toggleSwitch(key)}}/>
                                                             <label htmlFor={`switch_${key}`}>Line</label>
                                                         </div>
                                                     </div>
                                                     <nav className="level">
                                                         <div className="level-left">
                                                             <div className="level-item">
                                                                 <button className="button is-info is-small is-outlined" onClick={(e)=>{this.saveField(key)}}>Agregar</button>
                                                             </div>
                                                         </div>
                                                     </nav>
                                                 </div>
                                             }
                                         </React.Fragment>:
                                         <React.Fragment>
                                             <div className="media-content">
                                                 <div className="content">
                                                     <p>{item.qr?'Código QR':item.property}</p>
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
                    <h1 onClick={(e)=>{this.setState({showPrev:true})}}>Preview</h1>
                    {showPrev && (this.renderPrint())}
                </div>
            </div>
        );
    }
}

export default Badge;