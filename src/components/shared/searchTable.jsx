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
        if (this.props.kind === 'user') {
            const filters = this.props.filter.map(item=>item.name);
            arrAux = this.props.data.filter( (item) =>{
                if(item.properties[filters[0]] && item.properties[filters[1]] && item.properties[filters[2]]){
                    return (item.properties[filters[0]].search(new RegExp(value, 'i')) >= 0 ||
                        (item.properties[filters[1]] && item.properties[filters[1]].search(new RegExp(value, 'i'))) >= 0 ||
                        (item.properties[filters[2]] && item.properties[filters[2]].search(new RegExp(value, 'i'))) >= 0);
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