import React, {Component} from 'react';

class Preview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            head: [
                {title:'Email',tag:'correo',used:false},
                {title:'Nombre',tag:'nombre',used:false},
                {title:'Nick',tag:'alias',used:false}
            ],
            list : [],
            auxArr: []
        }
    }

    componentDidMount(){
        let llaves = [];
        const {list} = this.props;
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
        this.setState({list})
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
        list[key].used = true;
        auxHead.splice(i,1);
        this.setState({auxArr:auxHead,head,list});
        this.headExist(key);
    }

    render() {
        const {list} = this.state;
        const self = this;
        console.log(self.state);
        return (
            <React.Fragment>
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
                                            (!item.used&&self.state.auxArr.length>0) && (
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
                                                                    return <a className="dropdown-item" key={llave} onClick={(e)=>{self.sChange(head,index)}}>{head.title}</a>
                                                                })
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            )
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
                {self.state.auxArr.length>0&&(<p className="has-text-danger">Faltan {self.state.auxArr.length} campos <b>Obligatorios</b></p>)}
                <button className="button is-primary is-rounded" disabled={self.state.auxArr.length>0} onClick={this.props.importUsers}>Importar</button>
            </React.Fragment>
        );
    }
}

export default Preview;