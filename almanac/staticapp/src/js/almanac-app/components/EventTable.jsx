import { h, Component } from 'preact';
import Dateline from 'dateline';

class EventTable extends Component {
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
        } else {
          datestr = `${date.date} 00:00:00 EST`;
        }

        console.log(datestr);

        const parsed = new Date(datestr);
        this.apDates[date.key] = Dateline(parsed);
      }
    });
  }

  render() {
    return (
      <div className="expando">
        <div class="row">
          <div class="column">
            <div class="top">
              <h4>Early voting</h4>
            </div>
            <div class="bottom">
              {
                this.apDates.earlyVoteStart ? (
                  <div>
                    <h6>Window</h6>
                    <p>{this.apDates.earlyVoteStart.getAPDate()} - {this.apDates.earlyVoteClose.getAPDate()}</p>
                  </div>
                ) : (<p class="no-data">No early voting</p>)
              }
            </div>
          </div>
          <div class="column">
            <div class="top">
              <h4>Voting by mail</h4>
            </div>
            <div class="bottom">
              {
                this.apDates.mailApplicationDeadline ? (
                  <div>
                    <h6>Register by</h6>
                    <p>{this.apDates.mailApplicationDeadline.getAPDate()}</p>
                    <h6>Mail in by</h6>
                    <p>{this.apDates.mailBallotDeadline.getAPDate()}</p>
                  </div>
                ) : (<p class="no-data">No vote by mail</p>)
              }
            </div>
          </div>
          <div class="column">
            <div class="top">
              <h4>Registration</h4>
            </div>
            <div class="bottom">
              {
                this.apDates.onlineRegDeadline ? (
                  <div>
                    <h6>Online by</h6>
                    <p>{this.apDates.onlineRegDeadline.getAPDate()}</p>
                  </div>
                ) : (<p class="no-data">No online voter registration</p>)
              }
              {
                this.apDates.regDeadline ? (
                  <div>
                    <h6>In person by</h6>
                    <p>{this.apDates.regDeadline.getAPDate()}</p>
                  </div>
                ) : (<p class="no-data">No known voter registration deadline</p>)
              }
            </div>
          </div>
          <div class="column">
            <div class="top">
              <h4>Polls close</h4>
            </div>
            <div class="bottom">
              {this.apDates.pollClosing ? (
                <div>
                  <h6>At</h6>
                  <p>{this.apDates.pollClosing.getAPTime()}</p>
                </div>
              ) : (<p class="no-data">No known poll closing time</p>)}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default EventTable