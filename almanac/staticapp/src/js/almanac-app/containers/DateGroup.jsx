import { h, Component } from 'preact';
import Event from '../components/Event';
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
        <div className="col-md-3 date">
          <h2>{this.APDate}</h2>
        </div>
        <div className="col-md-9 events">
          {this.props.events.map((event) => (
            <Event event={event} />
          ))}
        </div>
      </div>
    )
  }
}

export default DateGroup