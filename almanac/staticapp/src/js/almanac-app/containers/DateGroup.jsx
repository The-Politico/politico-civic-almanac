import React from 'react';
import Sticky from 'react-stickynode';
import Event from '../components/Event';
import Calendar from '../components/Calendar';
import Dateline from 'dateline';

class DateGroup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      APDate: Dateline(new Date(`${props.date}T12:00:00Z`)),
      days: [
        'Sunday', 
        'Monday', 
        'Tuesday', 
        'Wednesday', 
        'Thursday',
        'Friday',
        'Saturday',
      ],
    }
  }

  componentWillUpdate() {
    this.setState({
      APDate: Dateline(new Date(`${this.props.date}T12:00:00Z`))
    });
  }

  render() {
    return(
      <div className="date-group">
        <div className="container">
          <div className="row" id={`date-${this.props.date}`}>
            <div className="col-sm-3 desktop">
                <div className="date">
                  <Sticky 
                    top={20}
                    bottomBoundary={`#date-${this.props.date}`} 
                  >
                    <h5>{this.state.days[this.state.APDate.getDay()]}</h5>
                    <h2>{this.state.APDate.getAPDate()}</h2>
                    <Calendar date={this.state.APDate}/>
                  </Sticky>
                </div>
            </div>
            <div className="col-sm-9">
              <div className="events">
                {this.props.events.map((event) => (
                  <Event 
                    event={event} 
                    date={this.state.APDate}
                    key={event.id}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default DateGroup