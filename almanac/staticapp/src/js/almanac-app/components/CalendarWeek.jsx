import { h, Component } from 'preact';

class CalendarWeek extends Component {
  constructor(props) {
    super(props);

    if (!props.startingDay) {
      this.props.startingDay = 0;
    }
    if (!props.endingDay) {
      this.props.endingDay = 7;
    }
    this.days = [0,1,2,3,4,5,6];
  }

  render() {
    return (
      <div className="week">
        {this.days.map((day) => (
          <div className={'day' + (
            this.props.startingDay <= day && this.props.endingDay > day ? ' visible' : ''
          ) + (
            this.props.highlight === day ? ' selected' : ''
          )}></div>
        ))}
      </div>
    )
  }
}

export default CalendarWeek;