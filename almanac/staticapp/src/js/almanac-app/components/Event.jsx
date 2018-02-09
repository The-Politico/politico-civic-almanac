import { h, Component } from 'preact';

class Event extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="event-wrapper">
        <h4>{this.props.event.label}</h4>
      </div>
    )
  }
}

export default Event