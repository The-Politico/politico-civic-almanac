import React from 'react';
import DateGroup from './DateGroup';
import Search from '../components/Search';
import forIn from 'lodash/forIn';
import sortBy from 'lodash/sortBy';
import uniqBy from 'lodash/uniqBy';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dateGroups: this.props.data,
      divisions: [],
    }

    this.setSearchQuery = ::this.setSearchQuery;
  }

  componentDidMount() {
    let divisions = [];

    forIn(this.props.data, (events, date) => {
      events.forEach((event) => {
        if (divisions.indexOf(event.division) < 0) {
          divisions.push(event.division);
        }
      });
    });

    divisions = sortBy(divisions, (d) => d.label);
    divisions = uniqBy(divisions, (d) => d.label);
    
    this.setState({
      divisions: divisions,
    })
  }

  setSearchQuery(text) {
    if (text) {
      let dateGroups = {};

      forIn(this.props.data, (events, date) => {
        const filteredEvents = [];

        events.forEach((event) => { 
          if (event.division.label === text) {
            filteredEvents.push(event);
          }
        });
        
        if (filteredEvents.length > 0) {
          dateGroups[date] = filteredEvents;
        }
      });
      this.setState({dateGroups});
    } else {
      this.setState({dateGroups: this.props.data});
    }
  }

  render() {
    return (
      <div className="wrapper">
        <div className="search">
          <Search 
            setSearchQuery={this.setSearchQuery}
            divisions={this.state.divisions} 
          />
        </div>
        <div className="dates">
          {Object.keys(this.state.dateGroups).map((key) => (
            <DateGroup 
              key={key}
              date={key} 
              events={this.state.dateGroups[key]} 
            />
          ))}
        </div>
      </div>
    )
  }
}

export default App