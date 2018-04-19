import React from 'react';
import Dateline from 'dateline';
import { DateTime } from 'luxon';

class EventTable extends React.Component {
  constructor(props) {
    super(props);

    const dates = [
      {
        date: props.event.early_vote_start,
        key: 'earlyVoteStart',
      },
      {
        date: props.event.early_vote_close,
        key: 'earlyVoteClose',
      },
      {
        date: props.event.vote_by_mail_application_deadline,
        key: 'mailApplicationDeadline',
      },
      {
        date: props.event.vote_by_mail_ballot_deadline,
        key: 'mailBallotDeadline',
      },
      {
        date: props.event.online_registration_deadline,
        key: 'onlineRegDeadline',
      },
      {
        date: props.event.registration_deadline,
        key: 'regDeadline',
      },
      {
        date: props.event.poll_closing_time,
        key: 'pollClosing',
      },
    ]

    this.apDates = {};

    dates.forEach((date) => {
      if (date.date) {
        let datestr = '';
        if (date.date.length > 10) {
          datestr = date.date.slice(0, -1);
          console.log(datestr);
        } else {
          datestr = `${date.date}T12:00:00Z`;
        }

        const parsed = DateTime.fromISO(datestr);
        this.apDates[date.key] = Dateline(parsed.toJSDate());
      }
    });
  }

  render() {
    return (
      <div className='expando row'>
        <div className="row">
          <div className="column">
            <div className="top">
              <div className="icon-wrapper">
                <img src={`${window.appConfig.images}/signature.svg`} />
              </div>
              <h4>Registration</h4>
            </div>
            <div className="bottom">
              {
                this.apDates.regDeadline ? (
                  <div>
                    <h6>In person by</h6>
                    <p>{this.apDates.regDeadline.getAPDate()}</p>
                  </div>
                ) : (
                  <div>
                    <h6 className="no-data">No known voter registration deadline</h6>
                  </div>
                )
              }
              {
                this.apDates.onlineRegDeadline ? (
                  <div>
                    <h6>Online by</h6>
                    <p>{this.apDates.onlineRegDeadline.getAPDate()}</p>
                  </div>
                ) : null
              }
            </div>
          </div>
          <div className="column">
            <div className="top">
              <div className="icon-wrapper">
                <img src={`${window.appConfig.images}/clock.svg`} />
              </div>
              <h4>Early voting</h4>
            </div>
            <div className="bottom">
              {
                this.apDates.earlyVoteStart ? (
                  <div>
                    <h6>Start</h6>
                    <p>{this.apDates.earlyVoteStart.getAPDate()}</p>
                  </div>
                ) : (<h6 className="no-data">No early voting</h6>)
              }
              {
                this.apDates.earlyVoteStart ? (
                  <div>
                    <h6>End</h6>
                    <p>{this.apDates.earlyVoteClose.getAPDate()}</p>
                  </div>
                ) : null
              }
            </div>
          </div>
          <div className="column">
            <div className="top">
              <div className="icon-wrapper">
                <img src={`${window.appConfig.images}/envelope.svg`} />
              </div>
              <h4>Vote by mail</h4>
            </div>
            <div className="bottom">
              {
                this.apDates.mailApplicationDeadline ? (
                  <div>
                    <h6>Apply by</h6>
                    <p>{this.apDates.mailApplicationDeadline.getAPDate()}</p>
                  </div> 
                ) : (
                  <div>
                    <h6 className="no-data">No vote by mail</h6>
                  </div>
                )
              }
              {
                this.apDates.mailBallotDeadline ? (
                  <div>
                    <h6>Mail in by</h6>
                    <p>{this.apDates.mailBallotDeadline.getAPDate()}</p>
                  </div>
                ) : null
              }
            </div>
          </div>
          <div className="column">
            <div className="top">
              <div className="icon-wrapper">
                <img src={`${window.appConfig.images}/vote.svg`} />
              </div>
              <h4>Polls close</h4>
            </div>
            <div className="bottom">
              {this.apDates.pollClosing ? (
                <div>
                  <h6>At</h6>
                  <p>{this.apDates.pollClosing.getAPDate() + ', ' + this.apDates.pollClosing.getAPTime()}</p>
                </div>
              ) : (
                <div>
                  <h6 className="no-data">No known poll closing time</h6>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default EventTable