import React from 'react';
import Sticky from 'react-stickynode';
import Event from '../components/Event';
import Calendar from '../components/Calendar';
import Dateline from 'dateline';

class DateGroup extends React.Component {
  constructor(props) {
    super(props);
    this.parsedDate = new Date(`${props.date} 00:05:00`);
    this.APDate = Dateline(this.parsedDate)
    console.log(this.APDate);
    this.days = [
      'Sunday', 
      'Monday', 
      'Tuesday', 
      'Wednesday', 
      'Thursday',
      'Friday',
      'Saturday',
    ];
  }

  render() {
    return(
      <div className="date-group">
        <div className="container">
          <div className="row" id={`date-${this.props.date}`}>
            <div className="col-sm-3">
                <div className="date desktop">
                  <Sticky 
                    top={20}
                    bottomBoundary={`#date-${this.props.date}`} 
                  >
                    <h5>{this.days[this.APDate.getDay()]}</h5>
                    <h2>{this.APDate.getAPDate()}</h2>
                    <Calendar date={this.parsedDate}/>
                  </Sticky>
                </div>
                <div className="date mobile">
                  <Sticky 
                    top={0}
                    bottomBoundary={`#date-${this.props.date}`} 
                    innerZ={10}
                  >
                    <h5>{this.days[this.APDate.getDay()]}</h5>
                    <h2>{this.APDate.getAPDate()}</h2>
                  </Sticky>
                  <Calendar date={this.parsedDate}/>
                </div>
            </div>
            <div className="col-sm-9">
              <div className="events">
                {this.props.events.map((event) => (
                  <Event event={event} />
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