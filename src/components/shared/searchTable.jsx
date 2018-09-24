import React, {Component} from 'react';
import {FormattedMessage} from "react-intl";

class SearchComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showMessage: false,
            auxArr: [],
            message: ""
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {
            this.setState({auxArr:nextProps.data});
        }
    }

    filterByAllColums(value) {
        let arrAux;
        if (this.props.kind === 'user') {
            arrAux = this.props.data.filter( (item) =>{
                return (item.properties.email.search(new RegExp(value, 'i')) >= 0 ||
                    item.properties.email.search(new RegExp(value, 'i')) >= 0);
            }
                /*item.properties['name'].search(new RegExp(value, 'i')) >= 0 ||
                item.properties['email'].search(new RegExp(value, 'i')) >= 0 ||
                item.state['name'].search(new RegExp(value, 'i')) >= 0 ||
                item.rol['name'].search(new RegExp(value, 'i')) >= 0*/
            );
        }else if(this.props.kind === 'invitation'){
            arrAux = this.props.data.filter(item =>
                item.name.search(new RegExp(value, 'i')) >= 0 ||
                item.email.search(new RegExp(value, 'i')) >= 0);
        }
        return arrAux
    }

    handleFilter = (input) => {
        let value = input.target.value;
        if (value.length >= 3) {
            let filtered = this.filterByAllColums(value);
            if (filtered.length > 0) {
                this.setState({ showMessage: false, message: "" });
            } else {
                this.setState({ showMessage: true, message: "not" });
            }
            this.props.searchResult(filtered);
        }
        if (value.length <= 2) {
            if (value.length === 0) {
                this.setState({ showMessage: false, message: "" });
            } else {
                this.setState({
                    showMessage: true,
                    message: "short"
                });
            }
            this.props.searchResult(false);
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="field">
                    <p className="control has-icons-left">
                        <input className="input" type="text" placeholder="Buscar" onChange={this.handleFilter}/>
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