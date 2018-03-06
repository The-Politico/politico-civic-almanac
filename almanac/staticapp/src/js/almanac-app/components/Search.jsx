import React from 'react';
import Autosuggest from 'react-autosuggest';
import find from 'lodash/find';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      suggestions: [],
    }

    this.onChange = ::this.onChange;
    this.updateValue = ::this.updateValue;
    this.getSuggestions = ::this.getSuggestions;
    this.onSuggestionsFetchRequested = ::this.onSuggestionsFetchRequested;
    this.onSuggestionsClearRequested = ::this.onSuggestionsClearRequested;
    this.onClearClicked = ::this.onClearClicked;
  }

  escapeRegexCharacters(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  getSuggestions(value) {
    const escapedValue = this.escapeRegexCharacters(value.trim());
    
    if (escapedValue === '') {
      return [];
    }

    const regex = new RegExp('^' + escapedValue, 'i');

    return this.props.divisions.filter(division => regex.test(division.label));
  }

  getSuggestionValue(suggestion) {
    return suggestion.label;
  }

  renderSuggestion(suggestion) {
    return (
      <span>{suggestion.label}</span>
    )
  }

  onChange(e, value) {
    this.updateValue(value.newValue);
  }

  onSuggestionsFetchRequested({value}) {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  }

  onSuggestionsClearRequested() {
    this.setState({
      suggestions: [],
    });
  };

  updateValue(value) {
    this.setState({ value });

    if (find(this.props.divisions, (s) => s.label === value) || value === '') {
      this.props.setSearchQuery(value);
    }
  }

  onClearClicked(e) {
    this.onSuggestionsClearRequested();
    this.onChange(null, {newValue: '', method: 'type'});
    this.props.setSearchQuery('');
  }

  render() {
    const { value, suggestions } = this.state;

    const inputProps = {
      placeholder: 'Search for a state',
      value,
      onChange: this.onChange,
    };

    return (
      <div className="container">
        <div className="search-wrapper">
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={this.getSuggestionValue}
            renderSuggestion={this.renderSuggestion}
            inputProps={inputProps}
          />
          <div 
            className="clear-suggestions" 
            onClick={this.onClearClicked}
          >
            &times;
          </div>
        </div>
      </div>
    )
  }
}

export default Search;