import React, {Component} from 'react';
import {FormattedMessage} from "react-intl";

class SearchComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showMessage: false,
            value: '',
            auxArr: [],
            filtered: [],
            message: ""
        };
    }

    componentWillReceiveProps(nextProps) {
        const {filtered} = this.state;
        //Fix
        if (nextProps.data !== this.props.data) {
            this.setState({auxArr:nextProps.data});
            if(nextProps.clear&&this.state.value.length===0){
                this.setState({value:''});
                if(filtered.length > 0) this.props.searchResult(filtered);
            }
        }
        if(nextProps.clear !== this.props.clear){
            if(this.state.value.length>=3){
                if(filtered.length > 0) this.props.searchResult(filtered);
            }else this.setState({value:''})
        }
    }

    filterByAllColums(value) {
        let arrAux;
        if(this.props.event=== "5d24e15c1c9d4400004b4e0a"){
            arrAux = this.props.data.filter((item) => {
                if(item.properties && item.properties.dni){
                    return item.properties.dni.search(new RegExp(value, 'i')) >= 0
                }
            });
        }else{
            if (this.props.kind === 'user') {
                arrAux = this.props.data.filter((item)=>{
                    if(item.properties){
                        for(let key in item.properties){
                            const propertyValue = item.properties[key];
                            if(propertyValue){
                                if(typeof propertyValue === "string" && propertyValue.search(new RegExp(value, 'i')) >= 0){
                                    return true;
                                }else if(typeof propertyValue === "number"){
                                    const value = propertyValue.toString();
                                    return value.search(new RegExp(value, 'i')) >= 0
                                }
                            }
                        }
                    }
                });
            }else if(this.props.kind === 'invitation'){
                arrAux = this.props.data.filter(item =>
                    item.email.search(new RegExp(value, 'i')) >= 0 ||
                    item.state.search(new RegExp(value, 'i')) >= 0);
            }else if(this.props.kind === 'helpers'){
                arrAux = this.props.data.filter(item =>
                    item.user.email.search(new RegExp(value, 'i')) >= 0 ||
                    item.user.displayName.search(new RegExp(value, 'i')) >= 0);
            }
        }
        return arrAux
    }

    handleFilter = (input) => {
        let value = input.target.value;
        this.setState({value});
        if (value.length >= 3) {
            let filtered = this.filterByAllColums(value);
            if (filtered.length > 0) {
                this.setState({ showMessage: false, message: "", filtered });
            } else {
                this.setState({ showMessage: true, message: "not" });
            }
            this.props.searchResult(filtered);
        }
        if (value.length <= 2) {
            if (value.length === 0) {
                this.setState({ showMessage: false, message: "" });
                this.props.searchResult(this.props.data.slice(0,50));
            } else {
                this.setState({
                    showMessage: true,
                    message: "short"
                });
                this.props.searchResult(false);
            }
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="field">
                    <p className="control has-icons-left">
                        <input className="input" type="text" placeholder="Buscar" onChange={this.handleFilter} value={this.state.value}/>
                        <span className="icon is-small is-left"><i className="fas fa-search"/></span>
                    </p>
                    {this.state.showMessage && (
                        <p className="help is-danger">
                            <FormattedMessage id={`global.search_${this.state.message}`} defaultMessage="Help"/>
                        </p>
                    )}
                </div>
            </React.Fragment>
        );
    }
}

export default SearchComponent;
