import React, {Component} from 'react';
import Select from 'react-select';
import {FormattedMessage} from "react-intl";

const MAX_OPTIONS = 2;

class SelectInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maxReached: false,
            options: this.props.options,
            selectedOptions: []
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.options !== this.props.options) {
            this.setState({options:nextProps.options,selectedOptions:nextProps.selectedOptions});
        }
    }

    onChange = (selectedOptions, { action, option }) => {
        // bail if user is trying to add an option once max reached
        if (action === "select-option" && this.state.maxReached) {
            return;
        }

        // set max reached once achieved
        if (action === "select-option" && selectedOptions.length === MAX_OPTIONS) {
            this.setState({ maxReached: true });
        }

        // business as usual, except we want to revert max flag on remove/clear
        const maxReached = selectedOptions.length >= MAX_OPTIONS;
        this.setState({ maxReached, selectedOptions });
        this.props.selectOption(selectedOptions);
    };
    noOptionsMessage = ({ inputValue }) => {
        const { maxReached } = this.state;
        return maxReached
            ? `You can only select ${MAX_OPTIONS} options...`
            : `No options matching "${inputValue}"`;
    };
    render() {
        const { maxReached, selectedOptions, options } = this.state;
        const { name, isMulti, required } = this.props;
        return (
            <div className="field">
                <label className={`label ${required?'required':''}`}>{name}</label>
                <div className="control">
                    <Select
                        onChange={this.onChange}
                        options={maxReached ? selectedOptions : options}
                        isMulti={isMulti}
                        placeholder={<FormattedMessage id="global.select" defaultMessage="Select..."/>}
                        noOptionsMessage={this.noOptionsMessage}
                        value={selectedOptions}
                        className="basic-multi-select"
                        classNamePrefix="select"
                    />
                </div>
            </div>
        );
    }
}

export default SelectInput;