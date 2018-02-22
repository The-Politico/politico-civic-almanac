import React from 'react';
import Autocomplete from 'react-autocomplete';
import find from 'lodash/find';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    }

    this.onChange = ::this.onChange;
    this.onSelect = ::this.onSelect;
    this.updateValue = ::this.updateValue;
  }

  matchStateToTerm(state, value) {
    return (
      state.label.toLowerCase().indexOf(value.toLowerCase()) !== -1
    )
  }

  onChange(e, value) {
    this.updateValue(value);
  }

  onSelect(value) {
    this.updateValue(value)
  }

  updateValue(value) {
    this.setState({ value });

    if (find(this.props.divisions, (s) => s.label === value) || value === '') {
      this.props.setSearchQuery(value);
    }
  }

  render() {
    return (
      <div className="container">
        <Autocomplete
          getItemValue={(item) => item.label}
          items={this.props.divisions}
          value={this.state.value}
          inputProps={{ id: 'states-autocomplete' }}
          wrapperStyle={{ position: 'relative', display: 'inline-block' }}
          onChange={this.onChange}
          onSelect={this.onSelect}
          renderMenu={children => (
            <div className="menu">
              {children}
            </div>
          )}
          shouldItemRender={this.matchStateToTerm}
          renderItem={(item, isHighlighted) => (
            <div
              className={`item ${isHighlighted ? 'item-highlighted' : ''}`}
              key={item.abbr}
            >{item.name}</div>
          )}
        />
      </div>
    )
  }
}

export default Search;