import React from 'react';
import Sticky from 'react-stickynode';
import marked from 'marked';
import EventTable from './EventTable';
import PrimaryRules from './PrimaryRules';

class Event extends React.Component {
  constructor(props) {
    super(props);
    this.convertDescription = ::this.convertDescription;
  }

  convertDescription() {
    return {__html: marked(this.props.event.description)}
  }

  render() {
    const header = window.appConfig.link_path ? (
        <h3>
          {this.props.event.division.code !== '00' ? (
            <a href={`${window.appConfig.link_path}${this.props.event.division.slug}/`}>
              {this.props.event.label}
            </a>
          ) : (
            this.props.event.label
          )}
        </h3>
    ) : (
      <h3>{this.props.event.label}</h3>
    )

    const mobileHeader = window.appConfig.link_path ? (
        <h2>
          <a href={`${window.appConfig.link_path}${this.props.event.division.slug}/`}>
            {this.props.event.division.label}
          </a>
        </h2>
    ) : (
      <h2>{this.props.event.division.label}</h2>
    )

    let tags = [];
    if (this.props.event.event_type !== 'Primaries Runoff' && window.appConfig.type !== 'body') {
      if (this.props.event.senate_election) {
        tags.push('Senate');
      }
      if (this.props.event.governor_election) {
        tags.push('Governor');
      }
      if (this.props.event.house_election) {
        tags.push('House');      
      }
    }

    const desc = this.props.event.description ? (
      <div className="row">
        <div className="col-xs-12">
          <div className="description">
            <h5>What to watch</h5>
            <div
              className="txt"
              dangerouslySetInnerHTML={this.convertDescription()}
            >
            </div>
          </div>
        </div>
      </div>
    ) : null;

    const primaryRules = this.props.event.event_type === 'Primaries' && this.props.event.dem_primary_type ? (
      <div className="row">
        <div className="col-xs-12">
          <div className="primary-rules">
            <PrimaryRules event={this.props.event} />
          </div>
        </div>
      </div>
    ) : null;

    var eventTable = null;

    if (this.props.event.event_type === 'Primaries Runoff' || this.props.event.event_type === 'General Runoff') {
      eventTable = (<p>Runoff elections will occur if necessary per race.</p>);
    } else if (this.props.event.division.code === '00') {
      eventTable = (<p>All states except Louisiana will hold their general election. View individual state pages for voter information.</p>)
    } else {
      eventTable = <EventTable event={this.props.event} />
    }

    const id = `event-${this.props.event.election_day.date}-${this.props.event.division.slug}`;

    return (
      <div className="event-wrapper" id={id}>
        <div className="header-row row">
          <div className="col-xs-12">
            <div className="mobile">
              <Sticky
                top={0}
                bottomBoundary={`#${id}`}
                innerZ={10}
              > 
                <div className="row">
                  <div className="event-date-header col-xs-3">
                    <h5>{this.props.date.getAPDate().split(' ')[0]}</h5>
                    <h2>{this.props.date.getAPDate().split(' ')[1]}</h2>
                  </div>
                  <div className="col-xs-6">
                    <h5>{this.props.event.event_type}</h5>
                    {mobileHeader}
                  </div>
                  <div className="tags col-xs-3">
                    {tags.map((tag) => (
                      <span className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </Sticky>
            </div>
            <div className="desktop">
              {header}
              <div className="tags">
                {tags.map((tag) => (
                  <span className="tag">{tag}</span>
                ))}
              </div>
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
