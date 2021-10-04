import React, { Component } from 'react';
import Select from 'react-select';
import { FormattedMessage } from 'react-intl';

class SelectInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      maxReached: false,
      options: this.props.options,
      selectedOptions: this.props.selectedOptions,
    };
  }
  componentDidUpdate(prevProps) {
    if (this.props.options !== prevProps.options) {
      this.setState({ options: this.props.options });
    }
  }

  onChange = (selectedOptions, { action }) => {
    // bail if user is trying to add an option once max reached
    if (action === 'select-option' && this.state.maxReached) {
      return;
    }

    // set max reached once achieved
    if (action === 'select-option' && selectedOptions.length === this.props.max_options) {
      this.setState({ maxReached: true });
    }

    // business as usual, except we want to revert max flag on remove/clear
    const maxReached = selectedOptions.length >= this.props.max_options;
    this.setState({ maxReached, selectedOptions });
    this.props.selectOption(selectedOptions);
  };
  noOptionsMessage = ({ inputValue }) => {
    const { maxReached } = this.state;
    return maxReached
      ? `You can only select ${this.props.max_options} options...`
      : `No options matching "${inputValue}"`;
  };
  render() {
    const { maxReached, selectedOptions, options } = this.state;
    const { name, isMulti, required } = this.props;
    return (
      <div className='field'>
        <label className={`label ${required ? 'required' : ''}`}>{name}</label>
        <div className='control'>
          <Select
            id={'selectOrganization'}
            onChange={this.onChange}
            options={maxReached ? selectedOptions : options}
            isMulti={isMulti}
            placeholder={<FormattedMessage id='global.select' defaultMessage='Select...' />}
            noOptionsMessage={this.noOptionsMessage}
            value={selectedOptions}
            className='basic-multi-select'
            classNamePrefix='select'
          />
        </div>
      </div>
    );
  }
}

export default SelectInput;
