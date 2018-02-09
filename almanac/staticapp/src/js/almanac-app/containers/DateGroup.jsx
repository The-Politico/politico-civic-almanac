import { h, Component } from 'preact';
import Event from '../components/Event';
import Calendar from '../components/Calendar';
import Dateline from 'dateline';

class DateGroup extends Component {
  constructor(props) {
    super(props);
    this.parsedDate = new Date(`${this.props.date} 00:00:00 EST`);
    this.APDate = Dateline(this.parsedDate).getAPDate();
  }

  render() {
    return(
      <div className="date-group row">
        <div className="container">
          <div className="col-md-2 date">
            <h2>{this.APDate}</h2>
            <Calendar date={this.parsedDate}/>
          </div>
          <div className="col-md-10 events">
            {this.props.events.map((event) => (
              <Event event={event} />
            ))}
          </div>
        </div>
      </div>
    )
  }
}

export default DateGroup