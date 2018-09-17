import React, {Component} from 'react';
import { Actions, EventsApi } from "../../helpers/request";

class Preview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            head: [
                {tag:'email',used:false},
                {tag:'name',used:false}
            ],
            loading: true,
            list : [],
            auxArr: []
        };
        this.addField = this.addField.bind(this)
    }

    async componentDidMount(){
        let llaves = [];
        const {list, eventId} = this.props;
        const event = await EventsApi.getOne(eventId);
        event.user_properties.map(item => {
            this.setState(prevState => ({
                head: [...prevState.head, {tag:item.name,used:false}]
            }))
        });
        list.map(list => {
            llaves.push(list.key)
        });
        this.renderHead(llaves, list);
    }

    renderHead = (llaves, list) => {
        const a = llaves;
        const b = this.state.head;
        const comparer = (otherArray) => {
            return ( current ) => {
                return otherArray.filter( other => {
                    if (other === current.tag){
                        current.used = true;
                        return true
                    }else{ return false}
                }).length === 0;
            }
        }
        const onlyInB = b.filter(comparer(a));
        this.setState({auxArr:onlyInB,head:b});
        list.map(item=>{
            item.used = this.headExist(item.key)
        });
        let auxList = JSON.parse(JSON.stringify(list)); //create a copy of list
        this.setState({list,loading:false,auxList})
    }

    headExist = (key) => {
        let head = this.state.head;
        const j = head.map(e=>{ return e.tag; }).indexOf(key);
        return (j !== -1 ) ? head[j].used : false
    };

    sChange = (item,key) => {
        const auxHead = this.state.auxArr;
        const {head, list} = this.state;
        const i = auxHead.map(function(e) { return e.tag; }).indexOf(item.tag);
        const j = head.map(e=>{ return e.tag; }).indexOf(item.tag);
        head[j].used = true;
        let listCopy = JSON.parse(JSON.stringify(list));
        listCopy[key].used = true;
        listCopy[key].key = item.tag;
        auxHead.splice(i,1);
        this.setState({auxArr:auxHead,head,list:listCopy});
        this.headExist(key);
    };

    async addField(item, key) {
        console.log(item);
        const { list } = this.state;
        let resp = await Actions.post(`/api/user/events/${this.props.eventId}/addUserProperty`,{name:item.key});
        console.log(resp);
        if(resp){
            list[key].used = true;
            this.setState({ list });
        }
    };

    revertField = (item, position) => {
        const auxHead = this.state.auxArr;
        const list = JSON.parse(JSON.stringify(this.state.list));
        const head = [...this.state.head];
        const j = head.map(e=>{ return e.tag; }).indexOf(item.key);
        head[j].used = false;
        list[position].used = false;
        list[position].key = this.state.auxList[position].key;
        auxHead.push({tag:item.key,used:false});
        this.setState({auxArr:auxHead,head,list});
    };

    render() {
        const {list} = this.state;
        const self = this;
        return (
            <React.Fragment>
                {
                    this.state.loading ?
                        <div>Parsing excel</div> :
                        <div className="columns preview-list">
                            {
                                list.map(function(item, index) {
                                    return <div className="column" key={index}>
                                        <div className="box">
                                            <div className="field is-grouped">
                                                <div className={`control ${item.used ? "has-text-success" : "has-text-warning"}`}>
                                                    {item.key}
                                                </div>
                                                {
                                                    (!item.used&&self.state.auxArr.length>0) ?
                                                        <div className="dropdown is-hoverable">
                                                            <div className="control dropdown-trigger">
                                                                <button className="button is-text" aria-haspopup="true" aria-controls="dropdown-menu">
                                                                    <span className="icon is-small"><i className="fas fa-angle-down"/></span>
                                                                </button>
                                                            </div>
                                                            <div className="dropdown-menu" id="dropdown-menu" role="menu">
                                                                <div className="dropdown-content">
                                                                    {
                                                                        self.state.auxArr.map((head,llave)=>{
                                                                            return <a className="dropdown-item" key={llave} onClick={(e)=>{self.sChange(head,index)}}>{head.tag}</a>
                                                                        })
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>:
                                                        <span className="icon action_pointer tooltip is-small" data-tooltip="Change Field" onClick={(e)=>{self.revertField(item,index)}}>
                                                            <i className="fas fa-redo"/>
                                                        </span>
                                                }
                                                {
                                                    (!item.used&&self.state.auxArr.length<=0) && (
                                                        <span className="icon action_pointer tooltip is-small" data-tooltip="Add Field" onClick={(e)=>{self.addField(item,index)}}>
                                                            <i className="fas fa-plus"/>
                                                        </span>)
                                                }
                                            </div>
                                            <div>
                                                {item.list.slice(0,2).map((item,j)=>{
                                                    return <p key={j}>
                                                        {item}
                                                    </p>
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                })
                            }
                        </div>
                }
                {self.state.auxArr.length>0&&(<p className="has-text-danger">Faltan {self.state.auxArr.length} campos <b>Obligatorios</b></p>)}
                <button className="button is-primary is-rounded" disabled={self.state.auxArr.length>0} onClick={this.props.importUsers}>Importar</button>
            </React.Fragment>
        );
    }
}

export default Preview;