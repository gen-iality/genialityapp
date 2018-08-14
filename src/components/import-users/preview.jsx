import React, {Component} from 'react';

class Preview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            head : [
                {title:'Email',ln:['email','correo','mail']},
                {title:'Nombre',ln:['nombre','name']},
                {title:'Nick',ln:['nick','alias']}
            ],
            auxHead: []
        }
    }

    componentDidMount(){}

    handleList = () => {
        const {list} = this.props;
        const head = this.state.head;
        const self = this;
        let content = [];
        Object.keys(list).map(function(key, index) {
            return content.push(<div className="column" key={index}>
                <div className="box">
                    <div className="field is-grouped">
                        <div className={`control ${self.headExist(key) ? "has-text-success" : "has-text-warning"}`}>
                            {key}
                        </div>
                        {
                            !self.headExist(key) && (
                                <div className="dropdown is-hoverable">
                                    <div className="control dropdown-trigger">
                                        <button className="button is-text" aria-haspopup="true" aria-controls="dropdown-menu">
                                            <span className="icon is-small"><i className="fas fa-angle-down"/></span>
                                        </button>
                                    </div>
                                    <div className="dropdown-menu" id="dropdown-menu" role="menu">
                                        <div className="dropdown-content">
                                            {
                                                head.map((head,key)=>{
                                                    return <a className="dropdown-item" key={key}>{head.title}</a>
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                    <div>
                        {list[key].slice(0,2).map((item,j)=>{
                            return <p key={j}>
                                {item}
                            </p>
                        })}
                    </div>
                </div>
            </div>)
        });
        return content
    }

    headExist = (key) => {
        let auxHead = this.state.head;
        let asd = false;
        for(let i = 0; i < auxHead.length; i++){
            let item = auxHead[i];
            if(item.ln.indexOf(key)!==-1){
                asd = true;
                break;
            }
        }
        return asd
    };

    render() {
        return (
            <React.Fragment>
                <div className="columns preview-list">
                    {this.handleList()}
                </div>
                <button className="button is-primary is-rounded">Importar</button>
            </React.Fragment>
        );
    }
}

export default Preview;