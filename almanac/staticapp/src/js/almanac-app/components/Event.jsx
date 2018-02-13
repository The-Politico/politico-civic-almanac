import React from 'react';
import EventTable from './EventTable';
import PrimaryRules from './PrimaryRules';

class Event extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let tags = [];  
    if (this.props.event.event_type !== 'Primaries Runoff') {
      if (this.props.event.senate_election) {
        tags.push('Senate');
      }
      if (this.props.event.governor_election) {
        tags.push('Governor');
      }
      tags.push('House');
    }

    const desc = this.props.event.description ? (
      <div className="row">
        <div className="col-xs-12">
          <div className="description">
            <h5>What to watch</h5>
            <p>{this.props.event.description}</p>
          </div>
        </div>
      </div>
    ) : null;

    const primaryRules = this.props.event.event_type === 'Primaries' ? (
      <div className="row">
        <div className="col-xs-12">
          <div className="primary-rules">
            <h5>Primary Rules</h5>
            <PrimaryRules event={this.props.event} />
          </div>
        </div>
      </div>
    ) : null;

    const eventTable = this.props.event.event_type !== 'Primaries Runoff' ? (
      <EventTable event={this.props.event} />
    ) : null;

    return (
      <div className="event-wrapper">
        <div className="header-row row">
          <div className="col-xs-12">
            <h3><a href={`../${this.props.event.division.slug}/calendar/index.html`}>{this.props.event.label}</a></h3>
            <div className="tags">
              {tags.map((tag) => (
                <span className="tag">{tag}</span>
              ))}
            </div>
          </div>
        </div>
        {desc}
        {primaryRules}
        {eventTable}
      </div>
    )
  }
}

export default Event