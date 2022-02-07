import React, {Component} from 'react';

class DynamicForm extends Component {
    constructor(props) {
        super(props);
        this.state ={};
    }

    renderForm = () => {
        let model = this.props.model;
        let formUI = model.map((m,key) => {
            let type = m.type || "text";
            let props = m.props || {};
            let name= m.name;
            let mandatory = m.mandatory;
            let target = name;
            let value =  this.state[target] ? this.state[target] : m.type==="boolean" ? false : "";
            let input =  <input {...props}
                                className="input"
                                type={type}
                                key={key}
                                name={name}
                                value={value}
                                onChange={(e)=>{this.props.onChange(e, type)}}
            />;
            if (type == "boolean") {
                input =
                    <React.Fragment>
                    <input
                        name={name}
                        id={name}
                        className="is-checkradio is-primary is-rtl"
                        type="checkbox"
                        checked={this.state[name]}
                        onChange={this.handleInputChange} />
                    <label className={`label has-text-grey-light is-capitalized ${mandatory?'required':''}`} htmlFor={name}>{name}</label>
                </React.Fragment>
            }
            if (type == "list") {
                input = m.options.map((o,key) => {
                    return (<option {...props} key={key} value={o.value}>{o.value}</option>);
                });
                input = <div className="select">
                    <select name={name} value={value} onChange={(e)=>{this.props.onChange(e, type)}}>{input}</select>
                </div>;
            }
            return (
                <div key={'g' + key} className="field">
                    {m.type !== "boolean"&&
                        <label className={`label has-text-grey-light is-capitalized ${mandatory?'required':''}`}
                               key={"l" + key}
                               htmlFor={key}>
                            {name}
                        </label>}
                    <div className="control">
                        {input}
                    </div>
                </div>
            );
        });
        return formUI;
    };

    render() {
        return (
            <div>
                {this.renderForm()}
            </div>
        );
    }
}

export default DynamicForm;