import { h, Component } from 'preact';
import EventTable from './EventTable';

class Event extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let tags = [];  
    if (this.props.event.event_type === 'Primaries') {
      if (this.props.event.senate_election) {
        tags.push('Senate');
      }
      if (this.props.event.governor_election) {
        tags.push('Governor');
      }
      tags.push('House');
    }

    const desc = this.props.event.description ? (
      <div className="description">
        <p>{this.props.event.description}</p>
      </div>
    ) : null;

    return (
      <div className="event-wrapper">
        <div className="header-row">
          <h3>{this.props.event.label}</h3>
          <div className="tags">
            {tags.map((tag) => (
              <span className="tag">{tag}</span>
            ))}
          </div>
          {this.props.event.event_type === 'Primaries' ? (
            <div className="button-toggle">
              <span class="button">+</span>

            </div>
          ) : null}
        </div>
        {desc}
        {this.props.event.event_type === 'Primaries' ? (
          <EventTable event={this.props.event} />
        ) : null}
      </div>
    )
  }
}

export default Event