import React from 'react';
import CalendarWeek from './CalendarWeek';
import times from 'lodash/times';

class Calendar extends React.Component {
  constructor(props) {
    super(props);

    const monthData = [
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
    ];

    this.state = {
      monthData,
      month: 0,
      numberOfWeeks: 0,
      endingDay: 0,
      weekForHighlight: 0,
    }

    this.calculateCalendarData = ::this.calculateCalendarData;
    this.calculateCalendarData();
  }

  calculateCalendarData() {
    const month = this.state.monthData[this.props.date.getMonth()];
    const numberOfWeeks = this.calculateNumberOfWeeks(month);
    const endingDay = this.calculateEndingDay(month);
    const weekForHighlight = this.calculateWeekForHighlight(month, this.props.date.getDate(), numberOfWeeks);

    this.setState({
      month,
      numberOfWeeks,
      endingDay,
      weekForHighlight,
    });
  }

  calculateNumberOfWeeks(data) {
    const firstWeekDays = 7 - data.startingDay;
    const remainingDays = data.numberOfDays - firstWeekDays;
    return Math.ceil(remainingDays / 7);
  }

  calculateEndingDay(data) {
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
          startingDay={this.state.month.startingDay} 
          highlight={this.state.weekForHighlight === 0 ? this.props.date.getDay() : null}
          key={0}
        />
        {times(this.state.numberOfWeeks - 1 , i => <CalendarWeek 
          highlight={this.state.weekForHighlight === i + 1 ? this.props.date.getDay() : null}
          key={i + 1}
        />)}
        <CalendarWeek 
          endingDay={this.state.endingDay} 
          highlight={this.state.weekForHighlight === this.state.numberOfWeeks ? this.props.date.getDay() : null}
          key={this.state.numberOfWeeks}
        />
      </div>
    )
  }
}

export default Calendar;