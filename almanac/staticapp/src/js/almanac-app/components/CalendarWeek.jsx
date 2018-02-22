import React from 'react';

class CalendarWeek extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      days: [0,1,2,3,4,5,6],
    }
  }

  componentDidMount() {
    this.setState({
      startingDay: this.props.startingDay ? this.props.startingDay : 0,
      endingDay: this.props.endingDay ? this.props.endingDay : 7,
    });
  }

  componentWillUpdate() {
    this.setState({
      startingDay: this.props.startingDay ? this.props.startingDay : 0,
      endingDay: this.props.endingDay ? this.props.endingDay : 7,
    });
  }

  render() {
    return (
      <div className="week">
        {this.state.days.map((day) => (
          <div className={'day' + (
            this.state.startingDay <= day && this.state.endingDay > day ? ' visible' : ''
          ) + (
            this.props.highlight === day ? ' selected' : ''
          )}></div>
        ))}
      </div>
    )
  }
}

export default CalendarWeek;