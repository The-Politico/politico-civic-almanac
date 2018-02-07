import { h, Component } from 'preact';

class Event extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="event-wrapper">
        <h3>{this.props.event.label}</h3>
      </div>
    )
  }
}

export default Event