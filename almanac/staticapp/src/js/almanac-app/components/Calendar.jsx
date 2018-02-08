import { h, Component } from 'preact';
import CalendarWeek from './CalendarWeek';
import times from 'lodash/times';

class Calendar extends Component {
  constructor(props) {
    super(props);

    this.monthData = [
      {
        startingDay: 2,
        numberOfDays: 31,
      },
      {
        startingDay: 4,
        numberOfDays: 28,
      },
      {
        startingDay: 4,
        numberOfDays: 31,
      },
      {
        startingDay: 0,
        numberOfDays: 30,
      },
      {
        startingDay: 2,
        numberOfDays: 31,
      },
      {
        startingDay: 5,
        numberOfDays: 30,
      },
      {
        startingDay: 0,
        numberOfDays: 31,
      },
      {
        startingDay: 3,
        numberOfDays: 31,
      },
      {
        startingDay: 6,
        numberOfDays: 30,
      },
      {
        startingDay: 1,
        numberOfDays: 31,
      },
      {
        startingDay: 4,
        numberOfDays: 30,
      },
      {
        startingDay: 6,
        numberOfDays: 31,
      },
    ]

    this.month = this.monthData[props.date.getMonth()];
    this.numberOfWeeks = this.calculateNumberOfWeeks(this.month);
    this.lastWeekDays = this.calculateLastWeekDays(this.month);
    this.weekForHighlight = this.calculateWeekForHighlight(this.month, props.date.getDate(), this.numberOfWeeks);
  }

  calculateNumberOfWeeks(data) {
    const firstWeekDays = 7 - data.startingDay;
    const remainingDays = data.numberOfDays - firstWeekDays;
    return Math.ceil(remainingDays / 7);
  }

  calculateLastWeekDays(data) {
    const firstWeekDays = 7 - data.startingDay;
    const remainingDays = data.numberOfDays - firstWeekDays;
    return remainingDays % 7;
  }

  calculateWeekForHighlight(data, date, numberOfWeeks) {
    const firstWeekDays = 7 - data.startingDay;
    if (date <= firstWeekDays) {
      return 0;
    }
    const remainingDays = data.numberOfDays - firstWeekDays;
    let sundays = [];
    for (var i = firstWeekDays + 1; i < data.numberOfDays; i += 7) {
      sundays.push(i);
    }
    for (var i = 0; i < sundays.length; i++) {
      if (i === sundays.length - 1) {
        return i + 1;
      }

      if (date > sundays[i] && date < sundays[i + 1]) {
        return i + 1;
        break;
      } 
    }
  }

  render() {
    return (
      <div className="calendar-wrapper">
        <CalendarWeek 
          startingDay={this.month.startingDay} 
          highlight={this.weekForHighlight === 0 ? this.props.date.getDay() : null}
        />
        {times(this.numberOfWeeks - 1 , i => <CalendarWeek 
          highlight={this.weekForHighlight === i + 1 ? this.props.date.getDay() : null}
        />)}
        <CalendarWeek 
          endingDay={this.lastWeekDays} 
          highlight={this.weekForHighlight === this.numberOfWeeks ? this.props.date.getDay() : null}
        />
      </div>
    )
  }
}

export default Calendar;